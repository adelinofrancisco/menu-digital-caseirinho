import { Clock, MapPin, Phone, UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_INFO, getWhatsAppUrl } from '../lib/formatters';

export default function Navbar() {
  return (
    <header className="relative overflow-hidden border-b border-amber-500/20 bg-gradient-to-b from-[#1a221d] via-[#151b18] to-[#141816]">
      {/* Brilho decorativo sutil no topo */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[34rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 pb-6 pt-7 sm:px-6 sm:pb-8 sm:pt-9">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row sm:items-end">
          {/* Identidade da Marca */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-500/35 bg-red-600/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-red-200">
              <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" />
              <span>Menu Digital Oficial</span>
            </div>

            <div className="flex items-baseline gap-2.5">
              <h1 className="font-script text-5xl font-bold tracking-wide text-stone-50 drop-shadow-[0_2px_12px_rgba(217,119,6,0.25)] sm:text-6xl">
                {RESTAURANT_INFO.shortName}
              </h1>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/90 sm:inline">
                Restaurante
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-stone-300 sm:justify-start sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
                <span>{RESTAURANT_INFO.location}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0 text-amber-400" />
                <span>{RESTAURANT_INFO.hours}</span>
              </span>
            </div>
          </div>

          {/* Botão rápido de encomendas via WhatsApp */}
          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/30 ring-1 ring-amber-400/30 transition duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              <Phone className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
              <span>Encomendar no WhatsApp</span>
            </a>
            <span className="text-xs font-medium tracking-wide text-stone-400">
              {RESTAURANT_INFO.phoneDisplay}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
