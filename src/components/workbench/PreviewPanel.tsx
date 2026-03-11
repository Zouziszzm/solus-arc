"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePanel } from "./panel-context";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Copy, Check, Layout, Code2, ChevronDown, ChevronUp } from "lucide-react";

interface PreviewPanelProps {
    children: React.ReactNode;
    usageCode?: string;
    fullCode?: string;
    className?: string;
}

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export function PreviewPanel({
    children,
    usageCode,
    fullCode,
    className,
}: PreviewPanelProps) {
    const { isMaximized, toggleMaximize } = usePanel();
    const [previewKey, setPreviewKey] = React.useState(0);
    const [showCode, setShowCode] = React.useState(false);
    const [packageManager, setPackageManager] = React.useState<PackageManager>("pnpm");
    const [copiedSection, setCopiedSection] = React.useState<string | null>(null);
    const [isFullCodeExpanded, setIsFullCodeExpanded] = React.useState(false);

    const handleRefresh = React.useCallback(() => {
        setPreviewKey((prev) => prev + 1);
    }, []);

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const installCommands = {
        pnpm: "pnpm add motion",
        npm: "npm install motion",
        yarn: "yarn add motion",
        bun: "bun add motion",
    };

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
                "relative z-10 flex items-center justify-center p-3 overflow-hidden bg-muted/5",
                className
            )}
            initial={false}
        >
            {}
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
                        "flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 px-3 w-auto gap-2",
                        showCode ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    {showCode ? <Layout size={14} /> : <Code2 size={14} />}
                    <span className="text-[11px] font-bold uppercase tracking-wider">{showCode ? "Preview" : "Code"}</span>
                </button>
            </div>

            <div className="relative w-full h-full flex items-center justify-center p-4 overflow-auto no-scrollbar">
                <AnimatePresence mode="wait" initial={false}>
                    {showCode ? (
                        <motion.div
                            key="code"
                            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full max-w-3xl space-y-12 py-20"
                        >
                            {}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                                        <Terminal size={14} />
                                    </div>
                                    <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground/80">Install</h3>
                                </div>
                                <div className="rounded-2xl border border-border/40 bg-muted/20 backdrop-blur-md overflow-hidden">
                                    <div className="flex border-b border-border/40 bg-muted/40 p-1">
                                        {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((pm) => (
                                            <button
                                                key={pm}
                                                onClick={() => setPackageManager(pm)}
                                                className={cn(
                                                    "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                                                    packageManager === pm
                                                        ? "bg-background text-foreground shadow-sm"
                                                        : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {pm}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-4 flex items-center justify-between group">
                                        <code className="text-[13px] font-mono text-foreground/90">{installCommands[packageManager]}</code>
                                        <button
                                            onClick={() => copyToClipboard(installCommands[packageManager], "install")}
                                            className="p-2 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            {copiedSection === "install" ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-muted-foreground" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {}
                            {usageCode && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                                            <Layout size={14} />
                                        </div>
                                        <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground/80">Usage</h3>
                                    </div>
                                    <div className="relative group">
                                        <pre className="rounded-2xl border border-border/40 bg-muted/20 backdrop-blur-md p-6 overflow-auto text-[13px] font-mono leading-relaxed max-h-[400px]">
                                            {usageCode}
                                        </pre>
                                        <button
                                            onClick={() => copyToClipboard(usageCode, "usage")}
                                            className="absolute top-4 right-4 p-2 rounded-md bg-background/50 backdrop-blur-md border border-border/40 hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            {copiedSection === "usage" ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-muted-foreground" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {}
                            {fullCode && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                                            <Code2 size={14} />
                                        </div>
                                        <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground/80">Code</h3>
                                    </div>
                                    <div className="relative group overflow-hidden rounded-2xl border border-border/40 bg-muted/20 backdrop-blur-md">
                                        <div className={cn(
                                            "transition-all duration-500 ease-in-out relative overflow-hidden",
                                            isFullCodeExpanded ? "max-h-none" : "max-h-[300px]"
                                        )}>
                                            <pre className="p-6 overflow-auto text-[12px] font-mono leading-loose no-scrollbar">
                                                {fullCode}
                                            </pre>
                                            {!isFullCodeExpanded && (
                                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-muted/80 via-muted/40 to-transparent pointer-events-none backdrop-blur-[2px]" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between p-4 border-t border-border/40 bg-muted/40">
                                            <button
                                                onClick={() => setIsFullCodeExpanded(!isFullCodeExpanded)}
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {isFullCodeExpanded ? (
                                                    <><ChevronUp size={14} /> Collapse</>
                                                ) : (
                                                    <><ChevronDown size={14} /> Expand Snippet</>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => copyToClipboard(fullCode, "full")}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background/50 hover:bg-background border border-border/40 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                                            >
                                                {copiedSection === "full" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                {copiedSection === "full" ? "Copied" : "Copy Code"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
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
