import { PrismaClient } from "../generated/prisma/index.js";

export interface ProductionSummary {
    companyId: string;
    plantId: string;
    milestone: number;
    hydrogenProduced: number;
    energyConsumed: number;
    carbonProduced: number;
}


const STATE_FACTORS: Record<string, number> = {
    Delhi: 1.0,
    Maharashtra: 0.95,
    Assam: 0.8,
    Gujarat: 0.9,
    Karnataka: 0.92,
    default: 0.85,
};


export function generateProductionSummary(companyId: string, plantId: string, stateName: string, milestone = 1): ProductionSummary {
    
    const normalizedState = stateName.charAt(0).toUpperCase() + stateName.slice(1).toLowerCase();

    
    const factor: number = STATE_FACTORS[normalizedState] ?? STATE_FACTORS.default ?? 0.85;

    let totalHydrogen = 0;
    let totalEnergy = 0;
    let totalCarbon = 0;

    
    const intervals = 12 * 30 * 4; 

    for (let i = 0; i < intervals; i++) {
        const hydrogenProduced = (Math.random() * (20000 - 10000) + 10000) * factor;
        const energyConsumed = hydrogenProduced * (Math.random() * (45 - 35) + 35) * factor;
        const carbonProduced = hydrogenProduced * 0.008 * factor;

        totalHydrogen += hydrogenProduced;
        totalEnergy += energyConsumed;
        totalCarbon += carbonProduced;
    }

    return {
        companyId,
        plantId,
        milestone,
        hydrogenProduced: parseFloat(totalHydrogen.toFixed(2)),
        energyConsumed: parseFloat(totalEnergy.toFixed(2)),
        carbonProduced: parseFloat(totalCarbon.toFixed(2)),
    };
}
