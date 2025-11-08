'use client'

import { useEffect, useState } from "react";
import { CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { useAccount } from "wagmi";
import { getNetAPY, getTotalSupplyByUser } from "@/hooks/useLendingPoolContract";
import { getUserActiveLoans } from "@/lib/graphClient";

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
            <div className={`p-3 rounded-full ${color} text-white`}>
                {icon}
            </div>
        </div>
    );
}

export default function PortfolioOverview() {
    const { address } = useAccount();
    const [totalSupplied, setTotalSupplied] = useState<string>("$0.00");
    const [totalBorrowed, setTotalBorrowed] = useState<string>("$0.00");
    const [netApy, setNetApy] = useState<string>("0.00");

    useEffect(() => {
        async function loadValues() {
            if (!address) return;

            const result = await getTotalSupplyByUser(address);
            const loans = await getUserActiveLoans(address);
            const apy = await getNetAPY(address);


            var totalBorrowed = 0;
            loans.forEach((loan) => {
                const amount = Number(loan.amountBorrowedInUSDT ?? loan.amount) / 10 ** 18;
                totalBorrowed += amount;
            });
            setTotalSupplied(result);
            setTotalBorrowed("$" + String(totalBorrowed))
            setNetApy(apy.toLocaleString());
        }

        loadValues();
    }, [address]);

    const stats = [
        {
            title: "Total Supplied",
            value: totalSupplied,
            icon: <CreditCard className="w-6 h-6" />,
            color: "bg-green-500",
        },
        {
            title: "Total Borrowed",
            value: totalBorrowed,
            icon: <TrendingUp className="w-6 h-6" />,
            color: "bg-red-500",
        },
        {
            title: "Net APY",
            value: netApy,
            icon: <DollarSign className="w-6 h-6" />,
            color: "bg-blue-500",
        },
    ];

    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Portfolio Overview
            </h2>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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