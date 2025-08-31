import React from 'react';
import YearlyProjectionCard from '../features/dashboard/YearlyProjectionCard';
import UpcomingPayoutsCard from '../features/dashboard/UpcomingPayoutsCard';
import NotificationsCard from '../features/dashboard/NotificationsCard';
import ClaimHistoryCard from '../features/dashboard/ClaimHistoryCard';
import PayoutTrackerCard from '../features/dashboard/PayoutTrackerCard';
import SubmitClaimCard from '../features/dashboard/SubmitClaimCard';
import PlantAddForm  from './PlantAddform';
import Claim from '@/features/dashboard/Claim';
interface User {
    email: string;
}

interface DashboardPageProps {
    user: User;
    onNavigate: (path: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onNavigate }) => {
    return (
        <div className="min-h-screen font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
             <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Hello</h1>
                    <p className="text-gray-500">Here's your subsidy overview.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                     <button 
                        onClick={() => onNavigate('')}
                        className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition"
                        aria-label="Sign out"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                     </button>
                </div>
            </header>
            
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <YearlyProjectionCard />
                    <ClaimHistoryCard />
                    <PayoutTrackerCard />
                    <PlantAddForm onPlantAdded={()=>{
                        console.log("plant added sucessfully!!");
                    }}/>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                    <UpcomingPayoutsCard />
                    <NotificationsCard />
                    <Claim onClaimSubmitted={() => {
                        console.log("Claim submitted successfully!");
                    }} />
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;