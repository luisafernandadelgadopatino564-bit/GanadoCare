import React, { useState } from 'react';
import { ScheduledEvent, PriorityType } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  X,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface CalendarioViewProps {
  schedule: ScheduledEvent[];
  onAddNewEvent: (event: ScheduledEvent) => void;
  onToggleEventComplete: (eventId: string) => void;
  onNavigateToRegistrar?: (lotOrAnimal?: string) => void;
}

export const CalendarioView: React.FC<CalendarioViewProps> = ({
  schedule,
  onAddNewEvent,
  onToggleEventComplete,
  onNavigateToRegistrar,
}) => {
  // Navigation: Year & Month
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 is September (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // New Event Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'vacunacion' | 'sanidad' | 'reproductivo' | 'manejo'>('vacunacion');
  const [newDate, setNewDate] = useState('2025-09-15');
  const [newTime, setNewTime] = useState('08:30 AM');
  const [newLot, setNewLot] = useState('Lote Vacas Ordeño (12 animales)');
  const [newLocation, setNewLocation] = useState('Chute Principal');
  const [newResponsible, setNewResponsible] = useState('Carlos Mendoza');
  const [newPriority, setNewPriority] = useState<PriorityType>('prioritario');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const handleToday = () => {
    setCurrentYear(2025);
    setCurrentMonth(8); // Sept 2025
    setSelectedDay(15);
  };

  // Build calendar matrix
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0

  // Events in this month
  const monthString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const eventsInMonth = schedule.filter((ev) => ev.date.startsWith(monthString));

  // Events for selected day or month
  const displayedEvents = selectedDay
    ? schedule.filter(
        (ev) => ev.date === `${monthString}-${String(selectedDay).padStart(2, '0')}`
      )
    : eventsInMonth;

  // Day dot indicators
  const getEventDotsForDay = (day: number) => {
    const dStr = `${monthString}-${String(day).padStart(2, '0')}`;
    const dayEvents = schedule.filter((ev) => ev.date === dStr);
    return dayEvents;
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const event: ScheduledEvent = {
      id: `sched-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: newDate,
      time: newTime,
      targetLot: newLot,
      location: newLocation,
      responsible: newResponsible,
      priority: newPriority,
      tagLabel:
        newCategory === 'vacunacion'
          ? 'Inmunización'
          : newCategory === 'sanidad'
          ? 'Sanidad'
          : newCategory === 'reproductivo'
          ? 'Veterinaria'
          : 'Manejo',
      completed: false,
    };

    onAddNewEvent(event);
    setShowScheduleModal(false);
    setNewTitle('');

    // Trigger feedback toast
    setToastMessage('Evento guardado localmente (sincronizará al reconectar)');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-4 pb-12 animate-in fade-in duration-150">
      {/* 1. Subheader Intro */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#171d19] tracking-tight">
            Calendario
          </h1>
          <p className="text-xs text-[#41493e]">
            Aquí puedes ver y gestionar los eventos de tus animales.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#eff5ee] flex items-center justify-center text-[#00450d] shadow-xs">
          <CalendarIcon className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Month Navigation Bar */}
      <div className="flex items-center justify-between bg-[#eff5ee] rounded-2xl px-3 py-2 shadow-xs border border-[#dee4dd]/60">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Mes anterior"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#171d19] bg-white hover:bg-[#e4eae3] active:scale-95 transition-all shadow-xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col px-1">
            <span className="font-display font-bold text-base text-[#171d19] leading-tight">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <span className="font-display text-[10px] text-[#75584d] tracking-wider uppercase font-bold">
              {eventsInMonth.length} eventos activos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#e4eae3] text-[#171d19] font-display text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#00450d]">
              event
            </span>
            <span>Hoy</span>
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Mes siguiente"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#171d19] bg-white hover:bg-[#e4eae3] active:scale-95 transition-all shadow-xs"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Monthly Calendar Grid */}
      <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 text-center gap-1">
          {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((d, i) => (
            <span
              key={d}
              className={`font-display text-[11px] font-bold py-1 ${
                i >= 5 ? 'text-[#75584d]' : 'text-[#41493e]'
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 text-center font-display text-xs">
          {/* Empty prefix slots */}
          {Array.from({ length: firstDayWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 flex items-center justify-center opacity-25">
              -
            </div>
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = getEventDotsForDay(dayNum);
            const isSelected = selectedDay === dayNum;
            const isToday = currentYear === 2025 && currentMonth === 8 && dayNum === 15;

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                className={`relative h-11 flex flex-col items-center justify-center rounded-xl transition-all active:scale-90 ${
                  isSelected
                    ? 'bg-[#1b5e20] text-white shadow-xs font-bold'
                    : isToday
                    ? 'bg-[#acf4a4]/50 border border-[#00450d] text-[#00450d] font-bold'
                    : dayEvents.length > 0
                    ? 'bg-[#eff5ee] text-[#171d19] font-bold hover:bg-[#e4eae3]'
                    : 'text-[#171d19] hover:bg-[#eff5ee]'
                }`}
              >
                <span className="leading-none text-xs">{dayNum}</span>
                {/* Event Dots */}
                <div className="flex items-center gap-0.5 mt-1 h-1.5">
                  {dayEvents.slice(0, 3).map((ev, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected
                          ? 'bg-white'
                          : ev.category === 'vacunacion'
                          ? 'bg-[#1b5e20]'
                          : ev.category === 'sanidad'
                          ? 'bg-[#75584d]'
                          : ev.category === 'reproductivo'
                          ? 'bg-[#003d65]'
                          : 'bg-[#005589]'
                      }`}
                    ></span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Legend */}
        <div className="pt-2 border-t border-[#eff5ee] flex flex-wrap items-center justify-between gap-2 bg-[#eff5ee]/60 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b5e20]"></span>
            <span className="font-display text-[10px] text-[#41493e] font-bold">
              Vacunación
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#75584d]"></span>
            <span className="font-display text-[10px] text-[#41493e] font-bold">
              Sanidad / Desp.
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#003d65]"></span>
            <span className="font-display text-[10px] text-[#41493e] font-bold">
              Reproductivo
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#005589]"></span>
            <span className="font-display text-[10px] text-[#41493e] font-bold">
              Manejo / Peso
            </span>
          </div>
        </div>
      </div>

      {/* 4. Section: Eventos Próximos */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00450d] text-[20px]">
              format_list_bulleted
            </span>
            <h2 className="font-display font-bold text-base text-[#171d19]">
              {selectedDay
                ? `Eventos del ${selectedDay} de ${monthNames[currentMonth]}`
                : 'Eventos próximos'}
            </h2>
          </div>
          {selectedDay && (
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="font-display text-xs text-[#00450d] font-bold underline"
            >
              Ver todos del mes
            </button>
          )}
        </div>

        {/* Stack of Cards */}
        <div className="flex flex-col gap-2.5">
          {displayedEvents.map((ev) => {
            const isPriority = ev.priority === 'prioritario';
            const isSanidad = ev.priority === 'sanidad';
            const isVet = ev.priority === 'veterinaria';

            const borderColor =
              ev.category === 'vacunacion'
                ? 'bg-[#1b5e20]'
                : ev.category === 'sanidad'
                ? 'bg-[#75584d]'
                : ev.category === 'reproductivo'
                ? 'bg-[#003d65]'
                : 'bg-[#005589]';

            const badgeBg = isPriority
              ? 'bg-[#ffdad6] text-[#93000a]'
              : isSanidad
              ? 'bg-[#fed7ca] text-[#795c51]'
              : isVet
              ? 'bg-[#cfe5ff] text-[#001d34]'
              : 'bg-[#e4eae3] text-[#171d19]';

            return (
              <article
                key={ev.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-2 relative overflow-hidden transition-all active:scale-99"
              >
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${borderColor}`}></div>

                <div className="flex items-start justify-between gap-2 pl-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-[11px] text-[#00450d] font-bold uppercase">
                        {ev.date}
                      </span>
                      <span className="text-[#41493e]/40">•</span>
                      <span className="font-display text-[11px] text-[#41493e] font-semibold">
                        {ev.time}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-[#171d19] mt-0.5">
                      {ev.title}
                    </h3>
                  </div>

                  <span
                    className={`font-display text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${badgeBg}`}
                  >
                    {ev.priority}
                  </span>
                </div>

                <div className="pl-2 flex flex-col gap-1.5 pt-0.5">
                  <p className="text-xs text-[#41493e] leading-snug">
                    {ev.targetLot} • Responsable: <strong>{ev.responsible}</strong>
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#eff5ee] text-[#171d19] font-display text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#00450d]">
                          {ev.category === 'vacunacion'
                            ? 'vaccines'
                            : ev.category === 'manejo'
                            ? 'scale'
                            : ev.category === 'sanidad'
                            ? 'medication'
                            : 'monitor_heart'}
                        </span>
                        <span>{ev.tagLabel || ev.category}</span>
                      </span>
                      <span className="text-[11px] text-[#41493e]">{ev.location}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleEventComplete(ev.id)}
                      className={`h-7 px-2.5 rounded-lg font-display text-[11px] font-bold flex items-center gap-1 transition-all ${
                        ev.completed
                          ? 'bg-[#acf4a4] text-[#002203]'
                          : 'bg-[#eff5ee] text-[#41493e] hover:bg-[#e4eae3]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{ev.completed ? 'Listo' : 'Marcar'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {displayedEvents.length === 0 && (
            <div className="bg-white rounded-2xl p-6 text-center border border-[#dee4dd] flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-3xl text-[#717a6d]">
                event_busy
              </span>
              <p className="font-display font-bold text-xs text-[#171d19]">
                No hay eventos registrados para este día.
              </p>
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                className="text-xs text-[#00450d] font-display font-bold underline"
              >
                + Programar uno ahora
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Primary Field CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowScheduleModal(true)}
          className="w-full h-14 bg-[#1b5e20] hover:bg-[#00450d] text-white rounded-xl flex items-center justify-center gap-2 font-display font-bold text-[15px] shadow-md active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[24px]">event_available</span>
          <span>Programar nuevo evento</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto bg-[#171d19] text-[#eff5ee] py-3 px-4 rounded-xl shadow-xl flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom duration-200 text-xs font-semibold">
          <span className="material-symbols-outlined text-[#acf4a4] text-[20px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal / Bottom Drawer for Event Scheduling */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#dee4dd] pb-2">
              <h3 className="font-display font-bold text-base text-[#171d19]">
                Programar Evento en Calendario
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="w-7 h-7 rounded-full bg-[#eff5ee] flex items-center justify-center text-[#41493e]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="font-display text-xs font-bold text-[#41493e]">
                  Título del Evento
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ej. Baño garrapaticida lote 2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-12 px-3.5 rounded-xl bg-[#eff5ee] text-[#171d19] font-display text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00450d]"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">Categoría</span>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="h-11 px-2.5 rounded-xl bg-[#eff5ee] text-[#171d19] font-display text-xs font-bold focus:outline-none"
                  >
                    <option value="vacunacion">Vacunación</option>
                    <option value="sanidad">Sanidad / Desp.</option>
                    <option value="reproductivo">Reproductivo</option>
                    <option value="manejo">Manejo / Peso</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">Prioridad</span>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="h-11 px-2.5 rounded-xl bg-[#eff5ee] text-[#171d19] font-display text-xs font-bold focus:outline-none"
                  >
                    <option value="prioritario">Prioritario</option>
                    <option value="rutina">Rutina</option>
                    <option value="sanidad">Sanidad</option>
                    <option value="veterinaria">Veterinaria</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">Fecha</span>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="h-11 px-3 rounded-xl bg-[#eff5ee] text-[#171d19] font-display text-xs font-bold focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">Hora</span>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="08:30 AM"
                    className="h-11 px-3 rounded-xl bg-[#eff5ee] text-[#171d19] font-display text-xs font-bold focus:outline-none"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="font-display text-xs font-bold text-[#41493e]">
                  Lote / Animales Afectados
                </span>
                <input
                  type="text"
                  value={newLot}
                  onChange={(e) => setNewLot(e.target.value)}
                  placeholder="Lote Vacas Ordeño (12 cabezas)"
                  className="h-11 px-3 rounded-xl bg-[#eff5ee] text-[#171d19] font-display text-xs font-semibold focus:outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">Ubicación</span>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Chute Principal"
                    className="h-11 px-3 rounded-xl bg-[#eff5ee] text-[#171d19] font-display text-xs focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#41493e]">Responsable</span>
                  <input
                    type="text"
                    value={newResponsible}
                    onChange={(e) => setNewResponsible(e.target.value)}
                    placeholder="Carlos Mendoza"
                    className="h-11 px-3 rounded-xl bg-[#eff5ee] text-[#171d19] font-display text-xs focus:outline-none"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-13 bg-[#1b5e20] hover:bg-[#00450d] text-white rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 mt-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Guardar en el dispositivo</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
