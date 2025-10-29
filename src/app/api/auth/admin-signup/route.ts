import { NextRequest, NextResponse } from 'next/server';
import { AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, cognitoConfig } from '@/lib/cognito';

// Función para generar contraseña temporal predecible
function generateTemporaryPassword(): string {
  const timestamp = Date.now().toString().slice(-4);
  return `TempPass${timestamp}!`;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que las credenciales de AWS estén configuradas
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: 'Credenciales de AWS no configuradas para operaciones administrativas' },
        { status: 500 }
      );
    }

    const { username, email, password, birthdate, groupName, temporaryPassword = false } = await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username y email son requeridos' },
        { status: 400 }
      );
    }

    // Generar contraseña si no se proporciona
    let finalPassword = password;
    let isGeneratedPassword = false;
    
    if (!finalPassword) {
      finalPassword = generateTemporaryPassword();
      isGeneratedPassword = true;
    }

    // Crear usuario administrativamente (sin confirmación de email)
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: cognitoConfig.userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true', // Marcar email como verificado
        },
        {
          Name: 'birthdate',
          Value: birthdate || '1990-01-01',
        },
      ],
      MessageAction: 'SUPPRESS', // No enviar email de bienvenida
      TemporaryPassword: (temporaryPassword || isGeneratedPassword) ? finalPassword : undefined,
    });

    const createUserResponse = await cognitoClient.send(createUserCommand);

    // Si se proporciona una contraseña y no es temporal, establecerla como permanente
    if (finalPassword && !temporaryPassword && !isGeneratedPassword) {
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: cognitoConfig.userPoolId,
        Username: username,
        Password: finalPassword,
        Permanent: true, // Contraseña permanente, no temporal
      });

      await cognitoClient.send(setPasswordCommand);
    }

    // Si se especifica un grupo, asignar el usuario al grupo
    if (groupName) {
      const { AdminAddUserToGroupCommand } = await import('@aws-sdk/client-cognito-identity-provider');
      
      const addToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: cognitoConfig.userPoolId,
        Username: username,
        GroupName: groupName,
      });

      await cognitoClient.send(addToGroupCommand);
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario interno creado exitosamente',
      userSub: createUserResponse.User?.Username,
      isConfirmed: true, // Usuario ya confirmado
      groupAssigned: groupName || null,
      // Información importante sobre la contraseña
      passwordInfo: {
        password: finalPassword, // Siempre devolvemos la contraseña
        isGenerated: isGeneratedPassword,
        isTemporary: temporaryPassword || isGeneratedPassword,
        mustChangeOnFirstLogin: temporaryPassword || isGeneratedPassword,
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al crear usuario interno';
    console.error('Error en admin-signup:', error);
    
    // Detectar errores específicos de permisos
    if (errorMessage.includes('is not authorized to perform')) {
      return NextResponse.json(
        { 
          error: 'Error de permisos AWS: El usuario IAM no tiene permisos suficientes. Ve a AWS Console → IAM → tu usuario → Agregar políticas → AmazonCognitoPowerUser',
          details: errorMessage 
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}