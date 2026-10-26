import { ChaosToStructure } from './components/ChaosToStructure';
import { Diagnostic } from './components/Diagnostic';
import { Hero } from './components/Hero';
import { Invitation } from './components/Invitation';

export default function App() {
  return (
    <main id="main">
      <Hero />
      <ChaosToStructure />
      <Invitation />
      <Diagnostic />
    </main>
  );
}
