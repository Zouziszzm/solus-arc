"use client";

import React, { useState, useRef, useEffect } from "react";
import type { ComponentProp } from "@/../registry/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface ControlsTableProps {
    config: {
        props: ComponentProp[];
    };
    values: Record<string, any>;
    onChange: (name: string, value: any) => void;
    className?: string;
}

export function ControlsTable({ config, values, onChange, className }: ControlsTableProps) {
    const props = config.props;

    // Globally separate props by type to ensure grids form properly
    const switches = props.filter((p) => p.type === "switch");
    const sliders = props.filter((p) => p.type === "slider");
    const others = props.filter((p) => p.type !== "switch" && p.type !== "slider" && p.type !== "links");
    const linksProp = props.find((p) => p.type === "links");

    return (
        <div className={cn("w-full space-y-12", className)}>
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                    Component Controls
                </h3>
            </div>

            <div className="space-y-12 pb-20">
                {/* Links Editor */}
                {linksProp && (
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                            Navigation Links
                        </h4>
                        <LinkEditor
                            value={values[linksProp.name] || []}
                            onChange={(val) => onChange(linksProp.name, val)}
                        />
                    </div>
                )}

                {/* Toggles - 3 Columns */}
                {switches.length > 0 && (
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                            Toggles
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                            {switches.map((prop) => (
                                <ControlRow
                                    key={prop.name}
                                    prop={prop}
                                    value={values[prop.name]}
                                    onChange={onChange}
                                    layout="compact"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Adjustments - 2 Columns */}
                {sliders.length > 0 && (
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                            Adjustments
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {sliders.map((prop) => (
                                <ControlRow
                                    key={prop.name}
                                    prop={prop}
                                    value={values[prop.name]}
                                    onChange={onChange}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Configuration - 2 Columns */}
                {others.length > 0 && (
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                            Configuration
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {others.map((prop) => (
                                <ControlRow
                                    key={prop.name}
                                    prop={prop}
                                    value={values[prop.name]}
                                    onChange={onChange}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function LinkEditor({ value, onChange }: { value: any[]; onChange: (val: any[]) => void }) {
    const [newLabel, setNewLabel] = useState("");
    const [newAngle, setNewAngle] = useState(0);

    const addLink = () => {
        if (!newLabel) return;
        // Only one link per angle
        if (value.some(l => l.angle === newAngle)) return;

        onChange([...value, { label: newLabel, angle: newAngle, href: "#" }]);
        setNewLabel("");
    };

    const removeLink = (angle: number) => {
        onChange(value.filter(l => l.angle !== angle));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-[1fr_80px_auto] gap-3 items-end">
                <div className="space-y-2">
                    <label className="text-[11px] font-medium text-muted-foreground">Label</label>
                    <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="e.g. Home"
                        className="h-9 w-full rounded-md border border-border/40 bg-transparent px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-border transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-medium text-muted-foreground">Angle</label>
                    <input
                        type="number"
                        value={newAngle}
                        onChange={(e) => setNewAngle(Number(e.target.value))}
                        className="h-9 w-full rounded-md border border-border/40 bg-transparent px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-border transition-all"
                    />
                </div>
                <button
                    onClick={addLink}
                    className="h-9 w-9 flex items-center justify-center rounded-md bg-foreground text-background hover:bg-foreground/90 active:scale-95 transition-all mb-0.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {value.map((link) => (
                    <div
                        key={link.angle}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/20 text-[12px] group"
                    >
                        <span className="font-medium">{link.label}</span>
                        <span className="text-muted-foreground/60 font-mono text-[10px]">{link.angle}°</span>
                        <button
                            onClick={() => removeLink(link.angle)}
                            className="ml-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CustomSelect({ value, options, onChange }: { value: any, options: (string | number)[], onChange: (val: any) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-9 w-full items-center justify-between rounded-md border border-border/40 bg-transparent px-3 py-1 text-[13px] shadow-none transition-all hover:bg-muted/5",
                    isOpen ? "ring-1 ring-border border-border" : ""
                )}
            >
                <span className="truncate">{value}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn("text-muted-foreground/40 transition-transform duration-200", isOpen ? "rotate-180" : "")}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border border-border/40 bg-popover text-popover-foreground shadow-lg"
                    >
                        <div className="p-1">
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-[13px] outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                                        value === opt ? "bg-accent/50 text-accent-foreground font-medium" : "text-muted-foreground"
                                    )}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ControlRow({
    prop,
    value,
    onChange,
    layout = "default",
}: {
    prop: ComponentProp;
    value: any;
    onChange: (name: string, v: any) => void;
    layout?: "default" | "compact";
}) {
    const currentValue = value ?? prop.default;

    return (
        <div className={cn("flex flex-col gap-2.5 w-full")}>
            <div className="flex items-center justify-between w-full">
                <label className="text-[13px] font-medium text-foreground/80 leading-none">
                    {prop.label}
                </label>
                {layout === "default" && prop.type === "slider" && (
                    <span className="text-[10px] font-mono tabular-nums text-muted-foreground">
                        {currentValue}
                    </span>
                )}
            </div>

            <div className="flex items-center w-full">
                {renderControl(prop, currentValue, onChange)}
            </div>

            {prop.description && layout === "default" && (
                <p className="text-[11px] text-muted-foreground/60 leading-normal max-w-[90%]">
                    {prop.description}
                </p>
            )}
        </div>
    );
}

function renderControl(
    prop: ComponentProp,
    currentValue: any,
    onChange: (name: string, value: any) => void
) {
    switch (prop.type) {
        case "switch":
            return (
                <button
                    type="button"
                    onClick={() => onChange(prop.name, !currentValue)}
                    className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
                        currentValue ? "bg-foreground" : "bg-muted"
                    )}
                >
                    <span
                        className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                            currentValue ? "translate-x-4.5" : "translate-x-0.5"
                        )}
                    />
                </button>
            );

        case "slider":
            return (
                <input
                    type="range"
                    min={prop.min ?? 0}
                    max={prop.max ?? 100}
                    step={prop.step ?? 1}
                    value={currentValue}
                    onChange={(e) => onChange(prop.name, Number.parseFloat(e.target.value))}
                    className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-foreground hover:accent-foreground/80 transition-all"
                />
            );

        case "select":
            return (
                <CustomSelect
                    value={currentValue}
                    options={prop.options || []}
                    onChange={(val) => onChange(prop.name, val)}
                />
            );

        case "number":
            return (
                <input
                    type="number"
                    value={currentValue}
                    onChange={(e) => onChange(prop.name, Number.parseFloat(e.target.value))}
                    className="flex h-9 w-full rounded-md border border-border/40 bg-transparent px-3 py-1 text-[13px] shadow-none focus:outline-none focus:ring-1 focus:ring-border transition-all"
                />
            );

        case "color":
            return (
                <div className="flex w-full items-center gap-3">
                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded border border-border/40">
                        <input
                            type="color"
                            value={currentValue}
                            onChange={(e) => onChange(prop.name, e.target.value)}
                            className="absolute -inset-1 h-[150%] w-[150%] cursor-pointer border-none bg-transparent"
                        />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
                        {currentValue}
                    </span>
                </div>
            );

        case "input":
        default:
            return (
                <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => onChange(prop.name, e.target.value)}
                    className="flex h-9 w-full rounded-md border border-border/40 bg-transparent px-3 py-1 text-[13px] shadow-none focus:outline-none focus:ring-1 focus:ring-border transition-all"
                />
            );
    }
}
