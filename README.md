# AWS Cognito + Next.js + TypeScript Integration

Este proyecto demuestra cómo integrar AWS Cognito con Next.js y TypeScript para implementar autenticación completa.

## 🚀 Características

- ✅ **Login/Logout** de usuarios
- ✅ **Registro** de nuevos usuarios con confirmación por email
- ✅ **Configuración de contraseña** por parte del usuario
- ✅ **Reset/cambio de contraseña**
- ✅ **Gestión de sesiones** con Context API
- ✅ **Protección de rutas**
- ✅ **Interfaz responsive** con Tailwind CSS

## 🛠️ Stack Tecnológico

- **Next.js 14+** con App Router
- **TypeScript** para type safety
- **AWS SDK v3** para integración con Cognito
- **Tailwind CSS** para estilos
- **React Context API** para estado global

## 📋 Prerequisitos

1. **Cuenta de AWS** con acceso a Cognito
2. **Node.js 18+** y npm
3. **Pool de usuarios** configurado en AWS Cognito
4. **Client App** configurada en el User Pool

## ⚙️ Configuración AWS

### 1. Crear User Pool en AWS Cognito

1. Ve a AWS Console → Cognito
2. Crea un nuevo User Pool
3. Configura los atributos requeridos (email)
4. Configura las políticas de contraseña
5. Crea un App Client

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` con tu configuración:

```env
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOL_ID=tu-user-pool-id
NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID=tu-client-id
```

## 🚀 Instalación y Uso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Edita `.env.local` con tus credenciales de AWS Cognito:

```env
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── login/              # Página de login
│   ├── signup/             # Página de registro
│   ├── dashboard/          # Dashboard protegido
│   ├── set-new-password/   # Configurar contraseña
│   └── forgot-password/    # Reset de contraseña
├── components/
│   ├── LoginForm.tsx
│   ├── SignUpForm.tsx
│   └── SetNewPasswordForm.tsx
├── contexts/
│   └── AuthContext.tsx     # Context de autenticación
├── hooks/
│   └── useAuth.ts          # Hooks personalizados
├── lib/
│   └── cognito.ts          # Configuración AWS
└── services/
    └── auth.ts             # Servicios de autenticación
```

## 🔐 Flujo de Autenticación

### 1. Registro de Usuario
1. Usuario completa formulario de registro
2. AWS Cognito envía código de confirmación por email
3. Usuario confirma cuenta con código
4. Cuenta activada

### 2. Primer Login
1. Usuario inicia sesión con credenciales
2. AWS Cognito requiere configurar nueva contraseña
3. Usuario establece contraseña personalizada
4. Acceso al dashboard

### 3. Login Normal
1. Usuario inicia sesión
2. Acceso directo al dashboard

### 4. Reset de Contraseña
1. Usuario solicita reset desde login
2. AWS Cognito envía código por email
3. Usuario ingresa código y nueva contraseña
4. Contraseña actualizada

## 🎯 Páginas y Funcionalidades

### `/login`
- Formulario de inicio de sesión
- Redirección a `/set-new-password` si es primer login
- Enlace a "Olvidé mi contraseña"

### `/signup`
- Formulario de registro con validación
- Confirmación por email con código
- Redirección automática al login tras confirmar

### `/set-new-password`
- Configuración de contraseña inicial
- Validación de requisitos de seguridad
- Redirección automática al dashboard

### `/forgot-password`
- Solicitud de reset por email
- Confirmación con código y nueva contraseña

### `/dashboard`
- Área protegida para usuarios autenticados
- Información del usuario
- Opción de logout

## 🔧 Configuración Avanzada

### Personalizar Cognito

```typescript
// src/lib/cognito.ts
export const cognitoConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
  clientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID!,
};
```

### Hooks de Autenticación

```typescript
// Uso en componentes
const { signIn, isLoading, error } = useSignIn();
const { signUp } = useSignUp();
const { user, logout, isAuthenticated } = useAuth();
```

## 🛡️ Seguridad

- **Tokens JWT** gestionados automáticamente
- **Sesiones seguras** con AWS Cognito
- **Validación client-side y server-side**
- **HTTPS obligatorio** en producción
- **Protección CSRF** incluida

## 🚀 Deployment

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Build para Producción

```bash
npm run build
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Para soporte y preguntas:
- Revisa la [documentación de AWS Cognito](https://docs.aws.amazon.com/cognito/)
- Consulta la [documentación de Next.js](https://nextjs.org/docs)

---

**¡Felicidades! 🎉** Has implementado exitosamente un sistema de autenticación completo con AWS Cognito, Next.js y TypeScript.
