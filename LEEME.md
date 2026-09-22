# Registro de síntomas — puesta en marcha

Tres pasos, unos 15 minutos la primera vez. Después no tocás más nada.

---

## 1 · Conectar el Sheet (5 min)

El Sheet ya está creado en tu Drive: **Registro de síntomas**
https://docs.google.com/spreadsheets/d/1Ke2YGRH56HG5-hoKissoWz4OrIqYa3D84yvZoWlYneY/edit

1. Abrilo → menú **Extensiones → Apps Script**.
2. Borrá el contenido del editor y pegá todo `Code.gs`. Guardá (Ctrl+S).
3. Arriba, elegí la función **`configurar`** y tocá **Ejecutar**.
   Te va a pedir autorización: aceptá. Si aparece "Google no verificó esta app",
   entrá en *Configuración avanzada → Ir a Registro de síntomas (no seguro)*.
   Es tu propio script, no hay nadie más involucrado.
4. En el panel de abajo (*Registro de ejecución*) aparece una línea `TOKEN: xxxxx`.
   **Copiá ese token**, lo necesitás en el paso 3.
5. Botón **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   - Implementar → copiá la **URL** (termina en `/exec`).

> "Cualquier persona" es necesario para que tu celular pueda escribir sin login.
> Lo que protege el acceso es el token: sin él, el script rechaza todo.

---

## 2 · Publicar la app (5 min)

Necesita estar en una URL https para que funcione sin conexión.

1. Entrá a github.com → **New repository** → nombre `registro` → **Public** → Create.
2. **uploading an existing file** → arrastrá estos archivos:
   `index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `icon-maskable.png`
   (`Code.gs` y este `LEEME.md` no hacen falta ahí, pero no molestan).
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: **main** / carpeta `/ (root)` → Save.
4. Al minuto queda en `https://TU-USUARIO.github.io/registro/`.

> El repositorio es público, pero sólo contiene la app vacía: ni tus datos ni el
> token están ahí. Los datos viven en tu Sheet y la configuración queda guardada
> únicamente en tu celular.

---

## 3 · Instalar en el celular (2 min)

1. Abrí esa URL en el celular.
2. **iPhone (Safari):** Compartir → *Añadir a pantalla de inicio*.
   **Android (Chrome):** menú ⋮ → *Instalar app* / *Añadir a pantalla de inicio*.
3. Abrila desde el ícono, tocá **⚙** y pegá la **URL** y el **token** del paso 1.
4. **Guardar y probar** → tiene que decir *Conexión correcta*.

Listo. Desde ahí se abre al instante y registrás sin pensar.

---

## Cómo queda cada cosa en el Sheet

Columnas: `id · registrado · inicio · fin · categoría · valor · comentarios`

| categoría | inicio | fin | valor | comentarios |
|---|---|---|---|---|
| Comida | hora | opcional | — | texto libre |
| Ejercicio | hora | opcional | — | texto libre |
| Medicación | hora | — | — | texto libre |
| Ánimo | hora | — | 1–5 | opcional |
| Sueño | me acosté | me levanté | 1–5 | opcional |
| Deposición | hora | — | Bristol 1–7 | opcional |
| Gases / Hinchazón / Cefalea / Acidez / *(el que escribas)* | empezó | terminó | 1–5 | opcional |

**`registrado` vs `inicio`:** `registrado` es cuándo tocaste guardar; `inicio` es
cuándo pasó la cosa. Casi siempre coinciden, pero se separan cuando cargás algo en
diferido — el sueño de anoche se registra a la mañana, o anotás a las 16 h un
síntoma que empezó a las 11. Sirve para dos cosas: detectar registros cargados
mucho después (donde la hora es de memoria y menos confiable) y ver a qué hora
del día solés registrar.

**Escalas 1–5:**

| | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Gravedad | leve | molesto | afecta el día | fuerte | incapacita |
| Ánimo | muy mal | mal | normal | bien | muy bien |
| Sueño | pésimo | malo | regular | bueno | muy bueno |

Las etiquetas están a la vista al elegir: es lo que hace que un 3 de hoy
signifique lo mismo que un 3 de dentro de tres semanas.

Cada síntoma va con su propio nombre en **categoría**, así se filtra directo con
una tabla dinámica. Los registros sin hora de fin quedan arriba en **En curso**:
cuando se te pasa, tocás *Terminó* y se completa solo.

---

## Detalles que conviene saber

- **Sin señal funciona igual.** Lo que guardes queda en cola (arriba dice
  *"N sin enviar"*) y se sube solo al recuperar conexión.
- **No se duplica.** Si un envío se corta y reintenta, el script reconoce el id
  y no escribe dos veces la misma fila.
- **Borrar.** La × en la lista de *Hoy* borra la fila también en el Sheet.
- **No edites la columna `id`** en el Sheet: es lo que usa la app para cerrar
  síntomas y borrar. El resto lo podés tocar sin problema.
- **Si cambiás el código del script**, hay que hacer *Implementar → Gestionar
  implementaciones → editar → Nueva versión*, o la URL sigue sirviendo la vieja.

---

## Cuando tengas 3–4 semanas cargadas

Pasame el Sheet y armo el cruce: qué comiste o tomaste en las horas previas a
cada episodio, si la distensión sigue al patrón de las comidas, cómo se mueven
juntos sueño, ánimo y síntomas. De ahí sale un resumen de una página para la
consulta.
