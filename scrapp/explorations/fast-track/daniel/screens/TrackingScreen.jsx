import PulseStatusScreen from '../../../../components/PulseStatusScreen';

// A diferencia de Start, esta pantalla no muestra [×] en la captura original —
// se replica tal cual, es una de las inconsistencias a revisar en el audit.
export default function TrackingScreen() {
  return (
    <PulseStatusScreen
      heading="Tracking…"
      subtitle="We're analysing your sample."
    />
  );
}
