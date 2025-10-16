export interface AuthUser {
  username: string;
  email?: string;
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  groups?: string[];
  roles?: string[];
}

export interface SignUpParams {
  username: string;
  password: string;
  email: string;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface ConfirmSignUpParams {
  username: string;
  confirmationCode: string;
}

export interface ChangePasswordParams {
  accessToken: string;
  previousPassword: string;
  proposedPassword: string;
}

export interface ForgotPasswordParams {
  username: string;
}

export interface ConfirmForgotPasswordParams {
  username: string;
  confirmationCode: string;
  newPassword: string;
}

export class AuthService {
  // Registro de usuario
  static async signUp({ username, password, email }: SignUpParams) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error en el registro',
        };
      }

      return {
        success: true,
        userSub: data.userSub,
        isConfirmed: data.isConfirmed,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Confirmar registro con código
  static async confirmSignUp({ username, confirmationCode }: ConfirmSignUpParams) {
    try {
      const response = await fetch('/api/auth/confirm-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, confirmationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error en la confirmación',
        };
      }

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error en la confirmación';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Inicio de sesión
  static async signIn({ username, password }: SignInParams): Promise<{
    success: boolean;
    user?: AuthUser;
    challengeName?: string;
    session?: string;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      console.log({data});
      

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error en el inicio de sesión',
        };
      }

      // Si hay un desafío (como configurar nueva contraseña)
      if (data.challengeName) {
        return {
          success: true,
          challengeName: data.challengeName,
          session: data.session,
        };
      }

      // Login exitoso
      if (data.user) {
        return {
          success: true,
          user: data.user,
        };
      }

      return {
        success: false,
        error: 'Respuesta inesperada del servidor',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el inicio de sesión';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Responder a desafío de nueva contraseña
  static async setNewPassword(
    username: string,
    newPassword: string,
    session: string
  ): Promise<{
    success: boolean;
    user?: AuthUser;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/auth/set-new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword, session }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error al establecer nueva contraseña',
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al establecer nueva contraseña';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Cambiar contraseña (requiere token de acceso - no necesita SECRET_HASH)
  static async changePassword({
    accessToken,
    previousPassword,
    proposedPassword,
  }: ChangePasswordParams) {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken, previousPassword, proposedPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error al cambiar contraseña',
        };
      }

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar contraseña';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Solicitar reset de contraseña
  static async forgotPassword({ username }: ForgotPasswordParams) {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error al solicitar reset de contraseña',
        };
      }

      return {
        success: true,
        codeDeliveryDetails: data.codeDeliveryDetails,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al solicitar reset de contraseña';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Confirmar reset de contraseña
  static async confirmForgotPassword({
    username,
    confirmationCode,
    newPassword,
  }: ConfirmForgotPasswordParams) {
    try {
      const response = await fetch('/api/auth/confirm-forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, confirmationCode, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error al confirmar nueva contraseña',
        };
      }

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al confirmar nueva contraseña';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Obtener información del usuario
  static async getCurrentUser(accessToken: string) {
    try {
      const response = await fetch('/api/auth/get-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error al obtener información del usuario',
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener información del usuario';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Obtener grupos del usuario
  static async getUserGroups(username: string) {
    try {
      const response = await fetch('/api/auth/get-user-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error al obtener grupos del usuario',
        };
      }

      return {
        success: true,
        groups: data.groups,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener grupos del usuario';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}