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

  const PlateElement = (
    <div className="relative shrink-0">
      <div className="ceramic-plate-rim relative h-26 w-26 rounded-full p-1.5 transition duration-500 group-hover:scale-105 sm:h-36 sm:w-36 sm:p-2">
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
            <div className="flex h-full w-full items-center justify-center bg-stone-900 text-amber-300/70">
              <FallbackIcon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          )}
        </div>
      </div>

      {item.prato_do_dia && (
        <span
          title="Prato do Dia"
          className="absolute -top-1 left-1.5 inline-flex items-center gap-0.5 rounded-full bg-[#bf3626] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow ring-1 ring-white/30"
        >
          <Flame className="h-2.5 w-2.5 fill-amber-200 text-amber-200" />
          Dia
        </span>
      )}

      {/* Folha verde decorativa discreta */}
      <div
        className={`absolute -bottom-1.5 ${
          isPlateOnLeft ? '-left-1' : '-right-1'
        }`}
      >
        <GreenLeaf className="h-5 w-5 sm:h-6 sm:w-6" rotate={isPlateOnLeft ? -30 : 40} />
      </div>
    </div>
  );

  const InfoElement = (
    <div
      className={`flex min-w-0 flex-1 flex-col justify-center ${
        isPlateOnLeft ? 'text-left' : 'text-right'
      }`}
    >
      <h3 className="font-sans text-base font-extrabold leading-snug tracking-tight text-white drop-shadow-sm transition group-hover:text-amber-200 sm:text-xl">
        {item.nome}
      </h3>

      {item.descricao && (
        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[#d4c3b3] sm:mt-1.5 sm:text-sm">
          {item.descricao}
        </p>
      )}

      {/* Preço de cada produto: badge suave em tom caramelo quente, sofisticado e legível */}
      <div
        className={`mt-2.5 flex items-center ${
          isPlateOnLeft ? 'justify-start' : 'justify-end'
        }`}
      >
        <span className="inline-flex items-center rounded-full border border-amber-600/35 bg-[#25150d] px-3 py-1 font-sans text-xs font-black tracking-tight text-amber-300 shadow-sm sm:text-sm">
          {formatKwanza(item.preco)}
        </span>
      </div>
    </div>
  );

  return (
    <article
      className={`group relative flex items-center gap-4 py-5 transition duration-200 hover:bg-black/10 sm:gap-7 sm:py-7 ${
        isPlateOnLeft ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {PlateElement}
      {InfoElement}
    </article>
  );
}
