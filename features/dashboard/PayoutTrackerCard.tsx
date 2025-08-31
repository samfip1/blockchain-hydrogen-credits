import React from 'react';
import Card from './Card';

const payouts = [
    { claimId: 'HC-001', amount: '$125,000', txId: '0x123...abc', confirmation: true },
    { claimId: 'HC-998', amount: '$98,000', txId: '0x456...def', confirmation: true },
    { claimId: 'HC-997', amount: '$110,500', txId: '0x789...ghi', confirmation: true },
];

const PayoutTrackerCard = () => {
    return (
        <Card>
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Payout Tracker</h3>
            <div className="space-y-4">
                {payouts.map(payout => (
                    <div key={payout.claimId} className="p-4 bg-gray-50 rounded-lg flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <p className="font-semibold text-gray-800">{payout.claimId}</p>
                            <p className="text-2xl font-bold text-emerald-600">{payout.amount}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Gateway TXID</p>
                            <p className="font-mono text-sm text-gray-600">{payout.txId}</p>
                        </div>
                        <a href="#" className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:underline">
                            <span>View on Blockchain</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default PayoutTrackerCard;
