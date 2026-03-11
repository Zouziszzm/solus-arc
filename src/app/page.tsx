import Link from "next/link";
import * as motion from "motion/react-client";

export default function HomePage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="max-w-2xl"
            >
                <h1 className="text-5xl font-serif leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl">
                    Build faster with elegant React components.
                </h1>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mt-12 space-y-6 text-lg text-muted-foreground leading-relaxed max-w-xl"
                >
                    <p>
                        Solus-Arc is a personal collection of components I&apos;ve gathered from various corners of the web. 
                        Each piece has been ethically sourced, updated, and refined for better usability and performance.
                    </p>
                    <p>
                        Everything here is for you to take and use in your own projects. 
                        Think of it as a curated treasury of high-end React patterns—ethically taken, 
                        deeply modified, and ready for your next big idea.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-12"
                >
                    <Link
                        href="/components"
                        className="group flex items-center gap-2 text-sm font-medium border border-border px-6 py-3 rounded-full hover:bg-accent transition-all duration-300 w-fit"
                    >
                        components
                        <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
