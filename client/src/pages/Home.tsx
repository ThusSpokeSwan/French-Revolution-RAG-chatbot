import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "../assets/french-revolution.jpg";
import { Crown } from "lucide-react";

function Home() {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Hero Section */}
            <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Crown className="h-6 w-6 text-red-400" />

                        <h1 className="text-xl font-bold tracking-wide">
                            French Revolution AI
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/login"
                            className="rounded-xl px-4 py-2 transition hover:bg-white/10"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="rounded-xl bg-white px-4 py-2 font-semibold text-black transition hover:scale-105"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>
            <section className="relative flex min-h-screen items-center justify-center px-6">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${heroImage})`,
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-slate-950" />

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 max-w-4xl text-center"
                >
                    <h1 className="mb-6 text-6xl font-extrabold md:text-8xl">
                        French Revolution AI
                    </h1>

                    <p className="mb-10 text-xl text-slate-300 md:text-2xl">
                        Explore the revolution that transformed France and reshaped the
                        modern world.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Link
                            to="/signup"
                            className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-105"
                        >
                            Get Started
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-7xl px-6 py-24">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center text-4xl font-bold"
                >
                    What You Can Explore
                </motion.h2>

                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        {
                            title: "Historical Figures",
                            text: "Robespierre, Louis XVI, Napoleon, Marie Antoinette and more.",
                        },
                        {
                            title: "Major Events",
                            text: "Bastille, Reign of Terror, National Convention, Directory.",
                        },
                        {
                            title: "AI-Powered Answers",
                            text: "RAG-powered chatbot grounded in historical sources.",
                        },
                    ].map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="rounded-3xl border border-slate-800 bg-slate-900 p-8"
                        >
                            <h3 className="mb-4 text-2xl font-bold">{card.title}</h3>

                            <p className="text-slate-400">{card.text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-24">
                <div className="grid gap-6 md:grid-cols-4">

                    {[
                        ["1789", "Revolution Begins"],
                        ["10,000+", "Knowledge Chunks"],
                        ["10 Years", "Political Upheaval"],
                        ["24/7", "Historical Exploration"],
                    ].map(([number, text]) => (
                        <motion.div
                            key={text}
                            whileHover={{ scale: 1.05 }}
                            className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center"
                        >
                            <div className="mb-2 text-4xl font-bold text-red-400">
                                {number}
                            </div>

                            <div className="text-slate-400">
                                {text}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Timeline */}
            <section className="mx-auto max-w-5xl px-6 py-24">
                <h2 className="mb-16 text-center text-4xl font-bold">
                    Revolution Timeline
                </h2>

                <div className="space-y-10">
                    {[
                        ["1789", "Storming of the Bastille"],
                        ["1792", "Monarchy Abolished"],
                        ["1793", "Louis XVI Executed"],
                        ["1794", "Robespierre Executed"],
                        ["1799", "Napoleon Takes Power"],
                    ].map(([year, event]) => (
                        <motion.div
                            key={year}
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
                        >
                            <div className="text-3xl font-bold text-yellow-400">
                                {year}
                            </div>

                            <div className="text-lg">{event}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 py-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="rounded-3xl border border-slate-800 bg-slate-900 p-12"
                >
                    <h2 className="mb-6 text-4xl font-bold">
                        Why This Project?
                    </h2>

                    <p className="text-lg leading-relaxed text-slate-300">
                        The French Revolution changed the course of
                        human history. It transformed ideas about
                        democracy, citizenship, rights, and political
                        power.
                    </p>

                    <p className="mt-4 text-lg leading-relaxed text-slate-300">
                        This AI-powered assistant combines Retrieval
                        Augmented Generation (RAG) with modern large
                        language models to help students explore
                        historical events conversationally.
                    </p>
                </motion.div>
            </section>

            {/* CTA */}
            <section className="px-6 py-24 text-center">
                <h2 className="mb-6 text-5xl font-bold">
                    Ready to Explore History?
                </h2>

                <p className="mb-10 text-slate-400">
                    Start asking questions about the French Revolution.
                </p>

                <Link
                    to="/signup"
                    className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-105"
                >
                    Start Exploring
                </Link>
            </section>

            <footer className="border-t border-white/10 py-10 text-center">
                <div className="mx-auto max-w-7xl px-6">
                    <h3 className="mb-2 text-lg font-semibold">
                        French Revolution AI
                    </h3>

                    <p className="text-slate-400">
                        Built using RAG, Gemini and modern web technologies.
                    </p>

                    <p className="mt-4 text-sm text-slate-500">
                        © 2026 French Revolution AI
                    </p>
                </div>
            </footer>
        </div>
    );
}
export default Home;