import { useState } from 'react';
import { Coffee, CupSoda, Flame, MessageCircle, UtensilsCrossed } from 'lucide-react';
import { formatKwanza, getWhatsAppUrl } from '../lib/formatters';

function getCategoryFallbackIcon(categoria) {
  const lower = (categoria || '').toLowerCase();
  if (lower.includes('café') || lower.includes('chá')) return Coffee;
  if (lower.includes('sumo') || lower.includes('bebida')) return CupSoda;
  return UtensilsCrossed;
}

export default function MenuItemCard({ item }) {
  const [imgError, setImgError] = useState(false);
  const FallbackIcon = getCategoryFallbackIcon(item.categoria);
  const showImage = Boolean(item.imagem_url) && !imgError;

  return (
    <article className="group relative flex items-center gap-4 rounded-2xl border border-stone-800/90 bg-[#1b201d]/90 p-3.5 transition duration-200 hover:border-amber-500/40 hover:bg-[#202622] hover:shadow-lg hover:shadow-black/30 sm:p-4">
      {/* Miniatura circular/arredondada com borda dourada remetendo ao cardápio físico */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-500/45 bg-stone-900 shadow-md transition duration-300 group-hover:border-amber-400/80 sm:h-28 sm:w-28">
        {showImage ? (
          <img
            src={item.imagem_url}
            alt={item.nome}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900 text-amber-500/70">
            <FallbackIcon className="h-9 w-9" />
          </div>
        )}

        {item.prato_do_dia && (
          <span
            title="Prato do Dia"
            className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow"
          >
            <Flame className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
            Dia
          </span>
        )}
      </div>

      {/* Informações do item */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-snug text-amber-50 transition group-hover:text-amber-300 sm:text-lg">
              {item.nome}
            </h3>
          </div>

          {item.descricao && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-400 sm:text-sm">
              {item.descricao}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-base font-extrabold tracking-tight text-amber-400 sm:text-lg">
            {formatKwanza(item.preco)}
          </span>

          <a
            href={getWhatsAppUrl(item.nome, item.preco)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Encomendar ${item.nome} pelo WhatsApp`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700/80 bg-stone-900/70 px-2.5 py-1.5 text-xs font-semibold text-stone-200 transition hover:border-amber-500/60 hover:bg-amber-500/15 hover:text-amber-300"
          >
            <MessageCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>Pedir</span>
          </a>
        </div>
      </div>
    </article>
  );
}
