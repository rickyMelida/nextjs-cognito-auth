import { NextRequest, NextResponse } from 'next/server';
import { AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, cognitoConfig } from '@/lib/cognito';

export async function POST(request: NextRequest) {
  try {
    // Verificar que las credenciales de AWS estén configuradas
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: 'Credenciales de AWS no configuradas para operaciones administrativas' },
        { status: 500 }
      );
    }

    const { username, groupName } = await request.json();

    if (!username || !groupName) {
      return NextResponse.json(
        { error: 'Username y groupName son requeridos' },
        { status: 400 }
      );
    }
    
    const command = new AdminAddUserToGroupCommand({
      UserPoolId: cognitoConfig.userPoolId,
      Username: username,
      GroupName: groupName,
    });

    await cognitoClient.send(command);
    
    return NextResponse.json({
      success: true,
      message: `Usuario ${username} agregado al grupo ${groupName} exitosamente`,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al agregar usuario al grupo';
    console.error('Error en add-user-to-group:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}