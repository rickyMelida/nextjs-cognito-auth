import { NextRequest, NextResponse } from 'next/server';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/lib/cognito';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acceso es requerido' },
        { status: 400 }
      );
    }
    
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    const response = await cognitoClient.send(command);
    
    // Extraer email de los atributos
    const emailAttribute = response.UserAttributes?.find(attr => attr.Name === 'email');
    
    return NextResponse.json({
      success: true,
      user: {
        username: response.Username,
        email: emailAttribute?.Value,
        accessToken,
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al obtener información del usuario';
    console.error('Error en get-user:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}