import React, { useState } from 'react';
import { Animal, FarmStats, ScheduledEvent } from '../types';

interface DashboardViewProps {
  stats: FarmStats;
  animals: Animal[];
  schedule: ScheduledEvent[];
  onSelectAnimal: (animal: Animal) => void;
  onNavigateToTab: (tab: string, extra?: any) => void;
  onQuickStartManga: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  animals,
  schedule,
  onSelectAnimal,
  onNavigateToTab,
  onQuickStartManga,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<'hoy' | 'mar' | 'mie' | 'jue'>('hoy');

  const cow1045 = animals.find((a) => a.id === '1045') || animals[0];
  const cow0482 = animals.find((a) => a.id === '0482') || animals[1];
  const bull0115 = animals.find((a) => a.id === '0115') || animals[2];

  // Tasks mapped by day
  const getTasksForDay = () => {
    switch (selectedDayTab) {
      case 'hoy':
        return [
          {
            time: '08:30 AM',
            title: 'Vacunación Antiaftosa (Lote Reproductores)',
            place: 'Manga Principal • Corral Central (48 cabezas)',
            icon: 'vaccines',
            tag: 'Urgente',
            tagColor: 'bg-[#ffdad6] text-[#93000a]',
          },
          {
            time: '09:00 AM',
            title: 'Chequeo de preñez Lote 3',
            place: 'Dr. Méndez • Ecógrafo móvil',
            icon: 'stethoscope',
            tag: 'Veterinaria',
            tagColor: 'bg-[#cfe5ff] text-[#001d34]',
          },
          {
            time: '03:30 PM',
            title: 'Pesaje de destete Lote Terneros',
            place: 'Báscula Brete Sur • 24 crías',
            icon: 'scale',
            tag: 'Manejo',
            tagColor: 'bg-[#e4eae3] text-[#171d19]',
          },
        ];
      case 'mar':
        return [
          {
            time: '07:00 AM',
            title: 'Revisión podológica Toro #0115',
            place: 'Potrero 1 - Corral Central • Aplomo derecho',
            icon: 'healing',
            tag: 'Podología',
            tagColor: 'bg-[#fed7ca] text-[#795c51]',
          },
          {
            time: '10:00 AM',
            title: 'Control de mastitis y test de California',
            place: 'Sala de ordeño mecánica • Cuartos afectados',
            icon: 'sanitizer',
            tag: 'Calidad',
            tagColor: 'bg-[#ffdad6] text-[#93000a]',
          },
        ];
      case 'mie':
        return [
          {
            time: '08:00 AM',
            title: 'Fin de período de retiro Vaca #0482',
            place: 'Potrero 4 • Apta para reintegrar a tanque',
            icon: 'water_drop',
            tag: 'Inocuidad',
            tagColor: 'bg-[#acf4a4] text-[#002203]',
          },
          {
            time: '02:00 PM',
            title: 'Rotación de potrero a Pastura Nueva',
            place: 'Lote Vacas Ordeño hacia Potrero 3',
            icon: 'fence',
            tag: 'Pastoreo',
            tagColor: 'bg-[#e4eae3] text-[#171d19]',
          },
        ];
      case 'jue':
        return [
          {
            time: '09:30 AM',
            title: 'Llegada de biológicos y vacunas SENASA',
            place: 'Recepción en botiquín veterinario',
            icon: 'inventory_2',
            tag: 'Insumos',
            tagColor: 'bg-[#cfe5ff] text-[#001d34]',
          },
        ];
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-8 animate-in fade-in duration-150">
      {/* 1. Header Greeter & Live Weather Bar */}
      <section className="flex items-center justify-between gap-3 pt-1">
        <div className="flex flex-col min-w-0">
          <span className="font-display text-[11px] font-bold text-[#41493e] uppercase tracking-wider">
            Buenos días, Don Carlos
          </span>
          <h1 className="font-display font-bold text-2xl text-[#171d19] tracking-tight">
            Estado del Hato
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-[#fed7ca]/80 text-[#2b160f] px-3 py-1.5 rounded-xl shadow-xs shrink-0">
          <span className="material-symbols-outlined text-[#75584d] text-[24px] material-symbols-fill">
            wb_sunny
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-[16px] text-[#2b160f]">
              24°C
            </span>
            <span className="font-display text-[10px] text-[#75584d] tracking-wider uppercase font-bold">
              Potrero 4
            </span>
          </div>
        </div>
      </section>

      {/* 2. Urgent Reminder Hero Card */}
      <section className="relative overflow-hidden rounded-2xl bg-white shadow-md border-l-4 border-l-[#ba1a1a]">
        <div className="p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px] material-symbols-fill">
                warning
              </span>
              <span className="font-display text-[11px] tracking-wider uppercase font-bold">
                Urgente Hoy
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#41493e] font-display text-[13px] font-bold">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>08:30 AM</span>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="font-display font-bold text-xl text-[#171d19] leading-tight">
              Vacunación Antiaftosa
            </h2>
            <p className="text-[14px] text-[#41493e] mt-0.5">
              Lote Reproductores •{' '}
              <strong className="text-[#171d19]">48 animales</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#eff5ee] px-3 py-2 rounded-xl text-xs text-[#171d19]">
            <span className="material-symbols-outlined text-[#00450d] text-[18px]">
              door_front
            </span>
            <span className="font-medium">Manga Principal • Corral Central</span>
          </div>

          <button
            type="button"
            onClick={onQuickStartManga}
            className="w-full h-13 bg-[#1b5e20] hover:bg-[#00450d] text-white rounded-xl flex items-center justify-center gap-2 font-display font-bold text-[15px] shadow-sm active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[22px] material-symbols-fill">
              play_circle
            </span>
            <span>Iniciar Ronda en Manga</span>
          </button>
        </div>
      </section>

      {/* 3. Hero Bovine Card (Translating hand-drawn sketch) */}
      <section className="relative overflow-hidden rounded-2xl bg-white shadow-md flex flex-col">
        <div className="relative w-full h-44 bg-[#e9efe9] overflow-hidden">
          <img
            alt="Vaca Holstein en pastura"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-rnPcvEeAqcLNUHk592qqlSA6HxhVpkZcjwfXvsjab7qoAew-lf7GRj0rn5Io-_rVXoF0CZl88PSEWaQ7l1zsrq4jLQAnvEBlPUSM62lw-QOlXPRIrFtAULv82hCisJiLQEjQcyLD-onz74RkoXFnnXWej_388QbhZz1cLUmScw3xoHzvZLX6x9fT7cUmiv9ThJgaC1H5kxj4lVgZWO1OzBZFs2xS54JVrNGAdjzcP-y-Nv55i9T7Rg"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm">
            <span className="material-symbols-outlined text-[#00450d] text-[18px] material-symbols-fill">
              event_upcoming
            </span>
            <span className="font-display text-[11px] font-bold text-[#00450d] tracking-wide uppercase">
              Próximo recordatorio
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#93000a] font-display text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">priority_high</span>
            <span>Prioridad Alta</span>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2.5 -mt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#acf4a4] text-[#002203]">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            </div>
            <span className="font-display text-sm text-[#75584d] font-bold">
              15 de Septiembre, 2025
            </span>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg text-[#171d19] leading-tight">
              Vacuna contra clostridiosis
            </h3>
            <p className="text-xs text-[#41493e] mt-0.5">
              Lote Vacas Ordeño • Dosis semestral obligatoria (14 animales)
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#eff5ee]">
            <span className="font-display text-[11px] text-[#1b5e20] bg-[#eff5ee] px-2.5 py-1 rounded-md font-bold">
              Potrero El Roble
            </span>
            <button
              type="button"
              onClick={() => onSelectAnimal(cow1045)}
              className="flex items-center gap-1 text-[#00450d] font-display font-bold text-sm hover:underline active:scale-95 transition-transform"
            >
              <span>Ver detalles de Luna</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Four Key Counters (2x2 Grid) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-display text-[12px] uppercase text-[#41493e] tracking-wider font-bold">
            Censo Ganadero
          </span>
          <button
            type="button"
            onClick={() => onNavigateToTab('animales')}
            className="font-display text-xs text-[#00450d] font-bold hover:underline"
          >
            Ver Todo ({stats.totalBovinos})
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Total Bovinos */}
          <div
            onClick={() => onNavigateToTab('animales')}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#dee4dd]/60 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all active:scale-98"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#eff5ee] flex items-center justify-center text-[#00450d]">
                <span className="material-symbols-outlined text-[22px]">sell</span>
              </div>
              <span className="bg-[#e4eae3] text-[#41493e] font-display text-[11px] px-2 py-0.5 rounded-full font-bold">
                Total
              </span>
            </div>
            <div>
              <span className="font-display font-bold text-3xl text-[#171d19] leading-none block">
                {stats.totalBovinos}
              </span>
              <span className="font-display text-xs text-[#171d19] font-bold mt-1 block">
                Bovinos en Finca
              </span>
              <span className="text-[11px] text-[#41493e]">Rodeo general</span>
            </div>
            <div className="pt-2 mt-2 border-t border-[#eff5ee] font-display text-[10px] text-[#41493e] flex justify-between">
              <span>{stats.hembras} Hembras</span>
              <span>{stats.machos} Machos</span>
            </div>
          </div>

          {/* En Tratamiento */}
          <div
            onClick={() => onNavigateToTab('animales')}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#dee4dd]/60 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all active:scale-98"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#fed7ca] flex items-center justify-center text-[#75584d]">
                <span className="material-symbols-outlined text-[22px] material-symbols-fill">
                  healing
                </span>
              </div>
              <span className="bg-[#ffdad6] text-[#93000a] font-display text-[11px] px-2 py-0.5 rounded-full font-bold">
                Alerta
              </span>
            </div>
            <div>
              <span className="font-display font-bold text-3xl text-[#75584d] leading-none block">
                {stats.enTratamiento}
              </span>
              <span className="font-display text-xs text-[#171d19] font-bold mt-1 block">
                En Tratamiento
              </span>
              <span className="text-[11px] text-[#41493e]">Observación clínica</span>
            </div>
            <div className="pt-2 mt-2 border-t border-[#eff5ee] font-display text-[10px] text-[#93000a] font-bold truncate">
              {stats.enRetiro} en período retiro
            </div>
          </div>

          {/* Por Vacunar */}
          <div
            onClick={() => onNavigateToTab('calendario')}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#dee4dd]/60 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all active:scale-98"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#eff5ee] flex items-center justify-center text-[#1b5e20]">
                <span className="material-symbols-outlined text-[22px]">vaccines</span>
              </div>
              <span className="bg-[#eff5ee] text-[#1b5e20] font-display text-[11px] px-2 py-0.5 rounded-full font-bold">
                Semana
              </span>
            </div>
            <div>
              <span className="font-display font-bold text-3xl text-[#171d19] leading-none block">
                {stats.porVacunarSemana}
              </span>
              <span className="font-display text-xs text-[#171d19] font-bold mt-1 block">
                Por Vacunar
              </span>
              <span className="text-[11px] text-[#41493e]">Campañas oficiales</span>
            </div>
            <div className="pt-2 mt-2 border-t border-[#eff5ee] font-display text-[10px] text-[#41493e] truncate">
              Carbunclo y Aftosa
            </div>
          </div>

          {/* Vacas Ordeño */}
          <div
            onClick={() => onNavigateToTab('animales')}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#dee4dd]/60 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all active:scale-98"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#cfe5ff] flex items-center justify-center text-[#003d65]">
                <span className="material-symbols-outlined text-[22px]">water_drop</span>
              </div>
              <span className="bg-[#cfe5ff] text-[#001d34] font-display text-[11px] px-2 py-0.5 rounded-full font-bold">
                Ordeño
              </span>
            </div>
            <div>
              <span className="font-display font-bold text-3xl text-[#171d19] leading-none block">
                {stats.vacasOrdeno}
              </span>
              <span className="font-display text-xs text-[#171d19] font-bold mt-1 block">
                Vacas Ordeño
              </span>
              <span className="text-[11px] text-[#41493e]">Lactancia activa</span>
            </div>
            <div className="pt-2 mt-2 border-t border-[#eff5ee] font-display text-[10px] text-[#003d65] font-semibold truncate">
              2 turnos diarios
            </div>
          </div>
        </div>
      </section>

      {/* 5. Producción de Leche & Ganancia Ponderal */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-[#dee4dd]/60 flex flex-col space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00450d] text-[22px]">
              analytics
            </span>
            <h2 className="font-display font-bold text-lg text-[#171d19]">
              Producción de Leche
            </h2>
          </div>
          <span className="bg-[#acf4a4] text-[#002203] font-display text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +4.2%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-[#eff5ee] p-3 rounded-xl">
          <div className="flex flex-col">
            <span className="font-display text-[10px] uppercase text-[#41493e] font-bold">
              Total Diario
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display font-bold text-2xl text-[#00450d] leading-none">
                {stats.produccionDiariaLitros}
              </span>
              <span className="font-display text-xs text-[#41493e] font-semibold">Litros</span>
            </div>
            <span className="text-[11px] text-[#41493e] mt-1">Tanque frío #1</span>
          </div>

          <div className="flex flex-col">
            <span className="font-display text-[10px] uppercase text-[#41493e] font-bold">
              Promedio / Vaca
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display font-bold text-2xl text-[#171d19] leading-none">
                {stats.promedioLitrosVaca}
              </span>
              <span className="font-display text-xs text-[#41493e] font-semibold">L/día</span>
            </div>
            <span className="text-[11px] text-[#00450d] font-semibold mt-1">
              Raza Holstein-Gyr
            </span>
          </div>
        </div>

        {/* Ganancia Media Diaria Engorde Bar */}
        <div className="flex flex-col space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[#171d19]">
            <span className="font-display text-xs font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#75584d] text-[18px]">
                scale
              </span>
              Ganancia Media Diaria (GMD)
            </span>
            <span className="font-display font-bold text-sm text-[#75584d]">
              {stats.gmdEngorde}{' '}
              <span className="font-normal text-xs text-[#41493e]">kg/día</span>
            </span>
          </div>
          <div className="w-full bg-[#dee4dd] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#75584d] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(stats.gmdEngorde / stats.gmdMeta) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[#41493e] font-display text-[10px]">
            <span>Lote Engorde Novillos (36 cabezas)</span>
            <span className="text-[#75584d] font-bold">Meta: {stats.gmdMeta} kg</span>
          </div>
        </div>
      </section>

      {/* 6. Health Alerts */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
              notification_important
            </span>
            <h2 className="font-display font-bold text-lg text-[#171d19]">
              Alertas Sanitarias
            </h2>
          </div>
          <span className="bg-[#ba1a1a] text-white font-display text-[11px] px-2 py-0.5 rounded-full font-bold">
            2 Activas
          </span>
        </div>

        {/* Alert 1: Antibiotic Milk Withdrawal (Vaca #0482) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-l-[#ba1a1a] border-t border-r border-b border-[#dee4dd]/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-[#eff5ee] px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] mr-2"></span>
              <span className="font-display text-xs font-bold text-[#171d19] tracking-wider">
                VACA #0482
              </span>
            </div>
            <span className="bg-[#ffdad6] text-[#93000a] font-display text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
              Retiro de Leche
            </span>
          </div>
          <div>
            <p className="font-display font-bold text-sm text-[#171d19]">
              Antibiótico Ceftiofur — ¡No ordeñar a tanque!
            </p>
            <p className="text-xs text-[#ba1a1a] font-bold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[15px]">hourglass_top</span>
              Faltan 2 días para completar cuarentena
            </p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-display text-[11px] text-[#41493e]">
              Lote Hospital • Potrero A
            </span>
            <button
              type="button"
              onClick={() => onSelectAnimal(cow0482)}
              className="h-9 px-3.5 bg-[#eff5ee] hover:bg-[#e4eae3] text-[#171d19] rounded-lg font-display text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span>Ver Ficha</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Alert 2: Podal Inspection (Toro #0115) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-l-[#75584d] border-t border-r border-b border-[#dee4dd]/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-[#eff5ee] px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#75584d] mr-2"></span>
              <span className="font-display text-xs font-bold text-[#171d19] tracking-wider">
                TORO #0115
              </span>
            </div>
            <span className="bg-[#fed7ca] text-[#795c51] font-display text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
              Podología
            </span>
          </div>
          <div>
            <p className="font-display font-bold text-sm text-[#171d19]">
              Revisión de pezuña derecha programada
            </p>
            <p className="text-xs text-[#41493e] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[15px]">event</span>
              Programado para mañana 07:00 AM
            </p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-display text-[11px] text-[#41493e]">
              Reproductor Brahman
            </span>
            <button
              type="button"
              onClick={() => onSelectAnimal(bull0115)}
              className="h-9 px-3.5 bg-[#eff5ee] hover:bg-[#e4eae3] text-[#171d19] rounded-lg font-display text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span>Ver Ficha</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Agenda de Campo / Mini-Calendar */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-[#dee4dd]/60 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00450d] text-[20px]">
              event_upcoming
            </span>
            <h2 className="font-display font-bold text-lg text-[#171d19]">
              Agenda de Campo
            </h2>
          </div>
          <span className="font-display text-xs font-bold text-[#41493e] uppercase">
            Octubre 2025
          </span>
        </div>

        {/* Day Selector Buttons */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            type="button"
            onClick={() => setSelectedDayTab('hoy')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl font-bold transition-all ${
              selectedDayTab === 'hoy'
                ? 'bg-[#00450d] text-white shadow-sm'
                : 'bg-[#eff5ee] text-[#171d19] hover:bg-[#e4eae3]'
            }`}
          >
            <span
              className={`font-display text-[10px] uppercase tracking-wider ${
                selectedDayTab === 'hoy' ? 'text-white' : 'text-[#41493e]'
              }`}
            >
              Hoy
            </span>
            <span className="font-display font-bold text-lg leading-none mt-0.5">14</span>
            <span
              className={`font-display text-[10px] mt-0.5 ${
                selectedDayTab === 'hoy' ? 'text-white' : 'text-[#41493e]'
              }`}
            >
              LUN
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDayTab('mar')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl font-bold transition-all ${
              selectedDayTab === 'mar'
                ? 'bg-[#00450d] text-white shadow-sm'
                : 'bg-[#eff5ee] text-[#171d19] hover:bg-[#e4eae3]'
            }`}
          >
            <span
              className={`font-display text-[10px] uppercase tracking-wider ${
                selectedDayTab === 'mar' ? 'text-white' : 'text-[#41493e]'
              }`}
            >
              Mañana
            </span>
            <span className="font-display font-bold text-lg leading-none mt-0.5">15</span>
            <span
              className={`font-display text-[10px] mt-0.5 ${
                selectedDayTab === 'mar' ? 'text-white' : 'text-[#41493e]'
              }`}
            >
              MAR
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDayTab('mie')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl font-bold transition-all ${
              selectedDayTab === 'mie'
                ? 'bg-[#00450d] text-white shadow-sm'
                : 'bg-[#eff5ee] text-[#171d19] hover:bg-[#e4eae3]'
            }`}
          >
            <span
              className={`font-display text-[10px] uppercase tracking-wider ${
                selectedDayTab === 'mie' ? 'text-white' : 'text-[#41493e]'
              }`}
            >
              Día 3
            </span>
            <span className="font-display font-bold text-lg leading-none mt-0.5">16</span>
            <span
              className={`font-display text-[10px] mt-0.5 ${
                selectedDayTab === 'mie' ? 'text-white' : 'text-[#41493e]'
              }`}
            >
              MIÉ
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDayTab('jue')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl font-bold transition-all ${
              selectedDayTab === 'jue'
                ? 'bg-[#00450d] text-white shadow-sm'
                : 'bg-[#eff5ee] text-[#171d19] hover:bg-[#e4eae3]'
            }`}
          >
            <span
              className={`font-display text-[10px] uppercase tracking-wider ${
                selectedDayTab === 'jue' ? 'text-white' : 'text-[#41493e]'
              }`}
            >
              Día 4
            </span>
            <span className="font-display font-bold text-lg leading-none mt-0.5">17</span>
            <span
              className={`font-display text-[10px] mt-0.5 ${
                selectedDayTab === 'jue' ? 'text-white' : 'text-[#41493e]'
              }`}
            >
              JUE
            </span>
          </button>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-2 pt-1">
          {getTasksForDay().map((task, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-[#eff5ee] rounded-xl hover:bg-[#e4eae3] transition-colors"
            >
              <div className="flex flex-col items-center justify-center bg-white px-2 py-1.5 rounded-lg text-[#171d19] shadow-xs">
                <span className="font-display font-bold text-xs leading-none">
                  {task.time.split(' ')[0]}
                </span>
                <span className="font-display text-[9px] uppercase text-[#41493e] mt-0.5">
                  {task.time.split(' ')[1]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-display font-bold text-sm text-[#171d19] truncate">
                    {task.title}
                  </p>
                  <span
                    className={`font-display text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase shrink-0 ${task.tagColor}`}
                  >
                    {task.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-[#41493e] text-xs">
                  <span className="material-symbols-outlined text-[14px]">
                    {task.icon}
                  </span>
                  <span className="truncate">{task.place}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="text-[#41493e]">Eventos organizados por potrero</span>
          <button
            type="button"
            onClick={() => onNavigateToTab('calendario')}
            className="text-[#00450d] font-display font-bold hover:underline"
          >
            Abrir Calendario Completo →
          </button>
        </div>
      </section>

      {/* 8. Field Primary Action Buttons */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={() => onNavigateToTab('escanear')}
          className="h-14 w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#1b5e20] text-white font-display font-bold text-[16px] shadow-md hover:bg-[#00450d] active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
          <span>Escanear Animal (Arete / QR)</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('registrar')}
          className="h-14 w-full flex items-center justify-center gap-2 rounded-xl bg-[#e4eae3] text-[#171d19] font-display font-bold text-[16px] shadow-sm hover:bg-[#dee4dd] active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[24px] text-[#75584d]">
            add_circle
          </span>
          <span>+ Registrar Evento en Campo</span>
        </button>
      </section>
    </div>
  );
};
