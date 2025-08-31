import React, { useState } from 'react';
import Card from './Card';

const payouts = [
    { name: 'Solaris Plant Q2', date: 'Due Jul 4, 2025', amount: '$6,990.00', icon: '☀️' },
    { name: 'HydroGen Alpha Q2', date: 'Due Jul 8, 2025', amount: '$9,990.00', icon: '💧' },
    { name: 'Windmill Farms Q2', date: 'Due Jul 13, 2025', amount: '$4,990.00', icon: '💨' },
];

const UpcomingPayoutsCard = () => {
    const [period, setPeriod] = useState('30');
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800">Upcoming Payouts</h3>
                    <p className="text-sm text-gray-500">Next {period} days</p>
                </div>
                 <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setPeriod('7')} className={`px-3 py-1 text-sm rounded-md ${period === '7' ? 'bg-white shadow-sm font-semibold' : 'text-gray-600'}`}>7 Days</button>
                    <button onClick={() => setPeriod('30')} className={`px-3 py-1 text-sm rounded-md ${period === '30' ? 'bg-white shadow-sm font-semibold' : 'text-gray-600'}`}>30 Days</button>
                </div>
            </div>
            <div className="space-y-4">
                {payouts.map(payout => (
                    <div key={payout.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gray-100 p-2 rounded-lg text-xl">{payout.icon}</div>
                            <div>
                                <p className="font-semibold text-gray-700">{payout.name}</p>
                                <p className="text-sm text-gray-500">{payout.date}</p>
                            </div>
                        </div>
                        <p className="font-bold text-gray-800">{payout.amount}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default UpcomingPayoutsCard;
