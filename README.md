# ACME Salary Management System

A web-based Employee Salary Management System designed for ACME Corp's HR Manager, built following a strict design system.

## System Architecture

![ACME Salary System Architecture](salaray-management-architectural-diagram.png)

## Project Structure

This project is a mono-repo containing two separate applications:

- **[`backend/`]**: Express.js + TypeScript + SQLite + Prisma ORM. Serves REST APIs and aggregates analytics.
- **[`frontend/`]**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui + Recharts.

---

## Quick Start Guide

### Prerequisites

- Node.js 18+ or 20+
- npm (Node Package Manager)

### Step 1: Install Dependencies

Install packages for both the backend and frontend services:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Initialize Database and Seed Data

Create the local SQLite database, run Prisma migrations, and seed exactly 10,000 synthetic employee records with random country, department, role, salary, and employment type distributions:

```bash
cd ../backend

# Run Prisma migrations (creates SQLite database E:/Interview/Salary Management Assessment/backend/prisma/dev.db)
npx prisma migrate dev --name init

# Seed the database (runs seeded Faker module to populate 10,000 records)
npx prisma db seed
```

### Step 3: Run the Servers

Open two terminal windows to run the servers concurrently in development mode:

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
# Server will run on http://localhost:4000
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
# App will run on http://localhost:3000
```

---

## Testing

Both frontend and backend are equipped with automated test suites ensuring high confidence in business calculations and components.

### Run Backend Tests (Jest)

Runs the test suites covering endpoint validations, currency calculation functions, and data transformations.

```bash
cd backend
npm test
# To view code coverage reports (target >= 70%):
npm run test:coverage
```

### Run Frontend Tests (React Testing Library)

Runs DOM assertions for key UI components (KPI cards, employee tables, and creation forms).

```bash
cd frontend
npm test
```

---

## Reference Specs

For full product framing, see:

- [Requirements Specification](requirements.md)
- [Design System details](design_system.md)
