import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDoIEh4Ep_dF72F1xtpUbduJecYWMFR0fs",
  authDomain: "msositanzania.firebaseapp.com",
  databaseURL: "https://msositanzania-default-rtdb.firebaseio.com",
  projectId: "msositanzania",
  storageBucket: "msositanzania.firebasestorage.app",
  messagingSenderId: "676055658294",
  appId: "1:676055658294:web:bb469335f74adfb9e40d97"
};

// Safe initialization
let app: any = null;
let auth: any = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase initialization notice:", error);
}

export { app, auth };
