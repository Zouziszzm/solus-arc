"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePanel } from "./panel-context";
import { motion, AnimatePresence } from "motion/react";

interface PreviewPanelProps {
    children: React.ReactNode;
    code?: string;
    className?: string;
}

export function PreviewPanel({
    children,
    code,
    className,
}: PreviewPanelProps) {
    const { isMaximized, toggleMaximize } = usePanel();
    const [previewKey, setPreviewKey] = React.useState(0);
    const [showCode, setShowCode] = React.useState(false);

    const handleRefresh = React.useCallback(() => {
        setPreviewKey((prev) => prev + 1);
    }, []);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "r") {
                handleRefresh();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleRefresh]);

    return (
        <motion.section
            data-maximized={isMaximized}
            className={cn(
                "relative z-10 flex h-[calc(100vh-80px)] items-center justify-center p-3 overflow-hidden bg-muted/5 animate-in fade-in duration-1000",
                className
            )}
            initial={false}
            animate={{
                flexBasis: isMaximized ? "100%" : "50%",
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
                mass: 1
            }}
            style={{
                minWidth: 0,
                flexShrink: 0,
                flexGrow: 0
            }}
        >
            {/* Action Bar */}
            <div className="absolute top-6 right-6 z-40 flex items-center gap-2 rounded-full border border-border/40 bg-background/80 p-1.5 backdrop-blur-md shadow-sm transition-all hover:bg-background">
                <button
                    onClick={handleRefresh}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
                    title="Refresh (R)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>
                </button>
                <button
                    onClick={toggleMaximize}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
                    title={isMaximized ? "Minimize" : "Expand"}
                >
                    {isMaximized ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                    )}
                </button>
                <div className="mx-1 h-4 w-px bg-border/40" />
                <button
                    onClick={() => setShowCode(!showCode)}
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95",
                        showCode ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title="View Code"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                </button>
            </div>

            <div className="relative w-full h-full flex items-center justify-center p-8">
                <AnimatePresence mode="wait" initial={false}>
                    {showCode && code ? (
                        <motion.div
                            key="code"
                            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full h-full overflow-hidden flex flex-col pt-16"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Component Usage</h3>
                                <button
                                    onClick={() => navigator.clipboard.writeText(code)}
                                    className="px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted text-[11px] font-medium transition-all active:scale-95"
                                >
                                    Copy Code
                                </button>
                            </div>
                            <pre className="flex-1 rounded-2xl bg-muted/20 border border-border/40 p-8 overflow-auto text-[13px] font-mono leading-relaxed no-scrollbar backdrop-blur-sm">
                                {code}
                            </pre>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`preview-${previewKey}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
