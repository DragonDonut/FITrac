# Fitness Rewards Tracker

## Overview
React + Firebase app to track healthy eating and exercise, with a reward system and level resets.

### Admin Panel
Access via: `/admin?key=nysecret` (set in .env)

### User View
Public at `/tracker`

## Setup

1. Copy `.env.example` to `.env` and fill in:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_ADMIN_KEY=nysecret
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run locally:
   ```
   npm run dev
   ```

4. Deploy to Vercel:
   - Push to GitHub
   - Connect repository in Vercel
   - Set environment variables in Vercel dashboard (same as .env)
   - Deploy

## Firestore Schema (single user default)
Collection: `users`
Document: `default`
Example structure:
```
{
  level: 2.5,
  previousLevel: 2.0,
  lastActive: "2025-07-31",
  actions: {
    "2025-07-30": { meal: true, workout: false, remark: "Good day" },
  },
  rewards: [
    { id: "uuid", title: "Cheat Day", level: 4, type: "🍕", hidden: false, claimed: false }
  ]
}
```

## Firebase Security Rules
See `firebase.rules.json`. Example rule to allow only read/write if secret logic implemented in frontend.

## Notes
- Level resets logic (missed day) currently needs to be handled via scheduled cloud function or manual check; admin can override reset.
- Claimed rewards are greyed out in user view.

## Customize
- Edit reward types/icons in `RewardManager.jsx`
- Tweak styling via Tailwind in `index.css`

