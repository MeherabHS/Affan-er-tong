# Affan er Tong — Bangladesh Debate Learning Community

> **"Listen. Think. Speak. Repeat."**
> 
> *Debate Without The Gatekeeping. Learn the craft over a cup of tea.*

**Affan er Tong** is an open, Bangladesh-based debate-learning platform designed to make parliamentary debate education accessible to everyone through structured learning path modules, breakdown video resources, open dialogue, and a secure administration dashboard.

---

## Key Features & Systems

### 1. Minimal Street-Poster & Tong Aesthetic
- **Authentic Visual System**: Inspired by Bangladeshi debate culture and informal roadside "tong/adda" tea stall discussions.
- **Official Color Palette**:
  - Warm Paper Background: `#F5F0E6`
  - Logo Primary Orange: `#E87525`
  - Ink Black Typography: `#171717`
  - Soft Cream Highlights: `#D7D0C4`
- **Typography & Layout**: Bold condensed display headers paired with clean body copy, distressed paper textures, marquee ticker strips, and handcrafted vector graphics.
- **Custom Favicon Suite**: Tea-glass symbol favicon derived from the official logo (`favicon.ico`, `icon.png`, `apple-icon.png`, `manifest.ts`).

---

### 2. Supabase Auth, Security & Input Sanitization
- **Cookie-Based PKCE SSR Authentication**: Built using `@supabase/ssr` with server-readable cookie sessions (`getUser()` verification).
- **Unbypassable Zod Validation**:
  - **Email**: Case-insensitive, control character removal, strict email validation.
  - **Password**: 12–128 characters; explicit validation error if leading/trailing whitespace exists (no silent trimming). Real-time password strength meter.
  - **Display Name**: Trims, collapses whitespace, applies Unicode NFC normalization, supports Bangla (`\u0980-\u09FF`) and international scripts, blocks direction-control abuse.
- **Security Hardening**:
  - **Cloudflare Turnstile CAPTCHA**: Bot & brute-force protection integrated into sign-up, sign-in, and password recovery.
  - **Account Enumeration Prevention**: Neutral responses for all authentication actions.
  - **Safe Redirect Defense**: `getSafeRedirect()` blocks open-redirect attacks (`javascript:`, external URLs, backslash bypasses).
  - **Security Headers & CSP**: Strict Content Security Policy allowing Turnstile, YouTube embeds, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
  - **Dedicated Error Status Pages**: Custom HTTP status pages for `/access-denied` (403), `/account-suspended` (403), and `/not-found` (404).

---

### 3. Protected Administration System (`/admin`)
- **Role-Based Access Control (RBAC)**: Enforced via SQL Security Definer `is_admin()` and database Row Level Security (RLS) policies.
- **Module Management**: Create, edit, reorder, publish, unpublish, and delete Learning Path modules.
- **Video Resource Management**: Add, edit, category-tag, and remove YouTube breakdown lessons.
- **User Directory**: View debaters, elevate users to `admin`, or suspend accounts with custom suspension reasons.
- **Security Audit Logs**: Track all administrative actions with timestamped audit entries (`admin_audit_logs`).

---

### 4. High Performance & Core Web Vitals
- **React Server Components**: Page layouts and static marketing sections (`HeroSection`, `WhyTongSection`, `AboutSection`, `CommunityCta`, `MotionStrip`) run server-side without initial client JS overhead.
- **Zero Initial YouTube Iframes**: Click-to-Play video facades with YouTube thumbnails (`https://i.ytimg.com/vi/ID/hqdefault.jpg`). `iframe` embeds (`https://www.youtube-nocookie.com/embed/ID`) load only when the user clicks Play.
- **Optimized WebP Image Pipeline**: Over 2.1 MB of image payload reduced through WebP compression (`logo.webp`, `hero-megaphone.webp`, `community-adda-illustration.webp`, `open-floor-microphone.webp`).
- **Database Query Limits & Column Filtering**: Queries fetch explicit columns instead of `SELECT *` with database index optimizations (`schema.sql`).

---

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend & Auth**: Supabase Auth & PostgreSQL (`@supabase/ssr`)
- **Validation**: Zod
- **Bot Protection**: Cloudflare Turnstile CAPTCHA
- **Icons**: Lucide React

---

## Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm / yarn / pnpm

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MeherabHS/Affan-er-tong.git
   cd Affan-er-tong
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root folder:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key-here

   # Optional Cloudflare Turnstile CAPTCHA
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=
   TURNSTILE_SECRET_KEY=
   ```

4. **Initialize Database Schema**:
   Paste the contents of [`supabase/schema.sql`](file:///c:/Users/CUBE/Desktop/yge-temp/supabase/schema.sql) into your **Supabase SQL Editor** and click **Run**.

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## Official Community Links & Credits

- **Official Facebook Page**: [facebook.com/Affan-er-Tong](https://www.facebook.com/people/Affan-er-Tong/61568027547475/)
- **Official Facebook Group**: [Affan er Tong Facebook Group](https://www.facebook.com/groups/1430127851736351/)
- **Engineered & Managed by**: [MHS](https://meherabhs.netlify.app)

---

© 2026 **Affan er Tong**. All rights reserved. *LISTEN. THINK. SPEAK. REPEAT.*
