// components/dashboard/Notifications.tsx

interface Notification {
    type: "warning" | "info" | "success";
    message: string;
}

const notifications: Notification[] = [
    {
        type: "warning",
        message: "Your borrowing health factor is below 1.5. Consider repaying to avoid liquidation.",
    },
    {
        type: "info",
        message: "New market added: LINK/USDC lending available now.",
    },
    {
        type: "success",
        message: "You earned 0.05 ETH from supplied assets this week.",
    },
];

export default function Notifications() {
    const getColor = (type: string) => {
        switch (type) {
            case "warning":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "info":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "success":
                return "bg-green-50 text-green-700 border-green-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>

            <div className="space-y-4">
                {notifications.map((notif, idx) => (
                    <div
                        key={idx}
                        className={`p-4 border-l-4 rounded-lg ${getColor(
                            notif.type
                        )} shadow-sm`}
                    >
                        {notif.message}
                    </div>
                ))}
            </div>
        </section>
    );
}