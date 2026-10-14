import React, { useState } from 'react';
import { Animal, FarmStats } from '../types';
import {
  Download,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Droplet,
  ShieldAlert,
  BarChart3,
  Layers,
  FileText,
} from 'lucide-react';

interface ReportesViewProps {
  stats: FarmStats;
  animals: Animal[];
  unsyncedCount: number;
  onSyncNow: () => void;
  onResetData: () => void;
}

export const ReportesView: React.FC<ReportesViewProps> = ({
  stats,
  animals,
  unsyncedCount,
  onSyncNow,
  onResetData,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onSyncNow();
      setIsSyncing(false);
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 3000);
    }, 1500);
  };

  const exportCSV = () => {
    const headers = [
      'Caravana',
      'SENASA_ID',
      'Nombre',
      'Raza',
      'Sexo',
      'Peso_kg',
      'Potrero',
      'Estado',
      'Produccion_L_dia',
      'Retiro_Activo',
    ];

    const rows = animals.map((a) => [
      a.earTagNumber,
      a.senasaId,
      a.name,
      a.breed,
      a.sex,
      a.currentWeight,
      `"${a.potrero}"`,
      a.status,
      a.productionData.dailyMilkYield,
      a.healthAlert?.active ? 'SI' : 'NO',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `censo_ganadero_finca_la_esperanza_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group by pasture
  const pastureCounts = animals.reduce((acc, animal) => {
    const p = animal.potrero.split(' - ')[0];
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col gap-4 pb-12 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#171d19] tracking-tight">
            Reportes & Trazabilidad
          </h1>
          <p className="text-xs text-[#41493e]">
            Métricas de producción, resguardo sanitario y sincronización local.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#eff5ee] flex items-center justify-center text-[#00450d]">
          <BarChart3 className="w-5 h-5" />
        </div>
      </div>

      {/* 1. Offline Sync Center Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00450d] text-[22px]">
              cloud_sync
            </span>
            <h3 className="font-display font-bold text-base text-[#171d19]">
              Centro de Sincronización Local
            </h3>
          </div>
          <span
            className={`font-display text-[10px] font-bold px-2 py-0.5 rounded-full ${
              unsyncedCount > 0
                ? 'bg-[#fed7ca] text-[#795c51]'
                : 'bg-[#acf4a4] text-[#002203]'
            }`}
          >
            {unsyncedCount > 0 ? `${unsyncedCount} Pendiente(s)` : 'Al Día'}
          </span>
        </div>

        <p className="text-xs text-[#41493e] leading-snug">
          Todos los pesajes, aplicaciones de antibióticos y vacunaciones se guardan primero en la
          memoria segura de tu dispositivo para operar sin internet en el campo.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="flex-1 h-12 bg-[#1b5e20] hover:bg-[#00450d] text-white rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Forzar Sincronización con Servidor'}</span>
          </button>
        </div>

        {syncDone && (
          <div className="bg-[#acf4a4]/40 border border-[#acf4a4] text-[#002203] p-2.5 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-[#00450d]" />
            <span>¡Sincronización completada! Todos los eventos están respaldados.</span>
          </div>
        )}
      </div>

      {/* 2. Sanitary & Withdrawal Overview */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#ba1a1a]" />
            <h3 className="font-display font-bold text-base text-[#171d19]">
              Control de Resguardo & Carencia
            </h3>
          </div>
          <span className="bg-[#ffdad6] text-[#93000a] font-display text-[10px] font-bold px-2 py-0.5 rounded-full">
            Inocuidad
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-[#eff5ee] p-3 rounded-xl flex flex-col">
            <span className="font-display text-[10px] uppercase text-[#41493e] font-bold">
              En Cuarentena / Retiro
            </span>
            <span className="font-display font-bold text-2xl text-[#ba1a1a] mt-1">
              {stats.enRetiro} animales
            </span>
            <span className="text-[10px] text-[#41493e] mt-0.5">Leche retenida</span>
          </div>
          <div className="bg-[#eff5ee] p-3 rounded-xl flex flex-col">
            <span className="font-display text-[10px] uppercase text-[#41493e] font-bold">
              Cobertura Antiaftosa
            </span>
            <span className="font-display font-bold text-2xl text-[#00450d] mt-1">
              96.8%
            </span>
            <span className="text-[10px] text-[#41493e] mt-0.5">Certificado SENASA</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#fed7ca]/50 text-[#795c51] text-xs leading-relaxed">
          <strong>Regla sanitaria activa:</strong> La vaca #0482 (La Morocha) no puede ordeñarse
          para tanque comercial hasta el 16 de Octubre a las 09:00 AM tras tratamiento con Ceftiofur.
        </div>
      </div>

      {/* 3. Pasture Distribution */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00450d]" />
            <h3 className="font-display font-bold text-base text-[#171d19]">
              Distribución por Potreros
            </h3>
          </div>
          <span className="font-display text-xs text-[#41493e] font-semibold">
            5 Potreros activos
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {Object.entries(pastureCounts).map(([pasture, count]) => (
            <div
              key={pasture}
              className="flex items-center justify-between p-2.5 bg-[#eff5ee] rounded-xl text-xs"
            >
              <span className="font-display font-bold text-[#171d19]">{pasture}</span>
              <span className="bg-white px-2 py-0.5 rounded font-display font-bold text-[#00450d] shadow-xs">
                {count} {count === 1 ? 'cabeza' : 'cabezas'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Official Export & Actions */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#dee4dd]/60 flex flex-col gap-2.5">
        <h3 className="font-display font-bold text-sm text-[#171d19]">
          Exportación de Documentos y Libros
        </h3>
        <p className="text-xs text-[#41493e]">
          Descarga la planilla oficial para control veterinario o inspección de SENASA.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={exportCSV}
            className="h-12 bg-[#eff5ee] hover:bg-[#e4eae3] text-[#171d19] rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#00450d]" />
            <span>Exportar Planilla Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="h-12 bg-[#eff5ee] hover:bg-[#e4eae3] text-[#171d19] rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-[#75584d]" />
            <span>Imprimir Ficha Oficial</span>
          </button>
        </div>

        <div className="pt-2 border-t border-[#eff5ee]">
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  '¿Deseas restablecer los datos de demostración a su estado inicial de la Finca La Esperanza?'
                )
              ) {
                onResetData();
              }
            }}
            className="text-[11px] text-[#717a6d] hover:text-[#ba1a1a] underline font-display"
          >
            Restablecer datos de demostración iniciales
          </button>
        </div>
      </div>
    </div>
  );
};
