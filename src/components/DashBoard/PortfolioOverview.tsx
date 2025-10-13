// components/dashboard/PortfolioOverview.tsx
import { CreditCard, DollarSign, TrendingUp, User } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color?: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    return (
        <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow hover:shadow-md transition">
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
            <div
                className={`p-3 rounded-full ${color ? color : "bg-blue-100"
                    } text-white`}
            >
                {icon}
            </div>
        </div>
    );
}

export default function PortfolioOverview() {
    // Mock data for static view
    const stats = [
        {
            title: "Wallet Balance",
            value: "$14,200",
            icon: <User className="w-6 h-6" />,
            color: "bg-indigo-500",
        },
        {
            title: "Total Supplied",
            value: "$8,500",
            icon: <CreditCard className="w-6 h-6" />,
            color: "bg-green-500",
        },
        {
            title: "Total Borrowed",
            value: "$2,300",
            icon: <TrendingUp className="w-6 h-6" />,
            color: "bg-red-500",
        },
        {
            title: "Net APY",
            value: "3.2%",
            icon: <DollarSign className="w-6 h-6" />,
            color: "bg-blue-500",
        },
    ];

    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </div>
        </section>
    );
}