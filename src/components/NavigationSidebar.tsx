import React from 'react';
import { User, TrendingUp, TrendingDown, Calculator, FileText } from 'lucide-react';
import { Button } from './ui/button';
import type { NavigationSection } from '../types';

interface NavigationSidebarProps {
    sections: NavigationSection[];
    currentSection: string;
    onSectionChange: (sectionId: string) => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
    sections,
    currentSection,
    onSectionChange
}) => {
    const getSectionIcon = (sectionId: string) => {
        switch (sectionId) {
            case 'personal':
                return <User size={20} />;
            case 'income':
                return <TrendingUp size={20} />;
            case 'expenses':
                return <TrendingDown size={20} />;
            case 'totals':
                return <Calculator size={20} />;
            default:
                return <FileText size={20} />;
        }
    };

    const getSectionColor = (sectionId: string) => {
        switch (sectionId) {
            case 'personal':
                return 'text-muted-foreground';
            case 'income':
                return 'text-success';
            case 'expenses':
                return 'text-muted-foreground';
            case 'totals':
                return 'text-primary';
            default:
                return 'text-muted-foreground';
        }
    };

    return (
        <div className="w-full h-fit">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="text-primary" size={14} />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">ELSTER Navigation</h2>
                </div>


                {/* Navigation Sections */}
                <div className="space-y-2">
                    {sections.map((section) => (
                        <Button
                            key={section.id}
                            variant={currentSection === section.id ? 'default' : 'ghost'}
                            className={`w-full justify-start p-3 h-auto ${currentSection === section.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
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

        </div>
    );
};

export default NavigationSidebar;