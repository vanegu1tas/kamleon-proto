import { createRoot } from 'react-dom/client';
import '../design-system/tokens/fonts.css';
import '../design-system/tokens/colors.css';
import '../design-system/tokens/semantic-colors.css';
import '../design-system/tokens/typography.css';
import '../design-system/tokens/text-styles.css';
import '../design-system/tokens/tokens.css';
import Login from './Login/Login';

createRoot(document.getElementById('root')).render(<Login />);
