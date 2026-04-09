import styles from './SignUp.module.css';
import Input from '../../../design-system/components/Input/Input';
import Button from '../../../design-system/components/Button/Button';
import Checkbox from '../../../design-system/components/Checkbox/Checkbox';

export default function SignUp({
  onNavigate,
  animPhase = '',
  name, onName,
  surname, onSurname,
  email, onEmail,
  password, onPassword,
  confirm, onConfirm,
  terms, onTerms,
  privacy, onPrivacy,
}) {
  const passwordsMatch = !confirm || password === confirm;
  const canSubmit = terms && privacy && password && confirm && passwordsMatch;

  return (
    <div className={styles.page}>

      <div className={styles.formArea}>
        <div className={styles.form}>

          {/* Stepper — no anima */}
          <div className={styles.steps}>
            <span className={`${styles.step} ${styles.stepActive}`} />
            <span className={styles.step} />
          </div>

          {/* Título y campos — animan en la transición al paso 2 */}
          <div className={animPhase ? styles[animPhase] : styles.fields}>

          <h1 className={styles.title}>Sign up</h1>

            <div className={styles.row}>
              <Input label="Name"    placeholder="First name" value={name}    onChange={onName}    required />
              <Input label="Surname" placeholder="Last name"  value={surname} onChange={onSurname} required />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={onEmail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={onPassword}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Enter password"
              value={confirm}
              onChange={onConfirm}
              error={!passwordsMatch ? "Passwords don't match" : undefined}
              required
            />

            <div className={styles.checkboxes}>
              <Checkbox
                checked={terms}
                onChange={onTerms}
                label={
                  <span className={styles.checkboxLabel}>
                    I agree to the <a href="#" className={styles.link}>Terms of Use</a>
                  </span>
                }
              />
              <Checkbox
                checked={privacy}
                onChange={onPrivacy}
                label={
                  <span className={styles.checkboxLabel}>
                    I agree to the <a href="#" className={styles.link}>Privacy Policy</a>
                  </span>
                }
              />
            </div>

            <Button
              size="s"
              style={{ width: '100%' }}
              disabled={!canSubmit}
              onClick={() => onNavigate('profile')}
            >
              Next
            </Button>

            <button className={styles.backLink} onClick={() => onNavigate('signin')}>
              Back to login
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}
