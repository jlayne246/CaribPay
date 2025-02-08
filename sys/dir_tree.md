/p2p-payment-app
├── /framework
│   ├── /core
│   │   ├── BaseModel.ts          # Core ORM functionalities
│   │   ├── QueryBuilder.ts       # Abstract SQL query builder
│   │   └── TransactionHandler.ts # Transaction safety utilities
│   ├── /config
│   │   ├── db.ts                 # MySQL database connection
│   │   └── env.ts                # Environment variable loader
│   └── /utils
│       ├── JWTService.ts         # JWT handling (auth, verification)
│       ├── QRCodeService.ts      # QR code generation/scanning logic
│       └── Logger.ts             # Centralized logging utility
│
├── /app
│   ├── /frontend
│   │   ├── /public               # Static assets (images, icons, etc.)
│   │   ├── /src
│   │   │   ├── /components       # Reusable React/Vue components
│   │   │   ├── /pages            # Main pages (Dashboard, Login, etc.)
│   │   │   ├── /services         # API service layer to interact with the backend
│   │   │   ├── /hooks            # Custom React hooks (if using React)
│   │   │   └── index.tsx         # Entry point for React/Vue
│   │   └── vite.config.ts        # Vite config for frontend
│
│   ├── /backend
│   │   ├── /src
│   │   │   ├── /controllers      # Handles HTTP requests (API endpoints)
│   │   │   ├── /services         # Business logic (transaction processing, auth)
│   │   │   ├── /middlewares      # Auth guards, error handling, role checks
│   │   │   ├── /models           # User, Wallet, Transaction models (extending BaseModel)
│   │   │   ├── /routes           # API routes definitions
│   │   │   ├── /sockets          # WebSocket logic for real-time updates
│   │   │   ├── server.ts         # Main Express app entry point
│   │   │   └── app.ts            # App initialization (middlewares, routes, sockets)
│   │   └── tsconfig.json         # TypeScript config for backend
│
│   └── /shared                   # Code shared between frontend & backend (types, constants)
│       ├── /types                # Global TypeScript types/interfaces
│       └── /constants            # App-wide constants (currencies, roles, etc.)
│
├── package.json
├── tsconfig.json
└── README.md
