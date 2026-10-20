<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5afe125a-d923-41d3-947e-5cc7fca95979

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Admin portal

- Open the website and select **Admin Portal** in the top strip.
- Sign in with the administrator email configured in `src/components/AdminPortal.tsx` and a password for an account that already exists in Firebase Authentication.
- The portal lists bookings, searches by patient/contact/doctor/reference, filters by status, updates booking status, and creates bookings from the admin side.
- Do not put passwords in source code or commit them to Git. A password previously shared in a chat should be changed before use.

### Before production deployment

The admin email check in the UI is only a user-interface gate, not a security boundary. Configure Firebase Authentication and enforce administrator-only access in Firestore Security Rules (or a trusted server using custom claims) before deploying. Do not rely on client-side checks to protect patient data. Also ensure your Firestore rules allow authorized appointment creation/status updates and deny unauthorized reads/writes.

### Local run

1. Install Node.js (current LTS).
2. Run `npm install`.
3. Run `npm run dev`.
