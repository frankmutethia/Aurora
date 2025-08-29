# Aurora Motors - AI Development Guide

## Architecture Overview

This is a modern car rental platform built with React 19, TypeScript, Vite, and Tailwind CSS v4. The app uses a **demo-first approach** with localStorage persistence instead of a backend.

### Key Structural Decisions

- **Single Page Application**: All routing handled by React Router in `src/App.tsx`
- **Component-first Architecture**: Reusable UI components in `src/components/`
- **Type-driven Development**: All data structures defined in `src/lib/types.ts`
- **Demo Data Layer**: Mock APIs and data in `src/lib/demo-data.ts` and `src/lib/auth.ts`

## Data Flow & State Management

### Core Data Entities

- **Cars**: Defined by `Car` type with agency-based organization
- **Bookings**: Complex lifecycle from `pending` → `confirmed` → `in_progress` → `completed`
- **Users**: Role-based (`customer` | `admin` | `owner`) with loyalty points
- **Agencies**: Multi-location support (`Aurora motors` | `Smart` | `JNK`)

### Local Storage Pattern

```typescript
// Read pattern (see src/lib/auth.ts)
function getCurrentUser(): Profile | null {
  try {
    return JSON.parse(localStorage.getItem("am_user") || "null");
  } catch {
    return null;
  }
}

// Write pattern
function setCurrentUser(user: Profile | null) {
  if (user) localStorage.setItem("am_user", JSON.stringify(user));
  else localStorage.removeItem("am_user");
}
```

## Component Patterns

### Standard Component Structure

```tsx
// Import React with explicit namespace (project convention)
import * as React from "react";
import type { Car } from "../lib/types";

// Functional components with explicit FC typing
const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  // Component logic
};

export default CarCard;
```

### Styling Conventions

- **Tailwind CSS v4** with custom properties in `src/index.css`
- **Responsive-first**: Always use mobile-first breakpoints (`sm:`, `md:`, `lg:`)
- **Color System**: Sky theme (`sky-600`, `sky-700`) for primary actions
- **Layout**: Prefer CSS Grid for complex layouts, Flexbox for simple alignment

## Development Workflows

### Essential Commands

```bash
npm run dev          # Start development server (requires Node.js 20.19+)
npm run build        # Production build with TypeScript compilation
npm run lint         # ESLint with React hooks and refresh plugins
npm run preview      # Preview production build
```

### Admin Dashboard Access

```typescript
// Quick admin access (see src/components/AdminPage.tsx)
import { createDemoAdmin } from "../lib/demo-admin";
createDemoAdmin(); // Creates admin user in localStorage
```

### Component Development

- **Admin Components**: Rich dashboard components with charts (using Recharts)
- **Public Components**: Simpler, conversion-focused design
- **Form Handling**: Uses controlled components with local state
- **Error Handling**: Toast notifications via `src/components/Toaster.tsx`

## Integration Points

### Demo Data System

All data functions live in `src/lib/demo-data.ts`:

```typescript
// Filter pattern
export function filterDemoCars(query: URLSearchParams) {
  /* complex filtering */
}

// Helper functions
export function getAvailableCars(): Car[];
export function getCarsDueForService(): Car[];
export function getPendingPayments(): Booking[];
```

### Route Structure

- `/` - Homepage with featured cars
- `/cars` - Car catalog with filtering
- `/cars/:id` - Car details
- `/book/:id` - Booking form with payment integration
- `/admin` - Protected admin dashboard (role-based access)
- `/profile` - User bookings and account

### Admin Dashboard Features

- **Multi-section Dashboard**: Sidebar navigation between dashboard/bookings/fleet/users/maintenance/reports
- **Real-time Charts**: Revenue trends, fleet utilization, booking distribution
- **Table Management**: Advanced filtering, pagination, bulk actions
- **Service Tracking**: Odometer-based maintenance scheduling

## Project-Specific Conventions

### Import Organization

```typescript
// 1. React and external libraries
import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 2. Internal types
import type { Car, Booking, Profile } from "../lib/types";

// 3. Internal utilities and data
import { DEMO_CARS, filterDemoCars } from "../lib/demo-data";
import { getCurrentUser } from "../lib/auth";

// 4. Components
import Header from "../components/Header";
```

### Form Patterns

- **Booking Flow**: Multi-step with driver details collection
- **Validation**: Runtime validation with user feedback
- **Payment Integration**: Simulated payment processing with method selection

### Agency-Based Organization

Cars belong to agencies with fixed pickup/return locations. When booking, locations are auto-set based on car's agency (see `getAgencyAddress()` usage).

When adding new features, follow the demo-data pattern and ensure TypeScript types are updated first.

## API Integration Readiness

### Backend Contract Alignment

The frontend is designed for seamless API migration. Key alignment points:

**Type Definitions** (`src/lib/types.ts`):

```typescript
// All types match expected backend schema
export type Car = {
  id: number; // Backend: car.id
  make: string; // Backend: car.make
  model: string; // Backend: car.model
  agency: Agency; // Backend: car.agency (enum)
  status: CarStatus; // Backend: car.status (enum)
  // ... exact field mapping
};
```

**Demo Data Structure** (`src/lib/demo-data.ts`):

- `DEMO_CARS`, `DEMO_BOOKINGS`, `DEMO_USERS` arrays mirror backend response format
- Helper functions (`getAvailableCars()`, `filterDemoCars()`) simulate API endpoints
- `URLSearchParams` filtering matches expected query parameters

**API Migration Pattern**:

```typescript
// Current demo pattern
import { DEMO_CARS, getAvailableCars } from "../lib/demo-data";

// Future API pattern (replace import, keep usage)
import { fetchCars, getAvailableCars } from "../lib/api";
```

### Data Layer Abstraction

- **Authentication**: `src/lib/auth.ts` localStorage functions → API calls
- **Booking Flow**: Form validation and submission ready for REST endpoints
- **Filtering**: URLSearchParams directly map to backend query strings
- **Pagination**: `PaginatedResponse<T>` type matches expected API format

### State Management Transition

Current localStorage keys match expected API endpoints:

- `am_user` → `/api/auth/me`
- `am_bookings` → `/api/bookings`
- Car filtering → `/api/cars?make=toyota&category=SUV`

### Backend Integration Checklist

When migrating to real APIs:

1. **Preserve Type Contracts**: All `src/lib/types.ts` definitions are backend-ready
2. **Replace Data Sources**: Swap `DEMO_CARS` → `fetchCars()` calls
3. **Maintain Filtering**: `URLSearchParams` in `filterDemoCars()` → API query strings
4. **Update Auth Flow**: Replace localStorage patterns in `src/lib/auth.ts`
5. **Booking Lifecycle**: Ensure `BookingStatus` enum matches backend states
6. **Agency System**: `Agency` type and `AGENCY_LOCATIONS` should align with backend

## Development Best Practices

### Terminal Usage

- **Always check existing terminals** with `get_terminal_output` before starting new ones
- **Reuse running dev servers** - don't restart unless necessary
- **Background processes**: Use `isBackground: true` for servers, `false` for one-off commands
- **Error checking**: Always check terminal output before proceeding
