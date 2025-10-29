import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

export const cognitoConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
  clientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID!,
  clientSecret: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_SECRET, // No usar NEXT_PUBLIC_ para secretos
};

// Configuración para manejar certificados en desarrollo
const shouldDisableSSL = process.env.AWS_DISABLE_SSL_VERIFICATION === 'true';

// Si necesitamos deshabilitar la verificación SSL en desarrollo
if (shouldDisableSSL) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Configuración del cliente de Cognito con manejo de credenciales
const createCognitoClient = () => {
  const config: any = {
    region: cognitoConfig.region,
  };

  // Agregar credenciales si están disponibles (para operaciones administrativas)
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  return new CognitoIdentityProviderClient(config);
};

export const cognitoClient = createCognitoClient();

export default cognitoClient;