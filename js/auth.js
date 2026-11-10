import { FirebaseAdapter } from './adapters/firebaseAdapter.js';

const firebase = new FirebaseAdapter();
const gate = document.querySelector('#authGate');
const app = document.querySelector('#careboxApp');
const content = document.querySelector('#authContent');
const signOutButton = document.querySelector('#signOutButton');
let activeUser = null;

function showMessage(message, type = 'error') {
  const old = content.querySelector('.auth-error,.auth-info');
  if (old) old.remove();
  const node = document.createElement('div');
  node.className = type === 'error' ? 'auth-error' : 'auth-info';
  node.textContent = message;
  content.prepend(node);
}

function loginView() {
  content.innerHTML = `
    <h1>Bienvenue</h1>
    <p class="auth-muted">Connectez-vous à votre espace CareBox pour consulter les informations autorisées de votre domicile.</p>
    <form class="auth-form" id="loginForm">
      <label>Adresse e-mail<input name="email" type="email" autocomplete="username" placeholder="nom@exemple.com" required></label>
      <label>Mot de passe<input name="password" type="password" autocomplete="current-password" placeholder="Votre mot de passe" required></label>
      <button class="auth-submit" type="submit">Se connecter</button>
      <button class="auth-link" type="button" id="forgotPassword">Mot de passe oublié ?</button>
    </form>`;
  content.querySelector('#loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const button = event.currentTarget.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Connexion…';
    try {
      const result = await firebase.signIn(form.get('email'), form.get('password'));
      await handleSignedIn(result.user, result.profile);
    } catch (error) {
      showMessage(authError(error));
      button.disabled = false;
      button.textContent = 'Se connecter';
    }
  });
  content.querySelector('#forgotPassword').addEventListener('click', async () => {
    const email = content.querySelector('[name="email"]').value.trim();
    if (!email) return showMessage('Saisissez votre adresse e-mail, puis réessayez.', 'info');
    try {
      await firebase.sendPasswordReset(email);
      showMessage('Si cette adresse correspond à un compte, un e-mail de réinitialisation sera envoyé.', 'info');
    } catch (error) {
      showMessage(authError(error));
    }
  });
}

function authError(error) {
  const code = error?.code || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Adresse e-mail ou mot de passe incorrect.';
  if (code.includes('too-many-requests')) return 'Trop de tentatives. Réessayez plus tard.';
  if (code.includes('network-request-failed')) return 'Connexion internet indisponible. Vérifiez votre réseau.';
  if (code.includes('unauthorized-domain')) return 'Ce domaine n’est pas autorisé dans Firebase Authentication.';
  return error?.message || 'Impossible de se connecter. Réessayez.';
}

async function handleSignedIn(user, profile) {
  activeUser = user;
  if (!profile || !['admin', 'family'].includes(profile.role) || !profile.familyId) {
    app.hidden = true;
    gate.hidden = false;
    content.innerHTML = `
      <h1>Accès en attente</h1>
      <p class="auth-muted">Votre compte est authentifié, mais aucun profil CareBox valide ne lui est encore associé.</p>
      <div class="auth-info">Un administrateur doit créer votre fiche utilisateur dans Firestore et vous rattacher à une famille. L’inscription seule ne donne jamais le rôle Admin.</div>
      <button class="auth-submit" id="pendingSignOut" type="button">Se déconnecter</button>`;
    content.querySelector('#pendingSignOut').addEventListener('click', () => firebase.signOut());
    return;
  }
  gate.hidden = true;
  app.hidden = false;
  document.querySelector('#signedInEmail').textContent = user.email || 'Compte CareBox';
  document.body.dataset.careboxRole = profile.role;
  document.body.dataset.careboxFamily = profile.familyId;
  window.dispatchEvent(new CustomEvent('carebox:authorized', { detail: { user, profile } }));
}

firebase.observeAuth(async ({ user, profile, error }) => {
  if (!user) {
    activeUser = null;
    app.hidden = true;
    gate.hidden = false;
    document.body.removeAttribute('data-carebox-role');
    document.body.removeAttribute('data-carebox-family');
    loginView();
    return;
  }
  if (error) {
    app.hidden = true;
    gate.hidden = false;
    content.innerHTML = '<h1>Vérification impossible</h1><p class="auth-muted">Impossible de lire votre profil CareBox. Vérifiez les règles Firestore ou contactez l’administrateur.</p>';
    return;
  }
  await handleSignedIn(user, profile);
});

signOutButton?.addEventListener('click', () => firebase.signOut());
