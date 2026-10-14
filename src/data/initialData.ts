import { Animal, ScheduledEvent, FarmStats, TimelineEvent } from '../types';

export const INITIAL_ANIMALS: Animal[] = [
  {
    id: '1045',
    earTagNumber: '#1045',
    senasaId: 'AR-094-1045',
    name: 'Luna',
    breed: 'Holstein',
    category: 'vaca',
    sex: 'hembra',
    birthDate: '2021-08-10',
    ageStr: '4 años',
    currentWeight: 520,
    birthWeight: 38.2,
    weaningWeight: 215.0,
    dailyGainRate: 0.88,
    potrero: 'Potrero 3 - Las Palmeras',
    status: 'sano',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-rnPcvEeAqcLNUHk592qqlSA6HxhVpkZcjwfXvsjab7qoAew-lf7GRj0rn5Io-_rVXoF0CZl88PSEWaQ7l1zsrq4jLQAnvEBlPUSM62lw-QOlXPRIrFtAULv82hCisJiLQEjQcyLD-onz74RkoXFnnXWej_388QbhZz1cLUmScw3xoHzvZLX6x9fT7cUmiv9ThJgaC1H5kxj4lVgZWO1OzBZFs2xS54JVrNGAdjzcP-y-Nv55i9T7Rg',
    healthData: {
      lastVaccine: {
        name: 'Anticarbunclosa y Mancha',
        date: '15 Ago 2025',
        nextDueDate: '15 Sep 2025',
        nextName: 'Clostridiosis',
      },
      lastTreatment: {
        name: 'Baño garrapaticida y antiparasitario ivermectina.',
        dateDaysAgo: 18,
        status: 'Período de resguardo cumplido',
      },
      clinicalState: {
        score: 'CC 4.0 / 5.0',
        note: 'Excelente condición corporal. Sin sintomatología clínica. Apta para ordeño sin período de carencia.',
      },
      vetNotes: '“Vaca dócil, excelente temperamento lechero en manga. Responde muy bien a suplementación con sales minerales. Chequeo de mastitis negativo.”',
    },
    reproductiveData: {
      status: 'Preñada (4 meses)',
      inseminationDate: '15 Abr 2025',
      sire: 'Toro Holstein Registro AR-908',
      estimatedCalvingDate: '20 Dic 2025',
    },
    productionData: {
      dailyMilkYield: 28.0,
      fatPercentage: 3.8,
      proteinPercentage: 3.3,
      monthlyAvg: 27.8,
      lactationStage: 'Plena lactancia (Pico sostenido)',
      superiorityVsHerd: 12,
    },
    timelineEvents: [
      {
        id: 'ev-luna-1',
        date: '15 AGO 2025',
        type: 'vacunacion',
        title: 'Anticarbunclosa y Mancha',
        details: 'Dosis semestral oficial preventiva. Lote Vacas Ordeño.',
        badge: 'Campaña',
        operator: 'Dr. Méndez',
        synced: true,
      },
      {
        id: 'ev-luna-2',
        date: '28 JUL 2025',
        type: 'desparasitacion',
        title: 'Baño Garrapaticida & Ivermectina',
        details: 'Aspersión y Pour-on. Período de carencia completado.',
        badge: 'Sanidad',
        operator: 'Carlos Mendoza',
        synced: true,
      },
      {
        id: 'ev-luna-3',
        date: '15 ABR 2025',
        type: 'reproductivo',
        title: 'Inseminación Artificial (I.A.)',
        details: 'Semen Toro AR-908. Diagnóstico de preñez positivo confirmado por ecografía.',
        badge: 'Reproducción',
        operator: 'Dr. Méndez',
        synced: true,
      },
      {
        id: 'ev-luna-4',
        date: '11 OCT 2025',
        type: 'pesaje',
        title: 'Pesaje Periódico en Brete',
        details: '520 kg (+12 kg respecto al bimestre anterior). GMD 0.88 kg/d.',
        badge: 'Control',
        operator: 'Carlos Mendoza',
        synced: true,
      },
    ],
  },
  {
    id: '0482',
    earTagNumber: '#0482',
    senasaId: 'AR-084-9912',
    name: 'La Morocha',
    breed: 'Girolando (5/8 Holstein, 3/8 Gyr)',
    category: 'vaca',
    sex: 'hembra',
    birthDate: '2021-03-14',
    ageStr: '3 años, 7 meses',
    currentWeight: 540,
    birthWeight: 36.5,
    weaningWeight: 210.0,
    dailyGainRate: 0.82,
    potrero: 'Potrero 4 - El Guayabo',
    status: 'observacion',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjId132khsVrsgLKaaM88jLhYz4jRpsfRpX2TXB636xmi1bq-0miO5363VYnNmVd63mwxO0yEcyHgufVklMO9E25X-QUFQNDPRgEX8VBWgIFKHnQQKbLMCy5700lo5XqdCQb9AWaWwSMMawEy2XabGS2wf1d3DkAVoHFmukmgxVgzGWEw3DHQ6HW3QWG-3QKLeSenNSpTBq0_4HgXF7AjoR3RpMKpaXb-jrA-e_5QVN5fqDSQ_DXF47w',
    healthAlert: {
      active: true,
      title: 'Mastitis subclínica (Cuarto Trasero Der.)',
      medicine: 'Antibiótico Ceftiofur / Penicilina Benzatínica',
      description: 'Penicilina Benzatínica Intramamaria • Dosis 2 de 3',
      doseProgress: 'Dosis 2 de 3',
      withdrawalHoursRemaining: 48,
      withdrawalEndDate: '16 Oct 2025',
      prohibitMilkDelivery: true,
      veterinarian: 'Dr. Ramón Méndez (Vet)',
    },
    healthData: {
      lastVaccine: {
        name: 'Anticarbunclosa y Mancha',
        date: '15 Ago 2024',
        nextDueDate: '14 Oct 2024',
        nextName: 'Antiaftosa Bivalente',
      },
      lastTreatment: {
        name: 'Aplicación intramamaria antibiótica',
        dateDaysAgo: 4,
        status: 'Retiro activo: 48 hs restantes',
      },
      clinicalState: {
        score: 'CC 3.5 / 5.0',
        note: 'Inflamación localizada en cuarto mamario posterior derecho en remisión. Ubre desinflamando.',
      },
      vetNotes: '“Administrar tercera dosis de antibiótico el 14 Oct. Desechar leche de todos los cuartos a pileta hasta completar período de carencia.”',
    },
    reproductiveData: {
      status: 'Inseminada (Preñez Pendiente)',
      inseminationDate: '28 Sep 2024',
      sire: 'Toro Gyr Lechero #99 (Pajuela)',
      estimatedCalvingDate: '05 Jul 2025',
    },
    productionData: {
      dailyMilkYield: 18.5,
      fatPercentage: 3.8,
      proteinPercentage: 3.3,
      monthlyAvg: 20.2,
      lactationStage: '2da Lactancia • Día 142 de ciclo',
      superiorityVsHerd: 4,
    },
    timelineEvents: [
      {
        id: 'ev-morocha-1',
        date: '10 OCT 2024',
        type: 'tratamiento',
        title: 'Aplicación Intramamaria (Dosis 2/3)',
        details: 'Tratamiento Mastitis con Ceftiofur. Responsable: R. Méndez. Retiro de leche obligatorio.',
        badge: 'Tratamiento',
        timeAgo: 'Hace 4d',
        operator: 'Dr. Ramón Méndez',
        synced: true,
      },
      {
        id: 'ev-morocha-2',
        date: '28 SEP 2024',
        type: 'reproductivo',
        title: 'Inseminación Artificial (I.A.)',
        details: 'Toro Gyr Lechero #99 • Celo Natural matutino detectado en corral.',
        badge: 'Reproducción',
        timeAgo: '-16d',
        operator: 'Dr. Ramón Méndez',
        synced: true,
      },
      {
        id: 'ev-morocha-3',
        date: '15 AGO 2024',
        type: 'vacunacion',
        title: 'Anticarbunclosa y Mancha',
        details: 'Lote Completo Potrero 4 • Certificado SENASA.',
        badge: 'Vacunación',
        timeAgo: 'Campaña',
        operator: 'Carlos Mendoza',
        synced: true,
      },
      {
        id: 'ev-morocha-4',
        date: '02 JUL 2024',
        type: 'pesaje',
        title: 'Pesaje en Báscula Chute',
        details: '535 kg (Condición Corporal: 3.5/5). Evolución positiva (+15 kg en 60 días).',
        badge: 'Pesaje',
        operator: 'Carlos Mendoza',
        synced: true,
      },
    ],
  },
  {
    id: '0115',
    earTagNumber: '#0115',
    senasaId: 'AR-055-0115',
    name: 'El Sultán',
    breed: 'Brahman Blanco',
    category: 'toro',
    sex: 'macho',
    birthDate: '2020-05-18',
    ageStr: '5 años',
    currentWeight: 780,
    birthWeight: 42.0,
    weaningWeight: 260.0,
    dailyGainRate: 1.15,
    potrero: 'Potrero 1 - Corral Central',
    status: 'observacion',
    photoUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    healthAlert: {
      active: true,
      title: 'Revisión podológica programada',
      medicine: 'Desinfección de pezuña y sulfato de cobre',
      description: 'Revisión de pezuña derecha delantera por leve renguera.',
      doseProgress: 'Programado 07:00 AM',
      withdrawalHoursRemaining: 0,
      withdrawalEndDate: 'Sin retiro cárnico',
      prohibitMilkDelivery: false,
      veterinarian: 'Dr. Ramón Méndez',
    },
    healthData: {
      lastVaccine: {
        name: 'Antiaftosa y Rabia Paresiante',
        date: '10 Jun 2025',
        nextDueDate: '14 Oct 2025',
        nextName: 'Antiaftosa Campaña',
      },
      lastTreatment: {
        name: 'Desparasitación con Ricobendazol',
        dateDaysAgo: 45,
        status: 'Completado',
      },
      clinicalState: {
        score: 'CC 4.5 / 5.0',
        note: 'Excelente porte y libido de monta. Aplomo anterior derecho bajo observación.',
      },
      vetNotes: '“Toro semental de alta fertilidad. Realizar pediluvio y recorte correctivo de casco.”',
    },
    reproductiveData: {
      status: 'Reproductor Activo',
      sire: 'Brahman Puro Pedigree El Mirador',
    },
    productionData: {
      dailyMilkYield: 0,
      fatPercentage: 0,
      proteinPercentage: 0,
      monthlyAvg: 0,
      lactationStage: 'Semental de monta natural',
      superiorityVsHerd: 25,
    },
    timelineEvents: [
      {
        id: 'ev-sultan-1',
        date: '10 JUN 2025',
        type: 'vacunacion',
        title: 'Vacunación Antiaftosa Oficial',
        details: 'Dosis reglamentaria SENASA en manga central.',
        badge: 'Vacunación',
        operator: 'Carlos Mendoza',
        synced: true,
      },
    ],
  },
  {
    id: '0304',
    earTagNumber: '#0304',
    senasaId: 'AR-094-0304',
    name: 'Canelo',
    breed: 'Novillo Angus x Brangus',
    category: 'ternero',
    sex: 'macho',
    birthDate: '2024-02-10',
    ageStr: '8 meses',
    currentWeight: 220,
    birthWeight: 35.0,
    weaningWeight: 215.0,
    dailyGainRate: 0.95,
    potrero: 'Potrero 2 - Cuna & Recría',
    status: 'sano',
    photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    healthData: {
      lastVaccine: {
        name: 'Triple Clostridial Terneros',
        date: '05 Sep 2025',
        nextDueDate: '05 Nov 2025',
        nextName: 'Refuerzo Queratoconjuntivitis',
      },
      lastTreatment: {
        name: 'Vitaminas AD3E + Fósforo',
        dateDaysAgo: 20,
        status: 'Completado',
      },
      clinicalState: {
        score: 'CC 3.8 / 5.0',
        note: 'Buen desarrollo de armazón óseo y musculatura. Destete reciente.',
      },
      vetNotes: '“Excelente conversión alimenticia con suplementación de silo de maíz.”',
    },
    reproductiveData: {
      status: 'Ternero en Recría',
    },
    productionData: {
      dailyMilkYield: 0,
      fatPercentage: 0,
      proteinPercentage: 0,
      monthlyAvg: 0,
      lactationStage: 'Destete precoz',
      superiorityVsHerd: 8,
    },
    timelineEvents: [
      {
        id: 'ev-canelo-1',
        date: '05 SEP 2025',
        type: 'pesaje',
        title: 'Pesaje de Destete',
        details: '215 kg al destete. Báscula Brete Sur.',
        badge: 'Pesaje',
        operator: 'Carlos Mendoza',
        synced: true,
      },
    ],
  },
  {
    id: '0910',
    earTagNumber: '#0910',
    senasaId: 'AR-OV-0910',
    name: 'Blanquita',
    breed: 'Oveja Dorper x Santa Inés',
    category: 'oveja',
    sex: 'hembra',
    birthDate: '2023-04-12',
    ageStr: '2 años',
    currentWeight: 68,
    birthWeight: 4.2,
    weaningWeight: 28.0,
    dailyGainRate: 0.22,
    potrero: 'Pastoreo Norte - Potrero 5',
    status: 'sano',
    photoUrl: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=800&q=80',
    healthData: {
      lastVaccine: {
        name: 'Clostridial Ovina 8 Vías',
        date: '12 Ago 2025',
        nextDueDate: '18 Sep 2025',
        nextName: 'Desparasitación Oral',
      },
      lastTreatment: {
        name: 'Antiparasitario Levamisol',
        dateDaysAgo: 60,
        status: 'Programada dosis de refuerzo',
      },
      clinicalState: {
        score: 'CC 3.5 / 5.0',
        note: 'Mucosa ocular rosada (FAMACHA Grado 1). Lana limpia.',
      },
      vetNotes: '“Monitoreo de coprología negativo para Fasciola.”',
    },
    reproductiveData: {
      status: 'Servicio natural confirmado',
    },
    productionData: {
      dailyMilkYield: 1.8,
      fatPercentage: 6.2,
      proteinPercentage: 5.4,
      monthlyAvg: 1.7,
      lactationStage: 'Lactancia Ovina',
      superiorityVsHerd: 15,
    },
    timelineEvents: [
      {
        id: 'ev-blanquita-1',
        date: '12 AGO 2025',
        type: 'vacunacion',
        title: 'Clostridiosis Ovina',
        details: 'Lote Ovejas Pastoreo (8 cabezas).',
        badge: 'Sanidad',
        operator: 'Carlos Mendoza',
        synced: true,
      },
    ],
  },
];

