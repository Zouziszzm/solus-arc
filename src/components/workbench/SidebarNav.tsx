"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import * as registry from "@/../registry";
import { ComponentConfig } from "@/../registry/types";

export function SidebarNav() {
    const pathname = usePathname();

    
    const configs = Object.values(registry) as ComponentConfig[];
    const categories = configs.reduce((acc, config) => {
        if (!acc[config.category]) {
            acc[config.category] = [];
        }
        acc[config.category].push(config);
        return acc;
    }, {} as Record<string, ComponentConfig[]>);

    const navGroups = [
        ...Object.entries(categories).map(([category, items]) => ({
            title: category,
            items: items.map((item) => ({
                title: item.name,
                href: `/components/${item.slug}`,
            })),
        })),
    ];

    return (
        <aside className={cn(
            "fixed z-40 bg-background transition-all duration-300",
            
            "lg:left-0 lg:top-20 lg:h-[calc(100vh-80px)] lg:w-72 lg:border-r lg:border-border/40 hidden lg:block"
        )}>
            <div className="flex flex-row lg:flex-col gap-8 lg:gap-8 w-full lg:px-8 lg:py-10">
                {navGroups.map((group) => (
                    <div key={group.title} className="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-3 shrink-0">
                        <h4 className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider lg:px-2">
                            {group.title}
                        </h4>
                        <div className="flex flex-row lg:flex-col gap-6 lg:gap-1 w-full">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center lg:px-3 lg:py-2 text-[13px] lg:text-[14px] whitespace-nowrap transition-colors",
                                            isActive
                                                ? "text-foreground font-semibold lg:bg-muted/80"
                                                : "text-muted-foreground hover:text-foreground lg:hover:bg-muted/50"
                                        )}
                                    >
                                        {}
                                        {isActive && (
                                            <div className="lg:hidden absolute bottom-[-16px] left-0 right-0 h-[2.5px] bg-foreground rounded-none" />
                                        )}
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
