# Guía de ejecución local de Dportii

Esta copia de la guía se encuentra en el repositorio del backend. Está dirigida a integrantes que instalarán Dportii en Windows para ejecutar las pruebas asignadas. Los valores sensibles deben solicitarse al propietario y nunca deben incorporarse a Git.

## 1. Repositorios necesarios

Se necesitan dos repositorios públicos y la rama de preparación del equipo. **No ejecutes el siguiente bloque**: es una vista previa. Los comandos se ejecutan individualmente en los pasos 3 y 4.

```powershell
git clone --branch preparacion-pruebas-equipo https://github.com/JesusLeos16/DportiiBack.git backexpress
git clone --branch preparacion-pruebas-equipo https://github.com/JesusLeos16/DportiiFront.git front
```

Ambos deben quedar dentro de la misma carpeta:

```text
DportiiLocal/
├── backexpress/
└── front/
    └── DportiiFront/
```

## 2. Requisitos previos

- Windows 10 u 11 y PowerShell 7 recomendado.
- Git.
- Node.js 24 LTS recomendado. La línea base mínima elegida para el equipo es Node.js 22.12.0. Vite admite técnicamente Node.js 20.19.0, pero esta guía estandariza las pruebas en 22.12.0 o superior.
- npm incluido con Node.js. La preparación se verificó con Node.js 24.15.0 y npm 11.12.1.
- Grafana k6 únicamente para `PRE-01`. En Windows puede instalarse con `winget install k6 --source winget`; confirma después con `k6 version`.
- Acceso a internet.
- Acceso autorizado al servicio MySQL de Aiven.
- Certificado CA recibido por un medio privado.
- Credenciales de la cuenta controlada recibidas por ingreso directo del propietario o mediante un gestor de secretos aprobado.

Comprueba las herramientas:

```powershell
git --version
node --version
npm --version
```

## 3. Clonar el backend

```powershell
$raiz = Join-Path $HOME "DportiiLocal"
New-Item -ItemType Directory -Path $raiz -Force
Set-Location $raiz
git clone --branch preparacion-pruebas-equipo https://github.com/JesusLeos16/DportiiBack.git backexpress
```

## 4. Clonar el frontend

En la misma terminal, o definiendo otra vez `$raiz` si abriste una nueva:

```powershell
$raiz = Join-Path $HOME "DportiiLocal"
Set-Location $raiz
git clone --branch preparacion-pruebas-equipo https://github.com/JesusLeos16/DportiiFront.git front
```

La aplicación del frontend queda en `front\DportiiFront`.

## 5. Instalar dependencias

Backend:

```powershell
Set-Location (Join-Path $HOME "DportiiLocal\backexpress")
npm ci
```

Frontend, en otra terminal o después de volver a `DportiiLocal`:

```powershell
Set-Location (Join-Path $HOME "DportiiLocal\front\DportiiFront")
npm ci
```

No elimines los archivos `package-lock.json`: garantizan una instalación reproducible.

## 6. Configurar el backend

1. Entra en el backend con `Set-Location (Join-Path $HOME "DportiiLocal\backexpress")`.
2. Copia el ejemplo:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Solicita al propietario, por un medio privado, los valores de `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `PORT`, `JWT_SECRET` y la ubicación autorizada del CA.
4. Guarda el certificado CA fuera de `backexpress` y fuera de cualquier repositorio Git.
5. Configura `DB_CA_PATH` con la ruta absoluta local del archivo CA.
6. No pegues el contenido del certificado dentro de `.env`.
7. No subas `.env`, no lo envíes por chat y no compartas capturas.

La validación TLS es estricta: el backend requiere el CA y mantiene `rejectUnauthorized: true`.

## 7. Configurar el frontend

En `DportiiLocal\front\DportiiFront`:

```powershell
Copy-Item .env.example .env.development
```

El ejemplo ya contiene `VITE_API_URL=http://127.0.0.1:3315`. Para estas pruebas, el propietario debe proporcionar `PORT=3315` al backend para que ambas configuraciones coincidan. No incluyas una URL de producción y no subas `.env.development`.

## 8. Encender Aiven

Antes de iniciar el backend, solicita al propietario que active Aiven, si corresponde, y confirma que MySQL aparece completamente activo. Si no recibes esa confirmación, registra la preparación como bloqueada y no cambies la configuración. Si el servicio está apagado o reactivándose pueden aparecer:

