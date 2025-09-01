import React from 'react';
import { X, Book, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    section?: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, section }) => {
    if (!isOpen) return null;

    const getSectionHelp = (sectionId?: string) => {
        switch (sectionId) {
            case 'personal':
                return {
                    title: 'Persönliche Daten',
                    icon: <Book size={24} className="text-blue-600" />,
                    content: [
                        {
                            title: 'Was sind persönliche Daten?',
                            text: 'Die persönlichen Daten umfassen alle Informationen, die Sie als Steuerpflichtige*r identifizieren und für die Steuererklärung benötigt werden.',
                            type: 'info'
                        },
                        {
                            title: 'Automatische Ausfüllung',
                            text: 'Diese Felder werden automatisch aus Ihren eingegebenen Steuerdaten ausgefüllt. Überprüfen Sie die Werte auf Richtigkeit.',
                            type: 'success'
                        },
                        {
                            title: 'Pflichtfelder',
                            text: 'Felder mit rotem Stern (*) müssen ausgefüllt werden. Ohne diese Angaben kann die Steuererklärung nicht eingereicht werden.',
                            type: 'warning'
                        }
                    ],
                    examples: [
                        'Name und Vorname aus Ihrem Personalausweis',
                        'Vollständige Adresse Ihres Hauptwohnsitzes',
                        'Steuernummer aus Ihrem Steuerbescheid',
                        'Wirtschaftsjahr aus Ihrer Buchführung'
                    ]
                };
            case 'income':
                return {
                    title: 'Einnahmen',
                    icon: <CheckCircle size={24} className="text-green-600" />,
                    content: [
                        {
                            title: 'Einnahmen-Kategorien',
                            text: 'Alle betrieblichen Einnahmen werden nach ELSTER-Feldnummern gruppiert und automatisch aus Ihren Transaktionen berechnet.',
                            type: 'info'
                        },
                        {
                            title: 'Umsatzerlöse (Feld 17)',
                            text: 'Dies ist das wichtigste Einnahmenfeld. Es enthält alle steuerpflichtigen Erlöse aus Ihrer Geschäftstätigkeit.',
                            type: 'success'
                        }
                    ],
                    examples: [
                        'Verkauf von Waren und Dienstleistungen',
                        'Erlöse aus EU-Lieferungen (Feld 19)',
                        'Sonstige betriebliche Erträge (Feld 18)'
                    ]
                };
            case 'expenses':
                return {
                    title: 'Ausgaben',
                    icon: <AlertTriangle size={24} className="text-red-600" />,
                    content: [
                        {
                            title: 'Betriebsausgaben',
                            text: 'Alle abzugsfähigen Ausgaben werden nach Kategorien geordnet. Diese können Ihre Steuerlast reduzieren.',
                            type: 'info'
                        },
                        {
                            title: 'Wareneinkauf (Feld 25)',
                            text: 'Dies ist das wichtigste Ausgabenfeld. Es enthält alle Einkäufe von Waren und Dienstleistungen.',
                            type: 'warning'
                        }
                    ],
                    examples: [
                        'Einkauf von Waren und Rohstoffen',
                        'Betriebskosten (Miete, Strom, etc.)',
                        'Fahrzeugkosten und Reisekosten',
                        'Werbe- und Marketingausgaben'
                    ]
                };
            case 'totals':
                return {
                    title: 'Zusammenfassung',
                    icon: <Lightbulb size={24} className="text-purple-600" />,
                    content: [
                        {
                            title: 'Automatische Berechnung',
                            text: 'Die Gesamtbeträge werden automatisch aus Ihren Einnahmen und Ausgaben berechnet.',
                            type: 'success'
                        },
                        {
                            title: 'Steuerpflichtiger Gewinn',
                            text: 'Dieser Wert bildet die Grundlage für Ihre Steuerberechnung.',
                            type: 'info'
                        }
                    ],
                    examples: [
                        'Gesamtbetrag der Einkünfte (Feld 52)',
                        'Zu versteuerndes Einkommen (Feld 54)',
                        'Umsatzsteuer-Saldo'
                    ]
                };
            default:
                return {
                    title: 'ELSTER EÜR Hilfe',
                    icon: <Info size={24} className="text-primary" />,
                    content: [
                        {
                            title: 'Navigation',
                            text: 'Verwenden Sie die Seitenleiste, um zwischen verschiedenen Abschnitten zu navigieren. Jeder Abschnitt enthält spezifische Felder für Ihre Steuererklärung.',
                            type: 'info'
                        },
                        {
                            title: 'Farbkodierung',
                            text: 'Felder haben unterschiedliche Farben: Grün = automatisch ausgefüllt, Blau = berechnet, Rot = Pflichtfeld, Grau = manuell.',
                            type: 'info'
                        },
                        {
                            title: 'Details anzeigen',
                            text: 'Klicken Sie auf ein Feld, um detaillierte Informationen und die zugrunde liegenden Transaktionen zu sehen.',
                            type: 'success'
                        }
                    ],
                    examples: [
                        'Überprüfen Sie alle automatisch ausgefüllten Felder',
                        'Kategorisieren Sie Ihre Transaktionen korrekt',
                        'Vergleichen Sie die berechneten Beträge mit Ihren Unterlagen',
                        'Nutzen Sie die Hilfe-Funktion bei Unsicherheiten'
                    ]
                };
        }
    };

    const helpData = getSectionHelp(section);

    const getContentIcon = (type: string) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle size={20} className="text-orange-600" />;
            case 'success':
                return <CheckCircle size={20} className="text-green-600" />;
            case 'info':
            default:
                return <Info size={20} className="text-blue-600" />;
        }
    };

    const getContentStyle = (type: string) => {
        switch (type) {
            case 'warning':
                return 'bg-orange-50 border-orange-200';
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden p-6">
                <div className="flex items-center justify-between border-b">
                    <div className="flex items-center gap-3">
                        {helpData.icon}
                        <h2 className="text-2xl font-semibold">{helpData.title}</h2>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-6">
                        {helpData.content.map((item, index) => (
                            <Card key={index} className={`border ${getContentStyle(item.type)}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        {getContentIcon(item.type)}
                                        <div className="flex-1">
                                            <h3 className="font-medium mb-2">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">{item.text}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {helpData.examples.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Praktische Beispiele</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {helpData.examples.map((example, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Badge variant="outline" className="mt-1">
                                                    {index + 1}
                                                </Badge>
                                                <span className="text-sm">{example}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Lightbulb size={20} className="text-primary mt-1" />
                                    <div>
                                        <h3 className="font-medium text-primary mb-2">💡 Tipp</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Bei Unsicherheiten über ein Feld klicken Sie einfach darauf, um detaillierte Informationen
                                            und die zugrunde liegenden Transaktionen zu sehen. Alle automatisch berechneten Werte
                                            können Sie mit Ihren eigenen Unterlagen vergleichen.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;