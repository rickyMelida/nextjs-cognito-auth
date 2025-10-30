'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminSignUp } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';

export default function AdminSignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '1990-01-01',
    selectedGroup: '',
    temporaryPassword: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [createdUserInfo, setCreatedUserInfo] = useState<any>(null);

  const { adminSignUp, isLoading: signUpLoading, error: signUpError } = useAdminSignUp();
  const { groups, isLoading: groupsLoading } = useGroups();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const result = await adminSignUp({
      username: formData.username,
      email: formData.email,
      password: formData.password || undefined,
      birthdate: formData.birthdate,
      groupName: formData.selectedGroup || undefined,
      temporaryPassword: formData.temporaryPassword,
    });

    if (result.success) {
      setCreatedUserInfo(result);
      setSuccessMessage(
        `Usuario "${formData.username}" creado exitosamente. ` +
        `${result.groupAssigned ? `Asignado al grupo: ${result.groupAssigned}` : ''}`
      );
      
      // Limpiar formulario
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthdate: '1990-01-01',
        selectedGroup: '',
        temporaryPassword: false,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Contraseña copiada al portapapeles');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registro de Usuario Interno
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crear usuario sin confirmación de email
          </p>
        </div>

        {successMessage && (
          <div className="rounded-md bg-green-50 p-4 space-y-3">
            <div className="text-sm text-green-700">{successMessage}</div>
            
            {/* Información de la contraseña */}
            {createdUserInfo?.passwordInfo && (
              <div className="border-t border-green-200 pt-3">
                <h4 className="text-sm font-medium text-green-800 mb-2">
                  🔐 Información de Acceso
                </h4>
                <div className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Usuario:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{createdUserInfo.userSub}</code>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Contraseña:</span>
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {createdUserInfo.passwordInfo.password}
                      </code>
                      <button
                        onClick={() => copyToClipboard(createdUserInfo.passwordInfo.password)}
                        className="text-xs text-blue-600 hover:text-blue-500"
                        title="Copiar contraseña"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    {createdUserInfo.passwordInfo.isGenerated && (
                      <p>• ✨ Contraseña generada automáticamente</p>
                    )}
                    {createdUserInfo.passwordInfo.isTemporary && (
                      <p>• 🔄 Contraseña temporal - debe cambiarla en el primer login</p>
                    )}
                    {!createdUserInfo.passwordInfo.isTemporary && (
                      <p>• ✅ Contraseña permanente - puede usarla indefinidamente</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/groups')}
                className="text-green-600 hover:text-green-500 text-sm font-medium"
              >
                Gestionar grupos →
              </button>
              <button
                onClick={() => {
                  setSuccessMessage(null);
                  setCreatedUserInfo(null);
                }}
                className="text-green-600 hover:text-green-500 text-sm font-medium"
              >
                Crear otro usuario
              </button>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Usuario"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="usuario@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                Fecha de Nacimiento
              </label>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.birthdate}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="selectedGroup" className="block text-sm font-medium text-gray-700">
                Grupo (Opcional)
              </label>
              {groupsLoading ? (
                <div className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <span className="text-gray-500">Cargando grupos...</span>
                </div>
              ) : (
                <select
                  id="selectedGroup"
                  name="selectedGroup"
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.selectedGroup}
                  onChange={(e) => setFormData({ ...formData, selectedGroup: e.target.value })}
                >
                  <option value="">Sin grupo asignado</option>
                  {groups.map((group) => (
                    <option key={group.groupName} value={group.groupName}>
                      {group.groupName}
                      {group.description && ` - ${group.description}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña (Opcional)
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Dejar vacío para generar automáticamente"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {formData.password && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </span>
                </button>
              )}
            </div>

            {formData.password && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </span>
                </button>
              </div>
            )}

            {formData.password && (
              <div className="flex items-center">
                <input
                  id="temporaryPassword"
                  name="temporaryPassword"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={formData.temporaryPassword}
                  onChange={(e) => setFormData({ ...formData, temporaryPassword: e.target.checked })}
                />
                <label htmlFor="temporaryPassword" className="ml-2 block text-sm text-gray-900">
                  Contraseña temporal (usuario debe cambiarla en el primer login)
                </label>
              </div>
            )}
          </div>

          {signUpError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{signUpError}</div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">ℹ️ Información del Registro Administrativo</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• El usuario será creado sin necesidad de confirmar email</li>
              <li>• El email será marcado automáticamente como verificado</li>
              <li>• Si no especificas contraseña, se generará una temporal automáticamente</li>
              <li>• La contraseña generada tendrá formato: TempPass[####]!</li>
              <li>• Siempre podrás ver la contraseña en el resultado</li>
              <li>• El usuario puede iniciar sesión inmediatamente</li>
              <li>• Útil para usuarios internos de la organización</li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              disabled={signUpLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signUpLoading ? 'Creando usuario...' : 'Crear Usuario Interno'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <div>
              <a href="/signup" className="text-sm text-indigo-600 hover:text-indigo-500">
                ← Volver al registro normal
              </a>
            </div>
            <div>
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-500">
                ¿Ya tienes cuenta? Inicia sesión aquí
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}