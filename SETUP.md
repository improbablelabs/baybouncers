# BayBouncers - Firebase + Vercel Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project" → name it `baybouncers`
3. Disable Google Analytics (or enable if you want it)
4. Click "Create Project"

## 2. Enable Firestore

1. In Firebase Console → Build → Firestore Database
2. Click "Create Database"
3. Start in **production mode**
4. Select region (us-west1 for California)

## 3. Get Client Credentials

1. Firebase Console → Project Settings (gear icon) → General
2. Scroll to "Your apps" → Click web icon (`</>`)
3. Register app name: `baybouncers-web`
4. Copy the config values — you'll need:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## 4. Get Admin Credentials (for API routes)

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. You need `client_email` and `private_key` from this file
5. Base64 encode the private key:
   ```bash
   echo -n "-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n" | base64
   ```

## 5. Add Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

| Variable | Value | Where to find it |
|----------|-------|-------------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `baybouncers.firebaseapp.com` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `baybouncers` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `baybouncers.appspot.com` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123...` | Firebase Console → Project Settings |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-...@baybouncers.iam.gserviceaccount.com` | Service account JSON |
| `FIREBASE_PRIVATE_KEY_BASE64` | `base64-encoded-key` | Service account JSON (base64 encoded) |

## 6. Deploy Firestore Rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # select your project
# Copy firestore.rules to the project root
firebase deploy --only firestore:rules
```

## 7. File Structure

Place the files in your Next.js project like this:

```
your-project/
├── app/
│   ├── api/
│   │   └── bookings/
│   │       └── route.js          ← api-bookings-route.js
│   └── page.jsx                  ← baybouncers.jsx
├── firebase/
│   ├── firebase.js               ← Client SDK config
│   ├── firebase-admin.js         ← Admin SDK (server-side)
│   ├── firestore.js              ← Firestore helper functions
│   └── email-notifications.js    ← Email functions
├── firestore.rules
├── .env.local                    ← Copy from .env.example
└── package.json
```

## 8. Install Dependencies

```bash
npm install firebase firebase-admin stripe
# Optional for emails:
npm install resend
```

## 9. Stripe Setup

### Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from Developers → API Keys
3. Use **test keys** (`pk_test_` / `sk_test_`) during development

### Configure Webhook
1. Go to Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://baybouncers.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.refunded`
4. Copy the **Signing Secret** (`whsec_...`) to your env vars

### For Local Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook signing secret it gives you to .env.local
```

### Add Stripe Env Vars to Vercel

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `NEXT_PUBLIC_BASE_URL` | `https://baybouncers.com` |

## 10. Wire Up the Booking Form with Stripe

Replace `handleSubmit` in the booking wizard to use the checkout hook:

```javascript
import { useCheckout } from "@/hooks/useCheckout";

function BookingWizard({ promoActive }) {
  const { checkout, bookWithCash, submitting, error } = useCheckout();

  // ... existing state ...

  // Pay with card (Stripe Checkout)
  const handleSubmit = async () => {
    const result = await checkout({
      ...form,
      bouncerId: selectedBouncer.id,
      bouncerName: selectedBouncer.name,
      bouncerPrice: selectedBouncer.price,
      date: selectedDate,
      startTime: timing.startTime,
      endTime: timing.endTime,
      durationType: timing.durationType,
      extraDays: timing.extraDays,
      promoApplied: promoActive,
    });
    // If successful, customer is redirected to Stripe Checkout
    // They return to /booking/success after payment
    // The webhook updates the booking to "confirmed"
  };

  // Pay with cash (no Stripe, booking saved as pending)
  const handleCashBooking = async () => {
    const result = await bookWithCash({
      ...form,
      bouncerId: selectedBouncer.id,
      bouncerName: selectedBouncer.name,
      bouncerPrice: selectedBouncer.price,
      date: selectedDate,
      startTime: timing.startTime,
      endTime: timing.endTime,
      durationType: timing.durationType,
      extraDays: timing.extraDays,
      promoApplied: promoActive,
    });
    if (result.success) {
      setSubmitted(true);
    }
  };
}
```

## 11. Wire Up Availability Checking

Replace the mock `getAvailableBouncers` function with the real one:

```javascript
import { getAvailableBouncersFromDB } from "@/firebase/firestore";

const handleTimingConfirm = async () => {
  setLoading(true);
  const avail = await getAvailableBouncersFromDB(
    BOUNCERS,
    selectedDate,
    timing.durationType,
    timing.extraDays
  );
  setAvailable(avail);
  setSelectedBouncer(null);
  setStep(3);
  setLoading(false);
};
```

## 12. File Structure (Updated with Stripe)

```
your-project/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.js              ← api-checkout-route.js
│   │   ├── bookings/
│   │   │   └── route.js              ← api-bookings-route.js (cash bookings)
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.js          ← api-webhooks-stripe-route.js
│   ├── booking/
│   │   ├── success/
│   │   │   └── page.jsx             ← booking-success-page.jsx
│   │   └── cancel/
│   │       └── page.jsx             ← booking-cancel-page.jsx
│   └── page.jsx                      ← baybouncers.jsx
├── firebase/
│   ├── firebase.js                   ← Client SDK config
│   ├── firebase-admin.js             ← Admin SDK (server-side)
│   ├── firestore.js                  ← Firestore helpers
│   └── email-notifications.js        ← Email templates
├── hooks/
│   └── useCheckout.js                ← Stripe checkout hook
├── firestore.rules
├── .env.local
└── package.json
```

## Payment Flow

```
Customer fills form → clicks "Pay $60 Deposit"
    ↓
POST /api/checkout
    ↓
Server validates → creates Firestore booking (status: pending)
    ↓
Server creates Stripe Checkout Session ($60 deposit + optional tip)
    ↓
Customer redirected to Stripe → enters card details
    ↓
Stripe processes payment
    ↓
Webhook fires: checkout.session.completed
    ↓
Server updates booking → status: confirmed, paymentStatus: deposit_paid
    ↓
Customer redirected to /booking/success
    ↓
(Optional) Confirmation emails sent to customer + admin
    ↓
Remaining balance collected on delivery day (cash or card)
```

## Firestore Collections

| Collection | Purpose |
|-----------|---------|
| `bookings` | All booking records with full details, pricing, and Stripe IDs |
| `blockedDates` | Admin-blocked dates (optional) |

## Booking Status Flow

```
pending → confirmed → completed
    ↘ expired (checkout session timed out)
    ↘ cancelled (deposit credited)
```

## Payment Status Flow

```
deposit_pending → deposit_paid → fully_paid
    ↘ deposit_expired (30 min timeout)
    ↘ deposit_credited (if cancelled)
    ↘ refunded
```
