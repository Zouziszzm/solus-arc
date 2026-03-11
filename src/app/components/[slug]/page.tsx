import { notFound } from "next/navigation";
import * as registryConfigs from "@/../registry";
import * as registryComponents from "@/../registry/components";
import { ComponentConfig } from "@/../registry/types";
import { WorkbenchClient } from "@/components/workbench/WorkbenchClient";
import fs from "fs/promises";
import path from "path";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ComponentWorkbench({ params }: PageProps) {
    const { slug } = await params;

    const config = Object.values(registryConfigs).find(
        (c) => (c as ComponentConfig).slug === slug
    ) as ComponentConfig | undefined;

    if (!config) {
        return notFound();
    }

    const componentName = config.name.replace(/\s+/g, "");
    const Component = (registryComponents as any)[componentName];

    if (!Component) {
        return notFound();
    }

    let fullCode = "";
    try {
        const filePath = path.join(process.cwd(), "registry/components", config.sourceFile);
        fullCode = await fs.readFile(filePath, "utf-8");
    } catch (error) {
        console.error("Failed to read component source:", error);
        fullCode = "Error loading component source.";
    }

    return (
        <WorkbenchClient 
            config={config} 
            component={Component} 
            fullCode={fullCode} 
        />
    );
}
