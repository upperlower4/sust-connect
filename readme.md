# SUST Connect – University Social Network

SUST Connect is a full‑stack social platform built for students, teachers, and alumni of Shahjalal University of Science and Technology (SUST). It combines a modern feed, emergency blood requests, a donor directory, direct messaging, events, polls, and an admin dashboard. Built with **Next.js 14 (App Router)**, **Supabase**, and **Cloudinary**.

## Features

### Core
- **Authentication** – Email OTP login, sign‑up with teacher toggle (requires admin verification)
- **Profile** – Unique `@username`, birth date (3 fields, stored as one), department, session, blood group, donor status, last donation date
- **Feed** – Six post types: General, Confession, Notice, Job, Tuition, Blood Request, Poll, Event
- **Blood Request** – Emergency badge, deadline‑based auto‑expiry
- **Confession** – Romantic styling, anonymous author
- **Donor Directory** – Search by blood group, session, department – contact via DM (phone hidden)
- **Friend & Prem Requests** – Gender‑based logic (same gender → only friend; opposite → both)
- **Real‑time Direct Messaging** – Read/unread status, online indicator, Supabase Realtime
- **Comments** – Text only, on all posts
- **Events** – Created only by verified users (teachers/admins), with “Going” / “Interested”
- **Polls** – Create multi‑option polls, one vote per user
- **Admin Dashboard** – User management, teacher verification, report handling
- **Notifications** – In‑app notifications for friend requests, messages, etc.
- **Expiry Logic** – Auto‑delete job/tuition/blood posts after deadline; archive expired notices
- **Auto‑fetch SUST Notices** – Scrapes official website and posts as notices (scheduled cron)

### UI/UX
- Mobile‑first responsive design
- Desktop: top navbar, right sidebar showing online friends
- Mobile: bottom navigation, floating `[+]` button to create posts
- Clean, modern look with Tailwind CSS

### Performance
- All images compressed to **≤70 KB** on upload (Cloudinary)
- Feed thumbnails served at **≤4 KB** (via query parameters)
- Unique view count (once per user/session)

## Tech Stack

| Area          | Technology |
|---------------|------------|
| Frontend      | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Backend       | Supabase (Auth, PostgreSQL, Realtime) |
| Image Storage | Cloudinary |
| Icons         | Lucide React |
| Hosting       | Vercel (recommended) |

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier)
- Cloudinary account (free tier)
- (Optional) Vercel account for deployment

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sust-connect.git
   cd sust-connect
Install dependencies

bash
npm install
Set up environment variables
Copy .env.example to .env.local and fill in your values (see below).

Set up Supabase

Create a new Supabase project.

Run the SQL schema from supabase/schema.sql (provided in the repository) in the Supabase SQL editor.

Configure Row Level Security (RLS) – basic policies are included.

Set up Cloudinary

Create a Cloudinary account.

Get your cloud name, API key, and API secret from the dashboard.

Run the development server

bash
npm run dev
Open http://localhost:3000.

Environment Variables
Create a .env.local file in the root with:

env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Note: The service role key is used for cron jobs and admin operations. Keep it secure.

Database Schema
The main tables are:

profiles – user data

posts – all posts (including polls and events)

comments, reactions, post_views

friends – friend/prem requests

messages – direct messages

notifications, reports

events – separate table for event details

polls, poll_votes

online_status – real‑time online tracking

The full SQL schema is in supabase/schema.sql. After creating the tables, enable RLS and set up policies as described.

Deployment
Deploy to Vercel
Push your code to a GitHub repository.

Log in to Vercel and import the project.

Add the environment variables (same as .env.local).

Deploy.

Cron Jobs (Auto‑Expiry & SUST Notices)
Set up a cron job (e.g., Vercel Cron Jobs, cron‑job.org) to call:

https://yourdomain.com/api/cron/expire-posts – runs daily to delete expired posts.

https://yourdomain.com/api/webhook/sustain-notices – runs periodically to fetch and post new SUST notices.

Folder Structure
text
sust-connect/
├── app/                  # Next.js App Router
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes
│   ├── auth/             # Sign in / sign up / verify OTP
│   ├── donor/            # Donor directory
│   ├── events/           # Events listing and creation
│   ├── messages/         # Direct messages
│   ├── polls/            # Polls list
│   ├── profile/          # User profile pages
│   ├── layout.tsx        # Root layout with sidebar & bottom nav
│   └── page.tsx          # Feed
├── components/           # Reusable UI components
│   ├── admin/
│   ├── dm/
│   ├── donor/
│   ├── events/
│   ├── feed/
│   ├── polls/
│   └── ui/
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── cloudinary.ts     # Image upload helper
│   └── utils.ts          # Helper functions (createNotification)
├── public/               # Static assets
├── middleware.ts         # Auth protection
└── ...
Usage
Creating a Post
Click the [+] button (bottom right on mobile, top right on desktop).

Select post type (General, Confession, Notice, Job, Tuition, Blood Request, Poll).

Fill in required fields.

For Blood Request, set deadline; the post will auto‑delete after that date.

Donor Directory
Use filters (blood group, session, department) to find donors.

Click “Message” to start a direct chat – phone numbers are never exposed.

Direct Messaging
On desktop, see online friends in the right sidebar.

On mobile, tap the Messages icon in bottom nav.

Send text messages – messages are real‑time with read receipts.

Events
Only verified users (teachers/admins) can create events.

Users can mark “Going” or “Interested”.

Polls
Anyone can create a poll (through the [+] button).

Users can vote once.

Results are shown after voting.

Admin
Access /admin (only users with is_admin = true).

Verify teachers, toggle alumni status, view and resolve reports.

Contributing
Contributions are welcome! Please open an issue or submit a pull request.

License
MIT

Acknowledgments
Built for SUST community

Uses Supabase for real‑time backend

Image optimization by Cloudinary
