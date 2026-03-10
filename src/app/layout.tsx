import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/Providers";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-serif"
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
            <body className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}>
                <Providers>
                    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-background/80 backdrop-blur-sm border-b border-border/40">
                        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-lg">✶</span>
                            <span className="font-serif text-lg tracking-tight">Solus-arc</span>
                        </Link>
                        <nav className="flex items-center gap-8 text-sm text-muted-foreground">
                            <Link href="/docs" className="hover:text-foreground transition-colors font-medium">Docs</Link>
                            <Link href="/components" className="hover:text-foreground transition-colors font-medium">Components</Link>
                            <Link href="https://github.com" target="_blank" className="flex items-center gap-1 hover:text-foreground transition-colors font-medium">
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
