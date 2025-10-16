import { NextResponse } from 'next/server';
import { cognitoConfig } from '@/lib/cognito';
import { createHmac } from 'crypto';

export async function GET() {
  try {
    const testUsername = 'testuser@example.com';
    
    // Verificar que tenemos todas las variables
    const config = {
      region: cognitoConfig.region,
      userPoolId: cognitoConfig.userPoolId,
      clientId: cognitoConfig.clientId,
      clientSecret: cognitoConfig.clientSecret,
    };
    
    console.log('Environment variables check:', {
      region: !!config.region,
      userPoolId: !!config.userPoolId,
      clientId: !!config.clientId,
      clientSecret: !!config.clientSecret,
      clientSecretLength: config.clientSecret?.length,
    });
    
    if (!config.clientSecret) {
      return NextResponse.json({
        error: 'Client secret not found in environment variables',
        config: {
          region: config.region,
          userPoolId: config.userPoolId,
          clientId: config.clientId,
          clientSecretExists: false,
        }
      }, { status: 500 });
    }
    
    // Generar SECRET_HASH de prueba
    const message = testUsername + config.clientId;
    const secretHash = createHmac('sha256', config.clientSecret)
      .update(message)
      .digest('base64');
    
    return NextResponse.json({
      message: 'SECRET_HASH test',
      testUsername,
      clientId: config.clientId,
      messageToHash: message,
      secretHash,
      clientSecretLength: config.clientSecret.length,
      environmentVariables: {
        AWS_USER_POOL_CLIENT_SECRET: !!process.env.AWS_USER_POOL_CLIENT_SECRET,
        NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID: !!process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID,
      }
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Error in debug endpoint',
      details: errorMessage,
    }, { status: 500 });
  }
}