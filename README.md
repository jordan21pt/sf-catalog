# sf-catalog

API REST em Node.js + TypeScript + Express + PostgreSQL.

## Setup

```bash

Crie .env:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=*****
DB_DATABASE=sf_catalog

docker-compose up

npm install

##rodar servidor

docker compose up --build

#seed com Faker.js
npm run seed -- 10 50

#Testes
npm test

# parar containers
docker compose down

# ver logs
docker compose logs -f api
docker compose logs -f db
```

.
