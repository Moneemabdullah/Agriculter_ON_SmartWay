# Agriculture On Smart Way

## Project Structure

```
Agriculter_ON_SmartWay
├─ client
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ AlertsPanel.tsx
│  │  │  ├─ AnalyticsCharts.tsx
│  │  │  ├─ CropManagement.tsx
│  │  │  ├─ DashboardHeader.tsx
│  │  │  ├─ DashboardOverview.tsx
│  │  │  ├─ DashboardSidebar.tsx
│  │  │  ├─ figma
│  │  │  │  └─ ImageWithFallback.tsx
│  │  │  ├─ IrrigationControl.tsx
│  │  │  ├─ PaymentsPanel.tsx
│  │  │  ├─ SensorCard.tsx
│  │  │  ├─ SettingsPanel.tsx
│  │  │  ├─ TeamManagement.tsx
│  │  │  └─ ui
│  │  │     ├─ accordion.tsx
│  │  │     ├─ alert-dialog.tsx
│  │  │     ├─ alert.tsx
│  │  │     ├─ aspect-ratio.tsx
│  │  │     ├─ avatar.tsx
│  │  │     ├─ badge.tsx
│  │  │     ├─ breadcrumb.tsx
│  │  │     ├─ button.tsx
│  │  │     ├─ calendar.tsx
│  │  │     ├─ card.tsx
│  │  │     ├─ carousel.tsx
│  │  │     ├─ chart.tsx
│  │  │     ├─ checkbox.tsx
│  │  │     ├─ collapsible.tsx
│  │  │     ├─ command.tsx
│  │  │     ├─ context-menu.tsx
│  │  │     ├─ dialog.tsx
│  │  │     ├─ drawer.tsx
│  │  │     ├─ dropdown-menu.tsx
│  │  │     ├─ form.tsx
│  │  │     ├─ hover-card.tsx
│  │  │     ├─ input-otp.tsx
│  │  │     ├─ input.tsx
│  │  │     ├─ label.tsx
│  │  │     ├─ menubar.tsx
│  │  │     ├─ navigation-menu.tsx
│  │  │     ├─ pagination.tsx
│  │  │     ├─ popover.tsx
│  │  │     ├─ progress.tsx
│  │  │     ├─ radio-group.tsx
│  │  │     ├─ resizable.tsx
│  │  │     ├─ scroll-area.tsx
│  │  │     ├─ select.tsx
│  │  │     ├─ separator.tsx
│  │  │     ├─ sheet.tsx
│  │  │     ├─ sidebar.tsx
│  │  │     ├─ skeleton.tsx
│  │  │     ├─ slider.tsx
│  │  │     ├─ sonner.tsx
│  │  │     ├─ switch.tsx
│  │  │     ├─ table.tsx
│  │  │     ├─ tabs.tsx
│  │  │     ├─ textarea.tsx
│  │  │     ├─ toggle-group.tsx
│  │  │     ├─ toggle.tsx
│  │  │     ├─ tooltip.tsx
│  │  │     ├─ use-mobile.ts
│  │  │     └─ utils.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  └─ styles
│  │     └─ globals.css
│  └─ vite.config.js
├─ developer_board
│  └─ sensorData
│     └─ smartsensor.ino
├─ readme.md
└─ Server
   ├─ .env
   ├─ Data
   │  ├─ crops.json
   │  ├─ diseases.json
   │  └─ fertilizer.json
   ├─ package-lock.json
   ├─ package.json
   └─ src
      ├─ config
      │  └─ db.config.js
      ├─ controllers
      │  ├─ auth.controller.js
      │  └─ sensor.controller.js
      ├─ index.js
      ├─ middleware
      │  └─ auth.middleware.js
      ├─ models
      │  ├─ dailyAverage.model.js
      │  ├─ sensorData.models.js
      │  └─ user.models.js
      └─ routes
         ├─ auth.routes.js
         └─ sensor.routes.js
```

---

## Description

Agriculter_ON_SmartWay is a comprehensive web application designed to revolutionize agricultural practices by connecting farmers, suppliers, and consumers in a seamless ecosystem. Leveraging technologies like **TypeScript, React, Node.js**, and real-time analytics, the platform helps optimize operations, reduce waste, and enhance supply chain efficiency.

---

## Technologies Used

<p align="">
<img src="https://skillicons.dev/icons?i=react,tailwind,js,nodejs,express,mongodb,arduino,typescript,docker" />
</p>

---

## Table of Contents

-   [Description](#description)
-   [Project Structure](#project-structure)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Features](#features)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)

---

## Installation

```bash
git clone https://github.com/Moneemabdullah/Agriculter_ON_SmartWay.git
cd Agriculter_ON_SmartWay
```

Install client & server:

```bash
cd client
npm install
cd ../Server
npm install
```

Create `.env` in `Server/`:

```
DATABASE_URL=your_database_url
API_KEY=your_api_key
PORT=5000
```

---

## Usage

### Client

```bash
cd client
npm start
```

Open: `http://localhost:3000`

### Server

```bash
cd Server
npm start
```

Runs on `http://localhost:5000`.

---

## Features

-   Real-time data analytics
-   IoT sensor integration
-   Farming insights & crop suggestions
-   Supply chain management
-   E-commerce for farm products
-   Dashboard for farmers & admins
-   Secure authentication
-   Mobile responsive UI

---

## Contributing

1. Fork the repo
2. Create a new branch
3. Commit changes
4. Push & submit PR

---
