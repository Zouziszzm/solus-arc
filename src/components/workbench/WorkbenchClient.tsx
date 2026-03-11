"use client";

import { useState, useMemo, useEffect } from "react";
import { ControlsTable } from "@/components/workbench/ControlsTable";
import { PreviewPanel } from "@/components/workbench/PreviewPanel";
import { InfoPanel } from "@/components/workbench/InfoPanel";
import { PropsTable } from "@/components/workbench/PropsTable";
import { ComponentConfig } from "@/../registry/types";
import * as motion from "motion/react-client";

import { PanelProvider, usePanel } from "./panel-context";

interface WorkbenchClientProps {
    config: ComponentConfig;
    component: any;
    fullCode: string;
}

export function WorkbenchClient(props: WorkbenchClientProps) {
    return (
        <PanelProvider>
            <WorkbenchContent {...props} />
        </PanelProvider>
    );
}

function WorkbenchContent({ config, component: Component, fullCode }: WorkbenchClientProps) {
    const { isMaximized } = usePanel();
    const [props, setProps] = useState<Record<string, any>>(() => {
        const initial: Record<string, any> = {};
        for (const p of config.props) {
            initial[p.name] = p.default;
        }
        return initial;
    });

    const handlePropChange = (name: string, value: any) => {
        setProps((prev) => ({ ...prev, [name]: value }));
    };

    const codeSnippet = `import { ${config.name.replace(/\s+/g, "")} } from '@/registry/components';

export default function MyComponent() {
  return (
    <${config.name.replace(/\s+/g, "")} 
      ${Object.entries(props)
            .filter(([k, v]) => v !== config.props.find((p) => p.name === k)?.default)
            .map(([k, v]) => `${k}={${typeof v === "string" ? `'${v}'` : v}}`)
            .join("\n      ")}
    />
  );
}`;

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const renderDescription = (text: string) => {
        const parts = text.split(/(\*.*?\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("*") && part.endsWith("*")) {
                return (
                    <span key={i} className="text-foreground/90 font-bold italic">
                        {part.slice(1, -1)}
                    </span>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="relative flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-80px)] w-full overflow-hidden lg:overflow-hidden bg-background">
            {/* Left/Top Side: Preview */}
            <motion.div
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    flexBasis: isMaximized ? "100%" : "50%"
                }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="flex-1 lg:flex-none h-[60vh] lg:h-full border-b lg:border-b-0 lg:border-r border-border/40 min-w-0"
            >
                <PreviewPanel usageCode={codeSnippet} fullCode={fullCode} className="h-full">
                    <div className="flex items-center justify-center p-2 lg:p-4 w-full h-full">
                        <Component {...props} />
                    </div>
                </PreviewPanel>
            </motion.div>

            {/* Right/Bottom Side: Info & Controls */}
            <motion.div
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{
                    opacity: isMaximized ? 0 : 1,
                    x: isMaximized ? 40 : 0,
                    filter: isMaximized ? "blur(10px)" : "blur(0px)",
                    flexBasis: isMaximized ? "0%" : "50%",
                    pointerEvents: isMaximized ? "none" : "auto"
                }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                className="flex-1 overflow-y-auto lg:h-full px-6 py-12 lg:p-0"
            >
                <InfoPanel>
                    <div className="space-y-12 lg:space-y-20 pb-20 lg:pb-40 px-0 lg:px-12">
                        {/* Header */}
                        <header className="space-y-6 pt-4 lg:pt-8">
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">
                                <span>made</span>
                                <span>•</span>
                                <span>{config.category}</span>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-foreground">
                                    {config.name}
                                </h1>
                                {config.authorName && (
                                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/40">
                                        <span>Taken from</span>
                                        <a
                                            href={config.authorLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-500 hover:text-orange-600 transition-colors underline decoration-orange-500/30 underline-offset-4"
                                        >
                                            {config.authorName}
                                        </a>

                                    </div>
                                )}
                            </div>
                            <p className="text-[15px] lg:text-[16px] text-muted-foreground/60 leading-relaxed max-w-[560px]">
                                {renderDescription(config.description)}
                            </p>
                        </header>

                        {/* Mobile Warning - Hidden on Large Screens */}
                        {isMobile && (
                            <div className="p-8 rounded-3xl border border-dashed border-orange-500/30 bg-orange-500/5 text-center space-y-4 animate-in slide-in-from-bottom duration-700">
                                <p className="text-sm text-orange-600/80 font-medium italic leading-relaxed">
                                    To see the full workbench magic (live code & advanced controls),
                                    please hop on a desktop. Shush, we know you want to.
                                </p>
                            </div>
                        )}

                        {/* Props & Controls - Hidden on Mobile */}
                        {!isMobile && (
                            <>
                                {/* Props Table */}
                                <PropsTable props={config.props} />

                                {/* Controls */}
                                <ControlsTable config={config} values={props} onChange={handlePropChange} />
                            </>
                        )}
                    </div>
                </InfoPanel>
            </motion.div>
        </div>
    );
}
