import { Flame, MessageCircle, Sparkles, Utensils } from 'lucide-react';
import { formatKwanza, getWhatsAppUrl } from '../lib/formatters';

export default function PratoDoDiaCard({ item }) {
  // Oculta graciosamente caso nenhum prato esteja marcado ou disponível
  if (!item || !item.disponivel) return null;

  return (
    <section
      aria-label="Prato do Dia"
      className="relative overflow-hidden rounded-3xl border border-amber-400/35 bg-gradient-to-br from-[#231d16] via-[#1c1a16] to-[#171c19] p-1 shadow-2xl shadow-black/50"
    >
      <div className="relative overflow-hidden rounded-[22px] bg-[#181b18]/90">
        {/* Glow decorativo */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-red-600/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-5 p-5 sm:grid-cols-[240px_1fr] sm:items-center sm:gap-7 sm:p-6">
          {/* Imagem em destaque com aro dourado inspirado no cardápio físico */}
          <div className="relative mx-auto w-full max-w-[260px] sm:mx-0">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border-2 border-amber-400/60 bg-stone-900 shadow-xl shadow-black/50 sm:aspect-square">
              {item.imagem_url ? (
                <img
                  src={item.imagem_url}
                  alt={item.nome}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-800 to-stone-900 text-amber-400/70">
                  <Utensils className="h-12 w-12" />
                  <span className="text-xs font-medium uppercase tracking-widest">
                    Caseirinho
                  </span>
                </div>
              )}
            </div>

            {/* Selo flutuante */}
            <div className="absolute -left-2 -top-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-red-950/60 ring-2 ring-[#181b18]">
              <Flame className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span>PRATO DO DIA</span>
            </div>
          </div>

          {/* Detalhes do prato */}
          <div className="flex flex-col justify-between text-center sm:text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Sugestão Especial do Chef • {item.categoria}</span>
              </div>

              <h2 className="mt-2 font-serif-display text-3xl font-bold leading-tight text-stone-50 sm:text-4xl">
                {item.nome}
              </h2>

              {item.descricao && (
                <p className="mt-2.5 text-sm leading-relaxed text-stone-300 sm:text-base">
                  {item.descricao}
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-4 sm:flex-row">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                  Preço Especial
                </span>
                <span className="text-2xl font-extrabold tracking-tight text-amber-400 sm:text-3xl">
                  {formatKwanza(item.preco)}
                </span>
              </div>

              <a
                href={getWhatsAppUrl(item.nome, item.preco)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-900/30 transition hover:bg-amber-400 active:scale-[0.98] sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Pedir este Prato</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
