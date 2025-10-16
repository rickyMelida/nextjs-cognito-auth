import { NextRequest, NextResponse } from 'next/server';
import { ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, cognitoConfig } from '@/lib/cognito';
import { createHmac } from 'crypto';

function generateSecretHash(username: string): string {
  return createHmac('sha256', cognitoConfig.clientSecret!)
    .update(username + cognitoConfig.clientId)
    .digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { username, confirmationCode } = await request.json();

    if (!username || !confirmationCode) {
      return NextResponse.json(
        { error: 'Username y código de confirmación son requeridos' },
        { status: 400 }
      );
    }

    const secretHash = generateSecretHash(username);
    
    const command = new ConfirmSignUpCommand({
      ClientId: cognitoConfig.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      SecretHash: secretHash,
    });

    await cognitoClient.send(command);
    
    return NextResponse.json({
      success: true,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error en la confirmación';
    console.error('Error en confirm-signup:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}