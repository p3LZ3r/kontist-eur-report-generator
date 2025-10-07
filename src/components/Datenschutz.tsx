import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';

interface DatenschutzProps {
    onBack: () => void;
}

const Datenschutz = ({ onBack }: DatenschutzProps) => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Button
                onClick={onBack}
                variant="ghost"
                className="mb-4"
            >
                <ArrowLeft className="mr-2" size={16} />
                Zurück zum Generator
            </Button>

            <Card>
                <CardHeader>
                    <h1 className="text-4xl mb-2">Datenschutzerklärung</h1>
                    <p className="text-muted-foreground">Informationen zur Datenverarbeitung gemäß DSGVO</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-2xl mb-3">1. Datenschutz auf einen Blick</h2>

                        <h3 className="text-xl mb-2 mt-4">Allgemeine Hinweise</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
                            passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
                            persönlich identifiziert werden können.
                        </p>

                        <h3 className="text-xl mb-2 mt-4">Datenerfassung auf dieser Website</h3>
                        <h4 className="text-lg mb-2 mt-3">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
                        <p className="text-muted-foreground leading-relaxed">
                            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten
                            können Sie dem Impressum dieser Website entnehmen.
                        </p>

                        <h4 className="text-lg mb-2 mt-3">Wie erfassen wir Ihre Daten?</h4>
                        <p className="text-muted-foreground leading-relaxed">
                            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um
                            Daten handeln, die Sie in ein Kontaktformular eingeben.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere
                            IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder
                            Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
                        </p>

                        <h4 className="text-lg mb-2 mt-3">Wofür nutzen wir Ihre Daten?</h4>
                        <p className="text-muted-foreground leading-relaxed">
                            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten.
                            Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                        </p>

                        <h4 className="text-lg mb-2 mt-3">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
                        <p className="text-muted-foreground leading-relaxed">
                            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
                            gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder
                            Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben,
                            können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter
                            bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl mb-3">2. Hosting</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden,
                            werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen,
                            Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten,
                            die über eine Website generiert werden, handeln.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und
                            bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und
                            effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1
                            lit. f DSGVO).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl mb-3">3. Allgemeine Hinweise und Pflichtinformationen</h2>

                        <h3 className="text-xl mb-2 mt-4">Datenschutz</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre
                            personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie
                            dieser Datenschutzerklärung.
                        </p>

                        <h3 className="text-xl mb-2 mt-4">Hinweis zur verantwortlichen Stelle</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                        </p>
                        <address className="not-italic text-muted-foreground leading-relaxed mt-3">
                            Torsten Linnecke<br />
                            [Ihre Adresse]<br />
                            [PLZ] [Stadt]<br />
                            E-Mail: [Ihre E-Mail]
                        </address>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen
                            über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.)
                            entscheidet.
                        </p>

                        <h3 className="text-xl mb-2 mt-4">Speicherdauer</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben
                            Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein
                            berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen,
                            werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung
                            Ihrer personenbezogenen Daten haben.
                        </p>

                        <h3 className="text-xl mb-2 mt-4">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können
                            eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf
                            erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                        </p>

                        <h3 className="text-xl mb-2 mt-4">Recht auf Datenübertragbarkeit</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags
                            automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format
                            aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen
                            verlangen, erfolgt dies nur, soweit es technisch machbar ist.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl mb-3">4. Datenerfassung auf dieser Website</h2>

                        <h3 className="text-xl mb-2 mt-4">Server-Log-Dateien</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien,
                            die Ihr Browser automatisch an uns übermittelt. Dies sind:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-3">
                            <li>Browsertyp und Browserversion</li>
                            <li>verwendetes Betriebssystem</li>
                            <li>Referrer URL</li>
                            <li>Hostname des zugreifenden Rechners</li>
                            <li>Uhrzeit der Serveranfrage</li>
                            <li>IP-Adresse</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat
                            ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website –
                            hierzu müssen die Server-Log-Files erfasst werden.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl mb-3">5. Analytics und Tracking</h2>

                        <h3 className="text-xl mb-2 mt-4">Umami Analytics</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Diese Website nutzt Umami Analytics, einen datenschutzfreundlichen Webanalyse-Dienst. Umami Analytics
                            verwendet keine Cookies und sammelt keine personenbezogenen Daten. Die erfassten Daten werden ausschließlich
                            in aggregierter Form gespeichert und können nicht zur Identifikation einzelner Nutzer verwendet werden.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Folgende Informationen werden erfasst:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-3">
                            <li>Seitenaufrufe und -besuche</li>
                            <li>Referrer (woher der Besucher kam)</li>
                            <li>Gerätetyp (Desktop, Mobile, Tablet)</li>
                            <li>Browsertyp</li>
                            <li>Betriebssystem</li>
                            <li>Land (basierend auf IP-Adresse, aber IP wird nicht gespeichert)</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Die Nutzung von Umami erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein
                            berechtigtes Interesse an der Analyse des Nutzerverhaltens, um sein Webangebot zu optimieren.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl mb-3">6. Lokale Datenverarbeitung</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong>Wichtig:</strong> Der EÜR Generator verarbeitet alle hochgeladenen CSV-Dateien ausschließlich lokal
                            in Ihrem Browser. Es werden keine Transaktionsdaten, Bankdaten oder persönliche Finanzinformationen an
                            unsere Server übertragen oder gespeichert.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Die gesamte Berechnung und Kategorisierung Ihrer Transaktionen erfolgt clientseitig in Ihrem Browser.
                            Ihre sensiblen Finanzdaten verlassen niemals Ihr Gerät und werden nirgendwo hochgeladen oder gespeichert.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl mb-3">7. Ihre Rechte</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Sie haben folgende Rechte:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
                            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                            <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
                            <li>Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
                        </ul>
                    </section>

                    <section className="pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                            Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })}<br />
                            Quelle: Erstellt mit Hilfe von eRecht24
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
};

export default Datenschutz;
