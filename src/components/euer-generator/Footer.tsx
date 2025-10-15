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
	({ onImpressumClick, onDatenschutzClick }: FooterProps) => {
		return (
			<footer className="mt-12 pt-8 border-t border-border">
				<div className="flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">
					<div className="flex gap-4">
						<button
							type="button"
							onClick={onImpressumClick}
							className="hover:text-foreground transition-colors underline-offset-4 hover:underline cursor-pointer"
						>
							Impressum
						</button>
						<button
							type="button"
							onClick={onDatenschutzClick}
							className="hover:text-foreground transition-colors underline-offset-4 hover:underline cursor-pointer"
						>
							Datenschutz
						</button>
					</div>
					<a
						href="https://github.com/torstendngh/kontist-eur-report-generator"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-foreground transition-colors underline-offset-4 hover:underline inline-flex items-center gap-1"
					>
						<Github size={14} />
						GitHub
					</a>
					<span className="text-xs">
						© {new Date().getFullYear()} Torsten Linnecke
					</span>
				</div>
			</footer>
		);
	},
);

Footer.displayName = "Footer";
