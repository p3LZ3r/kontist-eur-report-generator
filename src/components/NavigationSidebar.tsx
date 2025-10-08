import React from 'react';
import { User, TrendingUp, TrendingDown, Calculator, FileText } from 'lucide-react';
import { Button } from './ui/button';
import type { NavigationSection } from '../types';

interface NavigationSidebarProps {
    sections: NavigationSection[];
    currentSection: string;
    onSectionChange: (sectionId: string) => void;
    currentSkr?: string;
    isKleinunternehmer?: boolean;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
    sections,
    currentSection,
    onSectionChange,
    currentSkr = 'SKR04',
    isKleinunternehmer = false
}) => {
    const getSectionIcon = (sectionId: string) => {
        switch (sectionId) {
            case 'general':
                return <FileText size={20} />;
            case 'advisor':
                return <User size={20} />;
            case 'income':
                return <TrendingUp size={20} />;
            case 'expenses':
                return <TrendingDown size={20} />;
            case 'profit':
                return <Calculator size={20} />;
            case 'reserves':
                return <FileText size={20} />;
            case 'withdrawals':
                return <FileText size={20} />;
            default:
                return <FileText size={20} />;
        }
    };

    const getSectionColor = (sectionId: string) => {
        switch (sectionId) {
            case 'general':
                return 'text-muted-foreground';
            case 'advisor':
                return 'text-muted-foreground';
            case 'income':
                return 'text-green-600';
            case 'expenses':
                return 'text-red-600';
            case 'profit':
                return 'text-primary';
            case 'reserves':
                return 'text-muted-foreground';
            case 'withdrawals':
                return 'text-muted-foreground';
            default:
                return 'text-muted-foreground';
        }
    };

return (
        <div className="w-full h-full flex flex-col">
                {/* Navigation Sections */}
                <div className="space-y-2 flex-1">
                    {sections.map((section) => (
                        <Button
                            key={section.id}
                            variant={currentSection === section.id ? 'default' : 'ghost'}
className={`w-full justify-start p-3 h-auto cursor-pointer ${currentSection === section.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/50 hover:bg-muted'
                                }`}
                            onClick={() => onSectionChange(section.id)}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className={`flex-shrink-0 ${getSectionColor(section.id)}`}>
                                    {getSectionIcon(section.id)}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-sm">{section.title}</div>
                                    <div className="text-xs opacity-75 mt-1 font-mono">
                                        {section.fields.length} Felder
                                    </div>
                                </div>
                            </div>
                        </Button>
                    ))}
                </div>

                {/* Sidebar footer with configuration info (subtle, two columns, bottom) */}
                <div className="mt-auto pt-4 grid grid-cols-2 gap-x-4 text-muted-foreground">
                    <div className="flex flex-col items-start">
                        <div className="text-[10px] uppercase tracking-wide">Kontenrahmen</div>
                        <div className="text-sm font-medium text-foreground leading-tight">{currentSkr}</div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-[10px] uppercase tracking-wide">Kleinunternehmer</div>
                        <div className="text-sm font-medium text-foreground leading-tight">{isKleinunternehmer ? 'Ja' : 'Nein'}</div>
                    </div>
                </div>
        </div>
    );
};

export default NavigationSidebar;