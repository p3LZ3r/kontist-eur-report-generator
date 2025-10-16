import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface ImpressumProps {
  onBack: () => void;
}

const Impressum = ({ onBack }: ImpressumProps) => (
  <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex justify-start">
      <Button className="mb-4 cursor-pointer" onClick={onBack} variant="ghost">
        <ArrowLeft className="mr-2" size={16} />
        Zurück zum Generator
      </Button>
    </div>

    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-left text-4xl">Impressum</h1>
        <p className="text-left text-muted-foreground">Angaben gemäß § 5 TMG</p>
      </div>
      <div className="space-y-6 text-left">
        <section>
          <h2 className="mb-3 text-2xl">Betreiber</h2>
          <address className="text-muted-foreground not-italic leading-relaxed">
            Torsten Linnecke
            <br />
            Sudenburger Str. 23
            <br />
            39112 Magdeburg
            <br />
            Deutschland
          </address>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Kontakt</h2>
          <div className="space-y-1 text-muted-foreground">
            <p>E-Mail: me@torsten-linnecke.de</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Umsatzsteuer-ID</h2>
          <p className="text-muted-foreground">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            <br />
            DE312197667
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Verantwortlich für den Inhalt</h2>
          <p className="text-muted-foreground">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
            <br />
            Torsten Linnecke
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Verbraucherstreitbeilegung</h2>
          <p className="text-muted-foreground leading-relaxed">
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Haftung für Inhalte</h2>
          <p className="text-muted-foreground leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
            Inhalte umgehend entfernen.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Haftung für Links</h2>
          <p className="text-muted-foreground leading-relaxed">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich. Die verlinkten Seiten wurden zum
            Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
            erkennbar.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
            jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
            derartige Links umgehend entfernen.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Urheberrecht</h2>
          <p className="text-muted-foreground leading-relaxed">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht
            kommerziellen Gebrauch gestattet.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
            werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
            trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
            wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </section>

        <section className="border-border border-t pt-6">
          <p className="text-muted-foreground text-xs">
            Stand:{" "}
            {new Date().toLocaleDateString("de-DE", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Impressum;
