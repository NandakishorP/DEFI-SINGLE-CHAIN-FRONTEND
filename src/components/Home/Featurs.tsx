// components/Features.tsx
import { Shield, Banknote, HandCoins } from "lucide-react";

const features = [
    {
        icon: <Banknote className="w-10 h-10 text-indigo-600" />,
        title: "Deposit Assets",
        description:
            "Supply your crypto assets to the protocol and start earning interest immediately.",
    },
    {
        icon: <HandCoins className="w-10 h-10 text-indigo-600" />,
        title: "Borrow Instantly",
        description:
            "Borrow against your supplied collateral with transparent interest rates.",
    },
    {
        icon: <Shield className="w-10 h-10 text-indigo-600" />,
        title: "Secure & Transparent",
        description:
            "Smart contracts ensure security and transparency, with no hidden fees.",
    },
];

export default function Features() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                <p className="mt-4 text-gray-600">
                    Simple, secure, and efficient lending and borrowing for everyone.
                </p>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
                        >
                            <div className="flex justify-center">{feature.icon}</div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}