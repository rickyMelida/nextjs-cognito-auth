'use client';

import React from 'react';
import { usePermissions } from '@/hooks/useUserRoles';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredGroups?: string[];
  requiredAnyGroup?: string[];
  fallback?: React.ReactNode;
  adminOnly?: boolean;
  moderatorOrAdmin?: boolean;
}

export default function RoleGuard({
  children,
  requiredGroups = [],
  requiredAnyGroup = [],
  fallback = <div className="text-red-600 p-4">No tienes permisos para ver este contenido</div>,
  adminOnly = false,
  moderatorOrAdmin = false,
}: RoleGuardProps) {
  const { isAdmin, isModerator, hasGroup } = usePermissions();

  // Verificar si es admin únicamente
  if (adminOnly && !isAdmin) {
    return <>{fallback}</>;
  }

  // Verificar si es moderador o admin
  if (moderatorOrAdmin && !isAdmin && !isModerator) {
    return <>{fallback}</>;
  }

  // Verificar grupos específicos requeridos (debe tener TODOS)
  if (requiredGroups.length > 0) {
    const hasAllGroups = requiredGroups.every(group => hasGroup(group));
    if (!hasAllGroups) {
      return <>{fallback}</>;
    }
  }

  // Verificar si tiene alguno de los grupos (debe tener AL MENOS UNO)
  if (requiredAnyGroup.length > 0) {
    const hasAnyGroup = requiredAnyGroup.some(group => hasGroup(group));
    if (!hasAnyGroup) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

// Componente específico para contenido de admin
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard adminOnly={true} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

// Componente específico para contenido de moderador o admin
export function ModeratorOrAdmin({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard moderatorOrAdmin={true} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

// Hook para usar en lógica condicional
export function useRoleCheck() {
  const { isAdmin, isModerator, isUser, hasGroup } = usePermissions();

  return {
    isAdmin,
    isModerator,
    isUser,
    hasGroup,
    canAccess: (groups: string[]) => groups.some(group => hasGroup(group)),
    hasAnyRole: (roles: string[]) => roles.some(role => hasGroup(role)),
  };
}