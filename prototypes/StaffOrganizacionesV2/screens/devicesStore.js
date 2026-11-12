// Inventario de devices (exploración 29/10). Un device es un Display o un Sensor (K-POD) y
// sigue siendo parte de la unit: cada unit tiene como mucho uno de cada. La lista de Devices
// es el inventario de Kamleon staff: lo asignado (sale de las units del mock) y lo que está
// en stock esperando unit.
//
// Una sola fuente: lo asignado vive en `unit.display` / `unit.kpod` (los mismos objetos que
// lee la tabla de Units), y el stock en STOCK. Asignar, quitar o crear mueve el device entre
// los dos sitios, así que Units, Edit unit y Devices siempre dicen lo mismo.
import { ORGS } from '../../StaffOrganizaciones/mockData';

export const DEVICE_TYPES = {
  display: { label: 'Display', slot: 'display' },
  sensor:  { label: 'Sensor',  slot: 'kpod' },
};

const STOCK = [
  { id: 767601, type: 'display', dateAdded: '02 Oct 2026' },
  { id: 767602, type: 'display', dateAdded: '02 Oct 2026' },
  { id: 767603, type: 'display', dateAdded: '02 Oct 2026' },
  { id: 767604, type: 'display', dateAdded: '14 Oct 2026' },
  { id: 2961,   type: 'sensor',  dateAdded: '02 Oct 2026' },
  { id: 2962,   type: 'sensor',  dateAdded: '02 Oct 2026' },
  { id: 2963,   type: 'sensor',  dateAdded: '14 Oct 2026' },
  { id: 2964,   type: 'sensor',  dateAdded: '14 Oct 2026' },
  { id: 2965,   type: 'sensor',  dateAdded: '21 Oct 2026' },
];

// Fecha de alta de lo que se crea en el proto: hoy, mismo formato que el mock ("29 Oct 2026")
function today() {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const listeners = new Set();
function emit() { listeners.forEach(fn => fn()); }

export function subscribeDevices(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getUnitRows() {
  const rows = [];
  ORGS.forEach(org => org.centers.forEach(center =>
    (center.units ?? []).forEach(unit => rows.push({ unit, center, org }))
  ));
  return rows;
}

export function getDevices() {
  const assigned = [];
  getUnitRows().forEach(({ unit, center, org }) => {
    Object.entries(DEVICE_TYPES).forEach(([type, { slot }]) => {
      // La fecha viaja con el device; los del mock no la tienen y usan la de alta de la unit
      if (unit[slot]) assigned.push({ id: unit[slot].id, type, dateAdded: unit[slot].dateAdded ?? unit.dateAdded ?? '—', unit, center, org });
    });
  });
  return [...STOCK.map(d => ({ ...d, unit: null, center: null, org: null })), ...assigned];
}

export function getAvailable(type) {
  return STOCK.filter(d => d.type === type);
}

export function deviceExists(id) {
  return getDevices().some(d => String(d.id) === String(id));
}

function takeFromStock(id) {
  const i = STOCK.findIndex(d => String(d.id) === String(id));
  return i >= 0 ? STOCK.splice(i, 1)[0] : null;
}

function returnToStock(type, slotValue, unit) {
  if (slotValue) STOCK.unshift({ id: slotValue.id, type, dateAdded: slotValue.dateAdded ?? unit?.dateAdded ?? today() });
}

// Pone `deviceId` en la unit. Si la unit ya tenía uno de ese tipo, el anterior vuelve al stock.
// Si el device estaba en otra unit, sale de ella.
export function assignDevice(type, deviceId, unit) {
  const { slot } = DEVICE_TYPES[type];
  let dateAdded = takeFromStock(deviceId)?.dateAdded;
  if (!dateAdded) {
    getUnitRows().forEach(({ unit: u }) => {
      if (u !== unit && u[slot] && String(u[slot].id) === String(deviceId)) {
        dateAdded = u[slot].dateAdded ?? u.dateAdded;
        u[slot] = null;
      }
    });
  }
  if (unit[slot] && String(unit[slot].id) !== String(deviceId)) returnToStock(type, unit[slot], unit);
  unit[slot] = { id: deviceId, status: 'active', dateAdded };
  emit();
}

export function unassignDevice(type, unit) {
  const { slot } = DEVICE_TYPES[type];
  returnToStock(type, unit[slot], unit);
  unit[slot] = null;
  emit();
}

export function createDevice(type, id, unit = null) {
  STOCK.unshift({ id, type, dateAdded: today() });
  if (unit) assignDevice(type, id, unit);
  else emit();
}

// Solo se borra lo que está en stock: un device puesto en una unit se quita antes.
export function deleteDevice(id) {
  takeFromStock(id);
  emit();
}

export function unitLabel({ unit, center, org }) {
  return `${unit.id} · ${org?.name ?? '—'} · ${center?.name ?? '—'}`;
}
