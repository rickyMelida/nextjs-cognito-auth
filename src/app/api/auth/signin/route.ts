import { NextRequest, NextResponse } from 'next/server';
import { InitiateAuthCommand, AuthFlowType } from '@aws-sdk/client-cognito-identity-provider';
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
    const { username, password } = await request.json();

    console.log({cognitoConfig});
    

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username y password son requeridos' },
        { status: 400 }
      );
    }

    const secretHash = generateSecretHash(username);
    
    const command = new InitiateAuthCommand({
      ClientId: cognitoConfig.clientId,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    });

    const response = await cognitoClient.send(command);

    // Si hay un desafío (como configurar nueva contraseña)
    if (response.ChallengeName) {
      return NextResponse.json({
        success: true,
        challengeName: response.ChallengeName,
        session: response.Session,
      });
    }

    // Login exitoso
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
    const errorMessage = error instanceof Error ? error.message : 'Error en el inicio de sesión';
    console.error('Error en signin:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}