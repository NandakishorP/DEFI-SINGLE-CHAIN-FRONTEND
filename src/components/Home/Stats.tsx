'use client'

export default function Stats() {
    // 🔹 Placeholder values for now
    const stats = [
        { label: 'Total Value Locked', value: '$12.3M' },
        { label: 'Loans Issued', value: '48,921' },
        { label: 'Active Users', value: '7,842' },
    ]

    return (
        <section className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 text-center">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Protocol at a Glance
                </h2>
                <p className="mt-2 text-gray-600">
                    Transparent metrics updated in real-time.
                </p>

                {/* Stats Grid */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-gray-50 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                        >
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="mt-2 text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}