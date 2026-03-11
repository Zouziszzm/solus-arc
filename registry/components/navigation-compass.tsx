"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  motion,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
  useMotionValue,
  useTransform,
} from "motion/react";

export interface CompassNavLink {
  /** Degrees (0 = top, clockwise) where the link sits on the rose */
  angle: number;
  label: string;
  href: string;
}

export interface CompassColors {
  active: string;
  idle: string;
  idleHover: string;
}

export type RoseStyle = "solid" | "lines" | "minimal" | "cross";

export interface NavigationCompassProps {
  links?: CompassNavLink[];
  /** Angle (degrees, 0=top, CW) of the "active zone" pointer. */
  activeZoneAngle: number;
  /** Half-width of the active zone cone in degrees. */
  activeZoneThreshold?: number;
  /** Rotation of the compass rose needle decoration in degrees. */
  roseRotation?: number;
  /** Number of tick marks around the rose. */
  tickCount?: number;
  /** SVG viewBox size in px (square). Component is always responsive. */
  size?: number;
  colors?: CompassColors;
  /** Custom active color (e.g. #f97316) for the active tick line */
  activeColor?: string;
  /** Which style of inner rose to display */
  roseStyle?: RoseStyle;
  /** Radius scale for the rose (default 0.9) */
  roseSize?: number;
  /** Radius scale for the outer numbers (default 0.45) */
  numberRadiusMultiplier?: number;
  /** Length of the active tick mark extension (default 25) */
  activeTickExtension?: number;
  /** Snap rotation to the nearest tick mark */
  snapToTick?: boolean;
  /** If true, the inner rose rotates to follow the user's cursor */
  magnetic?: boolean;
  /** Renders a draggable debug overlay with live rotation + active link info. */
  showDetails?: boolean;
  className?: string;
  /** Automatically rotate the inner rose so its highlighted arm points to the active zone */
  followActiveZone?: boolean;
  /** Should user pan rotate the outer Dial ring, or the inner Rose needle? (default "dial") */
  panElement?: "dial" | "rose";
  /** Angle of the rose arm to highlight, e.g. 0, 90, 180, 270. If null, none are highlighted. */
  highlightedPointerAngle?: number | null;
  /** Whether to show the secondary/minor arms of the compass rose */
  showMinorRoseArms?: boolean;
  /** Whether link labels are always visible or only show when active/hovered */
  linksVisibility?: "always" | "on-demand";
  /** Radius where links are placed: "outer" (default) or "numbers" (couples with degree labels) */
  linksRadius?: "outer" | "numbers";
  /** Font size for navigation links (default 16) */
  labelFontSize?: number;
  /** Positional radius multiplier for links (default 0.4762) */
  linksRadiusMultiplier?: number;
  /** Font size for degree labels (default 12) */
  degreeFontSize?: number;
}

/** Converts compass angle (0=top, CW) to SVG radians. */
function toAngleRad(angleDeg: number): number {
  return ((angleDeg - 90) * Math.PI) / 180;
}

interface Point {
  x: number;
  y: number;
}

function polarToCartesian(center: number, radius: number, angleDeg: number): Point {
  const rad = toAngleRad(angleDeg);
  return {
    x: Number((center + Math.cos(rad) * radius).toFixed(4)),
    y: Number((center + Math.sin(rad) * radius).toFixed(4)),
  };
}

/** Returns the shortest arc distance between two angles on a 360° circle. */
function angularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/** Hermite smoothstep: maps t ∈ [0,1] to a smooth S-curve. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Returns a 0–1 proximity value for a dial angle relative to the active zone.
 * Returns 0 when outside the threshold.
 */
function calcProximityProgress(
  dialAngle: number,
  totalRotation: number,
  activeZoneAngle: number,
  threshold: number
): number {
  const absolute = (dialAngle + totalRotation) % 360;
  const normalized = absolute >= 0 ? absolute : absolute + 360;
  const dist = angularDistance(normalized, activeZoneAngle);
  if (dist >= threshold) return 0;
  return smoothstep(1 - dist / threshold);
}

const PAN_SPRING = { stiffness: 180, damping: 28, mass: 1.4 } as const;
const LINK_SPRING = { stiffness: 400, damping: 30, mass: 0.6 } as const;

