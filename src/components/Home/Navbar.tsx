'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Markets', href: '/markets' },
        { name: 'My deposits', href: '/deposits' },
        { name: 'My Loans', href: '/loans' },
        { name: 'About', href: '/about' },
        { name: 'DashBoard', href: '/dashboard' },
    ];

    return (
        <nav className="backdrop-blur-md bg-slate-900/60 border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            <Link
                                key=""
                                href='/'
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                DEFI
                            </Link>
                        </h1>
                    </div>

                    {/* Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <ConnectButton />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;