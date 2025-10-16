import { NextRequest, NextResponse } from 'next/server';
import { RespondToAuthChallengeCommand, ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, cognitoConfig } from '@/lib/cognito';
import { createHmac } from 'crypto';
import { extractUserInfo } from '@/lib/jwt-utils';

function generateSecretHash(username: string): string {
  return createHmac('sha256', cognitoConfig.clientSecret!)
    .update(username + cognitoConfig.clientId)
    .digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { username, newPassword, session } = await request.json();

    if (!username || !newPassword || !session) {
      return NextResponse.json(
        { error: 'Username, nueva contraseña y sesión son requeridos' },
        { status: 400 }
      );
    }

    const secretHash = generateSecretHash(username);
    
    const command = new RespondToAuthChallengeCommand({
      ClientId: cognitoConfig.clientId,
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      Session: session,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: newPassword,
        SECRET_HASH: secretHash,
      },
    });

    const response = await cognitoClient.send(command);

    if (response.AuthenticationResult) {
      const idToken = response.AuthenticationResult.IdToken;
      let userInfo = null;
      
      // Extraer información del usuario desde el ID token
      if (idToken) {
        userInfo = extractUserInfo(idToken);
      }
      
      return NextResponse.json({
        success: true,
        user: {
          username,
          email: userInfo?.email,
          accessToken: response.AuthenticationResult.AccessToken!,
          refreshToken: response.AuthenticationResult.RefreshToken,
          idToken: response.AuthenticationResult.IdToken,
          groups: userInfo?.groups || [],
          roles: userInfo?.roles || [],
        },
      });
    }

    return NextResponse.json(
      { error: 'Respuesta inesperada del servidor' },
      { status: 500 }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al establecer nueva contraseña';
    console.error('Error en set-new-password:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}