/**
 * Registro de síntomas — receptor para la web app del celular.
 *
 * Pasos (una sola vez):
 *  1. Abrí el Sheet "Registro de síntomas" → Extensiones → Apps Script.
 *  2. Borrá lo que haya y pegá este archivo entero. Guardá.
 *  3. Elegí la función "configurar" arriba y tocá Ejecutar. Autorizá los permisos.
 *     En el registro de ejecución aparece tu TOKEN: copialo.
 *  4. Implementar → Nueva implementación → tipo "Aplicación web".
 *     Ejecutar como: Yo. Quién tiene acceso: Cualquier persona.
 *     Copiá la URL que termina en /exec.
 *  5. En la web app del celular (⚙) pegá la URL y el token.
 */

const SHEET_ID = '1Ke2YGRH56HG5-hoKissoWz4OrIqYa3D84yvZoWlYneY';
const SHEET_NAME = 'Registro';
const TZ = 'America/Argentina/Buenos_Aires';
const HEADERS = ['id', 'registrado', 'inicio', 'fin', 'categoría', 'valor', 'comentarios'];

function configurar() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  ss.setSpreadsheetTimeZone(TZ);

  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName(SHEET_NAME);
  }
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sh.setFrozenRows(1);
  sh.getRange('B:D').setNumberFormat('yyyy-mm-dd hh:mm');
  sh.setColumnWidth(1, 140);
  sh.setColumnWidths(2, 3, 130);
  sh.setColumnWidth(5, 120);
  sh.setColumnWidth(6, 60);
  sh.setColumnWidth(7, 420);

  const props = PropertiesService.getScriptProperties();
  let token = props.getProperty('TOKEN');
  if (!token) {
    token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
    props.setProperty('TOKEN', token);
  }
  Logger.log('TOKEN: ' + token);
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_({ ok: false, error: 'json' });
  }

  const token = PropertiesService.getScriptProperties().getProperty('TOKEN');
  if (!token || body.token !== token) return out_({ ok: false, error: 'token' });

  const ops = Array.isArray(body.ops) ? body.ops : [];
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = getSheet_();
    ops.forEach(function (op) {
      if (op.op === 'add') addRow_(sh, op.row);
      else if (op.op === 'update') updateEnd_(sh, op.id, op.fin);
      else if (op.op === 'delete') deleteRow_(sh, op.id);
    });
    return out_({ ok: true, n: ops.length });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out_({ ok: true, msg: 'Registro de síntomas activo' });
}

// ---------- helpers ----------

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

function findRow_(sh, id) {
  if (!id || sh.getLastRow() < 2) return 0;
  const cell = sh.getRange(2, 1, sh.getLastRow() - 1, 1)
    .createTextFinder(String(id))
    .matchEntireCell(true)
    .findNext();
  return cell ? cell.getRow() : 0;
}

// Idempotente: si el id ya existe (reintento después de un corte), no duplica.
function addRow_(sh, r) {
  if (!r || !r.id || findRow_(sh, r.id)) return;
  const valor = r.valor === '' || r.valor == null ? '' : Number(r.valor);
  sh.appendRow([
    String(r.id),
    toDate_(r.registrado),
    toDate_(r.inicio),
    toDate_(r.fin),
    safe_(r.categoria),
    valor,
    safe_(r.comentarios)
  ]);
}

function updateEnd_(sh, id, fin) {
  const row = findRow_(sh, id);
  if (row) sh.getRange(row, 4).setValue(toDate_(fin));
}

function deleteRow_(sh, id) {
  const row = findRow_(sh, id);
  if (row) sh.deleteRow(row);
}

// "2026-09-22T09:03" (hora local de Buenos Aires) → Date
function toDate_(s) {
  if (!s) return '';
  return Utilities.parseDate(String(s).slice(0, 16), TZ, "yyyy-MM-dd'T'HH:mm");
}

// Evita que un texto que empieza con =, +, - o @ se interprete como fórmula.
function safe_(s) {
  s = s == null ? '' : String(s);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
