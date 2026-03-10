"use client";

interface PreviewAreaProps {
    children: React.ReactNode;
}

export function PreviewArea({ children }: PreviewAreaProps) {
    return (
        <div className="relative flex min-h-[400px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-slate-50/50 p-12 dark:bg-slate-950/50">
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative z-10 w-full flex justify-center">
                {children}
            </div>
        </div>
    );
}
