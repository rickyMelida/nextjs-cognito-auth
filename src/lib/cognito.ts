import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

export const cognitoConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
  clientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID!,
  clientSecret: process.env.AWS_USER_POOL_CLIENT_SECRET, // No usar NEXT_PUBLIC_ para secretos
};

// Configuración para manejar certificados en desarrollo
const shouldDisableSSL = process.env.AWS_DISABLE_SSL_VERIFICATION === 'true';

// Si necesitamos deshabilitar la verificación SSL en desarrollo
if (shouldDisableSSL) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const cognitoClient = new CognitoIdentityProviderClient({
  region: cognitoConfig.region,
});

export default cognitoClient;