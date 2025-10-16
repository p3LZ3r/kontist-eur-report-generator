import EuerGenerator from "./components/euer-generator/EuerGenerator";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <a
        className="focus-ring sr-only z-50 cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
        href="#main-content"
      >
        Zum Hauptinhalt springen
      </a>
      <main className="container mx-auto max-w-7xl px-4 py-8" id="main-content">
        <EuerGenerator />
      </main>
    </div>
  );
}

export default App;
