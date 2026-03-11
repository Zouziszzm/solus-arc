"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import * as registry from "@/../registry";
import { ComponentConfig } from "@/../registry/types";

export function SidebarNav() {
    const pathname = usePathname();

    // Group components by category
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
            // Desktop: Vertical Sidebar
            "lg:left-0 lg:top-20 lg:h-[calc(100vh-80px)] lg:w-72 lg:border-r lg:border-border/40 hidden lg:block"
        )}>
            <div className="flex flex-row lg:flex-col gap-8 lg:gap-12 w-full lg:px-10 lg:py-12">
                {navGroups.map((group) => (
                    <div key={group.title} className="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-8 shrink-0">
                        <h4 className="text-[11px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] lg:px-0">
                            {group.title}
                        </h4>
                        <div className="flex flex-row lg:flex-col gap-6 lg:gap-5 lg:border-l lg:border-border/40 lg:ml-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center lg:pl-8 text-[13px] lg:text-[14px] whitespace-nowrap transition-all duration-300",
                                            isActive
                                                ? "text-foreground font-bold lg:font-black"
                                                : "text-muted-foreground hover:text-foreground font-medium"
                                        )}
                                    >
                                        {/* Active Indicator Bar (Desktop) */}
                                        {isActive && (
                                            <div className="hidden lg:block absolute left-[-1.5px] top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                                        )}
                                        {/* Active Indicator Underline (Mobile) */}
                                        {isActive && (
                                            <div className="lg:hidden absolute bottom-[-16px] left-0 right-0 h-[2.5px] bg-orange-500 rounded-t-full shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
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
