type Item = { productId: string; quantity: number };

export class CheckStockUseCase {
  constructor(
    private readonly productRepo: {
      getStock(productId: string): Promise<number>;
    }
  ) {}

  async execute(input: { items: Item[] }): Promise<{
    ok: boolean;
    reason?: string;
    missing?: { productId: string; requested: number; available: number }[];
  }> {
    const missing: { productId: string; requested: number; available: number }[] = [];

    for (const it of input.items) {
      const available = await this.productRepo.getStock(it.productId);

      if (available < it.quantity) {
        missing.push({
          productId: it.productId,
          requested: it.quantity,
          available,
        });
      }
    }

    if (missing.length > 0) {
      return { ok: false, reason: "OUT_OF_STOCK", missing };
    }

    return { ok: true };
  }
}
