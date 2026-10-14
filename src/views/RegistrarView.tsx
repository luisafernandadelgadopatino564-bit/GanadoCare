import React, { useState } from 'react';
import { Animal, EventType, TimelineEvent } from '../types';
import {
  ShieldAlert,
  Mic,
  MicOff,
  CheckCircle,
  QrCode,
  ArrowLeftRight,
  Calendar,
  Clock,
  FlaskConical,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface RegistrarViewProps {
  animals: Animal[];
  selectedAnimal: Animal;
  onSelectAnimal: (animal: Animal) => void;
  onSaveEvent: (animalId: string, event: TimelineEvent, withdrawalDays: number) => void;
  onOpenScanner: () => void;
  onCancel: () => void;
}

export const RegistrarView: React.FC<RegistrarViewProps> = ({
  animals,
  selectedAnimal,
  onSelectAnimal,
  onSaveEvent,
  onOpenScanner,
  onCancel,
}) => {
  const [currentAnimal, setCurrentAnimal] = useState<Animal>(selectedAnimal);
  const [showAnimalPicker, setShowAnimalPicker] = useState(false);

  // Form states
  const [eventType, setEventType] = useState<EventType>('vacunacion');
  const [appliedDate, setAppliedDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  const [selectedProduct, setSelectedProduct] = useState('Antiaftosa Bivalente Oleosa (AftaVet)');
  const [dose, setDose] = useState<number>(2.0);
  const [route, setRoute] = useState<'subcutanea' | 'intramuscular' | 'topica' | 'oral'>('subcutanea');
  const [batchTrace, setBatchTrace] = useState('Lote: AF-9942 • Vence: 05/2026');
  const [withdrawalDays, setWithdrawalDays] = useState<number>(0);
  const [notes, setNotes] = useState(
    'Aplicación sin novedades en manga. Animal dócil, reaccionó bien. Próximo refuerzo en 6 meses según calendario oficial.'
  );

  // Speech dictation simulation / Web Speech API
  const [isRecording, setIsRecording] = useState(false);

  // Delight modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const productsMap: Record<EventType, string[]> = {
    vacunacion: [
      'Antiaftosa Bivalente Oleosa (AftaVet)',
      'Bacterina Triple Bovina (Clostridial)',
      'Vacuna Anticarbunclosa y Mancha',
      'Vacuna Brucelosis Cepa 19',
      'Vacuna Queratoconjuntivitis Infecciosa',
    ],
    tratamiento: [
      'Oxitetraciclina L.A. 200 mg/ml',
      'Penicilina Benzatínica Intramamaria',
      'Ceftiofur Clorhidrato 50 mg/ml',
      'Flunixin Meglumina Antiinflamatorio',
      'Complejo Vitamínico B12 Fuerte',
    ],
    desparasitacion: [
      'Ivermectina 3.15% L.A. (Bovimect)',
      'Levamisol Fosfato 12%',
      'Albendazol Suspensión Oral 10%',
      'Baño Pour-on Cipermetrina',
    ],
    reproductivo: [
      'Inseminación Artificial (Pajuela Gyr #99)',
      'Diagnóstico de Preñez por Ecografía',
      'Hormona GnRH Inductor de Celo',
      'Prostaglandina F2a Sincronización',
    ],
    cirugia: [
      'Descorne estético / Cauterización',
      'Curación de pezuña / Desvasado podal',
      'Sutura de herida en manga',
    ],
    pesaje: [
      'Control Rutinario de Peso en Báscula',
      'Pesaje de Destete',
      'Pesaje Ingreso a Feedlot',
    ],
  };

  const handleEventTypeChange = (type: EventType) => {
    setEventType(type);
    const list = productsMap[type] || [];
    if (list.length > 0) {
      setSelectedProduct(list[0]);
    }
    // sensible default withdrawal days
    if (type === 'tratamiento') setWithdrawalDays(3);
    else if (type === 'desparasitacion') setWithdrawalDays(14);
    else setWithdrawalDays(0);
  };

  const adjustDose = (delta: number) => {
    setDose((prev) => Math.max(0.5, parseFloat((prev + delta).toFixed(1))));
  };

  const setNowDateTime = () => {
    const d = new Date();
    setAppliedDate(
      d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const toggleDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulate dictation
      if (!isRecording) {
        setIsRecording(true);
        setTimeout(() => {
          setNotes(
            (prev) => prev + ' [Voz: Condición corporal estable, sin hinchazón en el sitio de inyección.]'
          );
          setIsRecording(false);
        }, 1500);
      }
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsRecording(false);

      if (isRecording) {
        recognition.stop();
        setIsRecording(false);
      } else {
        recognition.start();
      }
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTimelineEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      date: 'HOY',
      type: eventType,
      title: `${selectedProduct}`,
      details: `Dosis: ${dose} ml (${route}). ${notes}`,
      badge: eventType.toUpperCase(),
      timeAgo: 'Reciente',
      operator: 'Carlos Mendoza',
      medicine: selectedProduct,
      dose: `${dose} ml`,
      route: route,
      withdrawalDays: withdrawalDays,
      synced: false,
    };

    onSaveEvent(currentAnimal.id, newTimelineEvent, withdrawalDays);
    setShowSuccessModal(true);
  };

  const handleNextAnimal = () => {
    setShowSuccessModal(false);
    // Move to next animal in list if available
    const currentIndex = animals.findIndex((a) => a.id === currentAnimal.id);
    const nextIndex = (currentIndex + 1) % animals.length;
    setCurrentAnimal(animals[nextIndex]);
    setNotes('Animal dócil en manga. Aplicación limpia.');
  };

  return (
    <div className="flex flex-col gap-4 pb-12 animate-in fade-in duration-150">
      {/* 1. Offline Mode Banner */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-xs font-bold text-[#00450d] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#00450d]">
              offline_pin
            </span>
            Almacenamiento Local Offline
          </span>
          <span className="bg-[#acf4a4] text-[#002203] font-display text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00450d] animate-pulse"></span>
            Modo Manga / Campo
          </span>
        </div>
        <p className="text-xs text-[#41493e]">
          Registra tratamientos y biológicos al pie del brete, incluso bajo el sol y sin conexión.
        </p>
      </section>

      {/* 2. Animal Dossier Strip */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#eff5ee] flex items-center justify-center text-[#00450d] shrink-0">
              <span className="material-symbols-outlined text-3xl">sell</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-[#171d19] tracking-tight">
                  {currentAnimal.earTagNumber}
                </span>
                <span className="bg-[#1b5e20] text-white font-display text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {currentAnimal.status === 'sano' ? 'Sana' : 'En Observación'}
                </span>
              </div>
              <span className="text-xs text-[#41493e] truncate">
                {currentAnimal.name} • {currentAnimal.breed} ({currentAnimal.currentWeight} kg)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAnimalPicker(true)}
            className="h-10 px-3 bg-[#eff5ee] hover:bg-[#e4eae3] text-[#00450d] font-display font-bold text-xs rounded-xl flex items-center gap-1 transition-colors shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Cambiar</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#eff5ee] bg-[#eff5ee] rounded-xl p-2.5">
          <div className="flex flex-col">
            <span className="font-display text-[10px] uppercase text-[#41493e] font-bold">
              Lote actual
            </span>
            <span className="font-display text-xs font-bold text-[#171d19] truncate">
              {currentAnimal.potrero}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[10px] uppercase text-[#41493e] font-bold">
              Último Tratamiento
            </span>
            <span className="font-display text-xs font-bold text-[#171d19] truncate">
              Hace {currentAnimal.healthData.lastTreatment.dateDaysAgo} días
            </span>
          </div>
        </div>
      </div>

      {/* 3. Registration Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Tag & Scanner field */}
        <div className="flex flex-col gap-1.5">
          <label className="font-display font-bold text-xs text-[#171d19] flex items-center justify-between">
            <span>Caravana / Identificador</span>
            <span className="text-[#41493e] font-normal">ID Oficial SENASA</span>
          </label>
          <div className="flex items-stretch gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={currentAnimal.earTagNumber}
                className="w-full h-13 bg-white text-[#171d19] font-display font-bold text-lg px-4 rounded-xl border border-[#dee4dd] shadow-xs flex items-center"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00450d] material-symbols-outlined text-[22px] material-symbols-fill">
                verified
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenScanner}
              className="h-13 px-4 bg-[#fed7ca] hover:bg-[#fcc8b7] text-[#2b160f] rounded-xl font-display font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <QrCode className="w-5 h-5 text-[#75584d]" />
              <span>Escanear</span>
            </button>
          </div>
        </div>

        {/* Sanitary Event Type Selector Chips */}
        <div className="flex flex-col gap-1.5">
          <label className="font-display font-bold text-xs text-[#171d19] flex items-center justify-between">
            <span>Tipo de Evento Sanitario</span>
            <span className="text-[#00450d] font-bold uppercase text-[10px]">
              Obligatorio
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'vacunacion', label: 'Vacunación', icon: 'vaccines' },
              { id: 'tratamiento', label: 'Tratamiento Clínico', icon: 'medication' },
              { id: 'desparasitacion', label: 'Desparasitación', icon: 'pest_control' },
              { id: 'reproductivo', label: 'Reproductivo', icon: 'favorite' },
              { id: 'cirugia', label: 'Cirugía Menor', icon: 'healing' },
              { id: 'pesaje', label: 'Control Peso', icon: 'scale' },
            ].map((chip) => {
              const active = eventType === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleEventTypeChange(chip.id as EventType)}
                  className={`h-13 rounded-xl p-2.5 flex items-center gap-2 transition-all text-left font-display text-xs font-bold ${
                    active
                      ? 'bg-[#00450d] text-white shadow-sm'
                      : 'bg-white text-[#171d19] border border-[#dee4dd] hover:bg-[#eff5ee]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      active ? 'text-white material-symbols-fill' : 'text-[#75584d]'
                    }`}
                  >
                    {chip.icon}
                  </span>
                  <span className="truncate">{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-display font-bold text-xs text-[#171d19]">
              Fecha y Hora de Aplicación
            </label>
            <button
              type="button"
              onClick={setNowDateTime}
              className="text-[#00450d] font-display text-xs font-bold flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Usar Hora Actual</span>
            </button>
          </div>
          <div className="h-13 bg-white rounded-xl px-4 border border-[#dee4dd] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#41493e]" />
              <span className="font-display font-bold text-sm text-[#171d19]">
                {appliedDate}
              </span>
            </div>
            <Clock className="w-4 h-4 text-[#717a6d]" />
          </div>
        </div>

        {/* Product / Biológico */}
        <div className="flex flex-col gap-1.5">
          <label className="font-display font-bold text-xs text-[#171d19] flex items-center justify-between">
            <span>Producto / Biológico</span>
            <span className="text-[#00450d] font-bold text-[10px] uppercase">
              Botiquín Oficial
            </span>
          </label>
          <div className="relative">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full h-13 bg-white text-[#171d19] font-display text-sm font-semibold px-4 pr-10 rounded-xl border border-[#dee4dd] shadow-xs appearance-none focus:outline-none focus:ring-2 focus:ring-[#00450d]"
            >
              {(productsMap[eventType] || []).map((prod) => (
                <option key={prod} value={prod}>
                  {prod}
                </option>
              ))}
              <option value="Otro producto / Solución salina">Otro producto / Personalizado</option>
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#717a6d] pointer-events-none text-2xl">
              expand_more
            </span>
          </div>
        </div>

        {/* Dosage and Route (Side by side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Dose Stepper */}
          <div className="flex flex-col gap-1.5">
            <label className="font-display font-bold text-xs text-[#171d19]">
              Dosis por Cabeza
            </label>
            <div className="flex items-center h-13 bg-white rounded-xl border border-[#dee4dd] shadow-xs overflow-hidden p-1">
              <button
                type="button"
                onClick={() => adjustDose(-0.5)}
                className="w-12 h-full bg-[#eff5ee] active:bg-[#dee4dd] text-[#171d19] rounded-lg flex items-center justify-center font-display font-bold text-xl select-none"
              >
                −
              </button>
              <div className="flex-1 text-center font-display font-bold text-lg text-[#171d19]">
                {dose.toFixed(1)}{' '}
                <span className="font-display text-xs text-[#41493e] font-semibold">
                  ml
                </span>
              </div>
              <button
                type="button"
                onClick={() => adjustDose(0.5)}
                className="w-12 h-full bg-[#eff5ee] active:bg-[#dee4dd] text-[#171d19] rounded-lg flex items-center justify-center font-display font-bold text-xl select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Route Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-display font-bold text-xs text-[#171d19]">
              Vía de Administración
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'subcutanea', label: 'Subcutánea' },
                { id: 'intramuscular', label: 'Intramuscular' },
                { id: 'topica', label: 'Tópica / Pour-on' },
                { id: 'oral', label: 'Oral' },
              ].map((r) => {
                const active = route === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoute(r.id as any)}
                    className={`h-11 rounded-xl text-center font-display text-[11px] font-bold transition-all ${
                      active
                        ? 'bg-[#1b5e20] text-white shadow-xs'
                        : 'bg-white text-[#171d19] border border-[#dee4dd] hover:bg-[#eff5ee]'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Traceability of Bottle */}
        <div className="bg-[#eff5ee] rounded-xl p-3 flex items-center justify-between border border-[#dee4dd]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#41493e]">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[10px] uppercase text-[#41493e] font-bold">
                Trazabilidad de Frasco
              </span>
              <span className="font-display text-xs font-bold text-[#171d19]">
                {batchTrace}
              </span>
            </div>
          </div>
          <span className="bg-white text-[#00450d] font-display text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-[#acf4a4]">
            <CheckCircle className="w-3.5 h-3.5" />
            Vigente
          </span>
        </div>

        {/* Withdrawal Time (Tiempo de Retiro / Carencia) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-display font-bold text-xs text-[#171d19] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#75584d]" />
              <span>Tiempo de Retiro / Resguardo</span>
            </label>
            <span
              className={`font-display text-[10px] font-bold px-2 py-0.5 rounded-full ${
                withdrawalDays === 0
                  ? 'bg-[#acf4a4] text-[#002203]'
                  : 'bg-[#ffdad6] text-[#93000a]'
              }`}
            >
              {withdrawalDays === 0 ? 'Sin Restricción' : `Cuarentena: ${withdrawalDays} Días`}
            </span>
          </div>
          <p className="text-[11px] text-[#41493e]">
            Días de carencia obligatorios antes del envío a faena o consumo de leche.
          </p>

          <div className="flex items-center gap-1.5 mt-1">
            {[0, 3, 7, 14, 30].map((days) => {
              const active = withdrawalDays === days;
              return (
                <button
                  key={days}
                  type="button"
                  onClick={() => setWithdrawalDays(days)}
                  className={`flex-1 h-13 rounded-xl font-display font-bold flex flex-col items-center justify-center transition-all ${
                    active
                      ? days === 0
                        ? 'bg-[#00450d] text-white shadow-xs'
                        : 'bg-[#ba1a1a] text-white shadow-xs'
                      : 'bg-[#eff5ee] text-[#171d19] hover:bg-[#dee4dd]'
                  }`}
                >
                  <span className="text-base leading-none">{days}</span>
                  <span className="text-[9px] uppercase font-bold mt-0.5">Días</span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 p-2.5 rounded-xl bg-[#eff5ee] flex items-start gap-2 text-xs">
            {withdrawalDays === 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-[#00450d] shrink-0 mt-0.5" />
                <span className="text-[#171d19]">
                  <strong>Apto para ordeño inmediato:</strong> Este biológico oleoso no requiere
                  retiro de leche ni carne según ficha técnica SENASA.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                <span className="text-[#93000a]">
                  <strong>Retiro de {withdrawalDays} días activo:</strong> Prohibido destinar leche
                  al tanque general o mandar a faena hasta cumplir el ciclo sanitario.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Responsible Person */}
        <div className="flex flex-col gap-1.5">
          <label className="font-display font-bold text-xs text-[#171d19]">
            Responsable de Aplicación
          </label>
          <div className="h-13 bg-white rounded-xl px-4 border border-[#dee4dd] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#75584d] text-white flex items-center justify-center font-display text-xs font-bold">
                CM
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs text-[#171d19]">
                  Carlos Mendoza
                </span>
                <span className="text-[10px] text-[#41493e]">Capataz de Manga</span>
              </div>
            </div>
            <span className="text-[10px] font-display font-bold text-[#00450d] bg-[#acf4a4]/50 px-2 py-0.5 rounded">
              Oficial
            </span>
          </div>
        </div>

        {/* Field Notes with Voice Mic */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-display font-bold text-xs text-[#171d19]">
              Observaciones de Campo
            </label>
            <span className="text-[10px] font-display text-[#41493e]">Opcional</span>
          </div>
          <div className="bg-white rounded-2xl border border-[#dee4dd] shadow-xs p-3 flex flex-col gap-2">
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dicta o escribe detalles (ej. comportamiento, hinchazón, dosis de refuerzo)..."
              className="w-full bg-transparent text-sm text-[#171d19] focus:outline-none resize-none placeholder:text-[#717a6d]"
            />
            <div className="flex items-center justify-between pt-2 border-t border-[#eff5ee]">
              <button
                type="button"
                onClick={toggleDictation}
                className={`flex items-center gap-1.5 font-display text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  isRecording
                    ? 'bg-[#ffdad6] text-[#ba1a1a] animate-pulse'
                    : 'bg-[#eff5ee] text-[#75584d] hover:text-[#00450d]'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Escuchando en manga...' : 'Dictar por voz'}</span>
              </button>
              <span className="font-display text-[10px] text-[#41493e]">Audio local</span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="submit"
            className="w-full h-14 bg-[#1b5e20] hover:bg-[#00450d] text-white rounded-xl font-display font-bold text-[16px] shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Guardar Evento en Campo</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-center font-display text-[11px] text-[#41493e]">
            <span className="material-symbols-outlined text-[16px] text-[#00450d]">
              cloud_done
            </span>
            <span>Se guardará en memoria local y sincronizará con señal</span>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-full h-11 text-[#41493e] hover:text-[#171d19] font-display text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Cancelar y Volver</span>
          </button>
        </div>
      </form>

      {/* Animal Picker Modal */}
      {showAnimalPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl flex flex-col gap-3 max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dee4dd] pb-2">
              <h3 className="font-display font-bold text-sm text-[#171d19]">
                Seleccionar Animal en Manga
              </h3>
              <button
                type="button"
                onClick={() => setShowAnimalPicker(false)}
                className="w-7 h-7 rounded-full bg-[#eff5ee] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {animals.map((an) => (
                <button
                  key={an.id}
                  type="button"
                  onClick={() => {
                    setCurrentAnimal(an);
                    onSelectAnimal(an);
                    setShowAnimalPicker(false);
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between text-left border transition-all ${
                    currentAnimal.id === an.id
                      ? 'bg-[#acf4a4]/40 border-[#00450d]'
                      : 'bg-[#eff5ee] border-transparent hover:bg-[#e4eae3]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-[#fed7ca] px-2 py-0.5 rounded font-display font-bold text-xs text-[#2b160f]">
                      {an.earTagNumber}
                    </span>
                    <span className="font-display font-bold text-xs text-[#171d19]">
                      {an.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#41493e]">{an.currentWeight} kg</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delight Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white text-[#171d19] w-full max-w-sm rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#acf4a4] text-[#00450d] flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[36px] animate-bounce">
                task_alt
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-[#171d19]">
              ¡Registro Guardado!
            </h3>
            <p className="text-xs text-[#41493e] leading-relaxed">
              El evento para el animal{' '}
              <strong className="text-[#171d19]">{currentAnimal.earTagNumber}</strong> quedó
              archivado de forma segura en la base de datos de tu teléfono.
            </p>

            <div className="w-full bg-[#eff5ee] rounded-xl p-3 flex items-center gap-3 my-1 text-left">
              <span className="material-symbols-outlined text-[#00450d] text-[24px]">
                schedule_send
              </span>
              <div className="flex flex-col">
                <span className="font-display text-[10px] text-[#41493e] uppercase font-bold">
                  Cola de Sincronización
                </span>
                <span className="font-display font-bold text-xs text-[#171d19]">
                  1 registro pendiente de subida
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextAnimal}
              className="w-full h-13 bg-[#1b5e20] hover:bg-[#00450d] text-white rounded-xl font-display font-bold text-sm shadow-sm transition-all"
            >
              Continuar al Siguiente Animal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
