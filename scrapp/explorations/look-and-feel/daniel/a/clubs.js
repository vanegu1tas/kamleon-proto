// Clubes para la prueba de neutralidad de la A (escudos y fotos de Fast Track, sin copiar).
import arsenal from '../../../fast-track/daniel/dorsal/logos/arsenal.svg';
import dallas from '../../../fast-track/daniel/dorsal/logos/dallas.svg';
import villa from '../../../fast-track/daniel/dorsal/logos/aston-villa.svg';
import saka from '../../../fast-track/daniel/data/photos/arsenal/saka.jpg';
import prescott from '../../../fast-track/daniel/data/photos/dallas-real/dak-prescott.jpg';

export const CLUBS = {
  arsenal: { label: 'Arsenal',     logo: arsenal, player: { name: 'Saka',     photo: saka } },
  dallas:  { label: 'Dallas',      logo: dallas,  player: { name: 'Prescott', photo: prescott } },
  villa:   { label: 'Aston Villa', logo: villa,   player: { name: 'McGinn',   photo: null } },
};
