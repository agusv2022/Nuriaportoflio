# Nuria Iglesias — portfolio

Sitio estático en Astro, animado con GSAP, editable por CMS y desplegado en Cloudflare Pages.

---

## Arrancar en local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera /dist
npm run preview    # sirve /dist para comprobar antes de subir
```

Node 18.20 o superior.

---

## Estructura

```
src/
  content/site.json      ← TODO el texto y las imágenes de la web
  styles/global.css      ← el sistema de diseño (color, tipos, botones, hovers)
  scripts/motion.js      ← GSAP: letras, reveals, cursor
  layouts/Base.astro     ← <head>, fuentes, carga del JS
  components/            ← una sección por archivo
  pages/index.astro      ← ensambla las secciones
public/images/           ← las fotos
.pages.yml               ← configuración del CMS
```

Nada de contenido está escrito dentro de los componentes. Si hay que cambiar
un texto, se cambia en `src/content/site.json` — o desde el CMS, que escribe
en ese mismo archivo.

---

## Desplegar en Cloudflare Pages

1. Sube el repositorio a GitHub.
2. En el panel de Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. Selecciona el repo y configura:

   | Campo | Valor |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `20` (variable de entorno `NODE_VERSION`) |

4. **Save and Deploy**. Cada `git push` a `main` republica solo.

El sitio es 100 % estático, así que no hace falta adaptador ni funciones.
Si algún día se añade renderizado en servidor, entonces sí:
`npx astro add cloudflare`.

---

## CMS: que Nuria edite sin tocar código

Se usa [Pages CMS](https://pagescms.org), que es gratuito, no necesita servidor
y guarda los cambios como commits en GitHub.

1. Confirma que `.pages.yml` está en la raíz del repo (ya lo está).
2. Nuria entra en **https://app.pagescms.org** y accede con su cuenta de GitHub.
3. Le das acceso al repositorio desde GitHub → *Settings → Applications*.
4. Verá un formulario con todos los campos en castellano: portada, proyectos,
   servicios, sobre mí, contacto y pie.
5. Al pulsar guardar hace commit → Cloudflare detecta el push → la web se
   actualiza en un par de minutos.

Las imágenes se suben desde el propio CMS y aterrizan en `public/images`.

**Recomendación:** dale acceso de *Write* al repo, no de *Admin*. Puede editar
contenido y subir fotos, pero no borrar el proyecto.

---

## El formulario de contacto

El formulario ya funciona: valida los campos, avisa de los errores, envía por
fetch sin recargar la página y confirma el resultado. Sólo le falta un destino.

1. Crea un formulario en [Formspree](https://formspree.io) (el plan gratuito
   cubre 50 mensajes al mes).
2. Copia la URL que te dan, del estilo `https://formspree.io/f/xxxxxxx`.
3. Pégala en el CMS: **Contenido de la web → Contacto → URL del formulario**.

Hasta que se configure, al pulsar enviar aparece un aviso ofreciendo el correo
directo, en vez de fallar en silencio.

Lleva una trampa antispam invisible (`_gotcha`). Si un bot la rellena, el envío
se descarta y se le devuelve un falso mensaje de éxito.

Si prefieres no depender de un tercero estadounidense por el RGPD, la
alternativa es una función en `functions/api/contact.js` que envíe el correo
desde Cloudflare. En ese caso el campo pasa a ser `/api/contact`.

---

## Proyectos

Cada caso es un archivo en `src/content/projects/*.md`. El frontmatter lleva los
datos (título, sector, año, portada, servicios, resultados, galería) y el cuerpo
en markdown es el texto del caso.

De ahí salen tres cosas automáticamente:

- `/work` — el índice con todos los proyectos, ordenados por el campo `order`
- `/work/<slug>` — la página de cada caso, con enlace al siguiente
- Los cuatro huecos de la portada, que **no duplican datos**: en el CMS se elige
  qué proyecto va en cada hueco con un desplegable

Para añadir un proyecto nuevo, Nuria pulsa "Proyectos → Añadir" en el CMS.
El archivo se crea solo y aparece en `/work` sin que nadie toque código.

El campo `draft` lo mantiene fuera de la web hasta que esté listo.

### Nota sobre las referencias

Pages CMS guarda la referencia como ruta del archivo
(`src/content/projects/ultramar.md`). `src/pages/index.astro` la normaliza a
slug, así que también funciona si se escribe a mano sólo `ultramar`.

---

## Accesibilidad y rendimiento

- Los titulares se parten en letras para animarlos, pero conservan un
  `aria-label` con la frase completa y las letras van en `aria-hidden`.
- Todas las animaciones se desactivan con `prefers-reduced-motion`.
- En pantallas táctiles no hay hover: el texto de cada proyecto queda visible
  de forma permanente sobre la imagen.
- Contraste comprobado: tinta 14.8:1, gris 5.8:1, azul de texto 7.4:1.
