// components/Footer.tsx
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
            <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
                {/* Brand */}
                <div>
                    <h3 className="text-xl font-bold text-white">
                        Money Lending Protocol
                    </h3>
                    <p className="mt-2 text-gray-400">
                        Decentralized, secure, and transparent lending for everyone.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <a href="/dashboard" className="hover:text-white">
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="/markets" className="hover:text-white">
                                Markets
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="hover:text-white">
                                About
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="text-lg font-semibold text-white">Connect</h4>
                    <div className="flex space-x-4 mt-4">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white"
                        >
                            <Twitter className="w-6 h-6" />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white"
                        >
                            <Github className="w-6 h-6" />
                        </a>
                        <a
                            href="mailto:contact@protocol.com"
                            className="hover:text-white"
                        >
                            <Mail className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Money Lending Protocol. All rights reserved.
            </div>
        </footer>
    );
}