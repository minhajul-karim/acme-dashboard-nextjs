# Invoice Management App

## Setup Instructions
### **1. Clone the Repository**
```bash
git clone git@github.com:minhajul-karim/acme-dashboard-nextjs.git
cd acme-dashboard-nextjs
```

### **2. Install Dependencies**
```bash
pnpm install   # or npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory and add the following:
```env
POSTGRES_URL="postgres://user:***@host:port/database"
POSTGRES_URL_NON_POOLING="postgres://user:***@host:port/database"
POSTGRES_USER="user"
POSTGRES_HOST="host"
POSTGRES_PASSWORD="***"
POSTGRES_DATABASE="database"
AUTH_SECRET="***"
```

### **4. Start the Development Server**
```bash
pnpm dev   # or npm run dev
```

## Technologies Used
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication
- **PostgreSQL** for storing data

## Features

### Authentication & Authorization
- Secure authentication with NextAuth.js
- Protected routes with Middleware

### Invoices Management
- View invoices in a paginated table
- Create, edit, and delete invoices

### Dashboard & Analytics
- Dynamic analytics on collected, pending, total invoices & customers
- View latest invoices

### Advanced Search & Filters
- Debounced search using URL search params
- Pagination with state persistence

### Performance & Optimization
- Server Components for efficient data fetching
- Streaming & usage of skeletons for better loading states

### Error Handling & Validation
- Custom `error.tsx` for handling route errors
- 404 handling with `not-found.tsx`
- Server-side validation for forms
- Inline error display with React's `useActionState`

## Deployment
The application is **deployed on Vercel**. You can access the live version here:
[https://acme-dashboard-nextjs-chi.vercel.app/](https://acme-dashboard-nextjs-chi.vercel.app/)

## Future Improvements
- Full CRUD functionality for customers
- Paginated and searchable customer list
- Dynamic customer details page
- Toast notifications for CRUD actions
- Email notifications for new invoices
- PDF reports generation
- Dark mode toggle with Tailwind CSS

---
### **Author**
Developed by **Minhajul Karim** as part of a learning project to master **Next.js full-stack development**.
