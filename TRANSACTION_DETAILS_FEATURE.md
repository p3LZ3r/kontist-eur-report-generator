# Aufklappbare Transaktionsdetails in der Elster-Übersicht

## Überblick

Diese Implementierung erweitert die Elster-Übersicht um aufklappbare Bereiche für berechnete Werte, die sich aus mehreren Banktransaktionen zusammensetzen. Benutzer können jetzt sehen, welche spezifischen Transaktionen für die Berechnung eines Elster-Felds verwendet wurden.

## Features

### 1. Visueller Indikator
- Felder mit verfügbaren Transaktionsdetails zeigen einen kleinen blauen Punkt neben dem Betrag
- Der Tooltip zeigt die Anzahl der verfügbaren Transaktionen

### 2. Aufklappbare Details
- Klickbarer Bereich unter jedem Feld mit verfügbaren Transaktionsdetails
- Animierte Chevron-Icons zeigen den Zustand (auf/zu) an
- Smooth Slide-Animation beim Öffnen/Schließen

### 3. Detailansicht
- **Zusammenfassung**: Anzahl der Transaktionen und Gesamtbetrag
- **Kategorien-Aufschlüsselung**: Wenn mehrere SKR-Kategorien zum Feld beitragen
- **Transaktions-Tabelle**: 
  - Datum, Gegenpartei, Betrag, Verwendungszweck
  - Scrollbare Ansicht bei vielen Transaktionen
  - Hover-Effekte für bessere Benutzererfahrung

## Technische Implementierung

### Erweiterte Datenstrukturen

#### EuerCalculation Interface
```typescript
interface EuerCalculation {
  // Bestehende Felder...
  
  // Neue Felder für Transaktionsdetails
  incomeTransactions: { [key: string]: Transaction[] };
  expenseTransactions: { [key: string]: Transaction[] };
  privateTransactionDetails: { [key: string]: Transaction[] };
}
```

#### ElsterFieldValue Interface
```typescript
interface ElsterFieldValue {
  // Bestehende Felder...
  
  // Neue Felder für Transaktionsdetails
  transactions?: Transaction[];
  categoryBreakdown?: { [category: string]: { amount: number; transactions: Transaction[] } };
}
```

### Neue Komponenten

#### TransactionDetails.tsx
- Hauptkomponente für die Anzeige der aufklappbaren Transaktionsdetails
- Features:
  - Toggle-Funktionalität mit animierten Icons
  - Kategorien-Aufschlüsselung
  - Responsive Transaktions-Tabelle
  - Accessibility-Features (ARIA-Labels)

### Erweiterte Komponenten

#### FieldGroups.tsx
- Erweitert um State-Management für aufgeklappte Felder
- Integration der TransactionDetails-Komponente
- Visueller Indikator für verfügbare Details

#### euerCalculations.ts
- Erweiterte `calculateEuer` Funktion sammelt Transaktionsdetails
- `populateElsterFieldsFromCalculation` verknüpft Transaktionen mit Elster-Feldern
- Intelligente Zuordnung basierend auf SKR-Kategorie-Mappings

## Benutzerführung

### Workflow
1. **Erkennung**: Benutzer sehen blaue Punkte bei Feldern mit Details
2. **Interaktion**: Klick auf den aufklappbaren Bereich unter dem Feld
3. **Details**: Anzeige aller relevanten Transaktionen mit Kontext
4. **Navigation**: Einfaches Auf-/Zuklappen mehrerer Felder parallel

### UX-Verbesserungen
- **Hover-Effekte**: Alle interaktiven Bereiche haben Hover-Feedback
- **Animationen**: Smooth Transitions für bessere Wahrnehmung
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Performance**: Nur sichtbare Details werden gerendert (Conditional Rendering)

## Anwendungsfälle

### Für Steuerberater
- Schnelle Überprüfung der Berechnungsgrundlage
- Nachvollziehbarkeit der automatischen Kategorisierung
- Identifikation von Fehlkategorisierungen

### Für Unternehmer
- Transparenz über die Zusammensetzung der Steuerfelder
- Verständnis der EÜR-Berechnung
- Überprüfung der Vollständigkeit der Daten

## Performance-Überlegungen

### Optimierungen
- **Lazy Loading**: Transaktionsdetails werden nur bei Bedarf angezeigt
- **Memoization**: React.useState für effiziente Re-Renders
- **Conditional Rendering**: Komponenten werden nur gerendert wenn notwendig

### Speicher-Effizienz
- Transaktionsdaten werden nur einmal im Speicher gehalten
- Referenzen statt Duplikate für bessere Performance
- Cleanup von nicht benötigten Details

## Erweiterungsmöglichkeiten

### Kurz- bis mittelfristig
- **Export-Funktionalität**: CSV-Export der Detail-Transaktionen
- **Filter-Optionen**: Filtern nach Datum, Betrag, Kategorie
- **Sortier-Funktionen**: Sortierung der Transaktions-Tabelle
- **Suchfunktion**: Suche in Transaktionsdetails

### Langfristig
- **Visual Analytics**: Diagramme und Graphiken für Transaktionsverteilungen
- **Batch-Operationen**: Mehrere Transaktionen gleichzeitig bearbeiten
- **Smart Suggestions**: KI-basierte Vorschläge für Kategorisierung
- **Audit Trail**: Verfolgung von Änderungen an Kategorisierungen

## Testing

### Zu testende Bereiche
- **Funktionalität**: Auf-/Zuklappen funktioniert korrekt
- **Datenintegrität**: Richtige Transaktionen werden angezeigt
- **Performance**: Keine Verzögerungen bei großen Datensätzen
- **Responsive Design**: Funktioniert auf verschiedenen Bildschirmgrößen
- **Accessibility**: Screen Reader Kompatibilität

### Test-Szenarien
- Verschiedene SKR-Standards (SKR03, SKR04, SKR49)
- Kleinunternehmer vs. reguläre Unternehmen
- Verschiedene Transaktionsvolumen (10, 100, 1000+ Transaktionen)
- Edge Cases (keine Transaktionen, eine Transaktion, gemischte Kategorien)

## Maintenance

### Code-Qualität
- TypeScript für Type-Safety
- Konsistente Naming-Conventions
- Kommentierte komplexe Logik
- Modulare Komponentenarchitektur

### Update-Pfad
- Rückwärtskompatibilität gewährleistet
- Schrittweise Migration möglich
- Fallback für ältere Datenstrukturen