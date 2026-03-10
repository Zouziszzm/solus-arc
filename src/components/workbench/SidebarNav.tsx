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
        <aside className="fixed left-0 top-20 hidden h-[calc(100vh-80px)] w-60 bg-background px-8 py-10 md:block">
            <div className="flex flex-col gap-12">
                {navGroups.map((group) => (
                    <div key={group.title} className="flex flex-col gap-6">
                        <h4 className="text-[14px] font-medium text-foreground/90 tracking-tight px-0">
                            {group.title}
                        </h4>
                        <div className="relative flex flex-col gap-4 border-l border-foreground/10 ml-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center pl-6 text-[14px]",
                                            isActive
                                                ? "text-foreground font-bold"
                                                : "text-foreground/60 hover:text-foreground hover:font-bold font-normal"
                                        )}
                                    >
                                        {/* Active Indicator Bar */}
                                        {isActive && (
                                            <div className="absolute left-[-1.5px] top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-foreground" />
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