interface CompassRotation {
  panRotation: MotionValue<number>;
  magneticRotation: MotionValue<number>;
  magneticRingBias: MotionValue<number>;
  onWheel: (e: React.WheelEvent) => void;
  onPan: (containerRef: React.RefObject<HTMLDivElement | null>, info: { point: Point; delta: Point }) => void;
  onPanEnd: () => void;
}

function useCompassRotation(
  containerRef: React.RefObject<HTMLDivElement | null>,
  magnetic: boolean,
  baseRoseRotation: number,
  highlightedPointerAngle: number | null
): CompassRotation {
  const manualOffset = useMotionValue(0);
  const totalRotation = useSpring(manualOffset, PAN_SPRING);

  const prevAngle = React.useRef(baseRoseRotation);
  const mouseAngle = useMotionValue(baseRoseRotation);
  const magneticRotation = useSpring(mouseAngle, { stiffness: 100, damping: 20 });
  const magneticRingBias = useSpring(0, { stiffness: 100, damping: 20 });

  React.useEffect(() => {
    prevAngle.current = baseRoseRotation;
    mouseAngle.set(baseRoseRotation);
  }, [baseRoseRotation, mouseAngle]);

  React.useEffect(() => {
    if (!magnetic || !containerRef.current) {
      mouseAngle.set(baseRoseRotation);
      magneticRingBias.set(0);
      return;
    }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90;

      const armOffset = highlightedPointerAngle ?? 0;
      const targetRoseAngle = angle - armOffset;

      let roseDelta = targetRoseAngle - (prevAngle.current % 360);
      if (roseDelta > 180) roseDelta -= 360;
      if (roseDelta < -180) roseDelta += 360;

      prevAngle.current += roseDelta;
      mouseAngle.set(prevAngle.current);

      const dist = Math.min(Math.hypot(e.clientX - cx, e.clientY - cy) / 200, 1);
      magneticRingBias.set(angle * dist);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [magnetic, containerRef, mouseAngle, magneticRingBias, highlightedPointerAngle, baseRoseRotation]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      manualOffset.set(manualOffset.get() + (e.deltaY || e.deltaX) * 0.05);
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [containerRef, manualOffset]);

  function onPan(
    containerRef: React.RefObject<HTMLDivElement | null>,
    info: { point: Point; delta: Point }
  ) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const prevX = info.point.x - info.delta.x - window.scrollX;
    const prevY = info.point.y - info.delta.y - window.scrollY;
    const currX = info.point.x - window.scrollX;
    const currY = info.point.y - window.scrollY;

    const angle1 = Math.atan2(prevY - cy, prevX - cx);
    const angle2 = Math.atan2(currY - cy, currX - cx);

    let deltaAngle = angle2 - angle1;
    if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
    if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

    manualOffset.set(manualOffset.get() + deltaAngle * (180 / Math.PI));
  }

  function onPanEnd() {
    const velocity = totalRotation.getVelocity();
    if (Math.abs(velocity) > 10) {
      manualOffset.set(manualOffset.get() + velocity * 0.4);
    }
  }

  return {
    panRotation: totalRotation,
    magneticRotation,
    magneticRingBias,
    onPan,
    onPanEnd,
    onWheel: () => { },
  };
}

interface CompassRoseProps {
  center: number;
  rotation: MotionValue<number>;
  style: RoseStyle;
  scale?: number;
  activeColor?: string;
  highlightedPointerAngle?: number | null;
  showMinorRoseArms?: boolean;
}

