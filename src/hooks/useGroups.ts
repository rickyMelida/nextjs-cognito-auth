'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth';

export interface CognitoGroup {
  groupName: string;
  description?: string;
  roleArn?: string;
  precedence?: number;
  creationDate?: string;
  lastModifiedDate?: string;
}

export function useGroups() {
  const [groups, setGroups] = useState<CognitoGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.listAllGroups();
      
      if (result.success) {
        setGroups(result.groups || []);
      } else {
        // Si el error es por credenciales, usar un mensaje más amigable
        if (result.error?.includes('Credenciales de AWS no configuradas')) {
          setError('Para gestionar grupos, un administrador necesita configurar las credenciales de AWS.');
          setGroups([]); // Permitir que la aplicación continúe funcionando
        } else {
          setError(result.error || 'Error al cargar grupos');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addUserToGroup = async (username: string, groupName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.addUserToGroup(username, groupName);
      
      if (!result.success) {
        setError(result.error || 'Error al agregar usuario al grupo');
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

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    isLoading,
    error,
    fetchGroups,
    addUserToGroup,
  };
}