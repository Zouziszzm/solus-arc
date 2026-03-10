"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import * as registryConfigs from "@/../registry";
import { ComponentConfig } from "@/../registry/types";

export default function ComponentsIndex() {
    const router = useRouter();

    useEffect(() => {
        const configs = Object.values(registryConfigs) as ComponentConfig[];
        if (configs.length > 0) {
            router.replace(`/components/${configs[0].slug}`);
        }
    }, [router]);

    return (
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading workspace...</p>
            </div>
        </div>
    );
}