export const INITIAL_SCHEDULED_EVENTS: ScheduledEvent[] = [
  {
    id: 'sched-1',
    title: 'Vacunación (clostridiosis)',
    category: 'vacunacion',
    date: '2025-09-15',
    time: '08:30 AM',
    targetLot: 'Lote Vacas Ordeño (12 animales)',
    animalId: '1045',
    location: 'Chute Principal',
    responsible: 'Dr. Méndez',
    priority: 'prioritario',
    tagLabel: 'Inmunización',
    completed: false,
  },
  {
    id: 'sched-2',
    title: 'Revisión de peso',
    category: 'manejo',
    date: '2025-09-15',
    time: '02:00 PM',
    targetLot: 'Terneros destete (3 animales)',
    animalId: '0304',
    location: 'Báscula Brete Sur',
    responsible: 'Carlos Mendoza',
    priority: 'rutina',
    tagLabel: 'Control Crecimiento',
    completed: false,
  },
  {
    id: 'sched-3',
    title: 'Desparasitación',
    category: 'sanidad',
    date: '2025-09-18',
    time: '09:00 AM',
    targetLot: 'Lote Ovejas (8 animales)',
    animalId: '0910',
    location: 'Corral de Pastoreo Norte',
    responsible: 'Carlos Mendoza',
    priority: 'sanidad',
    tagLabel: 'Oral dosificado',
    completed: false,
  },
  {
    id: 'sched-4',
    title: 'Revisión reproductiva',
    category: 'reproductivo',
    date: '2025-09-22',
    time: '10:30 AM',
    targetLot: 'Luna #1045 y Lote Preñez',
    animalId: '1045',
    location: 'Manga Móvil con Ecógrafo',
    responsible: 'Dr. Méndez',
    priority: 'veterinaria',
    tagLabel: 'Ecógrafo móvil',
    completed: false,
  },
  {
    id: 'sched-5',
    title: 'Vacunación Antiaftosa',
    category: 'vacunacion',
    date: '2025-10-14',
    time: '08:30 AM',
    targetLot: 'Lote Reproductores • 48 animales',
    location: 'Manga Principal • Corral Central',
    responsible: 'Carlos Mendoza',
    priority: 'prioritario',
    tagLabel: 'Urgente Hoy',
    completed: false,
  },
  {
    id: 'sched-6',
    title: 'Revisión de pezuña derecha toro #0115',
    category: 'sanidad',
    date: '2025-10-15',
    time: '07:00 AM',
    targetLot: 'Reproductor Brahman #0115',
    animalId: '0115',
    location: 'Potrero 1 - Corral Central',
    responsible: 'Dr. Ramón Méndez',
    priority: 'sanidad',
    tagLabel: 'Podología',
    completed: false,
  },
  {
    id: 'sched-7',
    title: 'Pesaje de destete Lote Terneros',
    category: 'manejo',
    date: '2025-10-14',
    time: '03:30 PM',
    targetLot: 'Lote Terneros (24 crías)',
    location: 'Báscula Brete Sur',
    responsible: 'Carlos Mendoza',
    priority: 'rutina',
    tagLabel: 'Báscula Brete',
    completed: false,
  },
];

