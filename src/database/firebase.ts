
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDI5JthRCI-Frtcj7W_uirxmsiFicTYVYg',
  authDomain: 'mobilidade-universitaria-9fc0d.firebaseapp.com',
  projectId: 'mobilidade-universitaria-9fc0d',
  storageBucket: 'mobilidade-universitaria-9fc0d.firebasestorage.app',
  messagingSenderId: '939632757367',
  appId: '1:939632757367:web:059286c9ce6c339e1a1472',
};

const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
