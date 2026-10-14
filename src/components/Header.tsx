import React, { useState } from 'react';
import {
  CloudOff,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Download,
  Building,
  User,
  ShieldCheck,
  X,
  Radio,
  Sliders,
} from 'lucide-react';
import { FarmStats } from '../types';

interface HeaderProps {
  currentTab: string;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  unsyncedCount: number;
  onSyncNow: () => void;
  stats: FarmStats;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  isOffline,
  setIsOffline,
  unsyncedCount,
  onSyncNow,
  stats,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'inicio':
        return 'Inicio';
      case 'animales':
        return 'Animales';
      case 'registrar':
        return 'Registrar';
      case 'calendario':
        return 'Calendario';
      case 'reportes':
        return 'Reportes';
      case 'escanear':
        return 'Escanear';
      default:
        return 'GanadoCare';
    }
  };

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onSyncNow();
      setIsSyncing(false);
    }, 1200);
  };

  const exportDataJson = () => {
    const data = {
      farm: 'Finca La Esperanza',
      operator: 'Carlos Mendoza',
      exportedAt: new Date().toISOString(),
      stats,
      animals: localStorage.getItem('ganadocare_animals_v1'),
      schedule: localStorage.getItem('ganadocare_schedule_v1'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ganadocare_respaldo_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-[#f5fbf4]/95 backdrop-blur-xl border-b border-[#dee4dd]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto px-4 py-2 flex flex-col gap-1.5">
          {/* Top Brand & Profile Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1b5e20] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[22px]">pets</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-[20px] text-[#00450d] tracking-tight leading-none">
                    GanadoCare
                  </span>
                  <span className="bg-[#fed7ca] text-[#795c51] font-display text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Finca La Esperanza
                  </span>
                </div>
                <span className="font-display text-[12px] text-[#41493e] font-semibold tracking-tight">
                  {getTabLabel(currentTab)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                aria-label="Perfil del Ganadero"
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[#e4eae3] active:scale-95 transition-all"
              >
                <div className="relative">
                  <img
                    alt="Carlos Mendoza - Capataz"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI15-ZfL5P9qnPE9sPqSJ_w0HSvoZaUGS9u-aK5kyWwhyfQXxnRaJE2GOouS1Qg-zSzBPJT1i6_-oyzUjZ9ECoSD7k-W7Znjlbr7CIp92yMmLkzsBYxPvIapYN1mPqYgVvol1BqqqWky814asq3rFINAWzqrUr1q08pXig8-1OMCpfyWyq4oGfjn-MDZ7m2meLNdmdzw702dnpOrvrWMDBiIO2cjYHeh5kb21R6kg0Uj4uMpLOb7ofqQ"
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#1b5e20] shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1b5e20] border-2 border-[#f5fbf4]"></span>
                </div>
              </button>
            </div>
          </div>

          {/* Network & Offline Storage Banner with interactive toggle */}
          <div
            onClick={() => setIsOffline(!isOffline)}
            className={`w-full cursor-pointer px-3 py-1.5 rounded-lg flex items-center justify-between transition-all select-none ${
              isOffline
                ? 'bg-[#fed7ca] text-[#795c51] hover:bg-[#fcc8b7]'
                : 'bg-[#acf4a4]/60 text-[#002203] hover:bg-[#acf4a4]/80'
            }`}
            title="Haz clic para alternar entre modo Conectado y Fuera de línea"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {isOffline ? (
                <span className="material-symbols-outlined text-[16px] shrink-0 text-[#75584d]">
                  cloud_off
                </span>
              ) : (
                <span className="material-symbols-outlined text-[16px] shrink-0 text-[#00450d]">
                  cloud_done
                </span>
              )}
              <span className="font-display text-[11px] font-bold tracking-wide truncate">
                {isOffline
                  ? 'Sin conexión — se guardará localmente y sincronizará después'
                  : 'En línea — Base de datos sincronizada'}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {unsyncedCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full font-display">
                  {unsyncedCount} pend.
                </span>
              )}
              <span className="text-[10px] underline font-medium text-opacity-80">
                {isOffline ? 'Toca: conectar' : 'Toca: simular campo'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Profile & Farm Info Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#dee4dd] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#acf4a4] text-[#002203] flex items-center justify-center font-bold">
                  GC
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#171d19]">
                    Ficha del Operador & Finca
                  </h3>
                  <p className="text-xs text-[#41493e]">GanadoCare Sistema Rural</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full bg-[#eff5ee] text-[#41493e] flex items-center justify-center hover:bg-[#dee4dd]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Operator Card */}
            <div className="flex items-center gap-3 bg-[#eff5ee] p-3 rounded-xl">
              <img
                alt="Carlos Mendoza"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI15-ZfL5P9qnPE9sPqSJ_w0HSvoZaUGS9u-aK5kyWwhyfQXxnRaJE2GOouS1Qg-zSzBPJT1i6_-oyzUjZ9ECoSD7k-W7Znjlbr7CIp92yMmLkzsBYxPvIapYN1mPqYgVvol1BqqqWky814asq3rFINAWzqrUr1q08pXig8-1OMCpfyWyq4oGfjn-MDZ7m2meLNdmdzw702dnpOrvrWMDBiIO2cjYHeh5kb21R6kg0Uj4uMpLOb7ofqQ"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#1b5e20]"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-[16px] text-[#171d19]">
                  Carlos Mendoza
                </span>
                <span className="text-xs text-[#75584d] font-semibold">
                  Capataz de Manga & Sanidad
                </span>
                <span className="text-[11px] text-[#41493e] mt-0.5">
                  Finca La Esperanza • SENASA Reg. 28-940-A
                </span>
              </div>
            </div>

            {/* Farm Stats Summary */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#f5fbf4] border border-[#c0c9bb]/50 p-2 rounded-xl">
                <span className="text-[10px] font-display uppercase text-[#41493e] block">
                  Bovinos
                </span>
                <span className="font-display text-lg font-bold text-[#00450d]">
                  {stats.totalBovinos}
                </span>
              </div>
              <div className="bg-[#f5fbf4] border border-[#c0c9bb]/50 p-2 rounded-xl">
                <span className="text-[10px] font-display uppercase text-[#41493e] block">
                  En Ordeño
                </span>
                <span className="font-display text-lg font-bold text-[#003d65]">
                  {stats.vacasOrdeno}
                </span>
              </div>
              <div className="bg-[#f5fbf4] border border-[#c0c9bb]/50 p-2 rounded-xl">
                <span className="text-[10px] font-display uppercase text-[#41493e] block">
                  En Retiro
                </span>
                <span className="font-display text-lg font-bold text-[#ba1a1a]">
                  {stats.enRetiro}
                </span>
              </div>
            </div>

            {/* Offline sync actions */}
            <div className="bg-[#fed7ca]/50 p-3 rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#795c51]">
                <span>Cola de Sincronización Local:</span>
                <span className="font-bold">{unsyncedCount} registro(s)</span>
              </div>
              <button
                type="button"
                onClick={handleSyncClick}
                disabled={isSyncing}
                className="w-full h-11 bg-[#1b5e20] text-white rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-[#00450d] active:scale-98 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando con Servidor...' : 'Sincronizar Datos Ahora'}
              </button>
            </div>

            {/* Data Export Button */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={exportDataJson}
                className="flex-1 h-11 border border-[#c0c9bb] hover:bg-[#eff5ee] text-[#171d19] rounded-xl font-display font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 text-[#75584d]" />
                Descargar Respaldo JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
