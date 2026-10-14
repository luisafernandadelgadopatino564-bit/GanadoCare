export type EventType =
  | 'vacunacion'
  | 'tratamiento'
  | 'desparasitacion'
  | 'reproductivo'
  | 'cirugia'
  | 'pesaje';

export type PriorityType = 'prioritario' | 'rutina' | 'sanidad' | 'veterinaria';

export interface TimelineEvent {
  id: string;
  date: string;
  type: EventType;
  title: string;
  details: string;
  badge: string;
  timeAgo?: string;
  operator?: string;
  medicine?: string;
  dose?: string;
  route?: string;
  batchNumber?: string;
  withdrawalDays?: number;
  synced?: boolean;
}

export interface Animal {
  id: string;
  earTagNumber: string; // e.g. "#1045", "#0482"
  senasaId: string; // e.g. "AR-094-1045"
  name: string; // e.g. "Luna", "La Morocha"
  breed: string; // e.g. "Holstein", "Girolando (5/8 Holstein, 3/8 Gyr)"
  category: 'vaca' | 'toro' | 'ternero' | 'novillo' | 'oveja';
  sex: 'hembra' | 'macho';
  birthDate: string;
  ageStr: string;
  currentWeight: number; // in kg
  birthWeight: number;
  weaningWeight: number;
  dailyGainRate: number; // GMD kg/día
  potrero: string; // e.g. "Potrero 3 - Las Palmeras", "Potrero 4 - El Guayabo"
  status: 'sano' | 'observacion' | 'cuarentena' | 'prenada';
  photoUrl: string;
  healthAlert?: {
    active: boolean;
    title: string;
    medicine: string;
    description: string;
    doseProgress: string;
    withdrawalHoursRemaining: number;
    withdrawalEndDate: string;
    prohibitMilkDelivery: boolean;
    veterinarian: string;
  };
  healthData: {
    lastVaccine: {
      name: string;
      date: string;
      nextDueDate: string;
      nextName: string;
    };
    lastTreatment: {
      name: string;
      dateDaysAgo: number;
      status: string;
    };
    clinicalState: {
      score: string;
      note: string;
    };
    vetNotes: string;
  };
  reproductiveData: {
    status: string; // "Preñada (4 meses)", "Inseminada", "Celo Natural", "Vacía"
    inseminationDate?: string;
    sire?: string;
    estimatedCalvingDate?: string;
  };
  productionData: {
    dailyMilkYield: number; // L/día
    fatPercentage: number;
    proteinPercentage: number;
    monthlyAvg: number;
    lactationStage: string;
    superiorityVsHerd: number; // percentage e.g. +12
  };
  timelineEvents: TimelineEvent[];
}

export interface ScheduledEvent {
  id: string;
  title: string;
  category: 'vacunacion' | 'sanidad' | 'reproductivo' | 'manejo';
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:30 AM"
  targetLot: string;
  animalId?: string;
  location: string;
  responsible: string;
  priority: PriorityType;
  tagLabel?: string;
  completed: boolean;
}

export interface FarmStats {
  totalBovinos: number;
  hembras: number;
  machos: number;
  enTratamiento: number;
  enRetiro: number;
  porVacunarSemana: number;
  vacasOrdeno: number;
  produccionDiariaLitros: number;
  promedioLitrosVaca: number;
  gmdEngorde: number;
  gmdMeta: number;
}
