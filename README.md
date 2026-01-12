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


# Levantar Kubernetes

## 🛠️ Pré-requisitos

* **Docker** instalado.
* **Kubernetes** (Minikube ou Kind) configurado.
* **kubectl** instalado.

---

## 🚀 Preparação da Infraestrutura (Crucial)

Para que a API consiga comunicar com a base de dados a partir do cluster Kubernetes, siga estes passos na ordem exata:

### 1. Subir o MySQL no Docker (Host)
Execute o comando para criar o container com o suporte ao plugin de autenticação que o Prisma exige:

```bash
docker run -d \
  --name sf-mysql \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=senha \
  -e MYSQL_DATABASE=catalog_db \
  mysql:8 \
  --mysql-native-password=ON
```

### 2. Provisionar Utilizador e Permissões

Aguarde cerca de 10 segundos para o MySQL iniciar e execute o comando abaixo para criar o utilizador admin (utilizado pela aplicação):

docker exec -it sf-mysql mysql -psenha -e "
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'admin';
GRANT ALL PRIVILEGES ON catalog_db.* TO 'admin'@'%';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'senha';
FLUSH PRIVILEGES;"

### 3. Configuração de Rede e Firewall (Linux)

Para que o Minikube/Kind consiga "sair" do cluster e bater na porta 3307 do teu Ubuntu:

# Permitir tráfego na porta do MySQL
sudo ufw allow 3307/tcp

### 4. Deploy no Kubernetes
Configuração da DATABASE_URL
Certifique-se de que o seu ficheiro de Deployment ou Secret contém a seguinte string de conexão: mysql://admin:admin@host.docker.internal:3307/catalog_db

Nota: No Linux, se o host.docker.internal não funcionar, utilize o IP 172.17.0.1.

## Aplicar Manifestos
kubectl apply -f k8s/ -n sf

## Comandos Úteis de Debug

# Ver logs da API
kubectl logs -f -l app=sf-catalog-api -n sf

# Reiniciar o Pod (forçar nova tentativa)
kubectl delete pod -l app=sf-catalog-api -n sf

# Verificar se o banco está ativo e saudável
docker ps | grep sf-mysql
