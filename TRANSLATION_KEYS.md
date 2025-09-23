# 🌍 Claves de Traducción - iBlups

## 📝 Textos a Traducir

### **1. Dashboard**
```json
{
  "dashboard": {
    "title": "Dashboard",
    "loading": "Cargando dashboard...",
    "profile": {
      "title": "Mi Perfil",
      "edit": "Editar",
      "cancel": "Cancelar",
      "save": "Guardar",
      "saving": "Guardando...",
      "fields": {
        "firstName": "Nombre",
        "lastName": "Apellido",
        "country": "País",
        "city": "Ciudad",
        "dateOfBirth": "Fecha de nacimiento",
        "selectCountry": "Seleccionar país"
      }
    },
    "email": {
      "title": "Cambiar Email",
      "currentEmail": "Email actual",
      "changeEmail": "Cambiar Email",
      "warning": "Para cambiar tu email, necesitarás verificar el nuevo email con un código OTP.",
      "success": "Email actualizado correctamente"
    },
    "channels": {
      "title": "Canales que Sigues",
      "loading": "Cargando canales seguidos...",
      "empty": {
        "title": "No sigues ningún canal aún",
        "description": "Visita los canales y haz clic en \"Seguir canal\" para agregarlos aquí",
        "action": "Explorar Canales"
      },
      "actions": {
        "viewChannel": "Ver Canal",
        "unfollow": "Dejar de seguir",
        "refresh": "Recargar canales"
      },
      "followedOn": "Seguido el"
    },
    "sessions": {
      "title": "Mis Sesiones",
      "loading": "Cargando sesiones...",
      "current": "Sesión actual",
      "close": "Cerrar sesión",
      "refresh": "Recargar sesiones",
      "device": "Dispositivo",
      "browser": "Navegador",
      "country": "País",
      "lastActivity": "Última actividad",
      "created": "Creada"
    }
  }
}
```

### **2. Modal de OTP**
```json
{
  "auth": {
    "modal": {
      "title": {
        "login": "Ingresar a iBlups",
        "verify": "Verificar código"
      },
      "email": {
        "description": "Ingresa tu email para recibir un código de acceso",
        "label": "Email",
        "placeholder": "tu@email.com",
        "button": "Enviar código",
        "sending": "Enviando..."
      },
      "otp": {
        "description": "Ingresa el código de 4 dígitos enviado a",
        "label": "Código de verificación",
        "placeholder": "0000",
        "button": "Verificar código",
        "verifying": "Verificando...",
        "resend": "Reenviar código",
        "resending": "Reenviando...",
        "changeEmail": "Cambiar email"
      },
      "errors": {
        "emailRequired": "Email es requerido",
        "invalidEmail": "Email inválido",
        "otpRequired": "Código es requerido",
        "invalidOtp": "Código inválido o expirado",
        "networkError": "Error de red. Inténtalo de nuevo.",
        "serverError": "Error interno del servidor"
      },
      "success": {
        "emailSent": "Código enviado correctamente",
        "loginSuccess": "Inicio de sesión exitoso"
      }
    }
  }
}
```

### **3. Email de OTP**
```json
{
  "email": {
    "otp": {
      "subject": "Tu código de acceso a iBlups",
      "title": "Código de acceso",
      "greeting": "Hola,",
      "description": "Tu código de acceso para iBlups es:",
      "expiration": "Este código expira en 10 minutos. Si no solicitaste este código, puedes ignorar este email.",
      "thanks": "¡Gracias por usar iBlups!",
      "footer": "© 2024 iBlups. Todos los derechos reservados."
    }
  }
}
```

### **4. Botones de Navegación**
```json
{
  "navigation": {
    "viewerAccess": "Ingreso como viewer",
    "producerAccess": "Acceso de productor"
  }
}
```

### **5. Seguimiento de Canales**
```json
{
  "channels": {
    "follow": "Seguir canal",
    "unfollow": "Dejar de seguir",
    "following": "Siguiendo"
  }
}
```
