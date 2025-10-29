'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions, useUserRoles } from '@/hooks/useUserRoles';
import { AdminOnly, ModeratorOrAdmin } from '@/components/RoleGuard';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { groups, roles, isAdmin, isModerator, isUser } = usePermissions();
  const { groups: detailedGroups, isLoading: rolesLoading } = useUserRoles();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/groups"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Gestionar Grupos
              </a>
              <span className="text-gray-700">Hola, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                ¡Bienvenido a tu Dashboard!
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Información del Usuario
                  </h3>
                  <div className="space-y-2">
                    <p className="text-blue-700">
                      <span className="font-medium">Usuario:</span> {user?.username}
                    </p>
                    <p className="text-blue-700">
                      <span className="font-medium">Email:</span> {user?.email || 'No disponible'}
                    </p>
                    <p className="text-blue-700">
                      <span className="font-medium">Grupos:</span> {groups?.length > 0 ? groups.join(', ') : 'Ninguno'}
                    </p>
                    <p className="text-blue-700">
                      <span className="font-medium">Roles:</span> {roles?.length > 0 ? roles.join(', ') : 'Ninguno'}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Permisos del Usuario
                  </h3>
                  <div className="space-y-2">
                    <p className="text-green-700">
                      <span className="font-medium">Es Admin:</span> {isAdmin ? '✅ Sí' : '❌ No'}
                    </p>
                    <p className="text-green-700">
                      <span className="font-medium">Es Moderador:</span> {isModerator ? '✅ Sí' : '❌ No'}
                    </p>
                    <p className="text-green-700">
                      <span className="font-medium">Es Usuario:</span> {isUser ? '✅ Sí' : '❌ No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="mt-6 bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                  Acciones Rápidas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a
                    href="/groups"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-center block transition-colors"
                  >
                    <div className="text-sm font-medium">🏷️ Gestionar Grupos</div>
                    <div className="text-xs opacity-90 mt-1">Ver y asignar grupos de Cognito</div>
                  </a>
                  
                  <a
                    href="/admin-signup"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-center block transition-colors"
                  >
                    <div className="text-sm font-medium">👥 Usuario Interno</div>
                    <div className="text-xs opacity-90 mt-1">Crear sin confirmación de email</div>
                  </a>
                  
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg text-center transition-colors"
                  >
                    <div className="text-sm font-medium">🔄 Actualizar Datos</div>
                    <div className="text-xs opacity-90 mt-1">Refrescar información del usuario</div>
                  </button>
                  
                  <a
                    href="/set-new-password"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg text-center block transition-colors"
                  >
                    <div className="text-sm font-medium">🔑 Cambiar Contraseña</div>
                    <div className="text-xs opacity-90 mt-1">Actualizar tu contraseña</div>
                  </a>
                </div>
              </div>

              {/* Información detallada de grupos */}
              {rolesLoading ? (
                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700">Cargando información de grupos...</p>
                </div>
              ) : detailedGroups && detailedGroups.length > 0 && (
                <div className="mt-6 bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">
                    Grupos Detallados
                  </h3>
                  <div className="space-y-3">
                    {detailedGroups.map((group, index) => (
                      <div key={index} className="bg-white p-4 rounded border">
                        <h4 className="font-medium text-purple-900">{group.groupName}</h4>
                        {group.description && (
                          <p className="text-purple-700 text-sm mt-1">{group.description}</p>
                        )}
                        {group.roleArn && (
                          <p className="text-purple-600 text-xs mt-2">
                            <span className="font-medium">IAM Role:</span> {group.roleArn}
                          </p>
                        )}
                        {group.precedence !== undefined && (
                          <p className="text-purple-600 text-xs">
                            <span className="font-medium">Precedencia:</span> {group.precedence}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ejemplos de contenido basado en roles */}
              <AdminOnly
                fallback={
                  <div className="mt-6 bg-gray-100 p-6 rounded-lg">
                    <p className="text-gray-600">🔒 Contenido exclusivo para administradores</p>
                  </div>
                }
              >
                <div className="mt-6 bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    🔐 Panel de Administración
                  </h3>
                  <p className="text-red-700">
                    Este contenido solo es visible para usuarios con rol de Administrador.
                  </p>
                  <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Gestionar Usuarios
                  </button>
                </div>
              </AdminOnly>

              <ModeratorOrAdmin
                fallback={
                  <div className="mt-6 bg-gray-100 p-6 rounded-lg">
                    <p className="text-gray-600">🔒 Contenido para moderadores y administradores</p>
                  </div>
                }
              >
                <div className="mt-6 bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    ⚡ Panel de Moderación
                  </h3>
                  <p className="text-orange-700">
                    Este contenido es visible para moderadores y administradores.
                  </p>
                  <button className="mt-3 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                    Moderar Contenido
                  </button>
                </div>
              </ModeratorOrAdmin>

              <div className="mt-6 bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  🎉 ¡Integración Exitosa con Roles!
                </h3>
                <p className="text-yellow-700">
                  Has logrado integrar exitosamente AWS Cognito con Next.js y TypeScript incluyendo:
                </p>
                <ul className="mt-3 text-yellow-700 list-disc list-inside space-y-1">
                  <li>Login y logout de usuarios</li>
                  <li>Registro de nuevos usuarios</li>
                  <li>Configuración de contraseñas</li>
                  <li>Gestión de sesiones</li>
                  <li>Protección de rutas</li>
                  <li><strong>✨ Gestión de roles y grupos</strong></li>
                  <li><strong>✨ Control de acceso basado en roles</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}