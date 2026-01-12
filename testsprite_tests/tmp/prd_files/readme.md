# Agriculture On Smart Way

[Live demo](https://sam-smart-agriculture2.netlify.app/) • [Repository](https://github.com/Moneemabdullah/Agriculter_ON_SmartWay)

---

## Project Overview

**Agriculture On Smart Way** is a modern web platform that connects farmers, suppliers, and consumers to streamline agricultural operations and improve decision-making. The system integrates IoT sensors for real-time monitoring, provides analytics-driven recommendations, and includes a user-friendly dashboard for farmers and administrators.

Key objectives:
- Improve crop yields and resource efficiency
- Provide timely insights using sensor telemetry and analytics
- Simplify supply-chain operations and marketplace interactions

---

## Tech Stack

- Frontend: **React**, **TypeScript**, **Vite**, **Tailwind CSS**
- Backend: **Node.js**, **Express**
- Database: **MongoDB**
- IoT: **Arduino** (sensor integration)
- Dev & Infra: **Docker**, CI/CD workflows

<p align="center"><img src="https://skillicons.dev/icons?i=react,tailwind,js,nodejs,express,mongodb,arduino,typescript,docker" alt="technologies"/></p>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Environment variables](#environment-variables)
- [Features](#features)
- [Contributing](#contributing)
- [Contact & Support](#contact--support)

---

## Project structure

Top-level folders:

- `client/` — React frontend (Vite + TypeScript)
- `agri-server/` — TypeScript server (API, services, models)
- `Server/` — Node.js/Express API (additional/legacy server code)
- `lib/` — Embedded/IoT sketches (Arduino)

Refer to subfolders for controllers, models, routes, and React components.

---

## Requirements

- Node.js v18+ (recommended)
- npm or yarn
- MongoDB instance (local or cloud)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Moneemabdullah/Agriculter_ON_SmartWay.git
cd Agriculter_ON_SmartWay
```

2. Install dependencies:

```bash
# Frontend
cd client
npm install

# Backend (TypeScript server)
cd ../agri-server
npm install

# Optional: legacy server
cd ../Server
npm install
```

3. Create environment files as described below.

---

## Environment variables

Create a `.env` file in each server directory you intend to run (example keys):

```
# Server (agri-server/.env or Server/.env)
DATABASE_URL=<your_mongodb_connection_string>
PORT=5000
JWT_SECRET=<your_jwt_secret>
API_KEY=<optional_api_key>
```

---

## Running the app

Start the client:

```bash
cd client
npm start
```

Start the TypeScript server:

```bash
cd ../agri-server
npm run dev
```

Legacy server (if needed):

```bash
cd ../Server
npm start
```

- Frontend available at: http://localhost:3000
- API available at: http://localhost:5000 (config dependent)

---

## Features

- Real-time telemetry from IoT sensors
- Data aggregation & analytics (daily averages, trends)
- Crop recommendations and alerts
- Role-based access for farmers, suppliers, and admins
- Dashboard widgets for monitoring, payments, and irrigation control

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
