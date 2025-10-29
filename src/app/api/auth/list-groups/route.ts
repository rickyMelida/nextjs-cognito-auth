import { NextResponse } from 'next/server';
import { ListGroupsCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, cognitoConfig } from '@/lib/cognito';

export async function GET() {
  try {
    // Verificar que las credenciales de AWS estén configuradas
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { 
          error: 'Credenciales de AWS no configuradas. Configura AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY en tu archivo .env.local',
          groups: [] 
        },
        { status: 500 }
      );
    }

    const command = new ListGroupsCommand({
      UserPoolId: cognitoConfig.userPoolId,
      Limit: 60, // Máximo de grupos a listar
    });

    const response = await cognitoClient.send(command);
    
    // Extraer información de los grupos
    const groups = response.Groups?.map(group => ({
      groupName: group.GroupName,
      description: group.Description,
      roleArn: group.RoleArn,
      precedence: group.Precedence,
      creationDate: group.CreationDate,
      lastModifiedDate: group.LastModifiedDate,
    })) || [];
    
    return NextResponse.json({
      success: true,
      groups,
      totalGroups: groups.length,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al listar grupos';
    console.error('Error en list-groups:', error);
    
    // Detectar errores específicos de permisos
    if (errorMessage.includes('is not authorized to perform')) {
      return NextResponse.json(
        { 
          error: 'Error de permisos AWS: El usuario IAM no tiene permisos para listar grupos. Ve a AWS Console → IAM → tu usuario → Agregar políticas → AmazonCognitoPowerUser',
          groups: []
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