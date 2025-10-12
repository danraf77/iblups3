# Sistema de Autenticación OTP - iblups

## Descripción

Sistema completo de autenticación basado en códigos OTP de 4 dígitos enviados por email. Los usuarios pueden iniciar sesión con su email, y si no existe una cuenta, se crea automáticamente.

## Características

- ✅ Autenticación OTP de 4 dígitos
- ✅ Creación automática de usuarios
- ✅ Envío de emails con Resend
- ✅ Sesiones seguras con JWT
- ✅ Integración con Supabase
- ✅ Modal de login responsive
- ✅ Navbar con estado de autenticación
- ✅ Logout seguro

## Estructura de Archivos

```
app/
├── api/auth/
│   ├── send-otp/route.ts          # Envía código OTP por email
│   ├── verify-otp/route.ts        # Verifica código OTP
│   ├── me/route.ts                # Obtiene usuario actual
│   └── logout/route.ts           # Cierra sesión
├── components/
│   ├── OTPEmailTemplate.tsx      # Template de email
│   ├── OTPLoginModal.tsx         # Modal de login
│   └── Navbar.tsx               # Navbar actualizado
├── hooks/
│   └── useAuth.ts               # Hook de autenticación
└── middleware.ts                # Middleware de protección
```

## Tablas de Base de Datos Utilizadas

- `iblups_users_viewers` - Usuarios del sistema
- `iblups_user_sessions` - Sesiones activas
- `iblups_profile_viewers` - Perfiles de usuarios
- `iblups_otp_codes` - Códigos OTP temporales

## Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_supabase_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
RESEND_API_KEY=tu_resend_api_key
JWT_SECRET=tu_jwt_secret
```

## Uso del Sistema

### 1. Enviar OTP
```typescript
const response = await fetch('/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'usuario@email.com' })
});
```

### 2. Verificar OTP
```typescript
const response = await fetch('/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'usuario@email.com', 
    otpCode: '1234' 
  })
});
```

### 3. Usar Hook de Autenticación
```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <div>Bienvenido, {user?.email}</div>
      ) : (
        <button onClick={() => setShowLogin(true)}>
          Iniciar Sesión
        </button>
      )}
    </div>
  );
}
```

### 4. Modal de Login
```typescript
import OTPLoginModal from '../components/OTPLoginModal';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { login } = useAuth();
  
  const handleLoginSuccess = (user) => {
    login(user);
    setShowLogin(false);
  };
  
  return (
    <OTPLoginModal
      isOpen={showLogin}
      onClose={() => setShowLogin(false)}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}
```

## Flujo de Autenticación

1. **Usuario ingresa email** → Se envía OTP por email
2. **Usuario ingresa código** → Se verifica y crea sesión
3. **Sesión activa** → Usuario puede acceder a funciones protegidas
4. **Logout** → Se invalida sesión y se limpian cookies

## Seguridad

- Códigos OTP expiran en 10 minutos
- Sesiones duran 30 días
- JWT tokens seguros con firma HMAC
- Validación de sesiones en base de datos
- Limpieza automática de códigos usados

## Personalización

### Cambiar duración de OTP
En `app/api/auth/send-otp/route.ts`:
```typescript
const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
```

### Cambiar duración de sesión
En `app/api/auth/verify-otp/route.ts`:
```typescript
const expiresAtSession = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días
```

### Personalizar template de email
Editar `app/components/OTPEmailTemplate.tsx` para cambiar el diseño del email.

## Notas de Implementación

- Sistema creado con Cursor AI
- Integración completa con Supabase
- Emails enviados con Resend
- Interfaz responsive y moderna
- Manejo de errores robusto
- Código TypeScript con tipado estricto

## Soporte

Para problemas o preguntas sobre el sistema de autenticación OTP, revisar los logs del servidor y verificar la configuración de las variables de entorno.
