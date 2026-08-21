# Affan er Tong — Bangladesh Debate Learning Community

> **"Listen. Think. Speak. Repeat."**
> 
> *Debate Without The Gatekeeping. Learn the craft over a cup of tea.*

**Affan er Tong** is an open, Bangladesh-based debate-learning platform designed to make parliamentary debate education accessible to everyone through structured learning path modules, video breakdowns, open dialogue adda discussions, and a secure administration control system.

---

## Table of Contents

- [Platform Overview](#platform-overview)
- [Visual Design System](#visual-design-system)
- [Core Application Features](#core-application-features)
  - [Public Platform](#public-platform)
  - [Administration Dashboard](#administration-dashboard)
  - [Security & Authentication System](#security--authentication-system)
- [Security & Defense Architecture](#security--defense-architecture)
- [Performance & Web Vitals Optimization](#performance--web-vitals-optimization)
- [Database Architecture & RLS Policies](#database-architecture--rls-policies)
- [Technology Stack](#technology-stack)
- [Project Directory Structure](#project-directory-structure)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Getting Started Locally](#getting-started-locally)
- [Deployment Guide](#deployment-guide)
- [Official Links & Credits](#official-links--credits)

---

## Platform Overview

Affan er Tong bridges the gap between competitive parliamentary debaters and beginners across Bangladesh. Modeled after roadside tea stall ("tong") discussions where ideas are debated casually without hierarchy or gatekeeping, the platform offers:

1. **Structured Learning Modules**: Progressive parliamentary debate lessons categorized by difficulty level (Beginner, Intermediate, Advanced).
2. **Video Resource Library**: Curated video breakdowns of actual debate rounds, case studies, and speaker strategy breakdowns.
3. **Open Floor Q&A Adda**: An interactive community floor where debaters ask questions, share case ideas, and receive answers from community members.
4. **Internal Admin Dashboard**: A secure control system for administrators to manage modules, videos, user permissions, and audit logs.

---

## Visual Design System

The visual identity combines editorial minimalism with Bangladeshi street-poster aesthetics:

### Color Palette
- **Warm Paper Background**: `#F5F0E6` (Evokes wheat-pasted paper and warm tea stalls)
- **Primary Logo Orange**: `#E87525` (High-contrast accent for interactive elements and highlights)
- **Ink Black Typography**: `#171717` (Deep neutral for text, borders, and dark components)
- **Soft Cream Neutral**: `#D7D0C4` (Subtle container borders and card background variations)

### Typography & Aesthetics
- **Display Typography**: `Barlow Condensed` (Bold, uppercase, poster-style headlines)
- **Body Typography**: `Manrope` and `DM Sans` (Clean, legible sans-serif for text reading)
- **Textures & Micro-Interactions**: Paper grain overlays, marquee ticker strips, hand-drawn vector accents, and crisp 1px borders.
- **Custom Branding Suite**: Custom favicon derived from the tea-glass symbol (`favicon.ico`, `affan-tong-icon-v2.png`, `apple-icon.png`, `manifest.ts`).

---

## Core Application Features

### Public Platform

- **Header & Responsive Navigation**:
  - Responsive breakpoint at 900px width.
  - Desktop: Full link navigation, official Facebook button, and account control dropdown.
  - Mobile: Clean logo with accessible drawer navigation panel.
  - Role Awareness: The "Admin Control" menu item is rendered strictly when an authenticated user holds the `admin` role.

- **Hero Section**:
  - Server-rendered headline clamp layout with responsive fluid typography.
  - Inlined pop-art megaphone illustration optimized as WebP (`/hero-megaphone.webp`).

- **Motion Strip Ticker**:
  - Continuous marquee ticker displaying core community values.
  - Module-scoped item arrays to eliminate client-side re-render allocations.

- **Why Tong Section**:
  - 3 Core Pillars detailing the community philosophy: Peer-to-Peer Learning, Accessible Modules, and Open Adda Discussions.

- **Learning Path Section**:
  - Curriculum cards showing module number, level badge, duration, summary, and direct video links.
  - Dynamic link routing to the full `/modules` index page.

- **Video Library Section**:
  - Click-to-Play thumbnail facades using high-quality YouTube image endpoints (`https://i.ytimg.com/vi/ID/hqdefault.jpg`). Zero initial iframe embeds for optimal page load speed.
  - Interactive video player modal with sandbox restrictions (`sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"`).
  - YouTube ID validation using strict regular expressions (`/^[a-zA-Z0-9_-]{11}$/`).

- **Open Floor (Q&A Adda)**:
  - Interactive question feed with search filtering, category tags (Motion Analysis, BP Strategy, WSDC, General), and top-voted sorting.
  - Modal form for submitting new questions and nested response form for answering existing questions.
  - Input sanitization on all user submissions.

- **Community CTA & About Section**:
  - Custom poster panel linking directly to the official Facebook Group and Facebook Page.
  - Verified community background story with accent line markers.

- **FAQ Accordion & Footer**:
  - Toggleable frequently asked questions list.
  - Static server component footer with navigation links and official credits.

---

### Administration Dashboard (`/admin`)

Access to `/admin` requires authentication with a profile role of `admin` and an `account_status` of `active`.

- **Overview Dashboard (`/admin`)**:
  - Real-time counters for Total Learning Modules, Video Resources, Total Registered Debaters, and Active Administrators.
  - Quick action buttons and recent audit trail feed.

- **Module Management (`/admin/modules`)**:
  - Full CRUD operations for Learning Path modules.
  - Features: Numbering, title, slug generation, summary, level assignment, YouTube URL embedding, status toggling (`draft`, `published`, `coming_soon`, `archived`), and sorting.

- **Video Management (`/admin/videos`)**:
  - Full CRUD operations for video breakdown lessons.
  - Features: Title, slug, description, category assignment, YouTube URL extraction, thumbnail assignment, status toggling (`draft`, `published`, `archived`), and featured ordering.

- **User Directory & Management (`/admin/users`)**:
  - Searchable user database listing all registered debaters.
  - Role management: Elevate standard debaters to `admin` or revert roles.
  - Account status management: Suspend accounts with mandatory reason logging, or reactivate suspended debaters.

- **Security Audit Logs (`/admin/audit-logs`)**:
  - Filterable security log tracking administrative actions across the system.
  - Each entry records `admin_id`, action description, entity type, entity ID, entity title, and timestamp.

---

### Security & Authentication System

- **Sign In (`/sign-in`)**:
  - Email & password authentication processed via Supabase Auth server actions.
  - Integrated Cloudflare Turnstile CAPTCHA widget.
  - Rate limiting protection against brute-force attacks.

- **Sign Up (`/sign-up`)**:
  - Registration form with display name, email, password, and password confirmation.
  - Real-time password strength evaluator (score, length, number, symbol, uppercase/lowercase feedback).
  - Integrated Turnstile CAPTCHA challenge.

- **Password Recovery (`/forgot-password` & `/reset-password`)**:
  - Email-based password reset link generation.
  - Account enumeration defense: Neutral responses regardless of whether the email exists.
  - Secure token callback handler (`/reset-password`).

- **Dedicated Error Status Pages**:
  - `/access-denied`: 403 Forbidden page displayed when standard debaters attempt to access `/admin`.
  - `/account-suspended`: 403 Suspended page displayed when a suspended user logs in.
  - `/not-found`: Custom 404 page with navigation fallbacks.

---

## Security & Defense Architecture

The platform implements multi-layered security controls:

### 1. Fail-Closed Authentication Actions
All auth actions (`signUpClientAction`, `signInClientAction`, `forgotPasswordClientAction`, `resetPasswordClientAction`) verify that Supabase is properly configured. If unconfigured or misconfigured, actions fail closed immediately rather than returning mock success states.

### 2. Bot Protection & Rate Limiting
- **Cloudflare Turnstile**: Mandatory server-side token validation (`verifyTurnstileCaptcha`) on all sign-up, sign-in, and recovery requests. Fails closed in production if secret keys are unconfigured.
- **Rate Limiter**: In-memory rate limiting (`checkRateLimit`) with IP tracking and a 10,000-entry memory bound to prevent heap exhaustion Denial of Service (DoS).

### 3. Server-Verified Access Control
- **`getUser()` Verification**: Server component layouts and middleware call `supabase.auth.getUser()` (uncachable server call) rather than `getSession()` (which can be spoofed in local storage).
- **No Client Privilege Escalation**: Local storage fallbacks that previously mocked user state have been completely removed from admin layouts.

### 4. Input Sanitization & Validation
- **Zod Schemas**: Strict validation schemas (`emailSchema`, `passwordSchema`, `displayNameSchema`) enforce boundaries, trim bad whitespace, and normalize Unicode.
- **Iterative HTML Sanitizer**: `sanitizeInput()` uses an iterative loop to strip nested HTML tags (e.g. `<<script>script>`), followed by strict entity encoding.
- **URL Scheme Defense**: External links are validated with `isSafeUrl()` to reject non-HTTP protocols such as `javascript:` or `data:`.

### 5. HTTP Headers & Content Security Policy
`next.config.ts` enforces modern HTTP security headers:
- `Content-Security-Policy`: Restricts script, frame, image, font, and style sources. `'unsafe-eval'` is disabled.
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options`: `DENY`
- `X-Content-Type-Options`: `nosniff`
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: Disables camera, microphone, geolocation, and payment APIs.

---

## Performance & Web Vitals Optimization

- **React Server Components (RSC)**: Static marketing pages and layouts are rendered on the server, minimizing the initial client-side JavaScript bundle size (104 KB shared JS).
- **Click-to-Play YouTube Facades**: Embedded YouTube videos render static WebP thumbnails initially. Interactive `iframe` players load only on explicit user click, eliminating initial third-party script downloads.
- **WebP Image Pipeline**: All illustrations and logos are delivered in compressed WebP format (`logo.webp`, `hero-megaphone.webp`, `community-adda-illustration.webp`, `open-floor-microphone.webp`), reducing asset payloads by over 3.0 MB.
- **Optimized Caching Headers**: Static Next.js assets (`/_next/static/*`) carry immutable 1-year cache headers (`Cache-Control: public, max-age=31536000, immutable`).
- **Database Indexing**: Compound indexes on `status`, `sort_order`, `role`, `account_status`, and `created_at` ensure query responses stay fast under scale.

---

## Database Architecture & RLS Policies

The Supabase database schema (`supabase/schema.sql`) enforces complete data isolation via Row Level Security:

### Tables

1. **`profiles`**:
   - Primary Key: `id` (references `auth.users.id` on delete cascade)
   - Columns: `display_name`, `avatar_url`, `role` (`user`, `admin`), `account_status` (`active`, `suspended`, `disabled`), `suspended_reason`, `suspended_by`, `suspended_at`, `created_at`, `updated_at`.
   - RLS Policies: Public read for active debaters; Users can update display names; Admins can update all profile fields.

2. **`learning_modules`**:
   - Primary Key: `id` (UUID)
   - Columns: `module_number`, `slug`, `title`, `summary`, `level`, `duration`, `source_name`, `youtube_url`, `youtube_id`, `thumbnail_url`, `status`, `sort_order`, `published_at`, `created_by`, `updated_by`, `created_at`.
   - RLS Policies: Public select for `published` / `coming_soon` status; Admin-only insert, update, delete.

3. **`video_resources`**:
   - Primary Key: `id` (UUID)
   - Columns: `title`, `slug`, `description`, `category`, `youtube_url`, `youtube_id`, `thumbnail_url`, `source_name`, `status`, `sort_order`, `published_at`, `created_by`, `updated_by`, `created_at`.
   - RLS Policies: Public select for `published` status; Admin-only insert, update, delete.

4. **`admin_audit_logs`**:
   - Primary Key: `id` (UUID)
   - Columns: `admin_id`, `action`, `entity_type`, `entity_id`, `entity_title`, `changes` (JSONB), `created_at`.
   - RLS Policies: Admin-only select; Admin insert with `admin_id = auth.uid()` verification.

### Database Functions & Triggers

- **`is_admin()`**: SQL Security Definer function checking if `auth.uid()` has `role = 'admin'` and `account_status = 'active'`.
- **`handle_new_user()`**: Trigger function executed `AFTER INSERT ON auth.users`. Automatically creates a default `profile` record with `role = 'user'` and `account_status = 'active'`, preventing client-side role manipulation.

---

## Technology Stack

- **Core Framework**: Next.js 15 (App Router, Server Components)
- **UI Engine**: React 19
- **Type Safety**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Backend & Auth**: Supabase Auth, PostgreSQL, `@supabase/ssr`
- **Validation**: Zod 4
- **Bot Defense**: Cloudflare Turnstile CAPTCHA
- **Icons**: Lucide React

---

## Project Directory Structure

```text
yge-temp/
├── public/
│   ├── affan-tong-icon-v2.png
│   ├── community-adda-illustration.webp
│   ├── hero-megaphone.webp
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── logo.webp
│   └── open-floor-microphone.webp
├── src/
│   ├── app/
│   │   ├── access-denied/
│   │   ├── account-suspended/
│   │   ├── admin/
│   │   │   ├── audit-logs/
│   │   │   ├── modules/
│   │   │   │   ├── [id]/edit/
│   │   │   │   └── new/
│   │   │   ├── users/
│   │   │   └── videos/
│   │   │       ├── [id]/edit/
│   │   │       └── new/
│   │   ├── api/
│   │   │   └── csrf/
│   │   ├── auth/
│   │   │   └── callback/
│   │   ├── forgot-password/
│   │   ├── modules/
│   │   ├── reset-password/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── verify-email/
│   │   ├── error.tsx
│   │   ├── global-error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── manifest.ts
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminSidebar.tsx
│   │   ├── security/
│   │   │   └── browser-deterrents.tsx
│   │   ├── AboutSection.tsx
│   │   ├── AuthModal.tsx
│   │   ├── CommunityCta.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LearningPathSection.tsx
│   │   ├── ModuleRow.tsx
│   │   ├── MotionStrip.tsx
│   │   ├── QnASection.tsx
│   │   ├── TurnstileCaptcha.tsx
│   │   ├── VideoLibrarySection.tsx
│   │   └── WhyTongSection.tsx
│   ├── content/
│   │   ├── faq.ts
│   │   ├── learning-path.ts
│   │   ├── site.ts
│   │   └── video-library.ts
│   ├── lib/
│   │   ├── actions/
│   │   │   └── auth-actions.ts
│   │   ├── supabase/
│   │   │   ├── admin.ts
│   │   │   ├── client.ts
│   │   │   ├── middleware.ts
│   │   │   └── server.ts
│   │   ├── validations/
│   │   │   └── auth.ts
│   │   ├── rate-limit.ts
│   │   ├── security.ts
│   │   ├── supabase.ts
│   │   └── youtube.ts
│   └── middleware.ts
├── supabase/
│   └── schema.sql
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

---

## Environment Variables Configuration

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-Only Admin Service Role Key (Do NOT expose with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key-here

# Cloudflare Turnstile Bot Protection
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key-here
TURNSTILE_SECRET_KEY=your-turnstile-secret-key-here
```

---

## Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm / yarn / pnpm

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MeherabHS/Affan-er-tong.git
   cd Affan-er-tong
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy `.env.example` to `.env.local` and populate your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Initialize Database Schema**:
   Copy the contents of [`supabase/schema.sql`](file:///c:/Users/CUBE/Desktop/yge-temp/supabase/schema.sql), open your **Supabase Dashboard → SQL Editor**, paste the code, and click **Run**.

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for Production Verification**:
   ```bash
   npm run build
   ```

---

## Deployment Guide

### Vercel Deployment

1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Configure the Environment Variables in Vercel Project Settings (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`).
4. Deploy. Next.js App Router will compile static pages and API routes automatically.

---

## Official Links & Credits

- **Official Facebook Page**: [facebook.com/Affan-er-Tong](https://www.facebook.com/people/Affan-er-Tong/61568027547475/)
- **Official Facebook Group**: [Affan er Tong Facebook Group](https://www.facebook.com/groups/1430127851736351/)
- **Engineered & Managed by**: [MHS](https://meherabhs.netlify.app)

---

© 2026 **Affan er Tong**. All rights reserved. *LISTEN. THINK. SPEAK. REPEAT.*
