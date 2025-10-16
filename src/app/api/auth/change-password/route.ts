import { NextRequest, NextResponse } from 'next/server';
import { ChangePasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/lib/cognito';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, previousPassword, proposedPassword } = await request.json();

    if (!accessToken || !previousPassword || !proposedPassword) {
      return NextResponse.json(
        { error: 'Token de acceso, contraseña anterior y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }
    
    const command = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: previousPassword,
      ProposedPassword: proposedPassword,
    });

    await cognitoClient.send(command);
    
    return NextResponse.json({
      success: true,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cambiar contraseña';
    console.error('Error en change-password:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}