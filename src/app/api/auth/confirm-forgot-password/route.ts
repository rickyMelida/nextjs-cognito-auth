import { NextRequest, NextResponse } from 'next/server';
import { ConfirmForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, cognitoConfig } from '@/lib/cognito';
import { createHmac } from 'crypto';

function generateSecretHash(username: string): string {
  return createHmac('sha256', cognitoConfig.clientSecret!)
    .update(username + cognitoConfig.clientId)
    .digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { username, confirmationCode, newPassword } = await request.json();

    if (!username || !confirmationCode || !newPassword) {
      return NextResponse.json(
        { error: 'Username, código de confirmación y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    const secretHash = generateSecretHash(username);
    
    const command = new ConfirmForgotPasswordCommand({
      ClientId: cognitoConfig.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
      SecretHash: secretHash,
    });

    await cognitoClient.send(command);
    
    return NextResponse.json({
      success: true,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al confirmar nueva contraseña';
    console.error('Error en confirm-forgot-password:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}