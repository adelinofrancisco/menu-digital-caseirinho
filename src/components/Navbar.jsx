import { Clock, MapPin, UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_INFO } from '../lib/formatters';

export default function Navbar() {
  return (
    <header className="relative overflow-hidden border-b border-stone-800/80 bg-gradient-to-b from-[#120a06] via-[#160d08] to-[#120a06]/95">
      {/* Brilho quente suave no topo */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[30rem] -translate-x-1/2 rounded-full bg-amber-700/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          {/* Identidade do Restaurante */}
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c7b29e]">
              <UtensilsCrossed className="h-3 w-3 text-[#d8c0a8]" />
              <span>{RESTAURANT_INFO.socialHandle || '@RestauranteCaseirinho'}</span>
            </div>

            <h1 className="font-script text-3xl font-bold tracking-wide text-[#fdfbf9] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-4xl">
              {RESTAURANT_INFO.name}
            </h1>
          </div>

          {/* Badges elegantes em tom marfim/madeira */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-[#e4d6c7] sm:justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-800 bg-[#1c120c]/80 px-3 py-1.5 shadow-sm">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#c7b29e]" />
              <span>{RESTAURANT_INFO.location}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-800 bg-[#1c120c]/80 px-3 py-1.5 shadow-sm">
              <Clock className="h-3.5 w-3.5 shrink-0 text-[#c7b29e]" />
              <span>{RESTAURANT_INFO.hours}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
