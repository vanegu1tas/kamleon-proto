import { createRoot } from 'react-dom/client';

// Mismas bases que la scrapp: tipografía, tokens de color y la escala propia de la pantalla.
import '../design-system/tokens/fonts.css';
import '../design-system/tokens/colors.css';
import '../design-system/tokens/semantic-colors.css';
import '../design-system/tokens/tokens.css';
import './tokens/typography.css';

import RecommendationApp from './recommendation/RecommendationApp';

createRoot(document.getElementById('root')).render(<RecommendationApp />);
