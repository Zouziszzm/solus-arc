"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-8 w-8" />;
    }

    const switchTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    const onThemeChange = () => {
        if (!document.startViewTransition) {
            switchTheme();
            return;
        }

        document.documentElement.setAttribute("data-theme-transition", "true");
        const transition = document.startViewTransition(switchTheme);

        transition.finished.finally(() => {
            document.documentElement.removeAttribute("data-theme-transition");
        });
    };

    return (
        <button
            type="button"
            onClick={onThemeChange}
            className="flex size-8 items-center justify-center rounded-full hover:bg-accent transition-colors"
            aria-label="Toggle theme"
        >
            {resolvedTheme === "light" ? (
                <Moon className="h-[18px] w-[18px]" />
            ) : (
                <Sun className="h-[18px] w-[18px]" />
            )}
        </button>
    );
}
