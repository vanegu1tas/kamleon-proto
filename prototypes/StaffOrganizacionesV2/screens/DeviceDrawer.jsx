import { useState, useMemo } from 'react';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import { IconClose } from '../../../design-system/icons/outline';
import { DEVICE_TYPES, getUnitRows, unitLabel, deviceExists, assignDevice, unassignDevice, createDevice } from './devicesStore';
import shellStyles from '../../StaffOrganizaciones/screens/NewCenterDrawer.module.css';
import styles from './EditUnitDrawer.module.css';

const TYPE_OPTIONS = Object.entries(DEVICE_TYPES).map(([value, { label }]) => ({ value, label }));
const NO_UNIT = '';

// New device / Edit device (Figma 7625:99655). Mismo drawer para los dos: al editar, Type e ID
// quedan bloqueados (supuesto, por confirmar) y lo que se toca es la unit.
// Cambios sobre el Figma (Daniel, 29/10): la unit ya no es obligatoria (sin asterisco, como el
// resto de campos opcionales) y deja de ir primera. Date of installation se quita: ya no se pide.
// Misma regla que Edit unit: solo se ofrecen units con el hueco de ese tipo libre (para poner
// otro, primero se quita el que tiene).
export default function DeviceDrawer({ device, onClose, onSave }) {
  const isEdit = !!device;
  // Desde "Assign to unit" (device sin unit) el drawer dice lo que se va a hacer (Daniel, 29/10)
  const isAssign = isEdit && !device.unit;
  const rows = useMemo(() => getUnitRows(), []);
  // Sin tipo por defecto (Daniel, 29/10): dar de alta un sensor como pantalla sin darse cuenta no
  // se podría corregir, porque al editar el tipo queda bloqueado.
  const [type, setType]     = useState(device?.type ?? '');
  const [id, setId]         = useState(device ? String(device.id) : '');
  const [unitId, setUnitId] = useState(device?.unit ? String(device.unit.id) : NO_UNIT);
  const [touched, setTouched] = useState(false);

  const { slot, label } = DEVICE_TYPES[type] ?? { slot: null, label: 'Device' };
  const target = rows.find(r => String(r.unit.id) === unitId) ?? null;

  const idError = isEdit ? null
    : deviceExists(id.trim()) ? 'This ID already exists'
    : touched && id.trim() === '' ? 'Device ID is required' : null;
  const isDirty = isEdit ? unitId !== (device.unit ? String(device.unit.id) : NO_UNIT) : type !== '' && id.trim() !== '';

  function handleSave() {
    if (!isEdit) {
      setTouched(true);
      if (type === '' || id.trim() === '' || deviceExists(id.trim())) return;
      createDevice(type, id.trim(), target?.unit ?? null);
    } else if (target) {
      assignDevice(type, device.id, target.unit);
    } else {
      unassignDevice(type, device.unit);
    }
    onSave?.(
      !isEdit ? `${label} ${id.trim()} created`
      : isAssign && target ? `${label} ${device.id} assigned to unit ${target.unit.id}`
      : `${label} ${device.id} updated`
    );
    onClose();
  }

  // En la lista, ID · org · centro para elegir; ya elegida, el campo dice solo el ID (Daniel, 29/10).
  // El select es nativo y pinta la etiqueta de la opción elegida, así que esa va corta.
  const unitOptions = !slot ? [] : rows
    .filter(r => !r.unit[slot] || r.unit === device?.unit)
    .map(r => {
      const value = String(r.unit.id);
      return { value, label: value === unitId ? value : unitLabel(r) };
    });

  return (
    <div className={shellStyles.overlay} onMouseDown={onClose}>
      <div className={shellStyles.modal} onMouseDown={e => e.stopPropagation()}>

        <div className={shellStyles.header}>
          <h2 className={shellStyles.title}>
            {isAssign ? `Assign ${label.toLowerCase()} to unit` : isEdit ? `Edit ${label.toLowerCase()}` : 'New device'}
          </h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        <div className={shellStyles.body}>

          <div className={shellStyles.formRow}>
            <Dropdown
              label="Select type of device"
              required={!isEdit}
              placeholder="Select type"
              options={TYPE_OPTIONS}
              value={type}
              onChange={v => { setType(v); setUnitId(NO_UNIT); }}
              disabled={isEdit}
            />
            <Input
              label="Device ID"
              required={!isEdit}
              placeholder="Write here..."
              value={id}
              onChange={setId}
              error={idError || undefined}
              disabled={isEdit}
            />
          </div>

          <Dropdown
            label="Select unit to link"
            description={slot ? `Only units without a ${label.toLowerCase()} are listed.` : 'Select the type of device first.'}
            placeholder="No unit"
            options={unitOptions}
            value={unitId}
            onChange={setUnitId}
            disabled={!slot}
          />


        </div>

        <div className={`${shellStyles.footer} ${styles.footerNoBorder}`}>
          <Button variant="tertiary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!isDirty} onClick={handleSave}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </div>

      </div>
    </div>
  );
}
