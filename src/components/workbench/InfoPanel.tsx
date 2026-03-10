"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePanel } from "./panel-context";
import { motion } from "motion/react";

interface InfoPanelProps {
    children: React.ReactNode;
    className?: string;
}

export function InfoPanel({
    children,
    className,
}: InfoPanelProps) {
    const { isMaximized } = usePanel();

    return (
        <motion.div
            data-maximized={isMaximized}
            className={cn(
                "bg-background flex h-[calc(100vh-80px)] flex-col px-6",
                "z-0 overflow-hidden",
                className
            )}
            initial={false}
            animate={{
                flexBasis: isMaximized ? "0%" : "50%",
                opacity: isMaximized ? 0 : 1
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1
            }}
            style={{
                minWidth: 0,
                flexShrink: 0,
                flexGrow: 0,
                pointerEvents: isMaximized ? "none" : "auto"
            }}
        >
            <div className="relative h-full w-full overflow-y-auto pt-6 pb-24 no-scrollbar scroll-smooth">
                {children}
            </div>
        </motion.div>
    );
}
