import React from 'react';
import Card from './Card';

const notifications = [
    { text: 'Claim HC-001 has been approved.', time: '2 hours ago', icon: '✅' },
    { text: 'Auditor requested more info on HC-002.', time: '1 day ago', icon: '📄' },
    { text: 'Subsidy for HC-998 has been disbursed.', time: '3 days ago', icon: '💸' },
];

const NotificationsCard = () => {
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">Notifications & Alerts</h3>
                <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">View All</a>
            </div>
            <div className="space-y-4">
                {notifications.map((notification, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <div className="bg-gray-100 p-2 rounded-lg text-xl mt-1">{notification.icon}</div>
                        <div>
                            <p className="font-medium text-gray-700">{notification.text}</p>
                            <p className="text-sm text-gray-500">{notification.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default NotificationsCard;
