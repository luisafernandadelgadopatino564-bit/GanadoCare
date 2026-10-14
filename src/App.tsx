import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './views/DashboardView';
import { AnimalesView } from './views/AnimalesView';
import { RegistrarView } from './views/RegistrarView';
import { CalendarioView } from './views/CalendarioView';
import { ReportesView } from './views/ReportesView';
import { ScannerView } from './views/ScannerView';
import {
  Animal,
  ScheduledEvent,
  FarmStats,
  TimelineEvent,
} from './types';
import {
  loadAnimals,
  saveAnimals,
  loadSchedule,
  saveSchedule,
  loadUnsyncedCount,
  addUnsyncedRecord,
  clearUnsyncedRecords,
  INITIAL_STATS,
  INITIAL_ANIMALS,
  INITIAL_SCHEDULED_EVENTS,
} from './data/initialData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [animals, setAnimals] = useState<Animal[]>(() => loadAnimals());
  const [schedule, setSchedule] = useState<ScheduledEvent[]>(() => loadSchedule());
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(true); // Initialized offline as in field mockups
  const [unsyncedCount, setUnsyncedCount] = useState<number>(() => loadUnsyncedCount());
  const [stats, setStats] = useState<FarmStats>(INITIAL_STATS);

  // Monitor real network online/offline events, while allowing manual simulation toggle
  useEffect(() => {
    const handleOnline = () => {
      // User can still stay simulated offline if they desire
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update dynamic stats when animals change
  useEffect(() => {
    const activeWithdrawals = animals.filter((a) => a.healthAlert?.active).length;
    const milkCows = animals.filter((a) => a.productionData.dailyMilkYield > 0).length;
    setStats((prev) => ({
      ...prev,
      totalBovinos: animals.length > 200 ? animals.length : 248,
      enRetiro: activeWithdrawals,
      vacasOrdeno: milkCows > 40 ? milkCows : 58,
    }));
  }, [animals]);

  // Handlers
  const handleSelectAnimal = (animal: Animal | null) => {
    setSelectedAnimal(animal);
    if (animal) {
      setCurrentTab('animales');
    }
  };

  const handleRegisterEventForAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setCurrentTab('registrar');
  };

  const handleQuickStartManga = () => {
    const cow = animals.find((a) => a.id === '0482') || animals[0];
    setSelectedAnimal(cow);
    setCurrentTab('registrar');
  };

  const handleSaveEvent = (
    animalId: string,
    event: TimelineEvent,
    withdrawalDays: number
  ) => {
    setAnimals((prev) => {
      const updated = prev.map((an) => {
        if (an.id === animalId) {
          const updatedTimeline = [event, ...an.timelineEvents];

          // If withdrawal days > 0, set or update health alert
          let updatedAlert = an.healthAlert;
          if (withdrawalDays > 0) {
            const endDate = new Date(Date.now() + withdrawalDays * 24 * 60 * 60 * 1000);
            const endDateStr = endDate.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            updatedAlert = {
              active: true,
              title: `${event.title} — Período de Retiro Activo`,
              medicine: event.medicine || event.title,
              description: `Retiro de ${withdrawalDays} días. No destinar leche a tanque ni carne a faena.`,
              doseProgress: `Aplicación en manga (${event.dose || '2.0 ml'})`,
              withdrawalHoursRemaining: withdrawalDays * 24,
              withdrawalEndDate: endDateStr,
              prohibitMilkDelivery: true,
              veterinarian: 'Carlos Mendoza (Capataz)',
            };
          }

          return {
            ...an,
            status: withdrawalDays > 0 ? 'observacion' : an.status,
            healthAlert: updatedAlert,
            healthData: {
              ...an.healthData,
              lastTreatment: {
                name: event.title,
                dateDaysAgo: 0,
                status:
                  withdrawalDays > 0
                    ? `Retiro activo: ${withdrawalDays} días`
                    : 'Apto para ordeño inmediato',
              },
            },
            timelineEvents: updatedTimeline,
          };
        }
        return an;
      });

      saveAnimals(updated);
      return updated;
    });

    addUnsyncedRecord(event);
    setUnsyncedCount((prev) => prev + 1);
  };

  const handleAddNewAnimal = (newAnimal: Animal) => {
    setAnimals((prev) => {
      const updated = [newAnimal, ...prev];
      saveAnimals(updated);
      return updated;
    });
    addUnsyncedRecord({ type: 'nuevo_animal', data: newAnimal });
    setUnsyncedCount((prev) => prev + 1);
  };

  const handleUpdateAnimal = (updatedAnimal: Animal) => {
    setAnimals((prev) => {
      const updated = prev.map((an) =>
        an.id === updatedAnimal.id ? updatedAnimal : an
      );
      saveAnimals(updated);
      return updated;
    });
    setSelectedAnimal(updatedAnimal);
  };

  const handleAddNewEvent = (event: ScheduledEvent) => {
    setSchedule((prev) => {
      const updated = [event, ...prev];
      saveSchedule(updated);
      return updated;
    });
    addUnsyncedRecord({ type: 'nuevo_evento_agenda', data: event });
    setUnsyncedCount((prev) => prev + 1);
  };

  const handleToggleEventComplete = (eventId: string) => {
    setSchedule((prev) => {
      const updated = prev.map((ev) =>
        ev.id === eventId ? { ...ev, completed: !ev.completed } : ev
      );
      saveSchedule(updated);
      return updated;
    });
  };

  const handleSyncNow = () => {
    clearUnsyncedRecords();
    setUnsyncedCount(0);
    setIsOffline(false);
  };

  const handleResetData = () => {
    localStorage.clear();
    setAnimals(INITIAL_ANIMALS);
    setSchedule(INITIAL_SCHEDULED_EVENTS);
    setStats(INITIAL_STATS);
    setUnsyncedCount(1);
    setSelectedAnimal(null);
    setCurrentTab('inicio');
  };

  // Determine current active view
  const defaultSelectedAnimal = selectedAnimal || animals[0];

  return (
    <div className="min-h-screen bg-[#f5fbf4] text-[#171d19] flex flex-col antialiased selection:bg-[#acf4a4] selection:text-[#002203]">
      {/* Header bar */}
      <Header
        currentTab={currentTab}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        unsyncedCount={unsyncedCount}
        onSyncNow={handleSyncNow}
        stats={stats}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-26 pb-24">
        {currentTab === 'inicio' && (
          <DashboardView
            stats={stats}
            animals={animals}
            schedule={schedule}
            onSelectAnimal={handleSelectAnimal}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onQuickStartManga={handleQuickStartManga}
          />
        )}

        {currentTab === 'animales' && (
          <AnimalesView
            animals={animals}
            selectedAnimal={selectedAnimal}
            onSelectAnimal={setSelectedAnimal}
            onRegisterEventForAnimal={handleRegisterEventForAnimal}
            onUpdateAnimal={handleUpdateAnimal}
            onAddNewAnimal={handleAddNewAnimal}
            onOpenScanner={() => setCurrentTab('escanear')}
          />
        )}

        {currentTab === 'registrar' && (
          <RegistrarView
            animals={animals}
            selectedAnimal={defaultSelectedAnimal}
            onSelectAnimal={(an) => setSelectedAnimal(an)}
            onSaveEvent={handleSaveEvent}
            onOpenScanner={() => setCurrentTab('escanear')}
            onCancel={() => setCurrentTab('inicio')}
          />
        )}

        {currentTab === 'calendario' && (
          <CalendarioView
            schedule={schedule}
            onAddNewEvent={handleAddNewEvent}
            onToggleEventComplete={handleToggleEventComplete}
            onNavigateToRegistrar={() => setCurrentTab('registrar')}
          />
        )}

        {currentTab === 'reportes' && (
          <ReportesView
            stats={stats}
            animals={animals}
            unsyncedCount={unsyncedCount}
            onSyncNow={handleSyncNow}
            onResetData={handleResetData}
          />
        )}

        {currentTab === 'escanear' && (
          <ScannerView
            animals={animals}
            onSelectAnimal={(an) => {
              setSelectedAnimal(an);
              setCurrentTab('animales');
            }}
            onBack={() => setCurrentTab('inicio')}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab !== 'animales') {
            setSelectedAnimal(null);
          }
          setCurrentTab(tab);
        }}
        onOpenScanner={() => setCurrentTab('escanear')}
      />
    </div>
  );
}
