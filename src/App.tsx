import EuerGenerator from './components/EuerGenerator';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus-ring cursor-pointer"
      >
        Zum Hauptinhalt springen
      </a>
      <main id="main-content" className="container mx-auto px-4 py-8 max-w-7xl">
        <EuerGenerator />
      </main>
    </div>
  );
}

export default App;
