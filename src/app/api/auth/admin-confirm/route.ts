import { NextRequest, NextResponse } from 'next/server';
import { AdminConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
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

    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username es requerido' },
        { status: 400 }
      );
    }

    // Confirmar usuario administrativamente
    const command = new AdminConfirmSignUpCommand({
      UserPoolId: cognitoConfig.userPoolId,
      Username: username,
    });

    await cognitoClient.send(command);

    return NextResponse.json({
      success: true,
      message: `Usuario ${username} confirmado exitosamente`,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al confirmar usuario';
    console.error('Error en admin-confirm:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}