// This is a global file, so we can use the firebase object from the window scope
// which is loaded via the script tags in index.html

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj1wFLCvvDjZMetceQQq7iYy5z_BmNZhw",
  authDomain: "tawjihiai-1c0ee.firebaseapp.com",
  projectId: "tawjihiai-1c0ee",
  storageBucket: "tawjihiai-1c0ee.firebasestorage.app",
  messagingSenderId: "134724828324",
  appId: "1:134724828324:web:7055f4bd780e1850b93a31",
  measurementId: "G-HSG27178E5"
};


// Initialize Firebase
// Fix: Cast window to `any` to resolve TypeScript error for globally loaded firebase script.
const app = (window as any).firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const db = app.firestore();
// Export the firebase namespace to access FieldValue.serverTimestamp()
export const firebase = (window as any).firebase;