import { useState } from 'react';
import styles from './Profile.module.css';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import Button from '../../../design-system/components/Button/Button';
import Checkbox from '../../../design-system/components/Checkbox/Checkbox';

export default function Profile({ onNavigate, animPhase = '' }) {
  const [gender, setGender]   = useState('');
  const [height, setHeight]   = useState('');
  const [weight, setWeight]   = useState('');
  const [consent, setConsent] = useState(false);

  return (
    <div className={styles.page}>

      <div className={styles.formArea}>
        <div className={styles.form}>

          {/* Stepper — no anima */}
          <div className={styles.steps}>
            <span className={`${styles.step} ${styles.stepDone}`} />
            <span className={`${styles.step} ${styles.stepActive}`} />
          </div>

          {/* Título y campos — animan en la transición desde el paso 1 */}
          <div className={animPhase ? styles[animPhase] : styles.fields}>

          <div className={styles.header}>
            <h1 className={styles.title}>Complete your profile</h1>
            <p className={styles.subtitle}>Your data helps personalize your Kamleon experience.</p>
          </div>

            <Dropdown
              label="Gender"
              placeholder="Select gender"
              value={gender}
              onChange={setGender}
              options={[
                { label: 'Male',   value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other',  value: 'other' },
                { label: 'Prefer not to say', value: 'none' },
              ]}
            />

            <div className={styles.row}>
              <Input
                label="Height"
                placeholder="0"
                type="tel"
                suffix="cm"
                value={height}
                onChange={setHeight}
              />
              <Input
                label="Weight"
                placeholder="0"
                type="tel"
                suffix="kg"
                value={weight}
                onChange={setWeight}
              />
            </div>

            <div className={styles.divider} />

            <Checkbox
              checked={consent}
              onChange={setConsent}
              label={
                <span className={styles.consentLabel}>
                  I consent to the processing of my physiological data to personalize my profile.{' '}
                  <a href="#" className={styles.link}>Consent Information</a>
                  {' · '}
                  <a href="#" className={styles.link}>Privacy Policy</a>
                </span>
              }
            />

            <Button
              size="s"
              style={{ width: '100%' }}
              disabled={!consent}
              onClick={() => onNavigate('success')}
            >
              Register
            </Button>

            <Button
              variant="secondary"
              size="s"
              style={{ width: '100%' }}
              onClick={() => onNavigate('success')}
            >
              Skip, I'll fill it later
            </Button>

            <button className={styles.backLink} onClick={() => onNavigate('signup')}>
              Back
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}
