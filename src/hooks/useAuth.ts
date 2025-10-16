'use client';

import { useState } from 'react';
import { AuthService, SignInParams, SignUpParams, ConfirmSignUpParams } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const signIn = async (params: SignInParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.signIn(params);

      console.log('SignIn result:', {
        success: result.success,
        hasUser: !!result.user,
        challengeName: result.challengeName,
        hasSession: !!result.session,
        error: result.error
      });
      
      if (result.success && result.user) {
        login(result.user);
        return { success: true, user: result.user };
      }
      
      if (result.success && result.challengeName) {
        return {
          success: true,
          challengeName: result.challengeName,
          session: result.session,
        };
      }

      setError(result.error || 'Error en el inicio de sesión');
      return { success: false, error: result.error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading, error };
}

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (params: SignUpParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.signUp(params);
      
      if (!result.success) {
        setError(result.error || 'Error en el registro');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading, error };
}

export function useConfirmSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmSignUp = async (params: ConfirmSignUpParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.confirmSignUp(params);
      
      if (!result.success) {
        setError(result.error || 'Error en la confirmación');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { confirmSignUp, isLoading, error };
}

export function useSetNewPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const setNewPassword = async (username: string, newPassword: string, session: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.setNewPassword(username, newPassword, session);
      
      if (result.success && result.user) {
        login(result.user);
      } else if (!result.success) {
        setError(result.error || 'Error al establecer nueva contraseña');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { setNewPassword, isLoading, error };
}

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (username: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.forgotPassword({ username });
      
      if (!result.success) {
        setError(result.error || 'Error al solicitar reset de contraseña');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmForgotPassword = async (username: string, confirmationCode: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.confirmForgotPassword({
        username,
        confirmationCode,
        newPassword,
      });
      
      if (!result.success) {
        setError(result.error || 'Error al confirmar nueva contraseña');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { forgotPassword, confirmForgotPassword, isLoading, error };
}