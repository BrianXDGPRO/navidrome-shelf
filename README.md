# Navidrome Shelf (`navidrome-reimagined`)

Tu biblioteca de **Navidrome** (y servidores compatibles con **Subsonic / OpenSubsonic API**) como un estante interactivo de CDs en 3D para la web, construido con **Three.js** y **React**.

> Este proyecto es un fork y adaptación web independiente (*standalone*) de [**Spotify Reimagined**](https://github.com/WhiteRafalicu/spotify-reimagined) por [WhiteRafalicu](https://github.com/WhiteRafalicu), adaptado por [**BrianXDGPRO**](https://github.com/BrianXDGPRO/navidrome-shelf) para funcionar directamente en cualquier navegador conectado a **Navidrome** sin depender de Spotify ni de Spicetify.

Tus álbumes, playlists y canciones favoritas se muestran de canto en estantes de madera como cajas acrílicas reales (*jewel cases*) con refracción e iluminación art déco. Pasa el cursor sobre un disco y se deslizará hacia afuera mostrando su portada en alta definición; haz clic en él y se abrirá frente a ti: la portada es el libreto (*booklet*) con la lista de canciones, notas del álbum y letras sincronizadas, mientras el disco gira al reproducirse. Baja hasta el final del estante para llegar al rincón con una TV CRT Sony PVM, una PlayStation 1 interactiva y una pizarra acrílica que escribe la letra de la canción en tiempo real con plumón.

![The TV corner: a Sony PVM monitor, a PlayStation, and a whiteboard writing out the lyrics](https://raw.githubusercontent.com/WhiteRafalicu/spotify-reimagined/main/docs/screenshots/tv-corner.jpg)

| | |
| --- | --- |
| ![The shelf: jewel cases spine-out on walnut shelves, sorted by year behind divider cards, playlists as handwritten CD-Rs](https://raw.githubusercontent.com/WhiteRafalicu/spotify-reimagined/main/docs/screenshots/shelf.jpg) | ![An open jewel case: the tracklist printed in the booklet with shuffle, play and skip beside the title, and the disc in the tray](https://raw.githubusercontent.com/WhiteRafalicu/spotify-reimagined/main/docs/screenshots/open-case.jpg) |
| Tu biblioteca de Navidrome en el estante, con separadores y playlists como CD-Rs escritos a mano | Abre un disco: reproduce, activa aleatorio o mételo directamente en la PlayStation |

---

## ✨ Novedades y mejoras frente al proyecto original

1. **Aplicación Web Standalone conectada a Navidrome / Subsonic API (`extension.js` + `index.html`)**
   - No requiere Spotify Desktop ni Spicetify: corre directamente en cualquier navegador moderno como aplicación web o PWA.
   - **Autenticación integrada con Navidrome** (`/auth/login` y fallback estándar Subsonic `MD5(password + salt)` v1.16.1) con persistencia de sesión en `localStorage`.
   - **Motor de audio HTML5 integrado** con cola de reproducción, modo aleatorio (*shuffle*), repetición (desactivado / contexto / una canción), control de volumen persistente, integración con **MediaSession API** (controles multimedia del sistema operativo) y **Scrobbling** en tiempo real hacia Navidrome (`now playing` y reproducción completada).
   - **Triple fuente de letras sincronizadas**: soporte nativo para **OpenSubsonic** (`getLyricsBySongId`), API clásica de Subsonic (`getLyrics`) y respaldo automático con **LRCLIB** (`lrclib.net`) para letras sincronizadas línea por línea (`.lrc`).

2. **Mini reproductor inferior interactivo**
   - **Clic en la portada**: abre directamente la vista 3D de la caja abierta del CD con el disco girando y la lista de canciones (tanto en modo disco redondo como en modo portada cuadrada).
   - **Clic en el título de la canción**: cierra cualquier vista superpuesta, limpia filtros si el disco estaba oculto y desplaza la cámara del estante 3D directamente hasta la fila exacta del disco, sacándolo ligeramente e iluminándolo.
   - **Clic en el artista**: filtra automáticamente el estante mostrando únicamente los discos de ese artista y sube al inicio del estante.

3. **Portadas HD dinámicas (600×600) al hacer hover o seleccionar en el estante**
   - Para mantener un rendimiento fluido en bibliotecas grandes (+2,000 discos), el estante utiliza texturas ligeras de `128×128` en el `DataArrayTexture` general, pero carga dinámicamente al instante una textura **HD de 600×600** (`uHdTex` / `uHdLayer`) para el disco que tienes seleccionado o bajo el cursor.

4. **Navegación directa entre el estante y la PlayStation 1**
   - Botón dedicado en el encabezado (**"Ir a la PS1"** / **"Ir al estante"**) que alterna dinámicamente según la posición de la cámara para bajar al rincón de la consola o regresar arriba con un clic.

5. **Correcciones gráficas y de carga en bibliotecas grandes**
   - **Fix de subida parcial en `DataArrayTexture` (WebGL2)**: solucionado un bug en el que al redimensionarse el pool de instancias (`C0`) en el mismo frame en que se actualizaban capas individuales (`layerUpdates`), la GPU dejaba capas en negro/vacías permanentemente.
   - **Priorización de cola de descargas en pantalla y caché ampliada (`4096` discos)**: al hacer scroll rápido en bibliotecas de miles de álbumes, las descargas de portadas que ya salieron de cámara se descartan para priorizar las filas visibles, reciclando primero los slots fuera de pantalla.
   - **Corrección de iluminación, niebla y legibilidad en el tema claro (*Abedul / Birch*) y paredes claras (`#ece8e1`, `#cfc6b8`)**: ajustada la distancia dinámica de la niebla (`fog`) y desactivada sobre el rincón de la TV, la consola y la pizarra para evitar que el texto del plumón o el monitor Sony PVM se vieran lavados.

---

## 🚀 Cómo ejecutarlo o desplegarlo

Al ser una aplicación web estática (HTML + JS + CSS), puedes abrirla con cualquier servidor HTTP local o alojarla en GitHub Pages, Cloudflare Pages, Vercel, Nginx o Docker.

### Opción 1: Servidor local rápido con Python o Node.js

```bash
git clone https://github.com/BrianXDGPRO/navidrome-shelf.git
cd navidrome-shelf

# Con Python 3:
python3 -m http.server 8080

# O con Node.js:
npx serve -l 8080
```

Abre `http://localhost:8080` en tu navegador, introduce la URL de tu servidor **Navidrome**, tu usuario y contraseña, ¡y tu estante cargará automáticamente!

> **Nota sobre CORS:** Si alojas `navidrome-shelf` en un dominio distinto al de tu servidor Navidrome, asegúrate de que tu servidor Navidrome permita peticiones CORS desde ese origen (la API `/rest/*` de Navidrome incluye cabeceras CORS por defecto).

---

## 🎮 Controles e interacciones

| Acción | Resultado |
| --- | --- |
| **Pasar el cursor sobre un lomo** | La caja se desliza hacia afuera y gira mostrando su portada en **HD (600×600)** |
| **Clic en un disco del estante** | Saca la caja del estante y la abre frente a ti |
| **Clic en una canción del libreto** | Reproduce el álbum o playlist desde esa pista (las listas largas tienen scroll) |
| **Canciones · Notas · Letra** (abajo en el libreto) | Cambia de página: lista de canciones, notas de edición (fecha, sello, géneros, número de discos) y letra sincronizada |
| **Clic en el disco dentro de la caja** | Reproduce o pausa (el disco gira mientras suena) |
| **Aleatorio · Reproducir · Siguiente · Repetir** | Controles integrados en la parte superior del libreto |
| **Arrastrar la caja abierta** | Gira la caja 3D libremente |
| **Clic fuera de la caja o tecla `Esc`** | Cierra la caja y la devuelve a su lugar en el estante |
| **Poner en la consola** (bajo la caja abierta) | La cámara baja al rincón de la TV, abre la tapa de la PlayStation 1, inserta el CD y comienza a reproducirlo |
| **Clic en la portada del mini reproductor** | Abre la caja 3D y lista de canciones del disco que está sonando |
| **Clic en el título en el mini reproductor** | Te lleva directamente a la ubicación exacta de ese disco en el estante |
| **Clic en el artista en el mini reproductor** | Filtra el estante con todos los discos de ese artista |
| **Ir a la PS1 / Ir al estante** (en el encabezado) | Desplaza la cámara al rincón de la TV y la PlayStation o de vuelta arriba |
| **Pasar el cursor sobre la TV CRT** | Muestra los controles en pantalla (anterior, play/pausa, siguiente y barra de progreso) |
| **Panel frontal del monitor Sony PVM** | **VOL ±** ajusta el volumen; **BRIGHT, CONTRAST, CHROMA, PHASE, APERTURE ±** ajustan la imagen CRT; **RESET** restaura valores; **POWER** apaga/enciende la pantalla |
| **Clic en la PlayStation 1** | Abre su tapa para ver el disco (pausa la música); haz clic de nuevo para cerrarla y continuar |
| **Pilas de discos junto a la TV** | **A continuación**: los siguientes discos en la cola; haz clic en uno para saltar a él |
| **Pantalla completa** o tecla **`T`** | Modo TV: encuadra la TV CRT y la pizarra de letras a pantalla completa (`Esc` para salir) |
| **`Ctrl` + rueda del ratón** | Hace zoom hacia donde apunte el cursor para leer los lomos (`Esc` para restablecer) |
| **Flechas / Re Pág / Av Pág / Inicio / Fin** | Navega entre los discos del estante con el teclado (`Enter` o `Espacio` para abrir) |
| **`←` / `→` con una caja abierta** | Guarda el disco actual y abre el disco anterior o siguiente del estante |

---

## 📁 Estructura de archivos principales

* [`index.html`](index.html): Punto de entrada HTML5 y carga de React 18 + scripts del estante.
* [`extension.js`](extension.js): Cliente **Navidrome / Subsonic / OpenSubsonic API**, autenticación MD5/JWT, caché de biblioteca, motor de audio HTML5, buscador de letras (OpenSubsonic + Subsonic + LRCLIB) y barra de reproducción inferior interactiva.
* [`index.js`](index.js): Motor 3D en **Three.js** (estante instanciado, shaders de refracción de cristal acrílico, iluminación art déco, rincón con TV CRT Sony PVM, PlayStation 1 y pizarra de letras) + interfaz React de ajustes, filtros y cámara.
* [`manifest.json`](manifest.json): Manifiesto de la aplicación web.

---

## 🙌 Créditos

* **Adaptación a Navidrome y mejoras**: [**BrianXDGPRO**](https://github.com/BrianXDGPRO/navidrome-shelf).
* **Proyecto original (`spotify-reimagined`)**: [**WhiteRafalicu**](https://github.com/WhiteRafalicu/spotify-reimagined).
* **Geometría de la caja de CD y shaders de refracción/difracción**: [cd-case](https://github.com/annnguyentt/vibe-coding/tree/main/cd-case) por **Ann Nguyen** ([@ann_nnng](https://x.com/ann_nnng)).
* **Modelos 3D del rincón de TV y fuentes**:
  * `pvm_ps1.glb`: [Sony PVM-1341 || Sony Playstation](https://sketchfab.com/3d-models/sony-pvm-1341-sony-playstation-5f80311f1a4646ef9673f20ee6dc6245) por `dark_igorek` (CC BY 4.0)
  * `whiteboard.glb`: [School whiteboard 90cm × 120cm](https://sketchfab.com/3d-models/school-whiteboard-90cm-x-120cm-280856e261974ed093d9d15892ef045e) por `Pedro-Martins` (CC BY 4.0)
  * `ashtray.glb`: [Ashtray with Cigarettes](https://sketchfab.com/3d-models/ashtray-with-cigarettes-6e9bfb5e4b1e42b791a51c40cb993306) por `YJ_` (CC BY 4.0)
  * `table.glb`: [table_d from FPS Creator Classic](https://sketchfab.com/3d-models/table-d-from-fps-creator-classic-ef3b5348530448289083e82251233aaa) por `Garbage Raccoon` (CC BY 4.0)
  * Fuentes: [Permanent Marker](https://fonts.google.com/specimen/Permanent+Marker) (Apache 2.0) y [Pangolin](https://fonts.google.com/specimen/Pangolin) (SIL OFL 1.1).

## 📄 Licencia

El código de este repositorio se distribuye bajo la licencia **MIT**. Los modelos 3D y fuentes mantienen sus respectivas licencias originales indicadas arriba.
