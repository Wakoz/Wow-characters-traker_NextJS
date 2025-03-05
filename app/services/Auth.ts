// Interface pour les informations d'authentification
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
}

// Fonctions de gestion des cookies qui vérifient l'existence de document
export function setCookie(name: string, value: string, days: number) {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;Secure;SameSite=Strict`;
  }
}

export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function eraseCookie(name: string) {
  if (typeof window !== 'undefined') {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}

// Méthodes de gestion du token ajoutées
export function setAuthToken(token: string) {
  setCookie('authToken', token, 7); // 7 jours par défaut
}

export function getAuthToken(): string | null {
  return getCookie('authToken');
}

export function removeAuthToken() {
  eraseCookie('authToken');
}

// Fonction pour se connecter
export async function loginUser(credentials: AuthCredentials) {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...credentials,
      isLogin: true
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Email ou mot de passe incorrect');
  }

  // Utiliser la nouvelle méthode setAuthToken
  setAuthToken(data.token);
  
  return data.user;
}

// Fonction pour s'inscrire
export async function registerUser(credentials: AuthCredentials) {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...credentials,
      isLogin: false
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erreur lors de l\'inscription');
  }

  // Utiliser la nouvelle méthode setAuthToken
  setAuthToken(data.token);
  
  return data.user;
}

// Fonction pour se déconnecter
export function logoutUser() {
  removeAuthToken();
  // Rediriger vers la page de connexion ou actualiser l'état de l'application
  if (typeof window !== 'undefined') {
    window.location.href = '/auth';
  }
}

// Fonction pour vérifier si l'utilisateur est connecté
export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    const token = getCookie('authToken');
    return !!token;
  }
  return false;
}