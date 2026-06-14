# IG Clone

使用 Node.js、MongoDB、Socket.io、Docker 與 AWS 打造的 production-ready Instagram 全端仿作。

專案涵蓋即時聊天、JWT 驗證、AWS S3 圖片上傳、Docker multi-platform deployment，以及 GitHub Actions CI/CD 自動部署流程。

[![Test](https://github.com/TZUHAN07/ig-clone/actions/workflows/test.yml/badge.svg)](https://github.com/TZUHAN07/ig-clone/actions/workflows/test.yml)
[![Deploy](https://github.com/TZUHAN07/ig-clone/actions/workflows/deploy.yml/badge.svg)](https://github.com/TZUHAN07/ig-clone/actions/workflows/deploy.yml)

🌐 **Live Demo**：https://ig-clone.tzuhan.dev
（AWS EC2 + Docker + Nginx + Cloudflare）

---

# 專案定位

本專案為 portfolio 用途的 production-style 全端模擬實作。
在受控的 MVP 規模環境下，展示 system design、DevOps、與 backend engineering 的工程能力與設計思考。

---

# 系統範圍與限制

* 設計目標：MVP / 早期使用規模（early-scale usage）
* 部署架構：單一 region（AWS EC2 t2.micro）
* 預期 DAU：< 10,000
* 對社交互動接受 eventual consistency（follower count、like count 容許短暫延遲）
* 未涵蓋：multi-region replication、auto-scaling、disaster recovery

---

# Demo 與核心功能

## 即時聊天系統

https://github.com/user-attachments/assets/86390812-6034-4f65-b9e1-4f8ab6fc3d43

* 使用 Socket.io 建立即時聊天功能，支援 room-based event handling 與 acknowledgement callback。
* 支援同帳號多裝置同步更新。

## 圖片上傳與發文流程

https://github.com/user-attachments/assets/a38f6e2f-2934-4af4-be25-1be57be56a77

* 使用 AWS S3 建立圖片上傳流程，搭配 Multer 與 Sharp 進行圖片壓縮與 resize。
* 使用 CustomEvent pattern 實作首頁動態更新，不需重新整理頁面。
* 支援 Instagram carousel 形式的多圖貼文（1–10 張）。

---

# 技術亮點

* JWT authentication 搭配 Socket.io handshake middleware，實作即時連線驗證。
* 使用 Docker Compose 與 `docker-compose.override.yml` 分離開發與 production 環境。
* 使用 Docker Buildx 支援 Apple Silicon（ARM64）與 AWS EC2（AMD64）跨平台部署。
* 使用 `IntersectionObserver` 與 pagination 實作 infinite scroll。

---

# Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB（Mongoose）
* Socket.io
* JWT Authentication
* Multer
* Sharp

## Frontend

* Vanilla JavaScript（ES6+）
* HTML5
* CSS3
* RWD 響應式設計

## Testing

* Jest
* Supertest
* mongodb-memory-server

## DevOps & Cloud

* Docker
* Docker Compose
* Docker Buildx
* GitHub Actions CI/CD
* Nginx
* AWS EC2 / S3
* Cloudflare

---

# CI/CD Workflow

部署流程會在 merge 到 `main` branch 後自動觸發：

`Push → Test → Build Docker Images → Deploy to EC2`

* GitHub Actions 自動執行 Jest 與 Supertest 測試。
* 自動 build Docker image 並 push 至 Docker Hub。
* 透過 SSH workflow 自動部署至 AWS EC2。
* 使用 GitHub Secrets 管理敏感憑證與 SSH key。

---

# Testing

```bash id="q0d2wo"
cd backend

npm test
npm run test:coverage
```

目前測試涵蓋：

* 自訂 error handling unit test
* authentication API integration test
* 使用 `mongodb-memory-server` 建立隔離的 in-memory MongoDB 測試環境

---

# Database Design

```mermaid 
erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : has
    USER ||--o{ MESSAGE : sends
    USER }o--o{ USER : follows
    POST }o--o{ USER : liked_by
```

## Schema Design Considerations

* 使用 embedded sub-document 儲存 media 資訊，降低 post query 成本。
* 建立 compound index 優化 feed query 效能。
* 保留 follower / like relationship 後續拆分 collection 的 scalability 遷移空間。
* 文件化大型 follower relationship 的 migration path。

> 完整 ERD、Schema 設計理由、與 Scale Considerations 詳見 [docs/architecture.md](docs/architecture.md)。

---

# Engineering Notes

額外的 deployment 與 architecture 筆記整理於 `/docs`：

* Docker deployment
* Cloudflare 與 WebSocket proxy 問題
* MongoDB schema scaling
* GitHub Actions CI/CD 設定

---

# Known Limitations

目前部分功能仍為 MVP 階段實作：

* Backend 已支援 1–10 張 carousel media schema，但 frontend UI 目前仍以單張圖片 rendering 為主
* JWT token expiration handling 尚未完整實作 automatic re-authentication / redirect flow
* feed pagination 目前使用 skip/limit，尚未切換 cursor-based pagination

上述項目預計於後續版本持續重構與完善。

---

# Roadmap

## In Progress

* apiFetch wrapper refactor
* Read receipt / typing indicator
* Integration test coverage 擴充
* Cursor-based pagination

## Planned

* Redis caching
* Structured logging
* TypeScript migration
* Stories / Reels 功能

---

# Author

**趙紫涵（Tzu Han Chao / Joanne）**

* GitHub：https://github.com/TZUHAN07
* Email：[joannechao1007@gmail.com](mailto:joannechao1007@gmail.com)
