import React from 'react';
import Card from './Card';

const claims = [
    { id: 'HC-001', status: 'Subsidy Disbursed', amount: '125,000 kg H₂', date: '2024-07-15' },
    { id: 'HC-002', status: 'Auditor Verified', amount: '87,500 kg H₂', date: '2024-07-20' },
    { id: 'HC-003', status: 'Pending', amount: '92,000 kg H₂', date: '2024-07-22' },
    { id: 'HC-004', status: 'Rejected', amount: '50,000 kg H₂', date: '2024-06-10' },
];
type Claim={
    id:string,
    status:"PENDING"|"APPROVED"|"REJECTED",
    payout:GLfloat,
    date:Date
};

const statusStyles: { [key: string]: string } = {
    'APPROVED': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'REJECTED': 'bg-red-100 text-red-800',
};

const StatusPill = ({ status }: { status: string }) => (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
    </span>
);

const ClaimHistoryCard = () => {
    return (
        <Card>
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Claim History</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Claim ID</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map(claim => (
                            <tr key={claim.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{claim.id}</td>
                                <td className="px-6 py-4">{claim.amount}</td>
                                <td className="px-6 py-4">{claim.date}</td>
                                <td className="px-6 py-4"><StatusPill status={claim.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ClaimHistoryCard;
