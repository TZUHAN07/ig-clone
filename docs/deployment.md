# Deployment & CI/CD

本文件記錄 ig-clone 從本地開發到 production 部署的流程與架構設計。

---

# Deployment Architecture

```text
visitor
  ↓
Cloudflare
  ↓
AWS EC2 (Ubuntu)
  ↓
Nginx
  ├─ frontend static files
  ├─ /api → backend
  └─ /socket.io → backend
        ↓
Node.js + Express + Socket.io
        ↓
MongoDB Atlas / AWS S3
```

---

# Docker Environment Separation

使用 `docker-compose.yml` 與 `docker-compose.override.yml`
分離 development 與 production 環境。

## Development

* volume mount
* nodemon hot reload
* local image build

## Production

* image-only deployment
* Docker Hub pull
* EC2 deployment

此做法能降低 production 與 local development 的耦合。

---

# Multi-platform Docker Build

由於本地開發環境為 Apple Silicon（ARM64），
production 部署環境為 AWS EC2（AMD64），
因此使用 Docker Buildx 建立 multi-platform image。

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t tzuhan1007/ig-clone-backend:latest \
  --push ./backend
```

---

# CI/CD Workflow

GitHub Actions 在 merge 至 `main` branch 後自動執行：

```text
Push
  ↓
Run Tests
  ↓
Build Docker Images
  ↓
Push to Docker Hub
  ↓
Deploy to EC2
```

流程包含：

* Jest / Supertest automated testing
* Docker image build & push
* SSH deployment to AWS EC2
* GitHub Secrets 管理敏感憑證

---

# WebSocket Reverse Proxy

由於 Cloudflare Free Plan 不支援 proxy 非白名單 port，
因此使用 Nginx reverse proxy 處理 Socket.io WebSocket 連線。

```nginx
location /socket.io/ {
    proxy_pass http://backend:3000;
    proxy_http_version 1.1;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Frontend 改採 same-origin socket connection：

```js
const SOCKET_URL = window.location.origin;
```

避免 Cloudflare 對 `:3000` 連線阻擋。

---

# Express trust proxy

Production 環境使用 reverse proxy 時，
Express 預設無法正確取得 client IP。

因此設定：

```js
app.set("trust proxy", 1);
```

搭配 Nginx `X-Forwarded-For` header，
正確取得真實 client IP 並支援 rate limiting。

---

# Current Limitations

目前部署架構仍屬 MVP 階段：

* single-region deployment
* 無 auto-scaling
* 無 container orchestration
* 無 disaster recovery
* 無 centralized logging

上述項目預計於後續版本逐步改善。
