import { useState } from 'react';
import { Coffee, CupSoda, Flame, UtensilsCrossed } from 'lucide-react';
import { formatKwanza } from '../lib/formatters';
import GreenLeaf from './GreenLeaf';

function getCategoryFallbackIcon(categoria) {
  const lower = (categoria || '').toLowerCase();
  if (lower.includes('café') || lower.includes('chá')) return Coffee;
  if (lower.includes('sumo') || lower.includes('bebida')) return CupSoda;
  return UtensilsCrossed;
}

export default function MenuItemCard({ item, align = 'left' }) {
  const [imgError, setImgError] = useState(false);
  const FallbackIcon = getCategoryFallbackIcon(item.categoria);
  const showImage = Boolean(item.imagem_url) && !imgError;
  const isPlateOnLeft = align === 'left';

  // Componente do Prato redondo de cerâmica
  const PlateElement = (
    <div className="relative shrink-0">
      <div className="ceramic-plate-rim relative h-32 w-32 rounded-full p-2 transition duration-500 group-hover:scale-105 sm:h-36 sm:w-36">
        <div className="h-full w-full overflow-hidden rounded-full bg-stone-900">
          {showImage ? (
            <img
              src={item.imagem_url}
              alt={item.nome}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone-900 text-amber-400/70">
              <FallbackIcon className="h-10 w-10" />
            </div>
          )}
        </div>
      </div>

      {/* Selo se for o Prato do Dia */}
      {item.prato_do_dia && (
        <span
          title="Prato do Dia"
          className="absolute -top-1 left-2 inline-flex items-center gap-0.5 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow ring-1 ring-white/30"
        >
          <Flame className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
          Dia
        </span>
      )}

      {/* Folha verde decorativa que aparece no estilo do cartaz */}
      <div
        className={`absolute -bottom-2 ${
          isPlateOnLeft ? '-left-2' : '-right-2'
        }`}
      >
        <GreenLeaf className="h-6 w-6" rotate={isPlateOnLeft ? -35 : 45} />
      </div>
    </div>
  );

  // Componente de Informações (Nome, Descrição e Preço em cada produto)
  const InfoElement = (
    <div
      className={`flex min-w-0 flex-1 flex-col justify-center ${
        isPlateOnLeft ? 'text-left' : 'text-right sm:text-right'
      }`}
    >
      <h3 className="font-sans text-lg font-extrabold leading-snug tracking-tight text-white drop-shadow-sm transition group-hover:text-amber-300 sm:text-xl">
        {item.nome}
      </h3>

      {item.descricao && (
        <p className="mt-1.5 text-xs leading-relaxed text-[#d7c4b4] sm:text-sm">
          {item.descricao}
        </p>
      )}

      {/* Preço de cada produto (sem botão de pedir) */}
      <div
        className={`mt-2.5 flex items-center ${
          isPlateOnLeft ? 'justify-start' : 'justify-end'
        }`}
      >
        <span className="inline-flex items-center rounded-xl border border-amber-600/40 bg-[#2b160c]/90 px-3 py-1 font-sans text-sm font-black tracking-tight text-amber-400 shadow-sm sm:text-base">
          {formatKwanza(item.preco)}
        </span>
      </div>
    </div>
  );

  return (
    <article
      className={`group relative flex items-center gap-4 py-4 sm:gap-6 sm:py-5 ${
        isPlateOnLeft ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {PlateElement}
      {InfoElement}
    </article>
  );
}
