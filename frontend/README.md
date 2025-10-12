# Happy Everyday Property Management - Frontend

AI-Powered Property Management Platform Frontend

## Version: 0.0.1

## Technology Stack

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Query** for data fetching
- **Recharts** for data visualization

## Features

### Analytics Dashboard
- Real-time KPI cards (Occupancy, NOI, Cash Flow, Retention)
- Interactive charts and graphs
- Monthly cash flow analysis
- Occupancy distribution visualization
- Maintenance statistics

### Property Inspections
- Image upload interface
- AI-powered analysis display
- Damage detection results
- Cost estimation visualization

### Service Provider Management
- Provider directory
- Real-time availability status
- Rating and performance metrics
- Contact management

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NEXT_PUBLIC_VERSION`: 0.0.1

## Project Structure

```
frontend/
├── app/                    # Next.js app router
│   ├── dashboard/         # Dashboard page
│   ├── inspections/       # Inspections page
│   ├── providers/         # Providers page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── analytics/        # Analytics components
│   ├── Footer.tsx        # Footer with version
│   └── providers.tsx     # React Query provider
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## API Integration

The frontend connects to the FastAPI backend at `NEXT_PUBLIC_API_URL`.

Key API endpoints:
- `/api/analytics/*` - Analytics and BI data
- `/api/inspections/*` - Property inspections
- `/api/providers/*` - Service provider management
- `/api/privacy/*` - Privacy and compliance

## Version Tracking

Version number is displayed in the footer (bottom right corner).
Current version: **0.0.1**

Version increments by 0.0.1 with each significant update.

## License

Proprietary - Happy Everyday Property Management

