import React from 'react';
import Card from './Card';

const YearlyProjectionCard = () => {
    return (
        <Card>
            <div>
                <div className="flex items-center space-x-3">
                    <div className="p-1">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-700">Yearly Projection</h3>
                </div>
                <p className="text-5xl font-bold text-gray-800 mt-4">$1,751.52</p>
                <p className="text-gray-500 text-sm mt-1">Based on current subsidies</p>
            </div>
        </Card>
    );
};

export default YearlyProjectionCard;