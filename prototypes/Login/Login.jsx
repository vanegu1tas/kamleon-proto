import { useState } from 'react';
import styles from './Login.module.css';
import SignIn         from './screens/SignIn';
import SignUp         from './screens/SignUp';
import Profile        from './screens/Profile';
import ForgotPassword from './screens/ForgotPassword';
import CheckInbox      from './screens/CheckInbox';
import ResetPassword       from './screens/ResetPassword';
import WorkspaceSelector   from './screens/WorkspaceSelector';
import LogoKamleon from '../../design-system/icons/LogoKamleon';

const DIRECTION = {
  signin:        { signup: 'forward', forgot: 'forward', 'workspace-selector': 'forward' },
  'workspace-selector': { signin: 'back' },
  signup:        { signin: 'back', profile: 'forward' },
  profile:       { signup: 'back' },
  forgot:           { signin: 'back', 'check-inbox': 'forward' },
  'check-inbox':    { signin: 'back', forgot: 'back', 'reset-password': 'forward' },
  'reset-password': { signin: 'back' },
};

// Transiciones sin animación de página (solo anima el toast u otro elemento)
const INSTANT_TRANSITIONS = new Set(['reset-password→signin', 'workspace-selector→signin']);

// Transiciones que animan solo el form (imageBox queda estático)
const STEP_TRANSITIONS = new Set([
  'signup→profile',
  'profile→signup',
  'signin→forgot',
  'forgot→signin',
  'forgot→check-inbox',
  'check-inbox→forgot',
  'check-inbox→signin',
]);

export default function Login() {
  const [screen, setScreen]       = useState('signin');
  const [animClass, setAnim]      = useState('');   // wrapper — SignIn ↔ SignUp
  const [animPhase, setAnimPhase] = useState('');   // inner form — resto de transiciones

  const [name, setName]           = useState('');
  const [surname, setSurname]     = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [terms, setTerms]         = useState(false);
  const [privacy, setPrivacy]     = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [toast, setToast]             = useState('');

  function navigate(next, payload) {
    if (payload?.email) setForgotEmail(payload.email);
    if (payload?.toast) setToast(payload.toast);

    const key    = `${screen}→${next}`;
    const dir    = DIRECTION[screen]?.[next] ?? 'forward';

    if (INSTANT_TRANSITIONS.has(key)) {
      setScreen(next);
      return;
    }

    const isStep = STEP_TRANSITIONS.has(key);

    if (isStep) {
      const outPhase = dir === 'forward' ? 'exitForward' : 'exitBack';
      const inPhase  = dir === 'forward' ? 'enterForward' : 'enterBack';
      setAnimPhase(outPhase);
      setTimeout(() => {
        setScreen(next);
        setAnimPhase(inPhase);
        setTimeout(() => setAnimPhase(''), 250);
      }, 200);
    } else {
      const outClass = dir === 'forward' ? styles.slideOutLeft : styles.slideOutRight;
      const inClass  = dir === 'forward' ? styles.slideInRight : styles.slideInLeft;
      setAnim(outClass);
      setTimeout(() => {
        setScreen(next);
        setAnim(inClass);
        setTimeout(() => setAnim(''), 250);
      }, 200);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <LogoKamleon width={130} height={24} color="var(--color-text-strong)" />
      </div>
      <div className={animClass}>
        {screen === 'signin' && (
          <SignIn onNavigate={navigate} animPhase={animPhase} toast={toast} onDismissToast={() => setToast('')} />
        )}
        {screen === 'signup' && (
          <SignUp
            onNavigate={navigate}
            animPhase={animPhase}
            name={name}         onName={setName}
            surname={surname}   onSurname={setSurname}
            email={email}       onEmail={setEmail}
            password={password} onPassword={setPassword}
            confirm={confirm}   onConfirm={setConfirm}
            terms={terms}       onTerms={setTerms}
            privacy={privacy}   onPrivacy={setPrivacy}
          />
        )}
        {screen === 'profile' && (
          <Profile onNavigate={navigate} animPhase={animPhase} />
        )}
        {screen === 'forgot' && (
          <ForgotPassword onNavigate={navigate} animPhase={animPhase} />
        )}
        {screen === 'check-inbox' && (
          <CheckInbox onNavigate={navigate} animPhase={animPhase} email={forgotEmail} />
        )}
        {screen === 'reset-password' && (
          <ResetPassword onNavigate={navigate} email={forgotEmail} />
        )}
        {screen === 'workspace-selector' && (
          <WorkspaceSelector onNavigate={navigate} />
        )}
      </div>
    </div>
  );
}