- `ENOTFOUND`;
- `NXDOMAIN`;
- fallo en `SELECT 1`;
- backend que termina con código 1.

No modifiques el host ni desactives TLS para evitar estos errores. Al terminar, avisa al propietario; solo el propietario decide si el servicio debe apagarse.

## 9. Iniciar el backend

Desde el backend:

```powershell
Set-Location (Join-Path $HOME "DportiiLocal\backexpress")
npm start
```

El backend ejecuta `SELECT 1 AS ok` antes de abrir HTTP. Deben aparecer, en ese orden, mensajes equivalentes a:

- conexión con MySQL comprobada;
- servidor escuchando en el puerto configurado.

Si MySQL o TLS fallan, el proceso termina con código distinto de cero y el puerto no debe abrirse.

Comprueba la salud en otra terminal:

```powershell
$respuesta = Invoke-WebRequest http://127.0.0.1:3315/
$respuesta.StatusCode
$respuesta.Content
```

Se espera HTTP 200 y una respuesta JSON de salud.

## 10. Iniciar el frontend

Mantén el backend abierto. En otra terminal:

```powershell
Set-Location (Join-Path $HOME "DportiiLocal\front\DportiiFront")
npm run dev
```

Abre `http://127.0.0.1:5173`. Comprueba la landing y la página de login. Para verificar una compilación reproducible, usa una tercera terminal en la misma carpeta o detén Vite con `Ctrl + C` antes de ejecutar:

```powershell
npm run build
```

## 11. Iniciar sesión

- Utiliza únicamente la cuenta controlada.
- Pide al propietario que introduzca las credenciales directamente o las comparta con un gestor de secretos aprobado.
- No pegues correo, contraseña o token en el reporte, Google Docs, chats, consola o capturas.
- No conserves tokens en evidencias.
- Si la sesión caduca, inicia sesión otra vez; no reutilices tokens antiguos.
- No permitas que el navegador guarde la contraseña y evita perfiles sincronizados en equipos compartidos.
- Al terminar, usa **Cerrar sesión**, confirma que la sesión dejó de estar disponible y cierra el navegador. Si el cierre no está accesible, elimina los datos locales del sitio antes de abandonar un equipo compartido.

## 12. Orden correcto de ejecución

1. Solicitar al propietario que active Aiven y recibir confirmación.
2. Abrir una terminal en el backend.
3. Ejecutar `npm ci` si es la primera instalación.
4. Ejecutar `npm start`.
5. Confirmar MySQL y HTTP 200.
6. Abrir otra terminal en `front\DportiiFront`.
7. Ejecutar `npm ci` si es la primera instalación.
8. Ejecutar `npm run dev`.
9. Abrir Dportii en el navegador.
10. Iniciar sesión con la cuenta controlada.
11. Realizar solo la prueba asignada.
12. Guardar evidencias sin secretos ni datos personales.
13. Cerrar sesión y cerrar el navegador.
14. Cerrar Vite y backend con `Ctrl + C` en sus terminales.
15. Avisar al propietario que la prueba terminó; solo el propietario decide si Aiven se apaga.

## 13. Solución de problemas

### `DB_CA_PATH es obligatoria`

Falta configurar la ruta del certificado en el `.env` del backend. Solicita el CA y su procedimiento de entrega al propietario.

### `ENOENT` al leer el certificado

La ruta configurada es incorrecta, el archivo no existe o el usuario actual no puede leerlo. No copies el CA al repositorio.

### `ENOTFOUND` o `NXDOMAIN`

Aiven puede estar apagado o reactivándose. Confirma su estado antes de cambiar configuraciones.

### El backend termina con código 1

Falló la comprobación de MySQL o TLS. Por diseño, el puerto HTTP no se abre. Revisa Aiven, las variables locales y el CA sin imprimir sus valores.

### `EADDRINUSE`

El puerto ya está ocupado. Consulta el proceso sin detenerlo automáticamente:

```powershell
Get-NetTCPConnection -LocalPort 3315,5173 -State Listen |
  Select-Object LocalPort,OwningProcess
Get-NetTCPConnection -LocalPort 3315,5173 -State Listen |
  ForEach-Object { Get-Process -Id $_.OwningProcess } |
  Select-Object Id,ProcessName
```

Detén un proceso solo si confirmas que te pertenece. Preferentemente vuelve a su terminal y usa `Ctrl + C`.

### Frontend sin datos

