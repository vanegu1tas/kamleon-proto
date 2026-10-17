import { forwardRef, useState } from 'react';
import { initialsFor } from '../data/rosters';

// Foto del jugador. Si no tiene, o si la URL falla (enlace caducado, sin red), sus iniciales: nunca
// un círculo roto. El ref llega al elemento que se ve, para que el vuelo de Ready funcione igual.
const Avatar = forwardRef(function Avatar({ person, className, initialsClassName, ...rest }, ref) {
  const [failed, setFailed] = useState(false);
  if (person.photo && !failed) {
    return <img ref={ref} className={className} src={person.photo} alt="" onError={() => setFailed(true)} {...rest} />;
  }
  return <span ref={ref} className={`${className} ${initialsClassName}`} {...rest}>{initialsFor(person.name)}</span>;
});

export default Avatar;
