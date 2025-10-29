'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp, useConfirmSignUp } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';

export default function SignUpForm() {
  const [step, setStep] = useState<'signup' | 'confirm'>('signup');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '1990-01-01', // Valor por defecto
    selectedGroup: '', // Nuevo campo para el grupo seleccionado
  });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp, isLoading: signUpLoading, error: signUpError } = useSignUp();
  const { confirmSignUp, isLoading: confirmLoading, error: confirmError } = useConfirmSignUp();
  const { groups, isLoading: groupsLoading, addUserToGroup } = useGroups();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const result = await signUp({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      birthdate: formData.birthdate,
    });

    if (result.success) {
      setStep('confirm');
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await confirmSignUp({
      username: formData.username,
      confirmationCode,
    });

    if (result.success) {
      // Si se seleccionó un grupo, asignar el usuario al grupo
      if (formData.selectedGroup) {
        try {
          const groupResult = await addUserToGroup(formData.username, formData.selectedGroup);
          if (groupResult.success) {
            router.push('/login?message=Account confirmed successfully and assigned to group');
          } else {
            router.push('/login?message=Account confirmed but group assignment failed');
          }
        } catch (error) {
          router.push('/login?message=Account confirmed but group assignment failed');
        }
      } else {
        router.push('/login?message=Account confirmed successfully');
      }
    }
  };

  const isLoading = signUpLoading || confirmLoading;
  const error = signUpError || confirmError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'signup' ? 'Crear cuenta nueva' : 'Confirmar cuenta'}
          </h2>
          {step === 'confirm' && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Ingresa el código de confirmación enviado a tu email
            </p>
          )}
        </div>

        {step === 'signup' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Usuario
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
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="tu@email.com"
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
                  required
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
                    <option value="">Seleccionar grupo (opcional)</option>
                    {groups.map((group) => (
                      <option key={group.groupName} value={group.groupName}>
                        {group.groupName}
                        {group.description && ` - ${group.description}`}
                      </option>
                    ))}
                  </select>
                )}
                {!groupsLoading && groups.length === 0 && (
                  <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-700">
                      ⚠️ No hay grupos disponibles en este momento.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Podrás ser asignado a un grupo más tarde por un administrador.
                    </p>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Puedes asignar tu usuario a un grupo para obtener permisos específicos
                </p>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </span>
                </button>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
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
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {formData.selectedGroup && (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Grupo seleccionado:</span> {formData.selectedGroup}
                  {groups.find(g => g.groupName === formData.selectedGroup)?.description && (
                    <span className="block text-xs mt-1">
                      {groups.find(g => g.groupName === formData.selectedGroup)?.description}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Inicia sesión aquí
                </a>
              </span>
            </div>

            <div className="text-center border-t pt-4">
              <span className="text-xs text-gray-500">
                ¿Eres administrador?{' '}
                <a href="/admin-signup" className="font-medium text-purple-600 hover:text-purple-500">
                  Crear usuario interno sin confirmación de email
                </a>
              </span>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleConfirm}>
            <div>
              <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700">
                Código de Confirmación
              </label>
              <input
                id="confirmationCode"
                name="confirmationCode"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ingresa el código de 6 dígitos"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {formData.selectedGroup && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">
                  <span className="font-medium">🎯 Grupo asignado:</span> {formData.selectedGroup}
                  {groups.find(g => g.groupName === formData.selectedGroup)?.description && (
                    <span className="block text-xs mt-1">
                      {groups.find(g => g.groupName === formData.selectedGroup)?.description}
                    </span>
                  )}
                  <span className="block text-xs mt-1 text-green-600">
                    Después de la confirmación serás asignado automáticamente a este grupo.
                  </span>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep('signup')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Confirmando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}