Verifica `VITE_API_URL`, confirma que el backend siga abierto y comprueba `GET /`. No cambies Axios para fijar una URL personal.

### HTTP 401

Inicia sesión nuevamente con la cuenta controlada y obtén un token vigente. No compartas ni reutilices tokens caducados.

### `npm ci` falla

Comprueba `node --version`, `npm --version` y la carpeta actual. Confirma que existe `package-lock.json`; no lo borres ni lo regeneres sin autorización.

## 14. Reglas de seguridad

- No subir `.env`, `.env.test.local` o `.env.development`.
- No subir certificados `.pem`, `.crt` o `.cer`.
- No compartir tokens, contraseñas, correos completos de prueba ni credenciales de Aiven.
- No ejecutar `/migrate`.
- No ejecutar `migrate_combate.js`.
- No usar endpoints `DELETE`.
- No generar, regenerar o intercambiar llaves.
- No probar con datos ajenos.
- No modificar el esquema ni configuraciones sin comunicarlo al propietario.
- No incluir `dist`, logs locales o capturas técnicas en commits salvo autorización expresa.

## 15. Pruebas asignadas

| Integrante | Prueba |
|---|---|
| Leonardo Muñoz | `PIF-01` — Interfaz |
| Gabriel Tiburcio | `PRE-01` — Rendimiento |
| Gabriel Tiburcio | `PUS-01` — Usabilidad |
| Gabriel Rodarte | Revisión de resultados y evidencias |
| Jesús Leos | Coordinación y soporte del entorno |

Consulta el Google Docs compartido y edita únicamente los apartados asignados. No pegues credenciales o tokens en el documento.

### `PIF-01` — Interfaz, Leonardo Muñoz

- **Precondición:** sesión con la cuenta controlada y formulario de creación de torneo disponible.
- **Procedimiento:** abrir el formulario, dejar vacíos los campos obligatorios e intentar enviarlo una sola vez.
- **Resultado esperado:** no se crea un torneo; los campos obligatorios se señalan con mensajes comprensibles y la presentación permanece consistente.
- **Evidencia:** capturas del formulario y notas sin credenciales, tokens ni datos personales.

### `PRE-01` — Rendimiento, Gabriel Tiburcio

- **Precondición:** autorización del propietario, Aiven estable, backend local y token vigente de la cuenta controlada.
- **Herramienta:** Grafana k6. El procedimiento oficial de instalación está en `https://grafana.com/docs/k6/latest/set-up/install-k6/`.
- **Alcance obligatorio:** el script versionado `tests/pre01-torneo.js` ejecuta únicamente `GET /torneo`, 10 usuarios virtuales concurrentes, 30 segundos y una pausa de 1 segundo por usuario. No envía POST, PUT, PATCH o DELETE durante la carga.
- **Criterios:** tasa de error ≤ 1 %, cero respuestas HTTP 500 y percentil 95 ≤ 1 segundo.
- **Corte inmediato:** detener si aparece una operación de escritura, si el endpoint no es el acordado, si Aiven deja de estar estable o si el propietario solicita detenerla.
- **Evidencia:** reporte agregado de métricas sin URL sensible, token, encabezado `Authorization` ni datos personales.

Instala k6 antes de la sesión de prueba, pero no ejecutes la carga sin autorización del propietario:

```powershell
winget install k6 --source winget
k6 version
```

Con backend y Aiven confirmados, ejecuta desde `backexpress`:

```powershell
.\scripts\ejecutar-pre01.ps1
```

El lanzador pide correo y contraseña sin mostrarlos, realiza un único login previo, entrega el token a k6 solo mediante variables del proceso y elimina esas variables al terminar. No redirijas la consola a un archivo que pueda contener información operativa y nunca modifiques el script para imprimir encabezados.

### `PUS-01` — Usabilidad, Gabriel Tiburcio

- **Precondición:** tres participantes ajenos al desarrollo, cuenta/entorno autorizados y consentimiento para registrar observaciones anónimas.
- **Procedimiento:** cada persona inicia sesión, crea un torneo de prueba con formato `USAB_INICIALES_FECHA` y confirma que aparece en el listado, sin instrucciones directas durante el recorrido.
- **Criterios:** al menos dos de tres completan la tarea y no ocurre un error crítico.
- **Evidencia:** registro anonimizado por participante. No eliminar los torneos ni otros datos sin autorización expresa del propietario.
