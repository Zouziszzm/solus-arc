"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as registryConfigs from "@/../registry";
import * as registryComponents from "@/../registry/components";
import { ComponentConfig } from "@/../registry/types";
import * as motion from "motion/react-client";

export default function ComponentsIndex() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    const configs = Object.values(registryConfigs) as ComponentConfig[];

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        
        if (window.innerWidth >= 1024 && configs.length > 0) {
            router.replace(`/components/${configs[0].slug}`);
        }
        
        return () => window.removeEventListener("resize", checkMobile);
    }, [router, configs]);

    const [toast, setToast] = useState<string | null>(null);

    const showToast = () => {
        setToast("too diesel to run on your mobile hop on the desktop for this");
        setTimeout(() => setToast(null), 3000);
    };

    if (!isMobile) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                    <p className="text-sm text-muted-foreground animate-pulse font-medium">Entering Workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:hidden relative">
            {toast && (
                <div 
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-foreground text-background text-xs font-bold shadow-2xl border border-border/20 text-center w-[80%] max-w-xs animate-in fade-in slide-in-from-bottom-5 duration-300"
                >
                    {toast}
                </div>
            )}

            <div className="flex flex-col gap-0">
                {configs.map((config, index) => {
                    const componentName = config.name.replace(/\s+/g, "");
                    const Component = (registryComponents as any)[componentName];
                    
                    if (!Component) return null;

                    const defaultProps = config.props.reduce((acc, prop) => {
                        acc[prop.name] = prop.default;
                        return acc;
                    }, {} as any);

                    return (
                        <motion.div 
                            key={config.slug}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ 
                                duration: 0.8, 
                                delay: index * 0.1,
                                ease: [0.32, 0.72, 0, 1] 
                            }}
                            className="w-full border-b border-border/40 bg-background overflow-hidden"
                        >
                            <div className="px-6 pt-12 pb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 text-center">
                                    {config.name}
                                </h3>
                            </div>
                            <div 
                                className="flex items-center justify-center min-h-[400px] w-full p-4 active:bg-muted/5 transition-colors"
                                onClick={showToast}
                            >
                                <Component {...defaultProps} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            
            <div className="px-6 py-20 pb-40 text-center border-t border-border/40">
                <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-[0.3em]">
                    Solus-arc experimental mobile view
                </p>
            </div>
        </div>
    );
}
