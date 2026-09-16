import { useState, useRef, useEffect, useCallback } from 'react';
import DeviceFrame from '../components/DeviceFrame';
import HomeScreen from '../screens/flow/HomeScreen';
import ChooseTeamScreen from '../screens/flow/ChooseTeamScreen';
import ChooseAvatarScreen from '../screens/flow/ChooseAvatarScreen';
import PinEntryScreen from '../screens/flow/PinEntryScreen';
import StartScreen from '../screens/flow/StartScreen';
import TrackingScreen from '../screens/flow/TrackingScreen';
import FlushScreen from '../screens/flow/FlushScreen';
import Exploration5, { scoreToAngle5, getZoneIndex5, GAUGE_START } from '../screens/Exploration5';

const TRACKING_DURATION = 3000; // demo: análisis simulado
const FLUSH_DURATION    = 4000; // demo: "a minute" real acortado para probar

export default function FlowRunner() {
  const [step, setStep]             = useState('home');
  const [selectedTeam, setSelectedTeam]     = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [displayScore, setDisplayScore] = useState(0);
  const [animAngle, setAnimAngle]       = useState(null);
  const [glowZoneIdx, setGlowZoneIdx]   = useState(null);
  const [textStage, setTextStage]       = useState(null);
  const rafRef = useRef(null);

  const handleScoreTimeout = useCallback(() => setStep('flush'), []);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStep('home');
    setSelectedTeam(null);
    setSelectedAvatar(null);
    setDisplayScore(0);
    setAnimAngle(null);
    setGlowZoneIdx(null);
    setTextStage(null);
  }, []);

  function playScore() {
    const targetScore = Math.floor(Math.random() * 101);
    const targetAngle = scoreToAngle5(targetScore);
    const targetZoneIdx = getZoneIndex5(targetScore);
    const duration = 2200;

    setDisplayScore(0);
    setAnimAngle(GAUGE_START);
    setGlowZoneIdx(null);
    setTextStage(null);

    let glowTriggered = false;
    setTimeout(() => {
      const t0 = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / duration, 1);
        const ease = Math.sin(p * Math.PI / 2);
        setAnimAngle(GAUGE_START + ease * (targetAngle - GAUGE_START));
        setDisplayScore(Math.round(ease * targetScore));

        if (!glowTriggered && p >= 0.85) {
          glowTriggered = true;
          setGlowZoneIdx(targetZoneIdx);
          setTextStage('you-are');
          setTimeout(() => setTextStage('full'), 250);
        }

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setAnimAngle(targetAngle);
          setDisplayScore(targetScore);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 300);
  }

  // Tracking → Score (auto, simula el tiempo de análisis)
  useEffect(() => {
    if (step === 'tracking') {
      const t = setTimeout(() => {
        setStep('score');
        playScore();
      }, TRACKING_DURATION);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Flush → Home (auto)
  useEffect(() => {
    if (step === 'flush') {
      const t = setTimeout(reset, FLUSH_DURATION);
      return () => clearTimeout(t);
    }
  }, [step, reset]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  let screen;
  switch (step) {
    case 'home':
      screen = (
        <HomeScreen
          onLogin={() => setStep('team')}
          onSimulateQr={() => setStep('start')}
          onSimulateRfid={() => setStep('start')}
          onGuest={() => setStep('start')}
        />
      );
      break;
    case 'team':
      screen = (
        <ChooseTeamScreen
          onSelect={(team) => { setSelectedTeam(team); setStep('avatar'); }}
          onClose={reset}
        />
      );
      break;
    case 'avatar':
      screen = (
        <ChooseAvatarScreen
          onSelect={(avatar) => { setSelectedAvatar(avatar); setStep('pin'); }}
          onClose={reset}
        />
      );
      break;
    case 'pin':
      screen = (
        <PinEntryScreen
          avatar={selectedAvatar}
          onComplete={() => setStep('start')}
          onBack={() => setStep('avatar')}
          onClose={reset}
        />
      );
      break;
    case 'start':
      screen = <StartScreen onSimulateFlow={() => setStep('tracking')} onClose={reset} />;
      break;
    case 'tracking':
      screen = <TrackingScreen />;
      break;
    case 'score':
      screen = (
        <Exploration5
          score={displayScore}
          animAngle={animAngle}
          glowZoneIdx={glowZoneIdx}
          textStage={textStage}
          onTimeout={handleScoreTimeout}
        />
      );
      break;
    case 'flush':
      screen = <FlushScreen />;
      break;
    default:
      screen = null;
  }

  return <DeviceFrame>{screen}</DeviceFrame>;
}
