# Configuración del Proyecto Gespadel

Esta guía detalla los pasos necesarios para configurar el backend en Firebase para que la aplicación funcione correctamente. Está destinada a desarrolladores y asistentes de código que necesiten replicar el entorno.

## 1. Crear Proyecto en Firebase

- Ve a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto.
- Añade una **Aplicación Web** a tu proyecto.
- Firebase te proporcionará un objeto `firebaseConfig`. Este objeto ya está incluido en el fichero `firebase.ts`, por lo que no necesitas modificarlo en el código.

## 2. Habilitar Servicios de Firebase

### Firestore Database

1.  En el menú lateral, ve a **Firestore Database** y haz clic en "Crear base de datos".
2.  Inicia la base de datos en **modo de prueba**. Esto permite lecturas y escrituras sin restricciones iniciales.
3.  **Crea las Colecciones**: Dentro de Firestore, crea manualmente las siguientes colecciones (puedes dejarlas vacías inicialmente):
    -   `tournaments`
    -   `players`
    -   `registrations`

### Authentication

1.  Ve a la sección de **Authentication**.
2.  En la pestaña "Sign-in method" (Método de inicio de sesión), habilita los siguientes proveedores:
    -   **Email/Contraseña**
    -   **Google**

## 3. Reglas de Seguridad de Firestore

Para producción, es crucial proteger tu base de datos. Reemplaza las reglas por defecto en **Firestore Database -> Reglas** con las siguientes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Función para comprobar si un usuario es organizador
    function isOrganizer() {
      return request.auth != null && (
        get(/databases/$(database)/documents/players/$(request.auth.uid)).data.role == 'organizer' ||
        get(/databases/$(database)/documents/players/$(request.auth.uid)).data.role == 'organizer_player'
      );
    }

    // Lectura pública de torneos e inscripciones.
    match /tournaments/{tournamentId} {
      allow read: if true;
      // Solo los organizadores pueden crear/actualizar torneos.
      allow create, update: if isOrganizer();
    }
    match /registrations/{registrationId} {
      allow read: if true;
      // Solo usuarios autenticados pueden inscribirse.
      allow create: if request.auth != null;
    }
    
    // Reglas específicas para la colección de jugadores.
    match /players/{userId} {
      // Cualquiera puede leer perfiles.
      allow read: if true;
      
      // Un usuario puede crear su propio perfil, PERO solo con el rol de 'player'.
      allow create: if request.auth.uid == userId && request.resource.data.role == 'player';
      
      // Un usuario puede actualizar su perfil, PERO NO PUEDE cambiar su rol.
      allow update: if request.auth.uid == userId && request.resource.data.role == resource.data.role;
    }
  }
}
```

## 4. Gestión de Roles de Usuario

El sistema diferencia entre `player`, `organizer` y `organizer_player`.

### Crear un Organizador (o un Usuario con Doble Rol)

El rol de organizador **no se puede asignar desde la aplicación** por seguridad. Debe hacerse manualmente:

1.  **Crear el Usuario en Authentication**:
    -   Ve a **Authentication -> Users** y haz clic en "Add user".
    -   Crea el usuario con su email y una contraseña.
    -   Copia el **User UID** que se genera para este usuario.

2.  **Asignar el Rol en Firestore**:
    -   Ve a **Firestore Database -> `players`**.
    -   Haz clic en "Add document".
    -   En el campo **Document ID**, pega el **UID** del usuario que copiaste.
    -   Añade los campos necesarios para el perfil del usuario (name, email, etc.).
    -   Añade un campo `role` (tipo `string`) y asígnale uno de los siguientes valores:
        -   `"organizer"`: Para un usuario que solo puede acceder al panel de organizador.
        -   `"organizer_player"`: Para un usuario que necesita acceder tanto al panel de organizador como al de jugador.

¡Con estos pasos, el entorno de Firebase estará listo y la aplicación será completamente funcional!
