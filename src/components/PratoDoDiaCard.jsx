import { Flame, Sparkles, Utensils } from 'lucide-react';
import { formatKwanza } from '../lib/formatters';
import GreenLeaf from './GreenLeaf';

export default function PratoDoDiaCard({ item }) {
  // Oculta graciosamente caso nenhum prato esteja marcado ou disponível
  if (!item || !item.disponivel) return null;

  return (
    <section
      aria-label="Prato do Dia"
      className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-amber-800/40 bg-gradient-to-br from-[#29170e] via-[#1d1009] to-[#160b06] p-1 shadow-2xl shadow-black/80"
    >
      <div className="relative overflow-hidden rounded-[22px] bg-[#1c0f08]/95 p-5 sm:p-7">
        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
          {/* Prato de cerâmica branca com aro refinado */}
          <div className="relative shrink-0">
            <div className="ceramic-plate-rim relative h-36 w-36 rounded-full p-2 transition duration-500 hover:scale-105 sm:h-44 sm:w-44">
              <div className="h-full w-full overflow-hidden rounded-full bg-stone-900">
                {item.imagem_url ? (
                  <img
                    src={item.imagem_url}
                    alt={item.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-stone-900 text-amber-300/70">
                    <Utensils className="h-8 w-8" />
                    <span className="mt-1 text-[9px] font-bold uppercase tracking-widest">
                      Caseirinho
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Selo Prato do Dia em tom quente suave e elegante */}
            <div className="absolute -left-1 top-1 inline-flex items-center gap-1 rounded-full bg-[#bf3626] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md ring-2 ring-[#1c0f08]">
              <Flame className="h-3 w-3 fill-amber-200 text-amber-200" />
              <span>PRATO DO DIA</span>
            </div>

            {/* Folha verde decorativa */}
            <div className="absolute -bottom-2 -right-1">
              <GreenLeaf className="h-7 w-7" rotate={-25} />
            </div>
          </div>

          {/* Informações do Prato do Dia */}
          <div className="flex flex-1 flex-col text-center sm:text-left">
            <div className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/90 sm:justify-start">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Sugestão Especial • {item.categoria}</span>
            </div>

            <h2 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl">
              {item.nome}
            </h2>

            {item.descricao && (
              <p className="mt-1.5 text-xs leading-relaxed text-[#d9c8b8] sm:text-sm">
                {item.descricao}
              </p>
            )}

            {/* Preço em badge acolhedor com tom âmbar suave */}
            <div className="mt-3.5 flex items-center justify-center sm:justify-start">
              <div className="inline-flex items-baseline gap-2 rounded-xl border border-amber-600/35 bg-[#2a170d]/90 px-3.5 py-1.5 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/75">
                  Preço
                </span>
                <span className="font-sans text-xl font-black tracking-tight text-amber-300 sm:text-2xl">
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
