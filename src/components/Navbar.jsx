import { Clock, MapPin, UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_INFO } from '../lib/formatters';

export default function Navbar() {
  return (
    <header className="relative overflow-hidden border-b border-amber-900/40 bg-gradient-to-b from-[#160a04] via-[#1d0e07] to-[#180b06]/95">
      {/* Brilho âmbar sutil no topo */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-44 w-[34rem] -translate-x-1/2 rounded-full bg-amber-600/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          {/* Identidade do Restaurante */}
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/80">
              <UtensilsCrossed className="h-3 w-3 text-amber-400" />
              <span>{RESTAURANT_INFO.socialHandle || '@RestauranteCaseirinho'}</span>
            </div>

            <h1 className="font-script text-4xl font-bold tracking-wide text-[#fdf8f4] drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] sm:text-5xl">
              {RESTAURANT_INFO.name}
            </h1>
          </div>

          {/* Informações de Localização e Horário (sem botão de pedir) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-amber-100/90 sm:justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/50 bg-[#25130a]/80 px-3 py-1.5 shadow-sm">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400" />
              <span>{RESTAURANT_INFO.location}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/50 bg-[#25130a]/80 px-3 py-1.5 shadow-sm">
              <Clock className="h-3.5 w-3.5 shrink-0 text-amber-400" />
              <span>{RESTAURANT_INFO.hours}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
