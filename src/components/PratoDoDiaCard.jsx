import { Flame, Sparkles, Utensils } from 'lucide-react';
import { formatKwanza } from '../lib/formatters';
import GreenLeaf from './GreenLeaf';

export default function PratoDoDiaCard({ item }) {
  // Oculta graciosamente caso nenhum prato esteja marcado ou disponível
  if (!item || !item.disponivel) return null;

  return (
    <section
      aria-label="Prato do Dia"
      className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#3d2719]/70 bg-gradient-to-br from-[#24150e] via-[#1a0f0a] to-[#140a06] p-1 shadow-2xl shadow-black/80"
    >
      <div className="relative overflow-hidden rounded-[22px] bg-[#1a0f0a]/95 p-5 sm:p-7">
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
                  <div className="flex h-full w-full flex-col items-center justify-center bg-stone-900 text-[#d8c0a8]">
                    <Utensils className="h-8 w-8" />
                    <span className="mt-1 text-[9px] font-bold uppercase tracking-widest">
                      Caseirinho
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Selo Prato do Dia em vermelho nobre */}
            <div className="absolute -left-1 top-1 inline-flex items-center gap-1 rounded-full bg-[#b82e24] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md ring-2 ring-[#1a0f0a]">
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
            <div className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#cfb79f] sm:justify-start">
              <Sparkles className="h-3 w-3 text-[#d8c0a8]" />
              <span>Sugestão Especial • {item.categoria}</span>
            </div>

            <h2 className="mt-1 font-sans text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl">
              {item.nome}
            </h2>

            {item.descricao && (
              <p className="mt-1.5 text-xs leading-relaxed text-[#d4c3b2] sm:text-sm">
                {item.descricao}
              </p>
            )}

            {/* Preço em badge marfim elegante */}
            <div className="mt-3.5 flex items-center justify-center sm:justify-start">
              <div className="inline-flex items-baseline gap-2 rounded-xl border border-[#d8c7b5]/60 bg-[#faf6f0] px-3.5 py-1.5 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#73513b]">
                  Preço
                </span>
                <span className="font-sans text-xl font-black tracking-tight text-[#22130b] sm:text-2xl">
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
