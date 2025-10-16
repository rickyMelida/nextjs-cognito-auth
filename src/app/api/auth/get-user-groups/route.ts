import { NextRequest, NextResponse } from 'next/server';
import { AdminListGroupsForUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, cognitoConfig } from '@/lib/cognito';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username es requerido' },
        { status: 400 }
      );
    }
    
    const command = new AdminListGroupsForUserCommand({
      UserPoolId: cognitoConfig.userPoolId,
      Username: username,
    });

    const response = await cognitoClient.send(command);
    
    // Extraer información de los grupos
    const groups = response.Groups?.map(group => ({
      groupName: group.GroupName,
      description: group.Description,
      roleArn: group.RoleArn,
      precedence: group.Precedence,
    })) || [];
    
    return NextResponse.json({
      success: true,
      groups,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al obtener grupos del usuario';
    console.error('Error en get-user-groups:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}