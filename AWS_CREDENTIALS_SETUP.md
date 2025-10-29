# Configuración de Credenciales AWS para Gestión de Grupos

## 🔐 Credenciales Necesarias

Para usar las funcionalidades de gestión de grupos, necesitas configurar credenciales de AWS con permisos para AWS Cognito Identity Provider.

## 📋 Pasos para Configurar

### 1. Crear Usuario IAM en AWS

1. Ve a la **Consola de AWS** → **IAM** → **Usuarios**
2. Click en **"Crear usuario"**
3. Nombre del usuario: `cognito-admin` (o el nombre que prefieras)
4. Selecciona **"Credenciales de Access Key"**

### 2. Asignar Permisos

Asigna una de estas opciones de permisos:

#### Opción A: Política Predefinida (Más Amplia)
- `AmazonCognitoPowerUser`

#### Opción B: Política Personalizada (Recomendada)
Crea una política personalizada con estos permisos específicos:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:ListGroups",
                "cognito-idp:AdminAddUserToGroup",
                "cognito-idp:AdminRemoveUserFromGroup",
                "cognito-idp:AdminListGroupsForUser",
                "cognito-idp:AdminCreateUser",
                "cognito-idp:AdminSetUserPassword",
                "cognito-idp:AdminConfirmSignUp",
                "cognito-idp:AdminGetUser",
                "cognito-idp:AdminUpdateUserAttributes"
            ],
            "Resource": "arn:aws:cognito-idp:us-east-2:215847505882:userpool/us-east-2_ocU3TCWoA"
        }
    ]
}
```

#### Opción C: Política Específica para tu User Pool (Más Segura)
Para mayor seguridad, usa esta política que solo aplica a tu User Pool específico:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:*"
            ],
            "Resource": "arn:aws:cognito-idp:us-east-2:215847505882:userpool/us-east-2_ocU3TCWoA"
        }
    ]
}
```

### 3. Obtener Access Keys

1. Después de crear el usuario, ve a **"Credenciales de seguridad"**
2. Click en **"Crear access key"**
3. Selecciona **"Aplicación que se ejecuta fuera de AWS"**
4. **¡IMPORTANTE!** Guarda tanto el `Access Key ID` como el `Secret Access Key`

### 4. Configurar Variables de Entorno

Edita tu archivo `.env.local` y agrega:

```bash
# AWS Credentials para operaciones administrativas
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY_AQUI
AWS_SECRET_ACCESS_KEY=TU_SECRET_KEY_AQUI
```

### 5. Reiniciar el Servidor

```bash
npm run dev
```

## ✅ Verificar Configuración

1. Ve a `/groups` en tu aplicación
2. Deberías ver la lista de grupos de Cognito
3. Deberías poder asignar usuarios a grupos

## 🚨 Importante: Seguridad

- **NUNCA** subas el archivo `.env.local` a tu repositorio
- Usa el archivo `.env.local.example` como plantilla
- Las credenciales deben ser solo para desarrollo/testing
- Para producción, usa IAM Roles en lugar de Access Keys

## 🔧 Troubleshooting

### Error: "Could not load credentials from any providers"
- Verifica que `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` estén configuradas
- Verifica que no tengan espacios extra o caracteres especiales

### Error: "is not authorized to perform: cognito-idp:AdminCreateUser"
Este es el error que estás experimentando. Para solucionarlo:

1. Ve a **AWS Console** → **IAM** → **Usuarios** → **foler-admin**
2. Click en **"Agregar permisos"** → **"Adjuntar políticas directamente"**
3. **Opción Rápida**: Busca y selecciona `AmazonCognitoPowerUser`
4. **Opción Segura**: Crea una política personalizada con el JSON de arriba

#### Pasos Detallados para Crear Política Personalizada:

1. Ve a **IAM** → **Políticas** → **Crear política**
2. Selecciona **JSON** y pega uno de los códigos JSON de arriba
3. Nombrala: `CognitoAdminUserPolicy`
4. Guarda la política
5. Ve a **Usuarios** → **foler-admin** → **Agregar permisos**
6. Busca y selecciona tu nueva política `CognitoAdminUserPolicy`

### Error: "Access Denied"
- Verifica que el usuario IAM tenga los permisos necesarios
- Verifica que el User Pool ID sea correcto

### Error: "Region not found"
- Verifica que `NEXT_PUBLIC_AWS_REGION` coincida con la región de tu User Pool

## 📞 Funcionalidades que Requieren Credenciales

- ✅ Listar todos los grupos (`/api/auth/list-groups`)
- ✅ Asignar usuario a grupo (`/api/auth/add-user-to-group`)
- ✅ Selector de grupos en registro
- ✅ Página de gestión de grupos (`/groups`)

## 📞 Funcionalidades que NO Requieren Credenciales

- ✅ Login/Logout
- ✅ Registro de usuarios
- ✅ Confirmación de email
- ✅ Cambio de contraseña
- ✅ Ver grupos del usuario actual