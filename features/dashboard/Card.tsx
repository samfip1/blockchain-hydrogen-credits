import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
