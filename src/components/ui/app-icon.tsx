import { memo } from "react";
import { cn } from "@/lib/utils";

interface AppIconProps {
  /**
   * Size variant for the icon
   * @default "lg"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show the floating animation
   * @default true
   */
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
} as const;

/**
 * AppIcon - Modern iOS 26-style app icon with glassmorphism effect
 *
 * Features:
 * - Rounded corners with iOS-style shape
 * - Glassmorphism with backdrop blur
 * - Subtle gradient overlay
 * - Soft shadows for depth
 * - Optional floating animation
 */
export const AppIcon = memo(
  ({ size = "lg", className, animate = true }: AppIconProps) => (
    <div
      className={cn(
        "relative",
        animate && "animate-float",
        sizeClasses[size],
        className
      )}
    >
      {/* iOS-style app icon container */}
      <div
        className={cn(
          // Base styles - iOS 26 rounded corners (22.5% of size)
          "relative overflow-hidden rounded-[22.5%]",
          "h-full w-full",
          // Light glassmorphism background
          "bg-gradient-to-br from-white via-blue-50/40 to-blue-100/60",
          "backdrop-blur-xl",
          // Shadows for depth (iOS-style layered shadows)
          "shadow-[0_2px_8px_rgba(0,0,0,0.12),0_8px_24px_rgba(37,99,235,0.24)]"
        )}
      >
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-500/10" />

        {/* Light reflection (top-left) */}
        <div className="-top-1/4 -left-1/4 absolute h-3/4 w-3/4 rounded-full bg-white/30 blur-2xl" />

        {/* Logo container */}
        <div className="relative flex h-full w-full items-center justify-center p-[15%]">
          <img
            alt="EÜR Generator"
            className="h-full w-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            src="/EUR-Generator-Logo.svg"
          />
        </div>
      </div>
    </div>
  )
);

AppIcon.displayName = "AppIcon";
