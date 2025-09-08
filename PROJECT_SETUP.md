# Gespadel - Configuración del Proyecto Firebase

Este documento describe los pasos necesarios para configurar el backend de Firebase para que la aplicación Gespadel funcione correctamente. Esta información es para desarrolladores y asistentes de IA que trabajen en el proyecto.

## 1. Configuración del Proyecto en Firebase

1.  **Crear un Proyecto**: Ve a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto si aún no existe.
2.  **Añadir una Aplicación Web**:
    *   Dentro del proyecto, registra una nueva aplicación web.
    *   Firebase te proporcionará un objeto de configuración (`firebaseConfig`). Este objeto ya está incluido en el fichero `firebase.ts` del proyecto. No es necesario modificarlo a menos que se cree un nuevo proyecto de Firebase.

## 2. Configuración de la Base de Datos (Firestore)

1.  **Habilitar Firestore**:
    *   En el menú lateral de la consola, ve a **Firestore Database**.
    *   Haz clic en "Crear base de datos".
    *   **Inicia la base de datos en modo de prueba**. Esto permite lecturas y escrituras sin restricciones de autenticación, lo cual es útil para el desarrollo inicial.

2.  **Crear Colecciones**:
    *   Dentro de Firestore, es necesario crear las siguientes colecciones. Puedes dejarlas vacías inicialmente; la aplicación las poblará.
        *   `tournaments`
        *   `players`
        *   `registrations`

## 3. Configuración de la Autenticación

1.  **Habilitar Authentication**:
    *   En el menú lateral, ve a **Authentication**.
2.  **Habilitar Proveedor de Google**:
    *   Ve a la pestaña "Sign-in method" (Método de inicio de sesión).
    *   Busca **Google** en la lista de proveedores y habilítalo. Proporciona un correo electrónico de soporte del proyecto cuando se te solicite.

## 4. Reglas de Seguridad de Firestore (Para Producción)

El modo de prueba es inseguro para un entorno de producción. Una vez que la aplicación esté lista para ser desplegada, es crucial actualizar las reglas de seguridad de Firestore para proteger los datos.

1.  Ve a **Firestore Database -> Reglas**.
2.  Reemplaza el contenido existente con las siguientes reglas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cualquiera puede leer torneos e inscripciones.
    match /tournaments/{tournamentId} {
      allow read: if true;
      allow create, update: if request.auth != null; // Solo usuarios autenticados pueden crear/actualizar.
    }
    match /registrations/{registrationId} {
      allow read: if true;
      allow create: if request.auth != null; // Solo usuarios autenticados pueden inscribirse.
    }
    // Cualquiera puede leer perfiles, pero un usuario solo puede editar el suyo.
    match /players/{userId} {
      allow read: if true;
      allow create, update: if request.auth.uid == userId;
    }
  }
}
```

Con estos pasos, el backend de Firebase estará correctamente configurado para soportar todas las funcionalidades de la aplicación Gespadel.
