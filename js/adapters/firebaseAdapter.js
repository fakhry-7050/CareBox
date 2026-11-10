/** Firebase client adapter for CareBox.
 * Client-side Firebase is used for user sign-in and authorized reads.
 * Privileged provisioning and device ingestion must be performed by a trusted backend.
 */
import { auth, db } from '../core/firebase.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

export class FirebaseAdapter {
  constructor() {
    this.configured = true;
    this.auth = auth;
    this.db = db;
  }

  isAvailable() {
    return this.configured;
  }

  async signIn(email, password) {
    const credential = await signInWithEmailAndPassword(this.auth, email.trim(), password);
    const profile = await this.getUserProfile(credential.user.uid);
    return { user: credential.user, profile };
  }

  async signOut() {
    await signOut(this.auth);
  }

  observeAuth(callback) {
    return onAuthStateChanged(this.auth, async user => {
      if (!user) {
        callback({ user: null, profile: null });
        return;
      }

      try {
        const profile = await this.getUserProfile(user.uid);
        callback({ user, profile });
      } catch (error) {
        callback({ user, profile: null, error });
      }
    });
  }

  async getUserProfile(uid) {
    const snapshot = await getDoc(doc(this.db, 'users', uid));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }

  async sendPasswordReset(email) {
    await sendPasswordResetEmail(this.auth, email.trim());
  }

  async subscribeToDevice() {
    throw new Error('La synchronisation des appareils sera activée après validation du schéma Firestore.');
  }

  async requestMessagingPermission() {
    throw new Error('Les notifications push seront configurées dans une étape séparée.');
  }
}
