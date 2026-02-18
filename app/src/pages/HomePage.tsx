import Hero from '../sections/Hero';
import Benefits from '../sections/Benefits';
import Catalog from '../sections/Catalog';
import About from '../sections/About';
import Services from '../sections/Services';
import Contact from '../sections/Contact';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Benefits />
      <Catalog />
      <About />
      <Services />
      <Contact />
    </main>
  );
}
