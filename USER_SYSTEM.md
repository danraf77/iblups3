# Sistema de Usuarios Viewers - iBlups

## Descripción

Sistema completo de autenticación y seguimiento de canales para usuarios viewers implementado con Next.js 15, Supabase y Resend.

## Características Implementadas

### 🔐 Autenticación con OTP
- **Registro/Login automático**: Solo requiere email
- **Códigos OTP de 4 dígitos**: Enviados via Resend
- **Sesiones seguras**: Cookies HTTP-only con expiración de 30 días
- **Templates de email profesionales**: Usando React Email

### 👥 Gestión de Usuarios
- **Perfiles completos**: Información básica y preferencias
- **Verificación de email**: Automática al usar OTP
- **Sesiones persistentes**: Mantiene login entre visitas

### ❤️ Sistema de Seguimiento
- **Seguir/Dejar de seguir canales**: Con estado en tiempo real
- **Notificaciones**: Configurables por canal
- **Interfaz intuitiva**: Botones con estados visuales claros

## Estructura de Base de Datos

### Tablas Principales
- `iblups_users_viewers`: Usuarios/viewers
- `iblups_profile_viewers`: Perfiles extendidos
- `iblups_otp_codes`: Códigos de verificación
- `iblups_user_sessions`: Sesiones activas
- `iblups_channel_follows`: Relación usuario-canal

### Optimizaciones
- **Índices estratégicos**: Para consultas rápidas
- **Triggers automáticos**: Para campos `updated_at`
- **Funciones de limpieza**: Para datos expirados

## APIs Implementadas

### Autenticación
- `POST /api/auth/send-otp`: Envía código OTP
- `POST /api/auth/verify-otp`: Verifica código y autentica
- `GET /api/auth/me`: Obtiene usuario actual
- `POST /api/auth/logout`: Cierra sesión

### Canales
- `POST /api/channels/follow`: Seguir canal
- `DELETE /api/channels/follow`: Dejar de seguir
- `GET /api/channels/is-following`: Verificar estado

## Componentes

### AuthModal
- Modal de autenticación con 2 pasos
- Validación en tiempo real
- Estados de carga y error
- Reenvío de códigos

### FollowButton
- Botón dinámico de seguir/dejar de seguir
- Integración con autenticación
- Estados visuales claros
- Animaciones suaves

### Hooks
- `useAuth`: Gestión de autenticación
- `useChannelFollow`: Gestión de seguimiento

## Configuración

### Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio
RESEND_API_KEY=tu_clave_resend
JWT_SECRET=tu_secreto_jwt
```

### Dependencias
```json
{
  "@supabase/supabase-js": "^2.57.2",
  "resend": "^3.x.x",
  "@react-email/components": "^0.0.x",
  "@react-email/render": "^0.0.x",
  "lucide-react": "^0.x.x"
}
```

## Uso

### 1. Autenticación
```tsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Hola, {user?.display_name}</div>;
  }
  
  return <button onClick={() => setShowAuth(true)}>Ingresar</button>;
}
```

### 2. Seguimiento de Canales
```tsx
import { useChannelFollow } from '../hooks/useChannelFollow';

function ChannelPage({ channelId, channelUsername, channelName }) {
  const { isFollowing, toggleFollow, loading } = useChannelFollow({
    channelId,
    enabled: isAuthenticated
  });
  
  return (
    <button onClick={() => toggleFollow(channelUsername, channelName)}>
      {isFollowing ? 'Dejar de seguir' : 'Seguir'}
    </button>
  );
}
```

## Optimizaciones de Rendimiento

### Base de Datos
- Consultas optimizadas con JOINs
- Índices en campos frecuentemente consultados
- Configuraciones predefinidas para consultas comunes

### Frontend
- Hooks optimizados con dependencias mínimas
- Estados de carga para mejor UX
- Sanitización de datos sensibles

### Caching
- Sesiones persistentes en cookies
- Verificación de autenticación en cliente
- Estados optimizados para re-renders mínimos

## Seguridad

- **Cookies HTTP-only**: Previene acceso desde JavaScript
- **Tokens de sesión únicos**: Generados con crypto.randomUUID()
- **Expiración automática**: Códigos OTP y sesiones
- **Validación de entrada**: Sanitización de datos
- **Rate limiting**: Control de intentos fallidos

## Próximas Mejoras

- [ ] Notificaciones push
- [ ] Perfil de usuario completo
- [ ] Historial de canales vistos
- [ ] Recomendaciones personalizadas
- [ ] Modo oscuro/claro
- [ ] Múltiples idiomas

---

**Desarrollado con Cursor** - Sistema completo de usuarios viewers para iBlups
