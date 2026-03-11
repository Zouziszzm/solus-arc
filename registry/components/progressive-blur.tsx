"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type BlurSide =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "vertical"
  | "horizontal"
  | "all";

export interface ProgressiveBlurProps {
  /** The side to apply the blur to. Defaults to "vertical" if children are present. */
  side?: BlurSide;
  /** Height/width of the blur area in pixels. Default: 100 */
  blurSize?: number;
  /** Maximum blur intensity in pixels. Default: 16 */
  maxBlur?: number;
  /** Number of layers to create the progression. Default: 8 */
  intensity?: number;
  /** If true, the blur overlays are positioned absolutely within the container. Default: true */
  inset?: boolean;
  /** Optional content to wrap. If provided, the blurs are applied top/bottom of this content by default. */
  children?: React.ReactNode;
  /** Max height of the scrollable area. Default: "400px" */
  maxHeight?: string;
  /** Enable debug mode to see blur area boundaries. Default: false */
  debug?: boolean;
  className?: string;
  contentClassName?: string;
}

const SIDE_STYLES: Record<Exclude<BlurSide, "vertical" | "horizontal" | "all">, string> = {
  top: "top-0 left-0 right-0",
  bottom: "bottom-0 left-0 right-0",
  left: "top-0 bottom-0 left-0",
  right: "top-0 bottom-0 right-0",
};

export function ProgressiveBlur({
  side = "vertical",
  blurSize = 100,
  maxBlur = 16,
  intensity = 8,
  inset = true,
  maxHeight = "400px",
  debug = false,
  children,
  className,
  contentClassName,
}: ProgressiveBlurProps) {
  const getSides = (): Exclude<BlurSide, "vertical" | "horizontal" | "all">[] => {
    if (side === "vertical") return ["top", "bottom"];
    if (side === "horizontal") return ["left", "right"];
    if (side === "all") return ["top", "bottom", "left", "right"];
    return [side];
  };

  const sides = getSides();

  const renderBlurOverlay = (s: Exclude<BlurSide, "vertical" | "horizontal" | "all">) => {
    const isVertical = s === "top" || s === "bottom";
    const dimension = isVertical ? "height" : "width";

    return (
      <div
        key={s}
        className={cn(
          "pointer-events-none z-10",
          inset ? "absolute" : "relative",
          SIDE_STYLES[s],
          debug && "outline outline-1 outline-red-500 bg-red-500/10"
        )}
        style={{ [dimension]: `${blurSize}px` }}
      >
        {Array.from({ length: intensity }).map((_, i) => {
          const step = i + 1;
          const blurValue = (maxBlur / intensity) * step;
          const opacity = (1 / intensity) * step;

          // Calculate mask percentage
          const start = (i / intensity) * 100;
          const end = ((i + 1) / intensity) * 100;

          let gradientDir = "to top";
          if (s === "bottom") gradientDir = "to bottom";
          if (s === "right") gradientDir = "to right";
          if (s === "left") gradientDir = "to left";

          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${blurValue}px)`,
                WebkitBackdropFilter: `blur(${blurValue}px)`,
                maskImage: `linear-gradient(${gradientDir}, transparent ${start}%, black ${end}%)`,
                WebkitMaskImage: `linear-gradient(${gradientDir}, transparent ${start}%, black ${end}%)`,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={cn("relative overflow-hidden w-full border border-border/40 rounded-xl bg-background", className)}
      style={{ height: maxHeight }}
    >
      <div className={cn("h-full overflow-y-auto relative z-0 p-6", contentClassName)}>
        {children || (
          <div className="space-y-6 text-muted-foreground/60">
            {Array.from({ length: 50 }).map((_, i) => (
              <p key={i}>
                Paragraph {i + 1}: Premium UI designs often use progressive blurs to create
                elegant transitions between content and navigation elements.
                By using multiple layers of backdrop-filter with different
                blur radii and mask gradients, we achieve a much smoother
                result than a single blur transition. This creates a sense of
                depth and focus, guiding the user's attention while maintaining
                a clean and modern aesthetic. The stacking of subtle blur
                layers mimics the natural focus of the human eye, providing a
                more organic and premium feel compared to traditional linear
                fades or hard edges.
              </p>
            ))}
          </div>
        )}
      </div>
      {sides.map(renderBlurOverlay)}
    </div>
  );
}
