import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC4MBH0Gw9DcfwDRAR82wHkniCLwPlOGBE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "avance-curricular.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "avance-curricular",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "avance-curricular.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "864095552107",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:864095552107:web:e9204093b0b39f0ed8a72e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BYEY6RMER8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
};
