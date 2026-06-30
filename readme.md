# Agriculture On Smart Way

[Live demo](https://sam-smart-agriculture2.netlify.app/) • [Repository](https://github.com/Moneemabdullah/Agriculter_ON_SmartWay)
</br>

[![Netlify Status](https://api.netlify.com/api/v1/badges/02efa5f1-5573-4c5e-9805-2694863be63d/deploy-status)](https://app.netlify.com/projects/agriculture-smart/deploys)

---

## Project Overview

**Agriculture On Smart Way** is a modern web platform that connects farmers, suppliers, and consumers to streamline agricultural operations and improve decision-making. The system integrates IoT sensors for real-time monitoring, provides analytics-driven recommendations, and includes a user-friendly dashboard for farmers and administrators.

Key objectives:

-   Improve crop yields and resource efficiency
-   Provide timely insights using sensor telemetry and analytics
-   Simplify supply-chain operations and marketplace interactions

---

## Tech Stack

-   Frontend: **React**, **TypeScript**, **Vite**, **Tailwind CSS**
-   Backend: **Node.js**, **Express**
-   Database: **MongoDB**
-   IoT: **Arduino** (sensor integration)
-   Dev & Infra: **Docker**, CI/CD workflows

<p align="center"><img src="https://skillicons.dev/icons?i=react,tailwind,js,nodejs,express,mongodb,arduino,typescript,docker" alt="technologies"/></p>

---

## Table of Contents

-   [Project Overview](#project-overview)
-   [Tech Stack](#tech-stack)
-   [Project structure](#project-structure)
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Running the app](#running-the-app)
-   [Environment variables](#environment-variables)
-   [Features](#features)
-   [Contributing](#contributing)
-   [Contact & Support](#contact--support)

---

## Project structure

Top-level folders:

-   `client/` — React frontend (Vite + TypeScript)
-   `Server/` — Express API (TypeScript, controllers, services, models)
-   `lib/` — Embedded/IoT sketches (Arduino)

Refer to subfolders for controllers, models, routes, and React components.

---

## Requirements

-   Node.js v18+ (recommended)
-   npm or yarn
-   MongoDB instance (local or cloud)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Moneemabdullah/Agriculter_ON_SmartWay.git
cd Agriculter_ON_SmartWay
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files as described below.

---

## Environment variables

Create a `.env` file in each server directory you intend to run (example keys):

```
# Server/.env
CONNECTION_STRING=<your_mongodb_connection_string>
PORT=3000
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

See `Server/.env.example` for all required vars.

---

## Running the app

```bash
# Client (http://localhost:5173)
cd client && npm run dev

# Server (http://localhost:3000)
cd Server && npm run dev
```

-   Frontend (Local): http://localhost:5173
-   API (Local): http://localhost:3000/api/v1

---

## Useful links

-   API docs: `Server/API_DOCUMENTATION.md`
-   Test scripts: `testsprite_tests/`

---

## API Endpoints (summary)

| Method | Endpoint                                         | Description                                           | Auth               |
| ------ | ------------------------------------------------ | ----------------------------------------------------- | ------------------ |
| POST   | `/api/v1/auth/signup`                            | Create new user (multipart/form-data; image optional) | No                 |
| POST   | `/api/v1/auth/signin`                            | Sign in and return JWT                                | No                 |
| GET    | `/api/v1/auth/me`                                | Get current authenticated user                        | Yes (Bearer token) |
| GET    | `/api/v1/users`                                  | List users                                            | No                 |
| GET    | `/api/v1/users/:id`                              | Get user by id                                        | No                 |
| PUT    | `/api/v1/users/:id`                              | Update user (farmer)                                  | Yes                |
| DELETE | `/api/v1/users/:id`                              | Delete user (admin/farmer)                            | Yes                |
| POST   | `/api/v1/crops`                                  | Add crop                                              | No                 |
| GET    | `/api/v1/crops`                                  | List crops                                            | No                 |
| GET    | `/api/v1/crops/:name`                            | Get crop by name                                      | No                 |
| DELETE | `/api/v1/crops/:id`                              | Delete crop                                           | Yes (admin)        |
| PUT    | `/api/v1/crops/:id`                              | Update crop                                           | Yes (farmer/admin) |
| POST   | `/api/v1/sensors`                                | Create sensor                                         | Yes (farmer)       |
| GET    | `/api/v1/sensors`                                | Get sensors for current user                          | Yes                |
| GET    | `/api/v1/sensors/id/:sensorId`                   | Get sensor by id                                      | Yes                |
| GET    | `/api/v1/sensors/owner/:ownerId`                 | Get sensors by owner                                  | Yes                |
| DELETE | `/api/v1/sensors/id/:sensorId`                   | Delete sensor                                         | Yes                |
| POST   | `/api/v1/telemetry/ingest`                       | Ingest telemetry data                                 | No                 |
| GET    | `/api/v1/telemetry/average/hour/:sensorId/:date` | Hourly averages for date                              | No                 |
| GET    | `/api/v1/telemetry/average/day/:sensorId/week`   | Daily averages for week                               | No                 |
| POST   | `/api/v1/blogs`                                  | Create blog (photos)                                  | Yes (admin/farmer) |
| GET    | `/api/v1/blogs/owner`                            | Get blogs by owner                                    | Yes                |
| GET    | `/api/v1/blogs`                                  | List blogs                                            | No                 |
| PUT    | `/api/v1/blogs/:blogId`                          | Update blog                                           | Yes (admin/farmer) |
| DELETE | `/api/v1/blogs/:blogId`                          | Delete blog                                           | Yes (admin)        |
| POST   | `/api/v1/blogs/:blogId/like`                     | Like a blog                                           | No                 |
| POST   | `/api/v1/firms`                                  | Create firm (photos)                                  | Yes (farmer)       |
| GET    | `/api/v1/firms`                                  | Get firms (auth)                                      | Yes                |
| GET    | `/api/v1/firms/:id`                              | Get firm by id                                        | Yes                |
| PATCH  | `/api/v1/firms/:id`                              | Update firm                                           | Yes                |
| DELETE | `/api/v1/firms/:id`                              | Delete firm                                           | Yes                |

> **Note:** Base API path is `/api/v1`. Many endpoints require a JWT in the `Authorization` header: `Authorization: Bearer <token>`.
>
> See `Server/API_DOCUMENTATION.md` for full request/response examples and more details.

---

## Project weekly plan

This table summarizes the 10-week project roadmap shown in the client changelog (`client/src/Landing page/Changelog.tsx`).

| Week    | Focus                       | Key tasks                                                               | Status    |
| ------- | --------------------------- | ----------------------------------------------------------------------- | --------- |
| Week 1  | Planning & Setup            | Finalize ideas and assign team roles; Set up GitHub & project tools     | Completed |
| Week 2  | System Design               | Create architecture diagrams; Plan databases; List sensors & components | Completed |
| Week 3  | Hardware Setup              | Connect ESP32 with soil & DHT sensors; Test readings via Serial Monitor | Completed |
| Week 4  | Backend Setup               | Build Node.js + Express API; Connect MongoDB; Test data routes          | Completed |
| Week 5  | Frontend Setup              | Start React app; Add authentication; Basic dashboard UI                 | Completed |
| Week 6  | IoT Integration             | Send ESP32 data to backend; Store in MongoDB; Verify live updates       | Completed |
| Week 7  | Feature Integration         | Add Cloudinary (image upload); Payment integration                      | Completed |
| Week 8  | Role-Based Dashboard        | Enable real-time data display; Add charts for sensor readings           | Completed |
| Week 9  | Testing & Debugging         | Fix bugs and improve UI; Test full system end-to-end                    | Completed |
| Week 10 | Finalization & Presentation | Prepare reports & slides; Create demo video; Finalize deployment        | Upcoming  |

> For an interactive view of the roadmap and progress bar, see the client changelog component: `client/src/Landing page/Changelog.tsx`.

---

## Features

-   Real-time telemetry from IoT sensors
-   Data aggregation & analytics (daily averages, trends)
-   Crop recommendations and alerts
-   Role-based access for farmers, suppliers, and admins
-   Dashboard widgets for monitoring, payments, and irrigation control

---

## Contributing

Thank you for considering a contribution! To contribute:

1. Fork the repository
2. Create a branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "Add feature"`
4. Push: `git push origin feat/my-feature`
5. Open a pull request with a clear description and screenshots (if UI changes)

Please open an issue for larger changes before submitting a PR.

---

## Contact & Support

For questions or support, open an issue or contact the maintainer via the repository.

---

> Note: This README is intended as a developer-friendly introduction. Consider adding a `LICENSE`, CI documentation, and detailed API docs or Swagger file for production-ready releases.
