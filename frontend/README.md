# FloodAtlas Frontend

FloodAtlas is a hyper-local flash flood prediction and early-warning platform for hilly regions (demonstrated with Chamoli District, Uttarakhand).

## Architecture

This frontend is built using:
- **React & Vite** for clean modular architecture
- **Tailwind CSS** with a professional dark theme and risk tier styling
- **Leaflet & React-Leaflet** for interactive GIS maps with real-time risk markers and village boundaries
- **React Router** for role-based routing (Public, Authority, Admin)
- **Axios** for standardized REST API communication
- **Socket.IO Client** for real-time risk, prediction, and telemetry updates
- **Lucide Icons** for consistent iconography

## Directory Structure

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── map/
│   │   ├── weather/
│   │   ├── risk/
│   │   ├── alerts/
│   │   └── authority/
│   │
│   ├── pages/
│   │   ├── public/
│   │   ├── authority/
│   │   └── admin/
│   │
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── socket/
│   ├── routes/
│   ├── locales/
│   ├── utils/
│   └── styles/
│
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env.example
├── .gitignore
└── README.md