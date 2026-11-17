// Clubes para la prueba de neutralidad de la C (color = tono del halo con la opción "Club") (escudos y fotos de Fast Track, sin copiar).
import arsenal from '../../../fast-track/daniel/dorsal/logos/arsenal.svg';
import dallas from '../../../fast-track/daniel/dorsal/logos/dallas.svg';
import villa from '../../../fast-track/daniel/dorsal/logos/aston-villa.svg';
import saka from '../../../fast-track/daniel/data/photos/arsenal/saka.jpg';
import prescott from '../../../fast-track/daniel/data/photos/dallas-real/dak-prescott.jpg';

export const CLUBS = {
  arsenal: { label: 'Arsenal',     logo: arsenal, color: '#7A1418', player: { name: 'Saka',     photo: saka } },
  dallas:  { label: 'Dallas',      logo: dallas,  color: '#123A6B', player: { name: 'Prescott', photo: prescott } },
  villa:   { label: 'Aston Villa', logo: villa,   color: '#5A1530', player: { name: 'McGinn',   photo: null } },
};
