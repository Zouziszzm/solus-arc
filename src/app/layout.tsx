import type { Metadata } from "next";
import { Inter, Instrument_Serif, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/Providers";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { Asterisk } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-serif"
});
const lora = Lora({
    subsets: ["latin"],
    variable: "--font-lora"
});

export const metadata: Metadata = {
    title: "Solus-Arc | Build faster with elegant React components",
    description: "A modern component library built for developers who want clean design without unnecessary complexity.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${instrumentSerif.variable} ${lora.variable} font-sans antialiased`}>
                <Providers>
                    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-8 py-4 lg:py-6 bg-background/80 backdrop-blur-md border-b border-border/40">
                        <Link href="/" className="flex items-center gap-2 text-sm font-bold shrink-0">
                            <Asterisk className="w-6 h-6 text-orange-500" />
                            <span className="font-lora text-xl tracking-tight">Solus-arc</span>
                        </Link>
                        <nav className="flex items-center gap-4 lg:gap-8 text-[12px] lg:text-sm text-muted-foreground overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-2">
                            <Link href="/docs" className="hover:text-foreground transition-colors font-semibold py-1">Docs</Link>
                            <Link href="/components" className="hover:text-foreground transition-colors font-semibold py-1">Components</Link>
                            <Link href="https://github.com/Zouziszzm/solus-arc" target="_blank" className="hidden sm:flex items-center gap-1 hover:text-foreground transition-colors font-semibold py-1">
                                Github
                            </Link>
                            <ThemeToggle />
                        </nav>
                    </header>
                    <main className="min-h-screen pt-20">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
