import { NextRequest, NextResponse } from 'next/server';
import { ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, cognitoConfig } from '@/lib/cognito';
import { createHmac } from 'crypto';

function generateSecretHash(username: string): string {
  return createHmac('sha256', cognitoConfig.clientSecret!)
    .update(username + cognitoConfig.clientId)
    .digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username es requerido' },
        { status: 400 }
      );
    }

    const secretHash = generateSecretHash(username);
    
    const command = new ForgotPasswordCommand({
      ClientId: cognitoConfig.clientId,
      Username: username,
      SecretHash: secretHash,
    });

    const response = await cognitoClient.send(command);
    
    return NextResponse.json({
      success: true,
      codeDeliveryDetails: response.CodeDeliveryDetails,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al solicitar reset de contraseña';
    console.error('Error en forgot-password:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}