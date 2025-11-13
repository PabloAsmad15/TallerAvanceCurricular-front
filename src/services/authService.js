import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from '../config/firebase';
import api from './api';

/**
 * Servicio de autenticación con Firebase
 */
const authService = {
  /**
   * Login con email y contraseña
   */
  async login(email, password) {
    try {
      // 1. Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Obtener token de Firebase
      const token = await user.getIdToken();
      
      // 3. Sincronizar con backend (verificar token y obtener datos del usuario de PostgreSQL)
      const response = await api.post('/auth/firebase-login', { firebaseToken: token });
      
      // 4. Guardar token y datos del usuario
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw this.handleFirebaseError(error);
    }
  },

  /**
   * Registro de nuevo usuario
   */
  async register(email, password, nombre, apellido, tipo = 'estudiante') {
    try {
      // 1. Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Obtener token
      const token = await user.getIdToken();
      
      // 3. Crear registro en PostgreSQL con datos adicionales
      const response = await api.post('/auth/firebase-register', {
        firebaseToken: token,
        firebaseUid: user.uid,
        email: user.email,
        nombre,
        apellido,
        tipo
      });
      
      // 4. Guardar token y datos
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw this.handleFirebaseError(error);
    }
  },

  /**
   * Recuperar contraseña
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.' };
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      throw this.handleFirebaseError(error);
    }
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Observer de cambios en autenticación
   */
  onAuthChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuario autenticado - obtener token actualizado
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
      } else {
        // Usuario no autenticado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      callback(user);
    });
  },

  /**
   * Refrescar token de Firebase
   */
  async refreshToken() {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true); // true = forzar refresh
        localStorage.setItem('token', token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      throw error;
    }
  },

  /**
   * Manejador de errores de Firebase
   */
  handleFirebaseError(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña debe tener mínimo 8 caracteres con letras y números',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    };

    const message = errorMessages[error.code] || error.message || 'Error de autenticación';
    return new Error(message);
  }
};

export default authService;
