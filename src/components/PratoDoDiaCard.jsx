import { Flame, Sparkles, Utensils } from 'lucide-react';
import { formatKwanza } from '../lib/formatters';
import GreenLeaf from './GreenLeaf';

export default function PratoDoDiaCard({ item }) {
  // Oculta graciosamente caso nenhum prato esteja marcado ou disponível
  if (!item || !item.disponivel) return null;

  return (
    <section
      aria-label="Prato do Dia"
      className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-amber-700/40 bg-gradient-to-br from-[#2c160c] via-[#211108] to-[#190c05] p-1.5 shadow-2xl shadow-black/70"
    >
      <div className="relative overflow-hidden rounded-[22px] bg-[#1d0e07]/95 p-5 sm:p-7">
        {/* Glows decorativos acolhedores */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-500/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-red-600/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          {/* Prato de cerâmica branca com aro realista e selo */}
          <div className="relative shrink-0">
            <div className="ceramic-plate-rim relative h-44 w-44 rounded-full p-2.5 transition duration-500 hover:scale-105 sm:h-48 sm:w-48">
              <div className="h-full w-full overflow-hidden rounded-full bg-stone-900">
                {item.imagem_url ? (
                  <img
                    src={item.imagem_url}
                    alt={item.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-stone-900 text-amber-400/80">
                    <Utensils className="h-10 w-10" />
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-widest">
                      Caseirinho
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Selo flutuante Prato do Dia */}
            <div className="absolute -left-2 top-1 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-amber-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg ring-2 ring-[#1d0e07]">
              <Flame className="h-3 w-3 fill-amber-300 text-amber-300" />
              <span>PRATO DO DIA</span>
            </div>

            {/* Folha verde decorativa fresca */}
            <div className="absolute -bottom-2 -right-1">
              <GreenLeaf className="h-8 w-8" rotate={-25} />
            </div>
          </div>

          {/* Informações do Prato do Dia e Preço (sem botão de pedir) */}
          <div className="flex flex-1 flex-col text-center sm:text-left">
            <div className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 sm:justify-start">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sugestão do Chef • {item.categoria}</span>
            </div>

            <h2 className="mt-1.5 font-sans text-2xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-3xl">
              {item.nome}
            </h2>

            {item.descricao && (
              <p className="mt-2 text-sm leading-relaxed text-[#d9c7b8] sm:text-base">
                {item.descricao}
              </p>
            )}

            {/* Preço em destaque por produto */}
            <div className="mt-4 flex items-center justify-center sm:justify-start">
              <div className="inline-flex items-baseline gap-2 rounded-2xl border border-amber-600/40 bg-gradient-to-r from-[#32170b] to-[#241006] px-4 py-2 shadow-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80">
                  Preço
                </span>
                <span className="font-sans text-2xl font-black tracking-tight text-amber-400 sm:text-3xl">
                  {formatKwanza(item.preco)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
