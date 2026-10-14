import React, { useState } from 'react';
import { Animal, TimelineEvent } from '../types';
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Calendar,
  Share2,
  Edit3,
  Scale,
  Heart,
  Droplet,
  ShieldAlert,
  Activity,
  CheckCircle,
  X,
  Camera,
  MapPin,
  QrCode,
  Radio,
} from 'lucide-react';

interface AnimalesViewProps {
  animals: Animal[];
  selectedAnimal: Animal | null;
  onSelectAnimal: (animal: Animal | null) => void;
  onRegisterEventForAnimal: (animal: Animal) => void;
  onUpdateAnimal: (updatedAnimal: Animal) => void;
  onAddNewAnimal: (animal: Animal) => void;
  onOpenScanner: () => void;
}

export const AnimalesView: React.FC<AnimalesViewProps> = ({
  animals,
  selectedAnimal,
  onSelectAnimal,
  onRegisterEventForAnimal,
  onUpdateAnimal,
  onAddNewAnimal,
  onOpenScanner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [activeDossierTab, setActiveDossierTab] = useState<'salud' | 'reproductivo' | 'produccion'>('salud');
  const [showNewAnimalModal, setShowNewAnimalModal] = useState(false);
  const [showMovePastureModal, setShowMovePastureModal] = useState(false);
  const [selectedNewPasture, setSelectedNewPasture] = useState('');

  // New Animal form state
  const [newTag, setNewTag] = useState('');
  const [newName, setNewName] = useState('');
  const [newBreed, setNewBreed] = useState('Holstein');
  const [newCategory, setNewCategory] = useState<'vaca' | 'toro' | 'ternero' | 'novillo' | 'oveja'>('vaca');
  const [newSex, setNewSex] = useState<'hembra' | 'macho'>('hembra');
  const [newWeight, setNewWeight] = useState('450');
  const [newPasture, setNewPasture] = useState('Potrero 3 - Las Palmeras');

  const pasturesList = [
    'Potrero 1 - Corral Central',
    'Potrero 2 - Cuna & Recría',
    'Potrero 3 - Las Palmeras',
    'Potrero 4 - El Guayabo',
    'Pastoreo Norte - Potrero 5',
    'Lote Hospital • Potrero A',
  ];

  // Filter animals
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.earTagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.senasaId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.potrero.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'todos') return true;
    if (filterCategory === 'ordeno') return animal.productionData.dailyMilkYield > 0;
    if (filterCategory === 'tratamiento') return animal.healthAlert?.active;
    if (filterCategory === 'prenadas') return animal.reproductiveData.status.toLowerCase().includes('preñada');
    if (filterCategory === 'terneros') return animal.category === 'ternero';
    if (filterCategory === 'toros') return animal.category === 'toro';
    return true;
  });

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim() || !newName.trim()) return;

    const formattedTag = newTag.startsWith('#') ? newTag : `#${newTag}`;
    const weightNum = parseFloat(newWeight) || 400;

    const newAnimalItem: Animal = {
      id: newTag.replace(/\D/g, '') || String(Date.now()).slice(-4),
      earTagNumber: formattedTag,
      senasaId: `AR-094-${newTag.replace(/\D/g, '') || '0000'}`,
      name: newName,
      breed: newBreed,
      category: newCategory,
      sex: newSex,
      birthDate: '2022-01-15',
      ageStr: '3 años',
      currentWeight: weightNum,
      birthWeight: 36,
      weaningWeight: 210,
      dailyGainRate: 0.85,
      potrero: newPasture,
      status: 'sano',
      photoUrl:
        newCategory === 'toro'
          ? 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjId132khsVrsgLKaaM88jLhYz4jRpsfRpX2TXB636xmi1bq-0miO5363VYnNmVd63mwxO0yEcyHgufVklMO9E25X-QUFQNDPRgEX8VBWgIFKHnQQKbLMCy5700lo5XqdCQb9AWaWwSMMawEy2XabGS2wf1d3DkAVoHFmukmgxVgzGWEw3DHQ6HW3QWG-3QKLeSenNSpTBq0_4HgXF7AjoR3RpMKpaXb-jrA-e_5QVN5fqDSQ_DXF47w',
      healthData: {
        lastVaccine: {
          name: 'Anticarbunclosa y Mancha',
          date: '15 Ago 2025',
          nextDueDate: '15 Sep 2025',
          nextName: 'Clostridiosis',
        },
        lastTreatment: {
          name: 'Control Sanitario Inicial',
          dateDaysAgo: 1,
          status: 'Sin restricciones',
        },
        clinicalState: {
          score: 'CC 4.0 / 5.0',
          note: 'Condición corporal óptima. Incorporado al censo.',
        },
        vetNotes: '“Animal dócil en manga, sin signos de estrés.”',
      },
      reproductiveData: {
        status: newSex === 'hembra' ? 'Apta para servicio' : 'Reproductor joven',
      },
      productionData: {
        dailyMilkYield: newCategory === 'vaca' ? 22.0 : 0,
        fatPercentage: 3.8,
        proteinPercentage: 3.3,
        monthlyAvg: 21.5,
        lactationStage: 'En producción',
        superiorityVsHerd: 5,
      },
      timelineEvents: [
        {
          id: `ev-${Date.now()}`,
          date: 'HOY',
          type: 'pesaje',
          title: 'Alta en Registro de Campo',
          details: `Pesaje inicial: ${weightNum} kg. Asignado a ${newPasture}.`,
          badge: 'Alta',
          operator: 'Carlos Mendoza',
          synced: false,
        },
      ],
    };

    onAddNewAnimal(newAnimalItem);
    setShowNewAnimalModal(false);
    onSelectAnimal(newAnimalItem);
    setNewTag('');
    setNewName('');
  };

  const handleMovePasture = () => {
    if (!selectedAnimal || !selectedNewPasture) return;
    const updated: Animal = {
      ...selectedAnimal,
      potrero: selectedNewPasture,
      timelineEvents: [
        {
          id: `ev-move-${Date.now()}`,
          date: 'HOY',
          type: 'pesaje',
          title: 'Rotación de Potrero',
          details: `Movido a ${selectedNewPasture}.`,
          badge: 'Manejo',
          operator: 'Carlos Mendoza',
          synced: false,
        },
        ...selectedAnimal.timelineEvents,
      ],
    };
    onUpdateAnimal(updated);
    setShowMovePastureModal(false);
  };

  // If viewing an individual animal dossier (Hoja de vida)
  if (selectedAnimal) {
    const a = selectedAnimal;
    const isUnderWithdrawal = a.healthAlert?.active;

    return (
      <div className="flex flex-col gap-4 pb-12 animate-in fade-in duration-150">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => onSelectAnimal(null)}
            className="flex items-center gap-1.5 h-11 px-3 bg-[#e4eae3] hover:bg-[#dee4dd] text-[#171d19] rounded-xl font-display font-bold text-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Volver al Rodeo</span>
          </button>

          <span className="font-display text-xs text-[#75584d] font-bold">
            Hoja de Vida del Animal
          </span>
        </div>

        {/* Ear Tag & Identification Hero Header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {/* Physical Ear Tag Vinyl Graphic */}
            <div className="flex items-center gap-2.5">
              <div className="bg-[#fed7ca] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-[#e4beb2]">
                <span className="material-symbols-outlined text-[#795c51] text-[20px]">sell</span>
                <span className="font-display font-bold text-xl text-[#2b160f] tracking-wider">
                  {a.earTagNumber}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[10px] uppercase text-[#41493e] font-bold">
                  SENASA OFICIAL
                </span>
                <span className="font-display font-bold text-xs text-[#171d19] tracking-tight">
                  {a.senasaId}
                </span>
              </div>
            </div>

            {/* Status Chip */}
            <span
              className={`font-display text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs ${
                isUnderWithdrawal
                  ? 'bg-[#ffdad6] text-[#93000a]'
                  : 'bg-[#acf4a4] text-[#002203]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isUnderWithdrawal ? 'bg-[#ba1a1a]' : 'bg-[#00450d]'
                } animate-pulse`}
              ></span>
              {isUnderWithdrawal ? 'En Observación' : 'Sana · Activa'}
            </span>
          </div>

          {/* Cow Nickname, Breed and Weight */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#171d19] leading-tight">
                {a.name}
              </h2>
              <p className="text-xs text-[#41493e] font-medium">
                {a.breed} • {a.sex === 'hembra' ? 'Hembra' : 'Macho'}
              </p>
            </div>
            <div className="text-right">
              <span className="font-display font-bold text-2xl text-[#00450d] leading-none">
                {a.currentWeight} kg
              </span>
              <p className="font-display text-[10px] text-[#41493e] font-bold">
                Pesado hace 3 días
              </p>
            </div>
          </div>

          {/* High-Contrast Milk Withdrawal Alert if active */}
          {isUnderWithdrawal && a.healthAlert && (
            <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-xl flex flex-col gap-1.5 shadow-sm border border-[#ba1a1a]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-[#ba1a1a] material-symbols-fill">
                    warning
                  </span>
                  <span className="font-display text-xs font-bold uppercase tracking-wide">
                    ESTADO: EN OBSERVACIÓN / RETIRO LECHE
                  </span>
                </div>
                <span className="bg-[#ba1a1a] text-white text-[10px] font-display font-bold px-2 py-0.5 rounded-full">
                  ACTIVO
                </span>
              </div>
              <p className="font-display font-bold text-sm text-[#171d19]">
                {a.healthAlert.title}
              </p>
              <div className="bg-[#ba1a1a] text-white p-2 rounded-lg flex items-center justify-between mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">
                    do_not_disturb_on
                  </span>
                  <span className="font-display text-xs font-bold uppercase">
                    NO ENTREGAR LECHE A TANQUE
                  </span>
                </div>
                <span className="font-display text-xs font-bold">
                  {a.healthAlert.withdrawalHoursRemaining}h restantes
                </span>
              </div>
              <span className="text-[11px] text-[#41493e] font-medium">
                Responsable: {a.healthAlert.veterinarian}
              </span>
            </div>
          )}

          {/* Photo and Biological Grid */}
          <div className="flex gap-3 items-center pt-2 border-t border-[#eff5ee]">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-[#e9efe9] shadow-inner">
              <img
                alt={a.name}
                src={a.photoUrl}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-display font-bold px-1.5 py-0.5 rounded">
                MANGA
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1 min-w-0">
              <div className="bg-[#eff5ee] p-2 rounded-xl">
                <span className="font-display text-[9px] text-[#41493e] uppercase font-bold block">
                  Edad
                </span>
                <span className="font-display text-xs text-[#171d19] font-bold">
                  {a.ageStr}
                </span>
              </div>
              <div className="bg-[#eff5ee] p-2 rounded-xl">
                <span className="font-display text-[9px] text-[#41493e] uppercase font-bold block">
                  Nacimiento
                </span>
                <span className="font-display text-xs text-[#171d19] font-bold truncate block">
                  {a.birthDate}
                </span>
              </div>
              <div className="bg-[#eff5ee] p-2 rounded-xl col-span-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#00450d]">
                  fence
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-[9px] text-[#41493e] uppercase font-bold">
                    Potrero Actual
                  </span>
                  <span className="font-display text-xs font-bold text-[#171d19] truncate">
                    {a.potrero}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trajectory Weight Metrics (Field sketch replica) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-bold uppercase text-[#75584d] tracking-wider">
              Trayectoria Ponderal
            </span>
            <span className="text-xs text-[#41493e]">Último pesaje: Hace 3 días</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#eff5ee] p-2 rounded-xl flex flex-col justify-between">
              <span className="font-display text-[10px] text-[#41493e] uppercase font-bold">
                Al nacer
              </span>
              <span className="font-display text-lg font-bold text-[#171d19] mt-1">
                {a.birthWeight}
              </span>
              <span className="text-[10px] text-[#717a6d]">kg</span>
            </div>
            <div className="bg-[#eff5ee] p-2 rounded-xl flex flex-col justify-between">
              <span className="font-display text-[10px] text-[#41493e] uppercase font-bold">
                Destete
              </span>
              <span className="font-display text-lg font-bold text-[#171d19] mt-1">
                {a.weaningWeight}
              </span>
              <span className="text-[10px] text-[#717a6d]">kg</span>
            </div>
            <div className="bg-[#acf4a4]/40 p-2 rounded-xl flex flex-col justify-between border border-[#acf4a4]">
              <span className="font-display text-[10px] text-[#00450d] uppercase font-bold">
                Actual
              </span>
              <span className="font-display text-lg font-bold text-[#00450d] mt-1">
                {a.currentWeight}
              </span>
              <span className="text-[10px] text-[#00450d] font-bold">kg</span>
            </div>
            <div className="bg-[#eff5ee] p-2 rounded-xl flex flex-col justify-between">
              <span className="font-display text-[10px] text-[#41493e] uppercase font-bold">
                GMD
              </span>
              <span className="font-display text-lg font-bold text-[#003d65] mt-1">
                {a.dailyGainRate}
              </span>
              <span className="text-[10px] text-[#717a6d]">kg/día</span>
            </div>
          </div>

          {/* Sparkline Graphic */}
          <div className="pt-2 border-t border-[#eff5ee] flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#00450d]">
                show_chart
              </span>
              <span className="text-[#41493e]">Crecimiento vs. Rodeo:</span>
              <span className="font-display font-bold text-[#00450d]">
                +{a.productionData.superiorityVsHerd}% superior
              </span>
            </div>
            <svg
              className="w-24 h-6 text-[#00450d]"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 100 24"
            >
              <polyline points="0,20 25,18 50,12 75,10 100,3"></polyline>
            </svg>
          </div>
        </div>

        {/* Domain Navigation Tabs: Salud / Reproductivo / Producción */}
        <div className="flex p-1 bg-[#e4eae3] rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveDossierTab('salud')}
            className={`flex-1 h-11 rounded-xl font-display text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeDossierTab === 'salud'
                ? 'bg-white text-[#00450d] shadow-sm'
                : 'text-[#41493e]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                activeDossierTab === 'salud' ? 'material-symbols-fill' : ''
              }`}
            >
              medical_services
            </span>
            <span>Salud</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDossierTab('reproductivo')}
            className={`flex-1 h-11 rounded-xl font-display text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeDossierTab === 'reproductivo'
                ? 'bg-white text-[#00450d] shadow-sm'
                : 'text-[#41493e]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                activeDossierTab === 'reproductivo' ? 'material-symbols-fill' : ''
              }`}
            >
              favorite
            </span>
            <span>Reproductivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDossierTab('produccion')}
            className={`flex-1 h-11 rounded-xl font-display text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeDossierTab === 'produccion'
                ? 'bg-white text-[#00450d] shadow-sm'
                : 'text-[#41493e]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                activeDossierTab === 'produccion' ? 'material-symbols-fill' : ''
              }`}
            >
              water_drop
            </span>
            <span>Producción</span>
          </button>
        </div>

        {/* Tab 1: Salud */}
        {activeDossierTab === 'salud' && (
          <div className="flex flex-col gap-3">
            {/* Card 1: Última Vacuna */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eff5ee] flex items-center justify-center text-[#00450d] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">vaccines</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-[#171d19]">
                    Última Vacuna
                  </h4>
                  <span className="font-display text-[10px] px-2 py-0.5 rounded bg-[#eff5ee] text-[#41493e] font-bold">
                    {a.healthData.lastVaccine.date}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#171d19] mt-0.5">
                  {a.healthData.lastVaccine.name}
                </p>
                <div className="mt-2 flex items-center gap-1.5 p-2 rounded-xl bg-[#eff5ee] text-xs text-[#75584d]">
                  <span className="material-symbols-outlined text-[16px]">event_upcoming</span>
                  <span>
                    Próxima:{' '}
                    <strong className="text-[#00450d]">
                      {a.healthData.lastVaccine.nextName}
                    </strong>{' '}
                    ({a.healthData.lastVaccine.nextDueDate})
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Último Tratamiento */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fed7ca] flex items-center justify-center text-[#75584d] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">sanitizer</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-[#171d19]">
                    Último Tratamiento
                  </h4>
                  <span className="font-display text-[10px] px-2 py-0.5 rounded bg-[#fed7ca] text-[#795c51] font-bold">
                    Hace {a.healthData.lastTreatment.dateDaysAgo} días
                  </span>
                </div>
                <p className="text-sm text-[#171d19] mt-0.5">
                  {a.healthData.lastTreatment.name}
                </p>
                <span className="inline-block mt-1 text-xs text-[#00450d] font-bold">
                  {a.healthData.lastTreatment.status}
                </span>
              </div>
            </div>

            {/* Card 3: Estado Clínico */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eff5ee] flex items-center justify-center text-[#00450d] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-[#171d19]">
                    Estado Clínico
                  </h4>
                  <span className="font-display text-[11px] px-2 py-0.5 rounded-full bg-[#acf4a4] text-[#002203] font-bold">
                    {a.healthData.clinicalState.score}
                  </span>
                </div>
                <p className="text-xs text-[#41493e] mt-1 leading-snug">
                  {a.healthData.clinicalState.note}
                </p>
              </div>
            </div>

            {/* Card 4: Observaciones Veterinarias */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eff5ee] flex items-center justify-center text-[#41493e] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">notes</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-sm text-[#171d19]">
                  Observaciones Veterinarias
                </h4>
                <p className="text-xs text-[#41493e] mt-1.5 italic bg-[#eff5ee] p-3 rounded-xl leading-relaxed">
                  {a.healthData.vetNotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reproductivo */}
        {activeDossierTab === 'reproductivo' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00450d]">pregnant_woman</span>
                  <h4 className="font-display font-bold text-sm text-[#171d19]">
                    Estado Reproductivo Actual
                  </h4>
                </div>
                <span className="font-display text-[11px] px-2.5 py-1 rounded-full bg-[#fed7ca] text-[#795c51] font-bold">
                  {a.reproductiveData.status}
                </span>
              </div>
              <p className="text-xs text-[#41493e] mt-1">
                Servicio con: <strong>{a.reproductiveData.sire || 'Monta natural controlada'}</strong>
              </p>
              {a.reproductiveData.inseminationDate && (
                <div className="flex justify-between items-center bg-[#eff5ee] p-2.5 rounded-xl text-xs">
                  <span className="text-[#41493e]">Fecha Inseminación:</span>
                  <span className="font-display font-bold text-[#171d19]">
                    {a.reproductiveData.inseminationDate}
                  </span>
                </div>
              )}
              {a.reproductiveData.estimatedCalvingDate && (
                <div className="flex justify-between items-center bg-[#acf4a4]/40 p-2.5 rounded-xl text-xs border border-[#acf4a4]">
                  <span className="text-[#00450d] font-bold">Fecha estimada de parto:</span>
                  <span className="font-display font-bold text-[#00450d]">
                    {a.reproductiveData.estimatedCalvingDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Producción */}
        {activeDossierTab === 'produccion' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00450d]">water_drop</span>
                  <h4 className="font-display font-bold text-sm text-[#171d19]">
                    Producción Lechera Diaria
                  </h4>
                </div>
                <span className="font-display font-bold text-2xl text-[#00450d]">
                  {a.productionData.dailyMilkYield} L/día
                </span>
              </div>
              <p className="text-xs text-[#41493e]">
                {a.productionData.lactationStage} • Ordeñe mecánico x2 turnos.
              </p>
              <div className="grid grid-cols-2 gap-2 bg-[#eff5ee] p-2.5 rounded-xl text-center">
                <div>
                  <span className="font-display text-[10px] text-[#41493e] uppercase font-bold block">
                    Grasa
                  </span>
                  <span className="font-display font-bold text-base text-[#171d19]">
                    {a.productionData.fatPercentage}%
                  </span>
                </div>
                <div>
                  <span className="font-display text-[10px] text-[#41493e] uppercase font-bold block">
                    Proteína
                  </span>
                  <span className="font-display font-bold text-base text-[#171d19]">
                    {a.productionData.proteinPercentage}%
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#eff5ee] flex justify-between text-xs">
                <span className="text-[#41493e]">Promedio mensual:</span>
                <span className="font-display font-bold text-[#171d19]">
                  {a.productionData.monthlyAvg} L/día
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Event History Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#41493e]">
                history
              </span>
              <h3 className="font-display font-bold text-sm text-[#171d19]">
                Historial de Eventos
              </h3>
            </div>
            <span className="font-display text-[10px] uppercase text-[#00450d] font-bold">
              {a.timelineEvents.length} eventos
            </span>
          </div>

          <div className="relative flex flex-col space-y-3 pl-4 before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#dee4dd]">
            {a.timelineEvents.map((ev) => (
              <div key={ev.id} className="relative flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center -ml-[19px] z-10 shadow-xs shrink-0 ${
                    ev.type === 'tratamiento'
                      ? 'bg-[#ffdad6] text-[#ba1a1a]'
                      : ev.type === 'reproductivo'
                      ? 'bg-[#fed7ca] text-[#75584d]'
                      : ev.type === 'vacunacion'
                      ? 'bg-[#acf4a4] text-[#00450d]'
                      : 'bg-[#cfe5ff] text-[#003d65]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] material-symbols-fill">
                    {ev.type === 'tratamiento'
                      ? 'vaccines'
                      : ev.type === 'reproductivo'
                      ? 'favorite'
                      : ev.type === 'vacunacion'
                      ? 'health_and_safety'
                      : 'scale'}
                  </span>
                </div>
                <div className="bg-[#eff5ee] rounded-xl p-2.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`font-display text-[10px] font-bold uppercase ${
                        ev.type === 'tratamiento'
                          ? 'text-[#ba1a1a]'
                          : ev.type === 'reproductivo'
                          ? 'text-[#75584d]'
                          : 'text-[#00450d]'
                      }`}
                    >
                      {ev.date} • {ev.type.toUpperCase()}
                    </span>
                    {ev.timeAgo && (
                      <span className="text-[10px] text-[#41493e]">{ev.timeAgo}</span>
                    )}
                  </div>
                  <p className="font-display font-bold text-xs text-[#171d19] mt-0.5">
                    {ev.title}
                  </p>
                  <span className="text-[11px] text-[#41493e] block leading-tight mt-0.5">
                    {ev.details}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary and Secondary Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onRegisterEventForAnimal(a)}
            className="w-full h-14 bg-[#1b5e20] hover:bg-[#00450d] text-white rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Registrar Nuevo Evento para {a.earTagNumber}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedNewPasture(a.potrero);
                setShowMovePastureModal(true);
              }}
              className="h-12 bg-[#eff5ee] hover:bg-[#e4eae3] text-[#171d19] rounded-xl font-display text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#75584d]">
                swap_horiz
              </span>
              <span>Mover Potrero</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectAnimal(null)}
              className="h-12 bg-[#eff5ee] hover:bg-[#e4eae3] text-[#171d19] rounded-xl font-display text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#41493e]">
                history
              </span>
              <span>Ver Todo el Rodeo</span>
            </button>
          </div>
        </div>

        {/* Move Pasture Modal */}
        {showMovePastureModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#dee4dd] pb-2">
                <h3 className="font-display font-bold text-base text-[#171d19]">
                  Rotar Potrero para {a.name} ({a.earTagNumber})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMovePastureModal(false)}
                  className="w-7 h-7 rounded-full bg-[#eff5ee] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#41493e]" />
                </button>
              </div>

              <label className="text-xs font-display font-bold text-[#41493e]">
                Selecciona la nueva pastura / corral:
              </label>
              <select
                value={selectedNewPasture}
                onChange={(e) => setSelectedNewPasture(e.target.value)}
                className="w-full h-12 px-3 bg-[#eff5ee] rounded-xl font-display text-sm text-[#171d19] focus:outline-none"
              >
                {pasturesList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleMovePasture}
                className="w-full h-12 bg-[#00450d] text-white rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 mt-2 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirmar Traslado</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Herd List view
  return (
    <div className="flex flex-col gap-4 pb-12 animate-in fade-in duration-150">
      {/* Top Banner & Quick NFC/QR Chute button */}
      <section className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onOpenScanner}
          className="w-full bg-[#eff5ee] hover:bg-[#e4eae3] active:bg-[#dee4dd] rounded-2xl p-3.5 shadow-sm transition-all flex items-center justify-between text-left group border border-[#dee4dd]/60"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#1b5e20] text-white flex items-center justify-center shrink-0 shadow-sm group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[24px]">sensors</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm text-[#171d19] truncate">
                  Escanear Arete o Chip
                </span>
                <span className="bg-[#fed7ca] text-[#795c51] font-display text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0">
                  NFC / QR
                </span>
              </div>
              <span className="text-xs text-[#41493e] truncate">
                Acerca el celular a la caravana del animal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#00450d] pl-2 shrink-0">
            <span className="material-symbols-outlined text-[24px]">photo_camera</span>
          </div>
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#717a6d]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por arete: Ej. #1045, #0482 o nombre"
            className="w-full h-12 pl-10 pr-10 bg-white text-[#171d19] font-display text-sm rounded-xl shadow-xs border border-[#dee4dd] focus:outline-none focus:ring-2 focus:ring-[#00450d]/40 placeholder:text-[#717a6d]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#41493e]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'ordeno', label: 'En Ordeño' },
            { id: 'tratamiento', label: 'En Tratamiento' },
            { id: 'prenadas', label: 'Preñadas' },
            { id: 'terneros', label: 'Terneros' },
            { id: 'toros', label: 'Toros' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? 'bg-[#00450d] text-white shadow-xs'
                  : 'bg-white text-[#41493e] border border-[#dee4dd] hover:bg-[#eff5ee]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Herd Count & + Add Animal button */}
      <div className="flex items-center justify-between px-1">
        <span className="font-display text-xs font-bold text-[#41493e] uppercase tracking-wide">
          Mostrando {filteredAnimals.length} de {animals.length} animales
        </span>
        <button
          type="button"
          onClick={() => setShowNewAnimalModal(true)}
          className="h-9 px-3 bg-[#1b5e20] text-white rounded-xl font-display text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#00450d] active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Nuevo Animal</span>
        </button>
      </div>

      {/* Animal Cards Grid / List */}
      <div className="flex flex-col gap-3">
        {filteredAnimals.map((animal) => {
          const isUnderWithdrawal = animal.healthAlert?.active;
          return (
            <div
              key={animal.id}
              onClick={() => onSelectAnimal(animal)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-all active:scale-99"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Ear Tag badge */}
                  <div className="bg-[#fed7ca] px-2.5 py-1 rounded-xl flex items-center gap-1 border border-[#e4beb2]">
                    <span className="material-symbols-outlined text-[#795c51] text-[18px]">
                      sell
                    </span>
                    <span className="font-display font-bold text-base text-[#2b160f]">
                      {animal.earTagNumber}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-base text-[#171d19] truncate">
                        {animal.name}
                      </h3>
                      {animal.status === 'sano' && (
                        <span className="material-symbols-outlined text-[#00450d] text-[16px] material-symbols-fill">
                          verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#41493e] truncate">
                      {animal.breed}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-display font-bold text-base text-[#00450d]">
                    {animal.currentWeight} kg
                  </span>
                  <span
                    className={`block font-display text-[9px] font-bold uppercase px-2 py-0.5 rounded-full mt-0.5 ${
                      isUnderWithdrawal
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : 'bg-[#acf4a4] text-[#002203]'
                    }`}
                  >
                    {isUnderWithdrawal ? 'En Retiro' : 'Sana'}
                  </span>
                </div>
              </div>

              {/* Photo & Quick specs */}
              <div className="flex items-center gap-3 bg-[#eff5ee] p-2 rounded-xl">
                <img
                  alt={animal.name}
                  src={animal.photoUrl}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="grid grid-cols-2 gap-2 flex-1 text-xs">
                  <div>
                    <span className="text-[10px] text-[#41493e] block font-display uppercase">
                      Potrero
                    </span>
                    <span className="font-display font-bold text-[#171d19] truncate block">
                      {animal.potrero.split(' - ')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#41493e] block font-display uppercase">
                      Producción
                    </span>
                    <span className="font-display font-bold text-[#003d65] truncate block">
                      {animal.productionData.dailyMilkYield > 0
                        ? `${animal.productionData.dailyMilkYield} L/d`
                        : animal.category === 'toro'
                        ? 'Semental'
                        : 'Recría'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#41493e] text-[20px]">
                  chevron_right
                </span>
              </div>
            </div>
          );
        })}

        {filteredAnimals.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2 border border-[#dee4dd]">
            <span className="material-symbols-outlined text-4xl text-[#717a6d]">search_off</span>
            <p className="font-display font-bold text-sm text-[#171d19]">
              No se encontraron animales con "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('todos');
              }}
              className="text-xs font-display font-bold text-[#00450d] underline mt-1"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>

      {/* Modal: New Animal */}
      {showNewAnimalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dee4dd] pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#acf4a4] text-[#002203] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-base text-[#171d19]">
                  Registrar Nuevo Bovino / Animal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAnimalModal(false)}
                className="w-7 h-7 rounded-full bg-[#eff5ee] flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#41493e]" />
              </button>
            </div>

            <form onSubmit={handleCreateAnimal} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">
                    Número de Arete / Caravana
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ej. #0988"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="h-11 px-3 bg-[#eff5ee] rounded-xl font-display text-sm font-bold text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#00450d]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">
                    Nombre / Apodo
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mariposa"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-11 px-3 bg-[#eff5ee] rounded-xl font-display text-sm font-bold text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#00450d]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">
                    Raza
                  </span>
                  <select
                    value={newBreed}
                    onChange={(e) => setNewBreed(e.target.value)}
                    className="h-11 px-3 bg-[#eff5ee] rounded-xl font-display text-xs font-bold text-[#171d19] focus:outline-none"
                  >
                    <option value="Holstein">Holstein</option>
                    <option value="Girolando">Girolando</option>
                    <option value="Jersey">Jersey</option>
                    <option value="Brahman">Brahman</option>
                    <option value="Angus">Angus</option>
                    <option value="Brangus">Brangus</option>
                    <option value="Pardo Suizo">Pardo Suizo</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">
                    Categoría
                  </span>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setNewCategory(cat);
                      if (cat === 'toro') setNewSex('macho');
                      if (cat === 'vaca') setNewSex('hembra');
                    }}
                    className="h-11 px-3 bg-[#eff5ee] rounded-xl font-display text-xs font-bold text-[#171d19] focus:outline-none"
                  >
                    <option value="vaca">Vaca Lechera</option>
                    <option value="toro">Toro Reproductor</option>
                    <option value="ternero">Ternero / Cría</option>
                    <option value="novillo">Novillo Engorde</option>
                    <option value="oveja">Oveja</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">
                    Peso Actual (kg)
                  </span>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="h-11 px-3 bg-[#eff5ee] rounded-xl font-display text-sm font-bold text-[#171d19] focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">
                    Potrero Asignado
                  </span>
                  <select
                    value={newPasture}
                    onChange={(e) => setNewPasture(e.target.value)}
                    className="h-11 px-2.5 bg-[#eff5ee] rounded-xl font-display text-xs font-bold text-[#171d19] focus:outline-none"
                  >
                    {pasturesList.map((p) => (
                      <option key={p} value={p}>
                        {p.split(' - ')[0]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#1b5e20] hover:bg-[#00450d] text-white rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 mt-2 shadow-sm active:scale-98 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Guardar Animal en Finca</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
