"use client";

import Link from "next/link";
import { MoveRight, Zap, Palette, ShieldCheck, ChevronRight, Asterisk, Github, Terminal } from "lucide-react";
import { motion } from "motion/react";

const features = [
    {
        title: "Elegant Design",
        description: "Crafted with a focus on minimalism and premium aesthetics, Solus-Arc components feel high-end out of the box.",
        icon: Palette,
        color: "text-rose-500",
        bg: "bg-rose-500/10"
    },
    {
        title: "High Performance",
        description: "Lightweight and optimized for speed. Every component is built to ensure your application remains snappy.",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        title: "Developer Friendly",
        description: "Easy to integrate and customize. Our API is intuitive, allowing you to build faster without the friction.",
        icon: ShieldCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    }
];

const steps = [
    {
        title: "Explore Components",
        code: "Open components section and see something you like.",
        description: "Browse our collection of hand-crafted components to find the perfect fit for your project."
    },
    {
        title: "Copy the Code",
        code: `Click the "Code" button to view and copy the main source code.`,
        description: "No npm packages to install for the components themselves. Just pure, editable code."
    },
    {
        title: "Install Dependencies & Enjoy",
        code: `Paste the code into your project, install any required dependencies (e.g., motion, lucide-react), and enjoy! I know you can take care of the rest.`,
        description: "Make sure you have the necessary libraries installed, then customize the component to your heart's content."
    }
];

export default function DocsPage() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-16"
            >
                <div className="flex items-center gap-2 text-orange-500 mb-4">
                    <Asterisk className="w-5 h-5" />
                    <span className="text-sm font-semibold tracking-wider uppercase">Documentation</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-lora mb-8 tracking-tight">
                    Building with <span className="text-orange-500 italic">Solus-Arc</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    Solus-Arc is a collection of high-quality, accessible React components
                    designed to help you build beautiful interfaces with ease.
                </p>
                <div className="flex flex-wrap gap-4 mt-10">
                    <Link
                        href="/components"
                        className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-none font-semibold hover:opacity-90 transition-opacity"
                    >
                        Explore Components <MoveRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="https://github.com/Zouziszzm/solus-arc"
                        target="_blank"
                        className="flex items-center gap-2 border border-border px-6 py-3 rounded-none font-semibold hover:bg-muted transition-colors"
                    >
                        <Github className="w-4 h-4" /> GitHub
                    </Link>
                </div>
            </motion.div>

            <section className="mb-24">
                <h2 className="text-3xl font-lora mb-12 flex items-center gap-3">
                    <Terminal className="w-6 h-6 text-orange-500" />
                    Quick Start Guide
                </h2>
                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <div key={step.title} className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-none flex items-center justify-center font-bold text-xl">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground mb-4 max-w-xl">{step.description}</p>
                                <div className="bg-zinc-950 text-zinc-50 p-6 rounded-none font-mono text-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white">Copy</button>
                                    </div>
                                    <code className="block">
                                        {step.code}
                                    </code>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-12 lg:p-24 rounded-none bg-orange-500 text-white relative overflow-hidden text-center">
                <motion.div
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-[-100px] right-[-100px] opacity-10"
                >
                    <Asterisk size={400} />
                </motion.div>

                <h2 className="text-4xl lg:text-6xl font-lora mb-8 relative z-10">Just copy and start the work people.</h2>
                <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto relative z-10">
                    No complex installations. Just beautiful code ready for your projects.
                </p>
                <Link
                    href="/components"
                    className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-none font-bold text-lg hover:bg-orange-50 transition-colors relative z-10"
                >
                    Get Started <ChevronRight className="w-5 h-5" />
                </Link>
            </section>

            <footer className="mt-24 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
                <p>© 2026 Solus-Arc. Built for the modern web.</p>
                <div className="flex gap-8">
                    <Link href="https://github.com/Zouziszzm/solus-arc" className="hover:text-foreground">GitHub</Link>
                    <Link href="/components" className="hover:text-foreground">Components</Link>
                </div>
            </footer>
        </div>
    );
}
