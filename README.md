# Kamdhenu Enterprise

> Premium dry fruits, nuts, and superfoods at transparent, market-direct prices in Kolkata.

Kamdhenu Enterprise is a modern e-commerce storefront web application designed for browsing premium dry fruits, curating family baskets, calculating proportional quantities and prices, and placing orders directly through WhatsApp.

---

## 🌟 Features

- **Product Catalog & Categorization**:
  - Filter across **Nuts**, **Dried Fruits**, and **Superfoods**.
  - Detailed product cards featuring dual-language labeling (English & Bengali script, e.g. *কাজুবাদাম*, *কাঠবাদাম*, *মাখনা*).
  - Highlights notes, sourcing, and health benefits for each item.
- **Dynamic Weight & Pricing Calculator**:
  - Select preset quantities (100g, 200g, 250g, 500g, 1000g / 1 KG).
  - Accurate proportional line total and subtotal calculations.
- **Pre-Curated Baskets**:
  - One-click addition of popular family packs (Everyday Pack, Family Wellness Pack).
- **Interactive Cart & Order Summary**:
  - Slide-out mobile and desktop basket drawer with quantity controls.
  - Persistent cart state across browser sessions via `localStorage`.
  - Customer notes input and bulk / celebration quotation options.
- **Direct WhatsApp Ordering**:
  - Automatically compiles an itemized, formatted order breakdown with exact rates, weights, and delivery instructions directly to WhatsApp (`+91 8585827649`).
- **Storefront & Location Info**:
  - Location details for Shib Dey Lane, Esplanade, Dharmatala, Kolkata with Google Maps integration.
  - Store hours, delivery policy, and transparent pricing FAQs.
- **Modern Performance & SEO**:
  - Full SSR (Server-Side Rendering) powered by TanStack Start.
  - Schema.org `Store` JSON-LD structured data for rich search engine indexing.
  - Open Graph and responsive meta tags.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start)
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based routing)
- **State & Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Bundler & Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with OKLCH theme tokens and `tw-animate-css`
- **UI Components**: [Radix UI](https://www.radix-ui.com/) accessible primitives & custom styled components
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toasts**: [Sonner](https://sonner.emilkowal.ski/)
- **Testing**: [Vitest](https://vitest.dev/) + Testing Library

---

## 📁 Project Structure

```text
Kamdhenu-Enterprise/
├── public/                  # Static assets (product images, favicons) served at root
├── components/              # UI components
│   ├── storefront.tsx       # Main storefront catalog, cart, and hero interface
│   └── ui/                  # Reusable Radix UI component library (accordion, sheet, button, etc.)
├── hooks/                   # Custom React hooks (e.g. use-mobile)
├── lib/                     # Business logic and utility functions
│   ├── catalog.ts           # Product catalog definitions, pack presets, and order generators
│   └── utils.ts             # Tailwind class merging utility (clsx + tailwind-merge)
├── routes/                  # File-based routes (TanStack Router)
│   ├── __root.tsx           # Root app shell, SEO metadata, fonts, and global providers
│   ├── index.tsx            # Main storefront route (`/`)
│   └── README.md            # Route conventions guide
├── test/                    # Automated unit and integration tests
│   ├── catalog.test.ts      # Tests for pricing, pack derivation, and WhatsApp summaries
│   ├── app-routing.test.tsx # Tests for TanStack Router matching
│   └── setup.ts             # Test environment configuration
├── routeTree.gen.ts         # Generated route tree (auto-managed by TanStack Router)
├── router.tsx               # Client router setup with QueryClient context
├── server.ts                # Server entry point
├── start.ts                 # Start instance configuration & CSRF middleware
├── styles.css               # Global Tailwind CSS v4 design system & theme tokens
├── vite.config.ts           # Vite configuration with TanStack Start & Tailwind plugins
├── tsconfig.json            # TypeScript configuration with `@/*` path aliases
└── package.json             # Project dependencies and lifecycle scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x+` (recommended)
- **npm**: `v10.x+` (or `pnpm` / `yarn`)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <your-github-repo-url>
   cd Kamdhenu-Enterprise
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:5173](http://localhost:5173).

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles both client and SSR server bundles for production. |
| `npm run preview` | Previews the production build locally. |
| `npm test` | Runs the test suite via Vitest. |

---

## 🧪 Testing

Run the automated test suite using:

```bash
npm test
```

This validates:

- Proportional pricing and weight calculations across all product grades.
- Order summary generation and formatting.
- TanStack Router file route tree matching.

---

## 🌐 Production Deployment

The project can be deployed to any modern web platform supporting Node.js or SSR runtimes (Vercel, Netlify, Cloudflare, Railway, Docker, etc.):

1. Run the build step:

   ```bash
   npm run build
   ```

2. The compiled static client assets are located in `dist/client/`, and SSR server bundles are in `dist/server/`.

### Deploying to Vercel

The repository includes a pre-configured `vercel.json` for seamless deployment:

1. Push this repository to your GitHub account.
2. In the [Vercel Dashboard](https://vercel.com/new), click **"Add New Project"** and import the repository.
3. Vercel will automatically detect `vercel.json` with the build command (`npm run build`) and output directory (`dist/client`).
4. Click **Deploy**. The site will be live instantly on Vercel's global CDN with pre-rendered HTML and full SEO.

---

## 📄 License

Copyright © 2026 Kamdhenu Enterprise. All rights reserved.
