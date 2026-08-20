# Requirements Document

## ACME Salary Management System

**Author:** Assessment Submission
**Date:** August 2026
**Version:** 1.0

---

## 1. Goal

Replace ACME Corp's Excel-based salary management process with a web-based internal tool that allows the HR Manager to manage compensation data for 10,000 employees across multiple countries, and derive meaningful insights about how the organisation pays its people.

---

## 2. User Persona

**Single user: HR Manager**
Internal tool. No authentication or role-based access control is required. The user is assumed to be pre-authenticated and trusted.

---

## 3. In-Scope Features

### 3.1 Employee Management

- **List View** — Paginated table (configurable page size) with columns for name, role, department, country, salary (local currency), salary (USD equivalent), employment type, and status.
- **Search** — Full-text search across employee name, email, and role.
- **Filter** — Filter by country, department, employment type, and status.
- **Sort** — Sort by name, salary, hire date, country, or department.
- **Add Employee** — Form to create a new employee record with full validation.
- **Edit Employee** — Update any field on an existing employee record.
- **View Detail** — Dedicated detail page for a single employee.
- **Deactivate / Reactivate** — Soft-delete via a status toggle (ACTIVE / INACTIVE). Data is preserved; employees are not hard-deleted.

### 3.2 Analytics Dashboard

- **KPI Cards** — Total active employees, total monthly payroll (USD), average salary (USD), median salary (USD).
- **Headcount by Country** — Bar chart showing employee distribution across US, India, UK, Germany.
- **Payroll by Department** — Donut chart showing total payroll spend broken down by department.
- **Average Salary by Country** — Bar chart comparing average USD-normalised salary per country.
- **Salary Distribution** — Histogram showing salary band distribution across the employee population.
- **Employment Type Breakdown** — Pie chart for Full-time / Part-time / Contractor split.
- **Dashboard Filters** — All charts filterable by country and department.

---

## 4. Deliberately Out of Scope (with Reasoning)

| Feature                        | Reason for Exclusion                                                                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Authentication & login**     | Explicitly excluded by product owner. Internal tool; single trusted user assumed.                                                                    |
| **Tax & payroll calculations** | Gross-to-net math, CTC components, and country-specific tax rules are explicitly out of scope. Compensation data management only.                    |
| **Salary revision history**    | Adds schema versioning complexity. Not required for core CRUD. Can be added in a future iteration.                                                   |
| **Salary bands / grades**      | No benchmark or grade data provided. Meaningful bands cannot be defined without additional business input.                                           |
| **Bulk Excel import**          | The 10,000-employee dataset is populated via a clean seed script. An import tool adds UI/parsing complexity without adding value to the asWsessment. |
| **Real-time exchange rates**   | Real-time rate APIs introduce rate-limit risks. We fetch the free, daily-updated `https://www.exchangerate-api.com/` to seed rates at startup.       |
| **Approval workflows**         | Requires multi-user roles and notification infrastructure. Out of scope given single-user context.                                                   |
| **Multi-user / RBAC**          | No multi-user requirement. Single HR Manager persona.                                                                                                |
| **Email notifications**        | No user accounts or communication workflows in scope.                                                                                                |
| **Mobile application**         | Web-only is sufficient for a desktop-centric internal HR tool.                                                                                       |

---

## 5. Technical Choices & Trade-offs

### Architecture

**Chosen:** Mono-repo with two separate apps — `backend/` (Express.js + TypeScript) and `frontend/` (Next.js 14 + TypeScript).

**Trade-off:** A Next.js mono-repo using API Routes would have been simpler to deploy. A separate Express backend was chosen to demonstrate clear separation of concerns, explicit REST API design, and independent deployability — more representative of a production engineering context.

### Database

**Chosen:** PostgreSQL (Neon DB) + Prisma ORM.

**Trade-off & SQLite Migration Rationale:** Initially, SQLite was chosen for local simplicity. However, in cloud deployment environments like Render's free tier, the container filesystem is ephemeral, meaning any local SQLite database changes are completely lost whenever the container restarts or redeploys. Since attaching persistent disks on Render is a paid feature, we migrated to **Neon DB (PostgreSQL)**. Neon provides a serverless PostgreSQL database with a generous free tier, enabling full data persistence across container redeploys at zero cost, while keeping the stack fully standard and compatible with Prisma.

### Multi-Currency Strategy

**Chosen:** Salaries stored in local currency. A daily-updated, free, public API (`https://www.exchangerate-api.com/`) is fetched at startup/seeding to populate the `ExchangeRate` table, which is used to normalise all values to USD for analytics.

### Component Library

**Chosen:** shadcn/ui + Tailwind CSS.

**Rationale:** Accessible, unstyled-by-default components with full customisability. No vendor lock-in. Production-quality output without opinionated design constraints.

### Deployment

**Chosen:** Vercel (frontend) + Render (backend Web Service) + Neon (cloud PostgreSQL database).

**Trade-off:** Hosting the backend on Render's free tier means the web service spins down after 15 minutes of inactivity, resulting in a brief cold start when accessed again. However, connecting to a managed, serverless database like Neon ensures all updates, status toggles, and seeded records are fully persisted permanently for free, bypassing ephemeral filesystem limitations of the free tier. In actual scenario, we would have choosen a paid and relaible service but for the sake of the assignment I choose this.

---

## 6. Data Model & Seed Assumptions

**Countries covered:** United States (US), India (IN), United Kingdom (UK), Germany (DE)

**Employee distribution (seed):**

- US: 40% | India: 30% | UK: 20% | Germany: 10%
- Full-time: 80% | Part-time: 10% | Contractor: 10%
- Active: 90% | Inactive: 10%
- Departments: Engineering, Sales, Marketing, HR, Finance, Operations, Product

**Salary ranges (annual, local currency):**

| Country | Currency | Min     | Max       |
| ------- | -------- | ------- | --------- |
| US      | USD      | 50,000  | 300,000   |
| India   | INR      | 500,000 | 5,000,000 |
| UK      | GBP      | 30,000  | 180,000   |
| Germany | EUR      | 35,000  | 200,000   |

Seed data generated using `@faker-js/faker` for realistic names, emails, and hire dates.

---

## 7. Quality Standards

- All API endpoints covered with unit tests (happy path + error path).
- Core business logic (currency conversion, KPI calculation) tested independently.
- TypeScript strict mode enabled across both apps.
- Zod used for runtime request validation on all mutation endpoints.
- Incremental Git commits demonstrating solution evolution.