function CompassRose({
  center,
  rotation,
  style,
  scale = 0.9,
  activeColor = "#f97316",
  highlightedPointerAngle = 0,
  showMinorRoseArms = true,
}: CompassRoseProps) {
  return (
    <g>
      <circle cx={center} cy={center} r="254" className="fill-transparent" />
      <circle cx={center} cy={center} r="250" className="fill-none stroke-foreground/20" strokeWidth="1" />
      <circle cx={center} cy={center} r="242" className="fill-none stroke-foreground/20" strokeWidth="2" />
      <circle cx={center} cy={center} r="230" className="fill-none stroke-foreground/10" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx={center} cy={center} r="80" className="fill-none stroke-foreground/10" strokeWidth="1" />

      <g transform={`translate(${center}, ${center})`}>
        <motion.g style={{ rotate: rotation, scale }}>
          <circle cx="0" cy="0" r="250" fill="transparent" className="pointer-events-none" />

          {style === "solid" && (
            <>
              <circle cx="0" cy="0" r="12" className="fill-none stroke-foreground/40" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" className="fill-foreground/60" />

              {showMinorRoseArms &&
                ([45, 135, 225, 315] as const).map((rot) => (
                  <g key={`minor-${rot}`} transform={`rotate(${rot})`}>
                    <polygon points="0,0 0,-130 -15,0" className="fill-none stroke-foreground/40" strokeWidth="1" />
                    <polygon points="0,0 0,-130 15,0" className="fill-none stroke-foreground/40" strokeWidth="1" />
                  </g>
                ))}

              {([0, 90, 180, 270] as const).map((rot) => {
                const isHighlight = highlightedPointerAngle === rot;
                return (
                  <g key={`major-${rot}`} transform={`rotate(${rot})`}>
                    <polygon
                      points="0,0 0,-215 -25,0"
                      className={isHighlight ? "fill-none" : "fill-none stroke-foreground/60"}
                      style={isHighlight ? { stroke: activeColor } : {}}
                      strokeWidth="1.5"
                    />
                    <polygon
                      points="0,0 0,-215 25,0"
                      className={isHighlight ? "fill-none" : "fill-none stroke-foreground/60"}
                      style={isHighlight ? { stroke: activeColor } : {}}
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </>
          )}

          {style === "lines" && (
            <>
              <circle cx="0" cy="0" r="8" className="fill-foreground/20" />
              {([0, 45, 90, 135, 180, 225, 270, 315] as const).map((rot) => {
                const isMajor = rot % 90 === 0;
                const isHighlight = highlightedPointerAngle === rot;
                return (
                  <line
                    key={`line-${rot}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={isMajor ? -215 : -140}
                    transform={`rotate(${rot})`}
                    stroke={isHighlight ? activeColor : "currentColor"}
                    strokeOpacity={isHighlight ? 1 : 0.4}
                    strokeWidth={isMajor ? 2 : 1}
                  />
                );
              })}
            </>
          )}

          {style === "minimal" && (
            <>
              <circle cx="0" cy="0" r="4" className="fill-foreground/40" />
              {([0, 90, 180, 270] as const).map((rot) => {
                const isHighlight = highlightedPointerAngle === rot;
                return (
                  <line
                    key={`min-${rot}`}
                    x1="0"
                    y1="-180"
                    x2="0"
                    y2="-220"
                    transform={`rotate(${rot})`}
                    stroke={isHighlight ? activeColor : "currentColor"}
                    strokeOpacity={isHighlight ? 1 : 0.6}
                    strokeWidth="2"
                  />
                );
              })}
            </>
          )}

          {style === "cross" && (
            <>
              <line x1="-220" y1="0" x2="220" y2="0" stroke="currentColor" strokeOpacity={0.1} strokeWidth="1" />
              <line x1="0" y1="-220" x2="0" y2="220" stroke="currentColor" strokeOpacity={0.1} strokeWidth="1" />
              {([0, 90, 180, 270] as const).map((rot) => {
                const isHighlight = highlightedPointerAngle === rot;
                return (
                  <g key={`cross-${rot}`} transform={`rotate(${rot})`}>
                    <path
                      d="M -10 0 L 0 -215 L 10 0"
                      fill="none"
                      stroke={isHighlight ? activeColor : "currentColor"}
                      strokeOpacity={isHighlight ? 1 : 0.4}
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </>
          )}

          {/* Default case handled by NavigationCompass if needed */}
        </motion.g>
      </g>
    </g>
  );
}

interface CompassTickProps {
  index: number;
  center: number;
  outerRadius: number;
  tickMajorRadius: number;
  tickMediumRadius: number;
  tickMinorRadius: number;
  tickCount: number;
  totalRotation: MotionValue<number>;
  activeZoneAngle: number;
  activeZoneThreshold: number;
  activeColor: string;
  activeTickExtension: number;
}

function CompassTick({
  index,
  center,
  outerRadius,
  tickMajorRadius,
  tickMediumRadius,
  tickMinorRadius,
  tickCount,
  totalRotation,
  activeZoneAngle,
  activeZoneThreshold,
  activeColor,
  activeTickExtension,
}: CompassTickProps) {
  const angleDeg = (index * 360) / tickCount;
  const angleRad = toAngleRad(angleDeg);

  const isMajor = angleDeg % 15 === 0;
  const isMedium = !isMajor && angleDeg % 5 === 0;
  const baseRadius = isMajor ? tickMajorRadius : isMedium ? tickMediumRadius : tickMinorRadius;

  const innerRadius = useTransform(totalRotation, (rotation) => {
    const progress = calcProximityProgress(angleDeg, rotation, activeZoneAngle, activeZoneThreshold);
    return baseRadius - progress * activeTickExtension;
  });

  const strokeColor = useTransform(totalRotation, (rotation) => {
    const absolute = (angleDeg + rotation) % 360;
    const normalized = absolute >= 0 ? absolute : absolute + 360;
    const dist = angularDistance(normalized, activeZoneAngle);
    if (dist <= 360 / tickCount / 2) return activeColor;
    return isMajor ? "rgba(100,100,100,0.4)" : "rgba(100,100,100,0.2)";
  });

  const x1 = useTransform(innerRadius, (r) => Number((center + Math.cos(angleRad) * r).toFixed(4)));
  const y1 = useTransform(innerRadius, (r) => Number((center + Math.sin(angleRad) * r).toFixed(4)));
  const { x: x2, y: y2 } = polarToCartesian(center, outerRadius, angleDeg);

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      style={{ stroke: strokeColor }}
      strokeWidth={isMajor ? 1.5 : 1}
    />
  );
}

interface CompassLinkItemProps {
  link: CompassNavLink;
  center: number;
  textRadius: number;
  totalRotation: MotionValue<number>;
  activeZoneAngle: number;
  activeZoneThreshold: number;
  colors: CompassColors;
  fontSize?: number;
  parentRotation: MotionValue<number>;
  visibility?: "always" | "on-demand";
}

function CompassLinkItem({
  link,
  center,
  textRadius,
  totalRotation,
  activeZoneAngle,
  activeZoneThreshold,
  colors,
  fontSize = 16,
  parentRotation,
  visibility = "always",
}: CompassLinkItemProps) {
  const { x: textX, y: textY } = polarToCartesian(center, textRadius, link.angle);
  const { x: hitX1, y: hitY1 } = polarToCartesian(center, 200, link.angle);
  const { x: hitX2, y: hitY2 } = polarToCartesian(center, 450, link.angle);

  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useMotionValueEvent(totalRotation, "change", (latest) => {
    const nextIsNear =
      calcProximityProgress(link.angle, latest, activeZoneAngle, activeZoneThreshold) > 0;
    if (nextIsNear !== isNear) setIsNear(nextIsNear);
  });

  const rawProgress = useTransform(totalRotation, (latest) =>
    calcProximityProgress(link.angle, latest, activeZoneAngle, activeZoneThreshold),
  );
  const springProgress = useSpring(rawProgress, LINK_SPRING);
  const scale = useTransform(springProgress, [0, 1], [1, 1.2]);

  const counterRotation = useTransform(parentRotation, (r) => -r);
  const opacity = useTransform(springProgress, (v) => {
    if (visibility === "always") return 1;
    return isHovered ? 1 : v;
  });

  return (
    <Link
      href={link.href}
      aria-label={`Navigate to ${link.label}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <line x1={hitX1} y1={hitY1} x2={hitX2} y2={hitY2} stroke="transparent" strokeWidth="40" style={{ cursor: "pointer" }} />
      <g transform={`translate(${textX}, ${textY})`}>
        <motion.g style={{ scale, rotate: counterRotation, opacity }}>
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className={cn(
              "cursor-pointer pointer-events-auto transition-colors duration-200",
              isNear ? colors.active : cn(colors.idle, colors.idleHover),
            )}
            style={{ fontFamily: "var(--font-inter)", fontSize: `${fontSize}px` }}
          >
            {link.label}
          </text>
        </motion.g>
      </g>
    </Link>
  );
}

function CompassDegreeLabels({
  center,
  numberRadius,
  links,
  fontSize = 12,
  totalRotation,
  activeZoneAngle,
  activeZoneThreshold,
  linksVisibility,
}: {
  center: number;
  numberRadius: number;
  links: CompassNavLink[];
  fontSize?: number;
  totalRotation: MotionValue<number>;
  activeZoneAngle: number;
  activeZoneThreshold: number;
  linksVisibility?: "always" | "on-demand";
}) {
  return (
    <>
      {Array.from({ length: 24 }, (_, i) => {
        const angle = i * 15;
        const link = links.find((l) => Math.abs(l.angle - angle) < 1);

        return (
          <DegreeLabel
            key={`num-${angle}`}
            angle={angle}
            center={center}
            numberRadius={numberRadius}
            fontSize={fontSize}
            hasLink={!!link}
            totalRotation={totalRotation}
            activeZoneAngle={activeZoneAngle}
            activeZoneThreshold={activeZoneThreshold}
            linksVisibility={linksVisibility}
          />
        );
      })}
    </>
  );
}

function DegreeLabel({
  angle,
  center,
  numberRadius,
  fontSize,
  hasLink,
  totalRotation,
  activeZoneAngle,
  activeZoneThreshold,
  linksVisibility,
}: {
  angle: number;
  center: number;
  numberRadius: number;
  fontSize: number;
  hasLink: boolean;
  totalRotation: MotionValue<number>;
  activeZoneAngle: number;
  activeZoneThreshold: number;
  linksVisibility?: "always" | "on-demand";
}) {
  const { x, y } = polarToCartesian(center, numberRadius, angle);

  const opacity = useTransform(totalRotation, (latest) => {
    if (!hasLink || linksVisibility !== "on-demand") {
      return hasLink ? 0 : 1;
    }
    const progress = calcProximityProgress(angle, latest, activeZoneAngle, activeZoneThreshold);
    return 1 - progress;
  });

  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g style={{ transform: `rotate(${angle}deg)`, opacity }}>
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground/40"
          style={{ fontFamily: "var(--font-doto)", fontSize: `${fontSize}px` }}
        >
          {angle}
        </text>
      </motion.g>
    </g>
  );
}

function CompassHUD({
  panRotation,
  roseRotation,
  activeAngle,
}: {
  panRotation: MotionValue<number>;
  roseRotation: MotionValue<number>;
  activeAngle: number;
}) {
  const [pan, setPan] = useState(0);
  const [rose, setRose] = useState(0);

  useMotionValueEvent(panRotation, "change", (v) => setPan(Math.round(v % 360)));
  useMotionValueEvent(roseRotation, "change", (v) => setRose(Math.round(v % 360)));

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="absolute top-4 left-4 z-50 p-4 rounded-2xl bg-background/80 backdrop-blur-md border border-border/40 font-mono text-[10px] space-y-2 min-w-[140px] pointer-events-auto shadow-xl cursor-move active:cursor-grabbing"
    >
      <div className="flex justify-between items-center text-muted-foreground/40 font-bold uppercase tracking-widest border-b border-border/20 pb-1 mb-2">
        <span>System HUD</span>
        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Pan Rot:</span>
        <span className="text-foreground font-bold">{pan}°</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Rose Rot:</span>
        <span className="text-foreground font-bold">{rose}°</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Active:</span>
        <span className="text-orange-500 font-bold">{activeAngle}°</span>
      </div>
    </motion.div>
  );
}

const DEFAULT_COLORS: CompassColors = {
  active: "fill-orange-300 dark:fill-orange-300",
  idle: "fill-foreground/50 font-medium",
  idleHover: "hover:fill-foreground/80",
};

export function NavigationCompass({
  links = [],
  activeZoneAngle = 0,
  activeZoneThreshold = 15,
  roseRotation = 45,
  tickCount = 180,
  size = 756,
  colors = DEFAULT_COLORS,
  activeColor = "#f97316",
  roseStyle = "solid",
  roseSize = 0.9,
  numberRadiusMultiplier = 0.45,
  activeTickExtension = 25,
  snapToTick = false,
  magnetic = false,
  showDetails = false,
  followActiveZone = false,
  panElement = "dial",
  highlightedPointerAngle = 0,
  showMinorRoseArms = true,
  linksVisibility = "always",
  linksRadius = "outer",
  labelFontSize = 16,
  linksRadiusMultiplier = 0.4762,
  degreeFontSize = 12,
  className,
}: Partial<NavigationCompassProps> & { className?: string }) {
  const center = size / 2;
  const outerRadius = Math.round(size * 0.4233);
  const tickMajorRadius = Math.round(size * 0.3836);
  const tickMediumRadius = Math.round(size * 0.3968);
  const tickMinorRadius = Math.round(size * 0.4101);
  const textRadius =
    linksRadius === "numbers"
      ? Math.round(size * numberRadiusMultiplier)
      : Math.round(size * linksRadiusMultiplier);
  const numberRadius = Math.round(size * numberRadiusMultiplier);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const rotation = useCompassRotation(containerRef, magnetic, roseRotation, highlightedPointerAngle);

  const snapAngle = 360 / tickCount;
  const snappedPanRotation = useTransform(rotation.panRotation, (r: number) => {
    return snapToTick ? Math.round(r / snapAngle) * snapAngle : r;
  });

  const dialRotation = useTransform([snappedPanRotation, rotation.magneticRingBias], ([pan]) => {
    if (magnetic) return 0;
    return panElement === "dial" ? (pan as number) : 0;
  });

  const roseRotationBase = useTransform([snappedPanRotation, rotation.magneticRotation], ([pan, mag]) => {
    if (magnetic) return mag as number;
    if (followActiveZone && panElement === "dial") {
      return activeZoneAngle - (highlightedPointerAngle ?? 0);
    }
    return panElement === "rose" ? (pan as number) : 0;
  });

  const snappedRoseRotation = useTransform(roseRotationBase, (r: number) => {
    return snapToTick ? Math.round(r / snapAngle) * snapAngle : r;
  });

  const proximityRotation = useTransform([dialRotation, snappedRoseRotation], ([dial, rose]) => {
    if (magnetic || panElement === "rose") {
      return (dial as number) - (rose as number) - (highlightedPointerAngle ?? 0) + activeZoneAngle;
    }
    return dial as number;
  });

  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      ref={containerRef}
      className={cn("relative pointer-events-auto touch-none select-none w-full max-w-[720px] aspect-square", className)}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="cursor-grab active:cursor-grabbing"
        style={{ overflow: "visible", touchAction: "none" }}
        aria-label="Navigation compass"
        role="navigation"
        onPan={(_e, info) => rotation.onPan(containerRef, info)}
        onPanEnd={rotation.onPanEnd}
      >
        <CompassRose
          center={center}
          rotation={snappedRoseRotation}
          style={roseStyle}
          scale={roseSize}
          activeColor={activeColor}
          highlightedPointerAngle={highlightedPointerAngle}
          showMinorRoseArms={showMinorRoseArms}
        />

        <motion.g
          style={{
            transformOrigin: "50% 50%",
            transformBox: "view-box",
            rotate: prefersReducedMotion ? 0 : dialRotation,
          }}
        >
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            className="stroke-foreground/20"
            strokeWidth="1"
            strokeDasharray="6 3"
          />

          {Array.from({ length: tickCount }, (_, i) => (
            <CompassTick
              key={i}
              index={i}
              center={center}
              outerRadius={outerRadius}
              tickMajorRadius={tickMajorRadius}
              tickMediumRadius={tickMediumRadius}
              tickMinorRadius={tickMinorRadius}
              tickCount={tickCount}
              totalRotation={proximityRotation}
              activeZoneAngle={activeZoneAngle}
              activeZoneThreshold={activeZoneThreshold}
              activeColor={activeColor}
              activeTickExtension={activeTickExtension}
            />
          ))}

          {links.map((link, idx) => (
            <CompassLinkItem
              key={`${link.label}-${idx}`}
              link={link}
              center={center}
              textRadius={textRadius}
              totalRotation={proximityRotation}
              activeZoneAngle={activeZoneAngle}
              activeZoneThreshold={activeZoneThreshold}
              colors={colors}
              fontSize={labelFontSize}
              parentRotation={dialRotation}
              visibility={linksVisibility}
            />
          ))}

          <CompassDegreeLabels
            center={center}
            numberRadius={numberRadius}
            links={links}
            fontSize={degreeFontSize}
            totalRotation={proximityRotation}
            activeZoneAngle={activeZoneAngle}
            activeZoneThreshold={activeZoneThreshold}
            linksVisibility={linksVisibility}
          />
        </motion.g>
      </motion.svg>

      {showDetails && (
        <CompassHUD
          panRotation={snappedPanRotation}
          roseRotation={snappedRoseRotation}
          activeAngle={activeZoneAngle}
        />
      )}
    </div>
  );
}
