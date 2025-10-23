export interface PollutionDeclaration {
	id?: number;
	titre: string;
	type: PollutionType;
	description: string;
	dateObservation: Date;
	lieu: string;
	latitude: number;
	longitude: number;
	photoUrl?: string;
}

export enum PollutionType {
	PLASTIQUE = "Plastique",
	CHIMIQUE = "Chimique",
	DEPOT_SAUVAGE = "Dépôt sauvage",
	EAU = "Eau",
	AIR = "Air",
	AUTRE = "Autre",
}
