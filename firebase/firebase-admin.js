// Firebase Admin SDK - Server-side only (API routes)
// Used for server-side operations like sending confirmation emails,
// validating promos, and future Stripe webhook handling

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Decode base64-encoded private key from env var
  const privateKey = process.env.FIREBASE_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf-8")
    : undefined;

  return initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminApp = getFirebaseAdmin();
export const adminDb = getFirestore(adminApp);
export default adminApp;
