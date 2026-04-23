# Flujo E2E: Solicitud de Uso de Canción (Track Request)

Este documento describe detalladamente el flujo de extremo a extremo (E2E) que debe implementar el Frontend para el componente "Solicitar Uso de la Canción", integrándose con la arquitectura de backend de Musila.

---

## 1. Subida del Documento Adjunto (Opcional)

Si el usuario adjuntó un archivo (por ejemplo, PNG, JPG, GIF o PDF) en el área de "Adjuntar documento", el frontend debe subir el archivo directamente a DigitalOcean Spaces antes de enviar la solicitud.

### Endpoint:

`POST /storage/upload-url`

**Payload:**

```json
{
  "folder": "requests/documents",
  "fileType": "image/png" // MIME type dinámico
}
```

**Respuesta Esperada:**

```json
{
  "uploadUrl": "https://<bucket>.nyc3.digitaloceanspaces.com/requests/documents/...",
  "fileUrl": "https://<bucket>.nyc3.cdn.digitaloceanspaces.com/requests/documents/...",
  "fileKey": "requests/documents/..."
}
```

**Acción del Frontend:**
Utilizar la `uploadUrl` para realizar una petición `PUT` directa pasando el `File` object capturado en el formulario (usualmente usando axios o fetch).

---

## 2. Creación de la Solicitud

Una vez se tengan los metadatos del archivo (o inmediatamente si no hay archivo adjunto), el frontend invoca la creación de la solicitud. Esto registra el interés en la base de datos y automáticamente crea un "Chat" asociado a esta solicitud, disparando también un evento interno que notifica al owner y al solicitante por correo.

### Endpoint:

`POST /requested-tracks`
_(Requiere Bearer Token del usuario autenticado)_

**Payload:**

```json
{
  "trackId": "<uuid-de-la-cancion>",
  "licenseType": "LICENCIA_DE_PRIMER_USO" // Debe ser un valor válido del enum LicenseType
}
```

**Respuesta Esperada:**

```json
{
  "id": "<uuid-de-la-solicitud>",
  "status": "PENDIENTE",
  "licenseType": "LICENCIA_DE_PRIMER_USO",
  "chat": {
    "id": "<uuid-del-chat>"
  },
  ...
}
```

> [!IMPORTANT]
> El frontend debe extraer la propiedad `chat.id` de la respuesta, ya que será indispensable para el siguiente paso (enviar el mensaje redactado).

---

## 3. Envío del Mensaje y Documento (Vía WebSocket)

El backend maneja los mensajes (tanto texto como archivos) a través de WebSockets en el namespace `/chat`.

### 3.1. Conexión y Autenticación al Socket

El frontend debe establecer una conexión de Socket.io hacia la ruta base con el namespace `/chat`. La autenticación se realiza de acuerdo a las reglas implementadas (`SocketAuthService` verifica el token/sesión automáticamente on connect).

```javascript
import { io } from "socket.io-client";

const socket = io("https://api.musila.com/chat", {
  auth: { token: "Bearer <tu-jwt>" },
});
```

### 3.2. Unirse a la sala del Chat (`joinChat`)

Para asegurar la recepción de eventos (como confirmación de lectura o respuestas), el cliente debe emitir el evento para unirse a la sala.

**Emitir:** `joinChat`
**Payload:**

```json
{
  "chatId": "<uuid-del-chat-devuelto-en-paso-2>"
}
```

### 3.3. Envío del Mensaje (`sendMessage`)

El frontend envía el contenido del campo "Escribe tu mensaje aquí" junto a los datos del archivo subido en el Paso 1.

**Emitir:** `sendMessage`
**Payload:**

````json
{
  "userId": "<uuid-del-usuario-logueado>",
  "chatId": "<uuid-del-chat-devuelto-en-paso-2>",
  "content": "<mensaje-escrito-en-el-textarea>",
  "type": "FILE", // Usar "TEXT" si no hay archivo
  "fileUrl": "<fileUrl-devuelto-en-paso-1>", // (Opcional si es TEXT)
  "filekey": "<fileKey-devuelto-en-paso-1>", // (Opcional si es TEXT)
  "fileName": "documento_licencia.pdf"       // (Opcional si es TEXT)
}


---

## Diagrama del Flujo (Frontend / Backend)

```mermaid
sequenceDiagram
    participant UI as Frontend (Modal)
    participant S3 as DigitalOcean (Storage)
    participant API as NestJS (REST API)
    participant WS as NestJS (WebSocket)
    participant DB as Postgres (TypeORM)

    rect rgb(240, 248, 255)
        note right of UI: Paso 1 (Opcional): Si hay archivo
        UI->>API: POST /storage/upload-url (folder, fileType)
        API-->>UI: Devuelve uploadUrl, fileUrl, fileKey
        UI->>S3: PUT (Archivo físico) hacia uploadUrl
    end

    rect rgb(245, 245, 245)
        note right of UI: Paso 2: Crear Solicitud
        UI->>API: POST /requested-tracks { trackId, licenseType }
        API->>DB: Crea RequestedTrack
        API->>DB: Crea Chat asociado
        API-->>UI: Devuelve RequestedTrack con chat.id
    end

    rect rgb(255, 245, 238)
        note right of UI: Paso 3: Enviar mensaje al Chat
        UI->>WS: Emit 'joinChat' { chatId }
        UI->>WS: Emit 'sendMessage' { chatId, content, fileUrl... }
        WS->>DB: Guarda Message en la base de datos
    end
````