export const INITIAL_STATS: FarmStats = {
  totalBovinos: 248,
  hembras: 142,
  machos: 106,
  enTratamiento: 6,
  enRetiro: 2,
  porVacunarSemana: 32,
  vacasOrdeno: 58,
  produccionDiariaLitros: 680,
  promedioLitrosVaca: 11.7,
  gmdEngorde: 0.78,
  gmdMeta: 0.85,
};

const STORAGE_KEYS = {
  ANIMALS: 'ganadocare_animals_v1',
  SCHEDULE: 'ganadocare_schedule_v1',
  STATS: 'ganadocare_stats_v1',
  UNSYNCED: 'ganadocare_unsynced_v1',
};

export function loadAnimals(): Animal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANIMALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading animals from localStorage', e);
  }
  return INITIAL_ANIMALS;
}

export function saveAnimals(animals: Animal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANIMALS, JSON.stringify(animals));
  } catch (e) {
    console.error('Error saving animals to localStorage', e);
  }
}

export function loadSchedule(): ScheduledEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading schedule from localStorage', e);
  }
  return INITIAL_SCHEDULED_EVENTS;
}

export function saveSchedule(schedule: ScheduledEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  } catch (e) {
    console.error('Error saving schedule to localStorage', e);
  }
}

export function loadUnsyncedCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNSYNCED);
    if (raw) return JSON.parse(raw).length;
  } catch (e) {
    console.error('Error loading unsynced count', e);
  }
  return 1; // Default 1 pending item as in UI mockup
}

export function addUnsyncedRecord(record: any): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNSYNCED);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ...record, createdAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.UNSYNCED, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving unsynced record', e);
  }
}

export function clearUnsyncedRecords(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.UNSYNCED, JSON.stringify([]));
  } catch (e) {
    console.error('Error clearing unsynced records', e);
  }
}
