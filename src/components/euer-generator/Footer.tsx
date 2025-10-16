import { Github } from "lucide-react";
import { memo } from "react";

interface FooterProps {
  onImpressumClick: () => void;
  onDatenschutzClick: () => void;
}

/**
 * Footer displays legal links (Impressum, Datenschutz) and GitHub link.
 *
 * @param props.onImpressumClick - Handler for Impressum link click
 * @param props.onDatenschutzClick - Handler for Datenschutz link click
 */
export const Footer = memo(
  ({ onImpressumClick, onDatenschutzClick }: FooterProps) => (
    <footer className="mt-12 border-border border-t pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground text-sm">
        <div className="flex gap-4">
          <button
            className="cursor-pointer underline-offset-4 transition-colors hover:text-foreground hover:underline"
            onClick={onImpressumClick}
            type="button"
          >
            Impressum
          </button>
          <button
            className="cursor-pointer underline-offset-4 transition-colors hover:text-foreground hover:underline"
            onClick={onDatenschutzClick}
            type="button"
          >
            Datenschutz
          </button>
        </div>
        <a
          className="inline-flex items-center gap-1 underline-offset-4 transition-colors hover:text-foreground hover:underline"
          href="https://github.com/torstendngh/kontist-eur-report-generator"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Github size={14} />
          GitHub
        </a>
        <span className="text-xs">
          © {new Date().getFullYear()} Torsten Linnecke
        </span>
      </div>
    </footer>
  )
);

Footer.displayName = "Footer";
