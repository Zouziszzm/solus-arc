"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { usePanel } from "./panel-context";
import { cn } from "@/lib/utils";

export function PanelToggle() {
    const { isMaximized, togglePanel } = usePanel();

    return (
        <button
            onClick={togglePanel}
            className={cn(
                "absolute bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all hover:bg-accent",
                isMaximized && "right-6"
            )}
            title={isMaximized ? "Show Controls" : "Maximize Preview"}
        >
            {isMaximized ? (
                <Minimize2 className="h-4 w-4 text-muted-foreground" />
            ) : (
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
            )}
        </button>
    );
}
