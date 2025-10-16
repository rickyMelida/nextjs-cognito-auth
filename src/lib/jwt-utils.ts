// Función para decodificar JWT sin verificar la firma (solo para extraer payload)
// NOTA: En producción deberías verificar la firma del JWT
export function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function extractUserInfo(idToken: string) {
  const payload = decodeJWT(idToken);
  if (!payload) return null;

  return {
    username: payload.sub,
    email: payload.email,
    groups: payload['cognito:groups'] || [],
    roles: payload['cognito:roles'] || [],
    givenName: payload.given_name,
    familyName: payload.family_name,
    emailVerified: payload.email_verified,
    exp: payload.exp,
    iat: payload.iat,
  };
}