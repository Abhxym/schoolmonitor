# Migrating from Vite/React SPA to Next.js App Router

This guide explains the exact mental model, architecture, and step-by-step process we used to migrate the School Monitor platform from a standard Vite React application (with `react-router-dom`) to the **Next.js App Router**.

If you are starting a project from scratch or migrating a similar application, follow this thought process.

---

## 1. The Core Paradigm Shift
When moving to Next.js, the most important mental shift is understanding two things:
1. **Routing:** You no longer define routes in a single `App.jsx` file using `<Route path="..." />`. Instead, Next.js uses **File-System Based Routing**. Folders dictate the URL.
2. **Rendering:** Standard React renders everything in the browser (Client-Side). Next.js renders everything on the server by default (Server Components). You only opt-in to browser rendering when you specifically need interactivity.

## 2. Step-by-Step Build Process

### Step 1: Environment Cleanup
If migrating, the first step is tearing down the old bundler.
* **Remove Vite:** Delete `vite.config.js`, `index.html`, and `main.jsx`.
* **Uninstall Dependencies:** Remove `vite`, `@vitejs/plugin-react`, and `react-router-dom`.
* **Install Next.js:** Run `npm install next@latest`.
* **Update `package.json`:** Change scripts to `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`.

*If starting from scratch:* Simply run `npx create-next-app@latest` and choose the App Router architecture.

### Step 2: Setting up the Root Layout (`src/app/layout.jsx`)
In a Vite app, you usually have an `index.html` file where you link your fonts, and a `main.jsx` where you wrap your app in Context Providers. 

In Next.js, **Root Layout** is the king.
* Create `src/app/layout.jsx`. 
* This file MUST contain the `<html>` and `<body>` tags.
* This is where you import your global CSS and define fonts (using `next/font/google`).
* Any global wrappers—like UI Toasters or Theme Providers—go here.

### Step 3: Understanding File-Based Routing
To create a homepage (`/`), you create `src/app/page.jsx`.
To create a `/dashboard` page, you create a folder and a file: `src/app/dashboard/page.jsx`.

* **The Rule:** The folder name becomes the URL path. The `page.jsx` inside it becomes the UI for that path.

### Step 4: Mastering "Route Groups" and Layouts
In our application, we had different sections (Admin, Headmaster, Public), each requiring a different layout (Sidebar vs. Topbar). 

Instead of writing complex wrapper logic, Next.js gives us **Route Groups**. 
By wrapping a folder name in parentheses (e.g., `(admin)`), Next.js **ignores** it in the URL, but allows you to share a layout file for everything inside it.

**Our Architecture:**
* `src/app/(admin)/layout.jsx` -> Contains the Admin Sidebar and wraps all admin pages.
* `src/app/(admin)/admin-dashboard/page.jsx` -> URL becomes `/admin-dashboard`.
* `src/app/(headmaster)/layout.jsx` -> Contains the Headmaster Sidebar.
* `src/app/(public)/layout.jsx` -> Contains the Public Topbar and Footer.

*Note: We renamed our dashboard folders to `admin-dashboard` and `headmaster-dashboard` because Next.js will throw a compilation error if two different route groups try to resolve to the exact same `/dashboard` path.*

### Step 5: The Component Strategy (`src/components/`)
A common mistake in Next.js is putting massive amounts of code directly into `page.jsx`. 

**How to think about it:**
1. `page.jsx` is just an entry point. It represents the "Route".
2. The actual UI should be modularized inside `src/components`.

We moved our massive `src/pages/` files into domain-specific folders:
* `src/components/dashboard/`
* `src/components/attendance/`
* `src/components/public/`
* `src/components/ui/` (for buttons, modals, datatables)

Then, inside `src/app/admin-dashboard/page.jsx`, we simply do:
```jsx
import AdminOverview from '../../../components/dashboard/AdminOverview';

export default function Page() {
  return <AdminOverview />;
}
```

### Step 6: The `"use client"` Directive (Crucial!)
Because Next.js uses Server Components by default, standard React features like `useState`, `useEffect`, `onClick`, or hooks from libraries like `framer-motion` will cause the build to crash.

**The Fix:**
Whenever a component requires interactivity (state, browser lifecycles, or event listeners), you must type `"use client";` at the very top of that specific component file (e.g., in `Sidebar.jsx`, `Modal.jsx`, `Houses.jsx`).

* **Best Practice:** Keep `"use client"` deep in the component tree. Don't put it in `page.jsx` if you can avoid it. Put it directly in the interactive UI component (like a Button or a Modal), so the rest of the page can remain a fast Server Component.

---

## Summary Cheat Sheet for Development

1. **Need a new page?** -> Create a folder in `src/app` and add a `page.jsx`.
2. **Need a shared wrapper/navbar?** -> Create a `layout.jsx` in that folder structure.
3. **Using `useState` or `onClick`?** -> Add `"use client";` at the top of the file.
4. **Where does global CSS go?** -> Import it into `src/app/globals.css` and load it in the Root `layout.jsx`.
5. **How to link between pages?** -> Don't use standard `<a>` tags. Use `import Link from 'next/link';` for optimized, instant client-side transitions.
