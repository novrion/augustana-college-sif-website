# Technical Summary

## Core
- **Frontend/Backend Framework**: Next.js (TypeScript)
- **CSS Framework**: Tailwind CSS
- **Hosting**: Vercel
- **Database & Storage**: Supabase (PostgreSQL)

## Authentication
- **Auth Provider**: NextAuth.js
  - Google OAuth (restricted to @augustana.edu domains)
  - Credential-based login (username/password)

## Data Integration
- **Stock Data**: Finnhub API
- **Automation**: GitHub Actions workflow (automatically schedules stock updates)

## Access Control
Role-based permissions system with hierarchical access levels:
- `admin`
- `president`
- `vice_president`
- `secretary`
- `holdings_write`
- `holdings_read`
- `user`

## Development & Deployment
The complete codebase is maintained in this GitHub repository, which serves as the direct source for Vercel deployments.

## System Flow
```
┌──────────────┐     ┌─────────────────────┐     ┌───────────────────┐
│ User Browser │<--->│  Vercel (Next.js)   │<--->│  Supabase         │
└──────────────┘     │  - Frontend         │     │  - PostgreSQL     │
                     │  - API Routes       │     │    Database       │
                     └─────────────────────┘     └───────────────────┘
                              ↑   ↑                        ↑
                              │   │                        │
                              ↓   ↓                        ↓
                      ┌────────────────┐            ┌───────────────┐
                      │  Google OAuth  │            │  Finnhub API  │
                      └────────────────┘            └───────────────┘
                                                          ↑
                                                          │
                      ┌─────────────────────┐             │
                      │  GitHub Actions     │-------------┘
                      │  - Stock Scheduler  │
                      └─────────────────────┘
```

## Credits & Warning
The entire project was coded by **Elias Lindstenz** (https://github.com/novrion) for the Augustana College Student Investment Fund during two weeks in the spring of 2025.
Elias had no web development experience prior to this project and therefore a lot of the code is conventionally inconsistent. There is also a good amount of code duplication.
To whoever gets the task of maintaining this website, good luck :).
