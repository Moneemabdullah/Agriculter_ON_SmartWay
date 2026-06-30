# Agriculture On SmartWay

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://sam-smart-agriculture2.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/02efa5f1-5573-4c5e-9805-2694863be63d/deploy-status)](https://app.netlify.com/projects/agriculture-smart/deploys)
[![CI](https://github.com/Moneemabdullah/Agriculter_ON_SmartWay/actions/workflows/ci.yml/badge.svg)](https://github.com/Moneemabdullah/Agriculter_ON_SmartWay/actions/workflows/ci.yml)

A modern smart agriculture platform that connects IoT sensors, real-time analytics, and an intuitive dashboard to help farmers monitor crops, manage irrigation, and make data-driven decisions.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

| Layer      | Technologies                                                           |
| ---------- | ---------------------------------------------------------------------- |
| Frontend   | React, TypeScript, Vite, Tailwind CSS, Recharts, shadcn/ui             |
| Backend    | Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Cloudinary      |
| IoT        | ESP32, Arduino (soil moisture, DHT sensors)                            |
| Infra      | Docker, GitHub Actions CI                                              |

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,tailwind,ts,nodejs,express,mongodb,arduino,docker" alt="tech stack" />
</p>

---

## Architecture

```
client/        React SPA (Vite + TypeScript)
Server/        Express REST API (controllers, services, routes, models)
lib/           IoT firmware (Arduino / ESP32 sketches)
```

- **Client** dev server proxies `/api` to `http://localhost:3000`
- **Server** routes mounted under `/api/v1`
- **MongoDB** lazy-connected on first request, then cached
- **Auth** via JWT stored in `localStorage`, injected as `Authorization: Bearer` header by Axios interceptor

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)
- npm (workspaces enabled at root)

### Installation

```bash
git clone https://github.com/Moneemabdullah/Agriculter_ON_SmartWay.git
cd Agriculter_ON_SmartWay
npm install
```

### Environment

```bash
cp Server/.env.example Server/.env
```

### Run Locally

```bash
# Terminal 1 — API server
cd Server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3000/api/v1

---

## Environment Variables

The server loads `Server/.env` from the project root.

| Variable                | Description            | Default                           |
| ----------------------- | ---------------------- | --------------------------------- |
| `CONNECTION_STRING`     | MongoDB connection URI | `mongodb://localhost:27017/agri-db`|
| `JWT_SECRET`            | JWT signing secret     | —                                 |
| `PORT`                  | Server port            | `3000`                            |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name  | —                                 |
| `CLOUDINARY_API_KEY`    | Cloudinary API key     | —                                 |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret  | —                                 |
| `TELEGRAM_BOT_TOKEN`    | Telegram bot token     | —                                 |
| `TELEGRAM_CHAT_ID`      | Telegram chat ID       | —                                 |

Client env (prefixed with `VITE_`):

| Variable             | Description         |
| -------------------- | ------------------- |
| `VITE_OPEN_WEATHER`  | OpenWeather API key |

---

## Available Scripts

| Package | Dev           | Build                       | Lint          | Test               |
| ------- | ------------- | --------------------------- | ------------- | ------------------ |
| Server  | `npm run dev` | `npm run build`             | `npm run lint`| `npm test` (Jest)  |
| Client  | `npm run dev` | `npm run build`             | `npm run lint`| `npm test` (Vitest)|

---

## API Overview

Base URL: `/api/v1`

### Authentication

Endpoints marked **Auth** require a `Bearer` token:

```
Authorization: Bearer <token>
```

### Auth

| Method | Path                    | Description          | Auth |
| ------ | ----------------------- | -------------------- | ---- |
| POST   | `/auth/signup`          | Register a new user  | No   |
| POST   | `/auth/signin`          | Sign in, get JWT     | No   |
| GET    | `/auth/me`              | Get current profile  | Yes  |
| POST   | `/auth/change-password` | Change password      | Yes  |

### Users

| Method | Path                  | Description          | Auth          |
| ------ | --------------------- | -------------------- | ------------- |
| GET    | `/users`              | List all users       | Admin         |
| GET    | `/users/:id`          | Get user by ID       | Yes           |
| PUT    | `/users/:id`          | Update user          | Farmer        |
| PATCH  | `/users/ban/:id`      | Ban/unban user       | Admin         |
| PATCH  | `/users/profile/photo`| Upload profile photo | Yes           |

### Crops

| Method | Path               | Description          | Auth           |
| ------ | ------------------ | -------------------- | -------------- |
| GET    | `/crops`           | List all crops       | No             |
| GET    | `/crops/:name`     | Get crop by name     | No             |
| POST   | `/crops`           | Create a crop        | Farmer / Admin |
| PUT    | `/crops/:id`       | Update a crop        | Farmer / Admin |
| DELETE | `/crops/:id`       | Delete a crop        | Admin          |

### Sensors

| Method | Path                     | Description             | Auth    |
| ------ | ------------------------ | ----------------------- | ------- |
| POST   | `/sensors`               | Register a new sensor   | Farmer  |
| GET    | `/sensors`               | List user's sensors     | Yes     |
| GET    | `/sensors/id/:sensorId`  | Get sensor by sensor ID | Yes     |
| DELETE | `/sensors/id/:sensorId`  | Delete a sensor         | Yes     |

### Telemetry

| Method | Path                                                 | Description                 | Auth |
| ------ | ---------------------------------------------------- | --------------------------- | ---- |
| POST   | `/telemetry/ingest`                                  | Ingest sensor data (ESP32)  | No   |
| GET    | `/telemetry/average/hour/:sensorId/:date`            | Hourly averages for a date  | Yes  |
| GET    | `/telemetry/average/day/:sensorId/:weekStart`        | Daily averages for a week   | Yes  |

### Blogs

| Method | Path                  | Description          | Auth           |
| ------ | --------------------- | -------------------- | -------------- |
| GET    | `/blogs`              | List all blogs       | No             |
| GET    | `/blogs/owner`        | List own blogs       | Yes            |
| POST   | `/blogs`              | Create a blog        | Farmer / Admin |
| PUT    | `/blogs/:blogId`      | Update a blog        | Farmer / Admin |
| DELETE | `/blogs/:blogId`      | Delete a blog        | Admin          |
| POST   | `/blogs/:blogId/like` | Like a blog          | Yes            |

### Farms

| Method | Path           | Description          | Auth    |
| ------ | -------------- | -------------------- | ------- |
| GET    | `/firms`       | List user's farms    | Yes     |
| GET    | `/firms/:id`   | Get farm by ID       | Yes     |
| POST   | `/firms`       | Create a farm        | Farmer  |
| PATCH  | `/firms/:id`   | Update a farm        | Yes     |
| DELETE | `/firms/:id`   | Delete a farm        | Yes     |

> Full request/response examples in `Server/API_DOCUMENTATION.md`.

---

## Features

- **IoT Integration** — ESP32 sensors push soil moisture, temperature, and humidity data to the backend
- **Real-time Dashboard** — Live sensor readings, weather data, and analytics charts
- **Irrigation Management** — Monitor field moisture levels and automate watering schedules
- **Crop Inventory** — Manage crop types, seasons, sowing and harvest periods
- **Farm Management** — Register farms with geo-location and link sensors
- **Blog System** — Create and manage agricultural articles with image uploads
- **Role-based Access** — Admin, farmer, and viewer roles with granular permissions
- **Cloudinary Integration** — Image upload and hosting for user profiles and blog posts

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to your fork: `git push origin feat/my-feature`
5. Open a pull request

For major changes, please open an issue first.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
