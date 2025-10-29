'use client';

import React, { useState } from 'react';
import { useGroups } from '@/hooks/useGroups';

interface GroupManagerProps {
  username?: string;
  onGroupAssigned?: (groupName: string) => void;
  showAssignmentControls?: boolean;
  title?: string;
}

export default function GroupManager({ 
  username, 
  onGroupAssigned, 
  showAssignmentControls = false,
  title = "Grupos Disponibles"
}: GroupManagerProps) {
  const { groups, isLoading, error, addUserToGroup } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAssignGroup = async () => {
    if (!username || !selectedGroup) return;

    setAssignmentLoading(true);
    setAssignmentMessage(null);

    const result = await addUserToGroup(username, selectedGroup);

    if (result.success) {
      setAssignmentMessage({ type: 'success', text: `Usuario asignado al grupo ${selectedGroup} exitosamente` });
      onGroupAssigned?.(selectedGroup);
      setSelectedGroup('');
    } else {
      setAssignmentMessage({ type: 'error', text: result.error || 'Error al asignar grupo' });
    }

    setAssignmentLoading(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {assignmentMessage && (
        <div className={`mb-4 p-4 border rounded-md ${
          assignmentMessage.type === 'success' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className={`text-sm ${
            assignmentMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {assignmentMessage.text}
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">No hay grupos disponibles</div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {groups.map((group, index) => (
              <div key={group.groupName} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{group.groupName}</h3>
                    {group.description && (
                      <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {group.precedence !== undefined && (
                        <span className="inline-block mr-4">Precedencia: {group.precedence}</span>
                      )}
                      {group.creationDate && (
                        <span>Creado: {new Date(group.creationDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  {showAssignmentControls && username && (
                    <div className="ml-4">
                      <input
                        type="radio"
                        id={`group-${index}`}
                        name="selectedGroup"
                        value={group.groupName}
                        checked={selectedGroup === group.groupName}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor={`group-${index}`} className="ml-2 text-sm text-gray-700">
                        Seleccionar
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showAssignmentControls && username && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Usuario: <span className="font-medium">{username}</span>
                </div>
                <button
                  onClick={handleAssignGroup}
                  disabled={!selectedGroup || assignmentLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assignmentLoading ? 'Asignando...' : 'Asignar al Grupo'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            Total de grupos: {groups.length}
          </div>
        </>
      )}
    </div>
  );
}