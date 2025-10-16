import { HelpCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";

interface HelpTooltipProps {
  title: string;
  content: string;
  examples?: string[];
  position?: "top" | "bottom" | "left" | "right";
  children?: React.ReactNode;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  title,
  content,
  examples = [],
  position = "top",
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        aria-label="Hilfe anzeigen"
        className="h-auto p-1 hover:bg-muted"
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        size="sm"
        variant="ghost"
      >
        {children || <HelpCircle className="text-muted-foreground" size={14} />}
      </Button>

      {isVisible && (
        <div className={`absolute z-50 ${getPositionClasses()}`}>
          <div className="w-96 rounded-lg border border-border bg-white p-5">
            <h4 className="mb-3 text-left">{title}</h4>

            <p className="mb-3 text-left text-muted-foreground text-sm leading-relaxed">
              {content}
            </p>

            {examples.length > 0 && (
              <div className="text-left">
                <h5 className="mb-2 font-medium text-sm">Beispiele:</h5>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {examples.map((example, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <span className="mt-1 flex-shrink-0 text-primary">•</span>
                      <span className="leading-relaxed">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Arrow */}
            <div
              className={`absolute h-2 w-2 bg-white border-${position === "top" ? "b" : position === "bottom" ? "t" : position === "left" ? "r" : "l"} border-${position === "top" ? "b" : position === "bottom" ? "t" : position === "left" ? "r" : "l"}-border rotate-45 transform ${
                position === "top"
                  ? "-translate-x-1/2 -mt-1 top-full left-1/2 transform"
                  : position === "bottom"
                    ? "-translate-x-1/2 -mb-1 bottom-full left-1/2 transform"
                    : position === "left"
                      ? "-translate-y-1/2 -ml-1 top-1/2 left-full transform"
                      : "-translate-y-1/2 -mr-1 top-1/2 right-full transform"
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
