"use client";

import { useState, useMemo } from "react";
import { ControlsTable } from "@/components/workbench/ControlsTable";
import { PreviewPanel } from "@/components/workbench/PreviewPanel";
import { InfoPanel } from "@/components/workbench/InfoPanel";
import { PropsTable } from "@/components/workbench/PropsTable";
import { ComponentConfig } from "@/../registry/types";

interface WorkbenchClientProps {
    config: ComponentConfig;
    component: any;
    fullCode: string;
}

export function WorkbenchClient({ config, component: Component, fullCode }: WorkbenchClientProps) {
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

    return (
        <div className="relative flex h-[calc(100vh-80px)] w-full overflow-hidden bg-background animate-in fade-in duration-1000">
            {/* Left Side: Preview */}
            <PreviewPanel usageCode={codeSnippet} fullCode={fullCode}>
                <div className="flex items-center justify-center p-10 w-full h-full">
                    <Component {...props} />
                </div>
            </PreviewPanel>

            {/* Right Side: Info & Controls */}
            <InfoPanel>
                <div className="space-y-20 pb-40">
                    {/* Header */}
                    <header className="space-y-3 pt-4">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/40 uppercase tracking-[0.2em]">
                            <span>made</span>
                            <span>•</span>
                            <span>{config.category}</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            {config.name}
                        </h1>
                        <p className="text-[15px] text-muted-foreground/80 leading-relaxed max-w-[640px]">
                            {config.description}
                        </p>
                    </header>

                    {/* Props Table */}
                    <PropsTable props={config.props} />

                    {/* Controls */}
                    <ControlsTable config={config} values={props} onChange={handlePropChange} />
                </div>
            </InfoPanel>
        </div>
    );
}
