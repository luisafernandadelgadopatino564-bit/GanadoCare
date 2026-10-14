import React, { useState, useEffect, useRef } from 'react';
import { Animal } from '../types';
import {
  ArrowLeft,
  QrCode,
  Radio,
  Zap,
  ZapOff,
  Keyboard,
  History,
  CheckCircle,
  X,
  Camera,
  RefreshCw,
} from 'lucide-react';

interface ScannerViewProps {
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
  onBack: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  animals,
  onSelectAnimal,
  onBack,
}) => {
  const [scanMode, setScanMode] = useState<'qr' | 'nfc'>('qr');
  const [torchOn, setTorchOn] = useState(false);
  const [detectedAnimal, setDetectedAnimal] = useState<Animal>(
    animals.find((a) => a.id === '1045') || animals[0]
  );
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [laserPosition, setLaserPosition] = useState(20);
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Animate scanning laser
  useEffect(() => {
    const interval = setInterval(() => {
      setLaserPosition((prev) => (prev >= 80 ? 20 : prev + 15));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // WebRTC camera startup
  useEffect(() => {
    let active = true;

    async function initCamera() {
      if (!useRealCamera) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        return;
      }

      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (active && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err: any) {
        console.warn('Real camera stream not available, falling back to simulated viewfinder', err);
        setCameraError('Cámara física no disponible en este dispositivo. Usando visor simulado de campo.');
        setUseRealCamera(false);
      }
    }

    initCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useRealCamera]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const cleaned = manualCode.trim().replace('#', '');
    const found = animals.find(
      (a) =>
        a.id.includes(cleaned) ||
        a.earTagNumber.includes(cleaned) ||
        a.senasaId.toLowerCase().includes(cleaned.toLowerCase())
    );

    if (found) {
      setDetectedAnimal(found);
      setShowManualInput(false);
      setManualCode('');
    } else {
      alert(`No se encontró ningún animal con el arete #${cleaned} en el censo.`);
    }
  };

  const handleCycleDemoAnimal = () => {
    const currentIndex = animals.findIndex((a) => a.id === detectedAnimal.id);
    const next = animals[(currentIndex + 1) % animals.length];
    setDetectedAnimal(next);
  };

  return (
    <div className="flex flex-col gap-3 pb-12 animate-in fade-in duration-150">
      {/* Top Bar & Contextual Action */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-[#eff5ee] active:bg-[#dee4dd] text-[#171d19] font-display font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-1.5 bg-[#e4eae3] px-3 py-1 rounded-full text-[#41493e]">
          <span className="material-symbols-outlined text-[16px] text-[#00450d] animate-pulse">
            sensors
          </span>
          <span className="font-display text-[10px] uppercase tracking-wider font-bold">
            {useRealCamera ? 'Cámara WebRTC' : 'Visor Activo'}
          </span>
        </div>
      </div>

      {/* Screen Heading */}
      <div>
        <h1 className="font-display font-bold text-2xl text-[#00450d] tracking-tight">
          Escanear animal
        </h1>
        <p className="text-xs text-[#41493e] mt-0.5">
          Identifica al animal con su código QR o etiqueta NFC en manga
        </p>
      </div>

      {/* Viewfinder Section */}
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#2c322d] shadow-md flex items-center justify-center select-none border-2 border-[#acf4a4]/40">
        {/* Real Camera Stream or High-Quality Pasture Viewfinder */}
        {useRealCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            alt="Vista de cámara en pastoreo con vaca lechera Holstein"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UjQRInlcxAsB_u45De8ttPVieYfJbMKlwP0EH7CHqCWZ7dWCPyYmKr7mk1JcmqjSAD96wBHjltAWL-laXUxVUO4sfNpSTnKB9Gc_W10PR_096e6t6hrwoqWQ0C_UagRRslOzmwqU3oHMgtnY1SCoRWxQIuhlZW3mt-p6KsWqodzz-Y1W0WO14LdCX-5iIdQYpuI5yuHcH8uHrw_ZH-_Ydyg2WAVBv4iVg5MVrf3-qTSWctRdcUhqiOAtuO"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Environmental Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 pointer-events-none"></div>

        {/* Top Overlay Controls inside Viewfinder */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto z-20">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/75 backdrop-blur-md rounded-full text-white">
            <span className="inline-block w-2 h-2 rounded-full bg-[#acf4a4] animate-ping"></span>
            <span className="font-display text-[10px] tracking-wider uppercase font-bold">
              Autoenfoque
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUseRealCamera(!useRealCamera)}
              title="Alternar entre cámara de tu dispositivo y visor de campo"
              className={`h-9 px-2.5 rounded-full backdrop-blur-md flex items-center gap-1 font-display text-[10px] font-bold shadow-sm transition-all ${
                useRealCamera ? 'bg-[#acf4a4] text-[#002203]' : 'bg-black/70 text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{useRealCamera ? 'Dispositivo' : 'Campo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setTorchOn(!torchOn)}
              aria-label="Encender linterna"
              className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-sm ${
                torchOn ? 'bg-[#acf4a4] text-[#002203]' : 'bg-black/75 text-white'
              }`}
            >
              {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tactical Reticle & Scan Target */}
        <div className="relative w-64 h-64 z-10 flex items-center justify-center">
          {/* 4 Corner Brackets */}
          <div
            className="absolute top-0 left-0 w-8 h-8 rounded-tl-lg shadow-sm"
            style={{ borderTop: '4px solid #acf4a4', borderLeft: '4px solid #acf4a4' }}
          ></div>
          <div
            className="absolute top-0 right-0 w-8 h-8 rounded-tr-lg shadow-sm"
            style={{ borderTop: '4px solid #acf4a4', borderRight: '4px solid #acf4a4' }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-lg shadow-sm"
            style={{ borderBottom: '4px solid #acf4a4', borderLeft: '4px solid #acf4a4' }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-8 h-8 rounded-br-lg shadow-sm"
            style={{ borderBottom: '4px solid #acf4a4', borderRight: '4px solid #acf4a4' }}
          ></div>

          {/* Scanning animated laser ray */}
          <div
            className="absolute left-1 right-1 h-0.5 bg-[#acf4a4] shadow-[0_0_12px_#acf4a4] transition-all duration-500 ease-in-out"
            style={{ top: `${laserPosition}%` }}
          ></div>

          {/* Tag Focus Reticle Indicator on Ear-Tag */}
          <div className="absolute -top-3 right-4 flex flex-col items-center gap-1 pointer-events-auto">
            <button
              type="button"
              onClick={handleCycleDemoAnimal}
              title="Toca para alternar animal detectado"
              className="flex items-center gap-1 bg-[#00450d] px-2.5 py-1 rounded-full shadow-md text-white font-display text-[10px] font-bold active:scale-95 transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-[#acf4a4]" />
              <span>Arete {detectedAnimal.earTagNumber}</span>
              <RefreshCw className="w-2.5 h-2.5 ml-0.5 opacity-70" />
            </button>
            <div className="w-2 h-2 rotate-45 bg-[#00450d] -mt-1"></div>
          </div>

          {/* Center alignment badge */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-[#acf4a4]">
            <span className="material-symbols-outlined text-[36px]">filter_center_focus</span>
          </div>
        </div>

        {/* Bottom Guidance Pill inside viewport */}
        <div className="absolute bottom-3 inset-x-4 z-20 flex justify-center text-center">
          <div className="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md shadow-sm text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#acf4a4]">
              center_focus_strong
            </span>
            <span className="font-display text-xs font-semibold">
              Apunta el arete dentro del visor
            </span>
          </div>
        </div>
      </div>

      {cameraError && (
        <p className="text-[11px] text-[#ba1a1a] text-center font-medium bg-[#ffdad6] p-2 rounded-xl">
          {cameraError}
        </p>
      )}

      {/* Instruction Subtext */}
      <p className="text-xs text-center text-[#41493e] px-2">
        Coloca el código QR o la etiqueta NFC dentro del recuadro
      </p>

      {/* Tactile Mode Switcher (QR vs NFC) */}
      <div className="p-1 rounded-2xl bg-[#e4eae3] flex items-center gap-1 shadow-xs">
        <button
          type="button"
          onClick={() => setScanMode('qr')}
          className={`flex-1 h-13 rounded-xl flex items-center justify-center gap-2 transition-all font-display text-xs font-bold active:scale-95 ${
            scanMode === 'qr'
              ? 'bg-[#1b5e20] text-white shadow-sm'
              : 'text-[#41493e] hover:text-[#171d19]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Escanear QR</span>
        </button>

        <button
          type="button"
          onClick={() => setScanMode('nfc')}
          className={`flex-1 h-13 rounded-xl flex items-center justify-center gap-2 transition-all font-display text-xs font-bold active:scale-95 ${
            scanMode === 'nfc'
              ? 'bg-[#1b5e20] text-white shadow-sm'
              : 'text-[#41493e] hover:text-[#171d19]'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Escanear NFC</span>
        </button>
      </div>

      {/* Live Detection Alert Card (Moment of Delight) */}
      <div className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-l-[#00450d] border-t border-r border-b border-[#dee4dd]/60 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Cattle Ear Tag Vinyl Graphic */}
            <div className="w-12 h-14 bg-[#fed7ca] text-[#2b160f] rounded-lg flex flex-col items-center justify-center shadow-xs border border-[#e4beb2] pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#dee4dd] mb-0.5"></div>
              <span className="font-display text-[9px] uppercase font-bold leading-none text-[#795c51]">
                Arete
              </span>
              <span className="font-display font-bold text-sm tracking-tight leading-none mt-0.5">
                {detectedAnimal.id}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-[#171d19]">
                  {detectedAnimal.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-display text-[10px] font-bold ${
                    detectedAnimal.status === 'sano'
                      ? 'bg-[#acf4a4] text-[#002203]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  {detectedAnimal.status === 'sano' ? 'Sana' : 'En Retiro'}
                </span>
              </div>
              <span className="text-xs text-[#41493e]">
                {detectedAnimal.breed} • ID {detectedAnimal.id}
              </span>
            </div>
          </div>

          <CheckCircle className="w-7 h-7 text-[#00450d] shrink-0" />
        </div>

        {/* Quick Metrics Ribbon */}
        <div className="grid grid-cols-3 gap-2 bg-[#eff5ee] rounded-xl p-2.5 text-center">
          <div>
            <span className="block font-display text-[10px] text-[#41493e] uppercase font-bold">
              Peso
            </span>
            <span className="font-display font-bold text-sm text-[#171d19]">
              {detectedAnimal.currentWeight} kg
            </span>
          </div>
          <div>
            <span className="block font-display text-[10px] text-[#41493e] uppercase font-bold">
              Producción
            </span>
            <span className="font-display font-bold text-sm text-[#00450d]">
              {detectedAnimal.productionData.dailyMilkYield > 0
                ? `${detectedAnimal.productionData.dailyMilkYield} L/d`
                : 'N/A'}
            </span>
          </div>
          <div>
            <span className="block font-display text-[10px] text-[#41493e] uppercase font-bold">
              Preñez
            </span>
            <span className="font-display font-bold text-sm text-[#75584d] truncate">
              {detectedAnimal.reproductiveData.status.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Action Button inside card */}
        <button
          type="button"
          onClick={() => onSelectAnimal(detectedAnimal)}
          className="w-full h-13 rounded-xl bg-[#00450d] hover:bg-[#1b5e20] text-white font-display font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-xs"
        >
          <span>Ver Ficha Completa de {detectedAnimal.name}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Manual Entry button & Historic action */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setShowManualInput(true)}
          className="flex-1 h-13 rounded-xl bg-[#eff5ee] hover:bg-[#e4eae3] text-[#171d19] font-display font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Keyboard className="w-4 h-4 text-[#75584d]" />
          <span>Ingresar código manual</span>
        </button>

        <button
          type="button"
          onClick={handleCycleDemoAnimal}
          title="Ver siguiente animal escaneado"
          className="w-13 h-13 rounded-xl bg-[#eff5ee] hover:bg-[#e4eae3] text-[#171d19] flex items-center justify-center transition-colors shadow-xs"
        >
          <History className="w-5 h-5 text-[#41493e]" />
        </button>
      </div>

      {/* Manual Code Input Bottom Sheet / Modal */}
      {showManualInput && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 shadow-2xl w-full max-w-sm flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-base text-[#171d19]">
                Buscar por número de arete
              </span>
              <button
                type="button"
                onClick={() => setShowManualInput(false)}
                className="w-7 h-7 rounded-full bg-[#eff5ee] flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#41493e]" />
              </button>
            </div>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Ej. 1045, 0482, 0115"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 h-12 bg-[#eff5ee] px-3.5 rounded-xl font-display font-bold text-base text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#00450d]"
              />
              <button
                type="submit"
                className="px-4 h-12 bg-[#00450d] text-white rounded-xl font-display font-bold text-sm shadow-xs hover:bg-[#1b5e20]"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
