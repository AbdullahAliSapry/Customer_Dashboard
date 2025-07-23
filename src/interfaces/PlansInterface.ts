export interface IPlan {
    id: number;
    nameen?: string;
    namear?: string;
    descriptionen?: string;
    descriptionar?: string;
    price?: number;
    durationindays?: number;
    durationtype?: PlanDurationType;
    plantype?: PlanType;
    features?: IPlanFeature[];
}

export interface IPlanFeature {
    id: number;
    nameen?: string;
    namear?: string;
    descriptionen?: string;
    descriptionar?: string;
    planid?: number;
    featuretype?: string;
    value?: string;
}

export enum PlanDurationType {
    month,
    year
}

export enum PlanType {
    free,
    basic,
    premium
}
