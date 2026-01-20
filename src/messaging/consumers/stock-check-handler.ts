import {
  assertExchange,
  connectRabbit,
  createChannel,
  subscribe,
  publish, 
} from "@rjrcosta/messaging-rabbit";

import {
  StockCheckV1,
  StockConfirmedV1,
  CATALOG_STOCK_REJECTED_V1,
} from "@rjrcosta/contracts";
import {ProductService} from "../../services/product.service"

const producservice = new ProductService


const mqUrl = process.env.SF_MQ_URL;
const exchange = process.env.SF_MQ_EXCHANGE || "sf.events";
const prefetch = Number(process.env.SF_MQ_PREFETCH || 10);

const stockCheckQueue =
  process.env.SF_CATALOG_STOCK_CHECK_QUEUE || "sf-catalog.stock.check";

const maxRetries = Number(process.env.SF_MQ_MAX_RETRIES || 5);
const retryDelayMs = Number(process.env.SF_MQ_RETRY_DELAY_MS || 5000);


async function getAvailableStock(productId: string): Promise<number> {
    console.log('iniciar get available stock', productId)
 const p = producservice.getProduct(Number(productId))
 console.log((await p).stock)
 return (await p).stock
}

export async function startStockCheckConsumer(): Promise<void> {
    console.log('startStockChekc')
  if (!mqUrl) throw new Error("SF_MQ_URL is required to start catalog consumer");

  const connection = await connectRabbit(mqUrl);
  const channel = await createChannel(connection, prefetch);
  await assertExchange(channel, exchange, "topic");

  await subscribe<{
    requestId: string;
    items: { productId: string; quantity: number }[];
  }>({
    channel,
    exchange,
    queue: stockCheckQueue,
    routingKey: StockCheckV1.type, // "catalog.stock.check.v1"
    maxRetries,
    retryDelayMs,

    onMessage: async (event, rawMsg) => {
  
      const headers = (rawMsg as any)?.properties?.headers ?? {};
      const orderId = headers["x-entity-id"]; // enviado pelo Orders
      const traceId = headers["x-trace-id"];

      console.log(orderId, headers, traceId)

      const { requestId, items } = event.payload;

      // 1) validar
      if (!requestId || !Array.isArray(items) || items.length === 0) {
        throw new Error("Invalid stock.check payload");
      }

      console.log('product_id handler', items[0].productId)
      // 2) verificar stock
      const missing: Array<{
        productId: string;
        requested: number;
        available: number;
      }> = [];

      for (const it of items) {
        const available = await getAvailableStock(it.productId);
        if (available < it.quantity) {
          missing.push({
            productId: it.productId,
            requested: it.quantity,
            available,
          });
        }
      }

      // 3) publicar resposta
      if (missing.length === 0) {
        const confirmedEvent = {
          type: StockConfirmedV1.type,
          source: "sf-catalog",
          timestamp: new Date().toISOString(),
          payload: {
            requestId,
            orderId,
          },
        };
        console.log('paylod', confirmedEvent.payload)
        await publish(channel, exchange, StockConfirmedV1.type, confirmedEvent, {
          headers: {
            "x-request-id": requestId,
            ...(orderId ? { "x-entity-id": orderId } : {}),
            ...(traceId ? { "x-trace-id": traceId } : {}),
          },
        });
      } else {
        const rejectedEvent = {
          type: typeof CATALOG_STOCK_REJECTED_V1,
          source: "sf-catalog",
          timestamp: new Date().toISOString(),
          payload: {
            requestId,
            orderId,
            reason: "OUT_OF_STOCK",
            missing,
          },
        };

        await publish(channel, exchange, typeof CATALOG_STOCK_REJECTED_V1, rejectedEvent, {
          headers: {
            "x-request-id": requestId,
            ...(orderId ? { "x-entity-id": orderId } : {}),
            ...(traceId ? { "x-trace-id": traceId } : {}),
          },
        });
      }
    },
  });
}
