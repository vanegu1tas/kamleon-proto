import PulseStatusScreen from '../../components/PulseStatusScreen';
import SimulateButton from '../../components/SimulateButton';

export default function StartScreen({ onSimulateFlow, onClose }) {
  return (
    <PulseStatusScreen
      heading="Start"
      subtitle="User confirmed, you can now urinate."
      onClose={onClose}
    >
      <SimulateButton label="Simulate flow detected" onClick={onSimulateFlow} />
    </PulseStatusScreen>
  );
}
