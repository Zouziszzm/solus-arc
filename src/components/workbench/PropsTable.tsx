"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { ComponentProp } from "@/../registry/types";

interface PropsTableProps {
    props: ComponentProp[];
    className?: string;
}

export function PropsTable({ props, className }: PropsTableProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    if (!props || props.length === 0) return null;

    const filteredProps = props.filter(p => p.name !== "tickCount");
    const visibleProps = isExpanded ? filteredProps : filteredProps.slice(0, 10);
    const hasMore = filteredProps.length > 10;

    return (
        <div className={cn("my-8 overflow-hidden border-t border-border/40 pt-8", className)}>
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                    Available Props
                </h3>
                {hasMore && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {isExpanded ? "Show Less" : `Show All (${filteredProps.length})`}
                    </button>
                )}
            </div>
            <div className="relative group/table">
                <div className={cn(
                    "overflow-x-auto transition-all duration-500 ease-in-out",
                    !isExpanded && hasMore ? "max-h-[400px]" : "max-h-[none]"
                )}>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-border/40">
                                <th className="text-left py-3 px-2 font-medium text-muted-foreground text-[10px] uppercase tracking-wider">
                                    Prop
                                </th>
                                <th className="text-left py-3 px-2 font-medium text-muted-foreground text-[10px] uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="text-left py-3 px-2 font-medium text-muted-foreground text-[10px] uppercase tracking-wider">
                                    Default
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProps.map((prop, idx) => (
                                <tr 
                                    key={prop.name} 
                                    className={cn(
                                        "border-b border-border/10 last:border-0 group hover:bg-muted/5 transition-colors",
                                        !isExpanded && idx >= 10 && "hidden"
                                    )}
                                >
                                    <td className="py-4 px-2 align-top">
                                        <code className="text-[12px] font-mono font-medium text-foreground/80">
                                            {prop.name}
                                        </code>
                                    </td>
                                    <td className="py-4 px-2 align-top text-[13px] text-muted-foreground leading-relaxed">
                                        {prop.description || "-"}
                                    </td>
                                    <td className="py-4 px-2 align-top text-[12px] font-mono text-muted-foreground/60 whitespace-nowrap">
                                        {prop.default !== undefined ? String(prop.default) : "required"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!isExpanded && hasMore && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
                )}
            </div>
        </div>
    );
}
