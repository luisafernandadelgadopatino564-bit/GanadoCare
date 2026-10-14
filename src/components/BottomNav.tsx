import React from 'react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenScanner?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const navItems = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: 'grid_view',
    },
    {
      id: 'animales',
      label: 'Animales',
      icon: 'pets',
    },
    {
      id: 'registrar',
      label: 'Registrar',
      icon: 'vaccines',
      highlight: true,
    },
    {
      id: 'calendario',
      label: 'Calendario',
      icon: 'calendar_month',
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: 'analytics',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#dee4dd]/80 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-18 px-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[62px] h-14 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-[#00450d] font-bold'
                  : 'text-[#41493e] hover:text-[#171d19]'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    isActive ? 'material-symbols-fill scale-110' : ''
                  }`}
                >
                  {item.icon}
                </span>
                {item.highlight && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1b5e20] animate-pulse"></span>
                )}
              </div>
              <span
                className={`font-display text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'text-[#00450d] font-bold' : 'text-[#41493e]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
