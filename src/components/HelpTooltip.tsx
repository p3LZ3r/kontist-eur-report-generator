import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from './ui/button';

interface HelpTooltipProps {
    title: string;
    content: string;
    examples?: string[];
    position?: 'top' | 'bottom' | 'left' | 'right';
    children?: React.ReactNode;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
    title,
    content,
    examples = [],
    position = 'top',
    children
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
            case 'bottom':
                return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
            case 'left':
                return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
            case 'right':
                return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
            default:
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
        }
    };

    return (
        <div className="relative inline-block">
            <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto hover:bg-muted"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
                aria-label="Hilfe anzeigen"
            >
                {children || <HelpCircle size={14} className="text-muted-foreground" />}
            </Button>

            {isVisible && (
                <div className={`absolute z-50 ${getPositionClasses()}`}>
                    <div className="bg-white border border-border rounded-lg p-5 w-96">
                        <h4 className="text-left mb-3">{title}</h4>

                        <p className="text-sm text-muted-foreground mb-3 text-left leading-relaxed">{content}</p>

                        {examples.length > 0 && (
                            <div className="text-left">
                                <h5 className="font-medium text-sm mb-2">Beispiele:</h5>
                                <ul className="text-sm text-muted-foreground space-y-2">
                                    {examples.map((example, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-primary mt-1 flex-shrink-0">•</span>
                                            <span className="leading-relaxed">{example}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Arrow */}
                        <div className={`absolute w-2 h-2 bg-white border-${position === 'top' ? 'b' : position === 'bottom' ? 't' : position === 'left' ? 'r' : 'l'} border-${position === 'top' ? 'b' : position === 'bottom' ? 't' : position === 'left' ? 'r' : 'l'}-border transform rotate-45 ${position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 -mt-1' :
                            position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1' :
                                position === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 -ml-1' :
                                    'right-full top-1/2 transform -translate-y-1/2 -mr-1'
                            }`} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpTooltip;