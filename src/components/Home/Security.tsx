// components/Security.tsx
import { ShieldCheck, Lock, FileText } from "lucide-react";

const securityPoints = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
        title: "Audited Smart Contracts",
        description: "Independent security firms audit our contracts to ensure safety.",
    },
    {
        icon: <Lock className="w-8 h-8 text-indigo-600" />,
        title: "Non-Custodial",
        description: "You remain in full control of your funds at all times.",
    },
    {
        icon: <FileText className="w-8 h-8 text-indigo-600" />,
        title: "Transparent & Open Source",
        description: "Our protocol is fully open-source for maximum transparency.",
    },
];

export default function Security() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900">Built for Security</h2>
                <p className="mt-4 text-gray-600">
                    Trust is the foundation of decentralized finance. Our protocol ensures
                    top-grade security and transparency.
                </p>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {securityPoints.map((point, idx) => (
                        <div
                            key={idx}
                            className="p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-center">{point.icon}</div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                {point.title}
                            </h3>
                            <p className="mt-2 text-gray-600">{point.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}