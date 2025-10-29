'use client';

import React, { useState } from 'react';
import GroupManager from '@/components/GroupManager';
import { useAuth } from '@/contexts/AuthContext';

export default function GroupsPage() {
  const { user } = useAuth();
  const [targetUsername, setTargetUsername] = useState('');
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver esta página</p>
          <a href="/login" className="text-indigo-600 hover:text-indigo-500">
            Ir a Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Gestión de Grupos</h1>
          <p className="mt-2 text-sm text-gray-600">
            Administra los grupos de Cognito y asigna usuarios
          </p>
        </div>

        {/* Formulario para asignar usuario a grupo */}
        <div className="mb-8 bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Asignar Usuario a Grupo</h2>
            <div className="flex space-x-2">
              <a
                href="/admin-signup"
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Crear Usuario Interno
              </a>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                {showAssignmentForm ? 'Ocultar' : 'Mostrar Formulario'}
              </button>
            </div>
          </div>

          {showAssignmentForm && (
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={targetUsername}
                  onChange={(e) => setTargetUsername(e.target.value)}
                  placeholder="Ingresa el nombre de usuario"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="text-sm text-gray-500">
                También puedes usar tu propio usuario: <span className="font-medium">{user.username}</span>
                <button
                  onClick={() => setTargetUsername(user.username)}
                  className="ml-2 text-indigo-600 hover:text-indigo-500"
                >
                  Usar mi usuario
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Componente de gestión de grupos */}
        <GroupManager
          username={showAssignmentForm ? targetUsername : undefined}
          showAssignmentControls={showAssignmentForm && !!targetUsername}
          title="Grupos Disponibles en Cognito"
          onGroupAssigned={(groupName) => {
            console.log(`Usuario ${targetUsername} asignado al grupo ${groupName}`);
          }}
        />

        {/* Información adicional */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Información sobre Grupos
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Los grupos definen roles y permisos en tu aplicación</li>
                  <li>La precedencia determina el orden de prioridad (menor número = mayor prioridad)</li>
                  <li>Los usuarios pueden pertenecer a múltiples grupos</li>
                  <li>Los cambios en grupos se reflejan inmediatamente en los tokens de acceso</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}