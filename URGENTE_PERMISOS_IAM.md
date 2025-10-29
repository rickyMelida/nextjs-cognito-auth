# 🚨 SOLUCIÓN URGENTE: Error de Permisos IAM

## Tu Error Específico:
```
User: arn:aws:iam::215847505882:user/foler-admin is not authorized to perform: cognito-idp:AdminCreateUser on resource: arn:aws:cognito-idp:us-east-2:215847505882:userpool/us-east-2_ocU3TCWoA
```

## ✅ SOLUCIÓN PASO A PASO:

### Opción 1: Solución Rápida (2 minutos)

1. **Ve a AWS Console**: https://console.aws.amazon.com/iam/
2. **Navega a**: IAM → Usuarios → `foler-admin`
3. **Click en**: "Permisos" → "Agregar permisos" → "Adjuntar políticas directamente"
4. **Busca**: `AmazonCognitoPowerUser`
5. **Selecciona** la casilla y **click** "Siguiente"
6. **Click**: "Agregar permisos"

✅ **¡Listo!** Ahora debería funcionar.

---

### Opción 2: Solución Segura (5 minutos)

#### Paso 1: Crear Política Personalizada
1. **Ve a**: IAM → Políticas → "Crear política"
2. **Click**: "JSON"
3. **Reemplaza** todo el contenido con:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:AdminCreateUser",
                "cognito-idp:AdminSetUserPassword",
                "cognito-idp:AdminConfirmSignUp",
                "cognito-idp:AdminAddUserToGroup",
                "cognito-idp:AdminRemoveUserFromGroup",
                "cognito-idp:AdminListGroupsForUser",
                "cognito-idp:ListGroups",
                "cognito-idp:AdminGetUser",
                "cognito-idp:AdminUpdateUserAttributes"
            ],
            "Resource": "arn:aws:cognito-idp:us-east-2:215847505882:userpool/us-east-2_ocU3TCWoA"
        }
    ]
}
```

4. **Click**: "Siguiente"
5. **Nombre**: `FolerAdminCognitoPolicy`
6. **Descripción**: `Permisos para gestionar usuarios en Cognito`
7. **Click**: "Crear política"

#### Paso 2: Asignar Política al Usuario
1. **Ve a**: IAM → Usuarios → `foler-admin`
2. **Click**: "Permisos" → "Agregar permisos" → "Adjuntar políticas directamente"
3. **Busca**: `FolerAdminCognitoPolicy`
4. **Selecciona** la casilla
5. **Click**: "Agregar permisos"

---

## 🔍 Verificar que Funciona:

1. **Espera** 1-2 minutos para que los permisos se propaguen
2. **Recarga** tu aplicación NextJS: http://localhost:3000/admin-signup
3. **Intenta** crear un usuario interno
4. **Debería funcionar** sin errores

---

## 📋 Permisos Incluidos en la Solución:

- ✅ `AdminCreateUser` - Crear usuarios sin confirmación de email
- ✅ `AdminSetUserPassword` - Establecer contraseñas permanentes
- ✅ `AdminConfirmSignUp` - Confirmar usuarios sin código
- ✅ `AdminAddUserToGroup` - Asignar usuarios a grupos
- ✅ `ListGroups` - Listar grupos disponibles
- ✅ `AdminGetUser` - Obtener información de usuarios
- ✅ `AdminUpdateUserAttributes` - Actualizar atributos de usuario

---

## 🚨 Si Sigue Fallando:

### Verificar Access Keys:
```bash
# En tu terminal, verifica que las credenciales estén configuradas:
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
```

### En tu archivo .env.local debe tener:
```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

### Reiniciar el servidor:
```bash
# Detén el servidor (Ctrl+C) y reinicia:
npm run dev
```

---

## 💡 Nota Importante:

El usuario `foler-admin` ya existe en tu cuenta AWS, solo necesita los permisos correctos. Una vez que agregues cualquiera de las dos opciones de arriba, podrás:

- ✅ Crear usuarios internos sin confirmación de email
- ✅ Asignar grupos automáticamente
- ✅ Gestionar todos los aspectos de usuarios en Cognito

**¡La funcionalidad estará lista en menos de 5 minutos!** 🚀