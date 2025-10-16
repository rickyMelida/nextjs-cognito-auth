'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';

export interface UserGroup {
  groupName: string;
  description?: string;
  roleArn?: string;
  precedence?: number;
}

export function useUserRoles() {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!user?.username) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await AuthService.getUserGroups(user.username);
        
        if (result.success) {
          setGroups(result.groups || []);
        } else {
          setError(result.error || 'Error al obtener grupos del usuario');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserGroups();
  }, [user?.username]);

  const refetchUserGroups = async () => {
    if (!user?.username) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.getUserGroups(user.username);
      
      if (result.success) {
        setGroups(result.groups || []);
      } else {
        setError(result.error || 'Error al obtener grupos del usuario');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones utilitarias para verificar roles
  const hasGroup = (groupName: string) => {
    return groups.some(group => group.groupName === groupName);
  };

  const hasAnyGroup = (groupNames: string[]) => {
    return groupNames.some(groupName => hasGroup(groupName));
  };

  const getGroupRoles = () => {
    return groups
      .filter(group => group.roleArn)
      .map(group => ({
        groupName: group.groupName,
        roleArn: group.roleArn!,
      }));
  };

  const hasRole = (roleArn: string) => {
    return groups.some(group => group.roleArn === roleArn);
  };

  // Obtener roles desde el token (más rápido)
  const getTokenGroups = () => {
    return user?.groups || [];
  };

  const getTokenRoles = () => {
    return user?.roles || [];
  };

  return {
    groups,
    isLoading,
    error,
    refetch: refetchUserGroups,
    // Funciones utilitarias
    hasGroup,
    hasAnyGroup,
    hasRole,
    getGroupRoles,
    // Desde token (más rápido)
    tokenGroups: getTokenGroups(),
    tokenRoles: getTokenRoles(),
  };
}

// Hook simplificado para verificar permisos
export function usePermissions() {
  const { tokenGroups, tokenRoles, hasGroup } = useUserRoles();

  const isAdmin = () => hasGroup('Administrators') || hasGroup('Admin');
  const isModerator = () => hasGroup('Moderators') || hasGroup('Moderator');
  const isUser = () => hasGroup('Users') || hasGroup('User');

  return {
    groups: tokenGroups,
    roles: tokenRoles,
    isAdmin: isAdmin(),
    isModerator: isModerator(),
    isUser: isUser(),
    hasGroup,
  };
}