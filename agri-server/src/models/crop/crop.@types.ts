export interface Crop {
    name: string;
    caregory: string;
    season: string;
    showingPeriod: {
        startMonth: number;
        endMonth: number;
    };
    harvestPeriod: {
        startMonth: number;
        endMonth: number;
    };
    idealConditions: {
        temperatureRange: {
            min: number;
            max: number;
        };
        humidityRange: {
            min: number;
            max: number;
        };
        soilType: string;
        soilmoistureRange: {
            min: number;
            max: number;
        };
    };
}
