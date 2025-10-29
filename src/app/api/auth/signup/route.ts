import { NextRequest, NextResponse } from 'next/server';
import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, cognitoConfig } from '@/lib/cognito';
import { createHmac } from 'crypto';

function generateSecretHash(username: string): string {
  if (!cognitoConfig.clientSecret) {
    throw new Error('Client secret not configured');
  }
  
  return createHmac('sha256', cognitoConfig.clientSecret)
    .update(username + cognitoConfig.clientId)
    .digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, email, birthdate } = await request.json();

    if (!username || !password || !email) {
      return NextResponse.json(
        { error: 'Username, password y email son requeridos' },
        { status: 400 }
      );
    }

    const secretHash = generateSecretHash(username);
    
    const command = new SignUpCommand({
      ClientId: cognitoConfig.clientId,
      Username: username,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'birthdate',
          Value: birthdate || '1990-01-01', // Valor por defecto si no se proporciona
        },
      ],
    });

    const response = await cognitoClient.send(command);
    
    return NextResponse.json({
      success: true,
      userSub: response.UserSub,
      isConfirmed: !response.CodeDeliveryDetails,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
    console.error('Error en signup:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}