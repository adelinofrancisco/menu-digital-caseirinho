import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Clock,
  Loader2,
  Lock,
  MapPin,
  Phone,
  Search,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PratoDoDiaCard from '../components/PratoDoDiaCard';
import MenuItemCard from '../components/MenuItemCard';
import GreenLeaf from '../components/GreenLeaf';
import { isSupabaseConfigured, menuService } from '../lib/supabaseClient';
import { MENU_CATEGORIES, RESTAURANT_INFO } from '../lib/formatters';

const DIAS_DA_SEMANA = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

export default function PublicMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const diaDaSemanaAtual = useMemo(() => {
    const hoje = new Date().getDay();
    return DIAS_DA_SEMANA[hoje] || 'hoje';
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchMenu() {
      try {
        setLoading(true);
        setError('');
        const data = await menuService.listItems({ onlyAvailable: true });
        if (active) setItems(data);
      } catch (err) {
        if (active) {
          setError(
            err?.message || 'Não foi possível carregar o menu neste momento.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchMenu();
    return () => {
      active = false;
    };
  }, []);

  const pratoDoDia = useMemo(
    () => items.find((item) => item.prato_do_dia && item.disponivel) || null,
    [items]
  );

  const categories = useMemo(() => {
    const present = new Set(items.map((item) => item.categoria).filter(Boolean));
    const ordered = MENU_CATEGORIES.filter((cat) => present.has(cat));
    const extras = Array.from(present).filter((cat) => !MENU_CATEGORIES.includes(cat));
    return ['Todos', ...ordered, ...extras];
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Todos' || item.categoria === selectedCategory;
      const matchesSearch =
        !query ||
        item.nome.toLowerCase().includes(query) ||
        (item.descricao || '').toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchTerm]);

  const groupedItems = useMemo(() => {
    if (selectedCategory !== 'Todos') {
      return [{ category: selectedCategory, list: filteredItems }];
    }

    const groups = new Map();
    const orderList = categories.filter((c) => c !== 'Todos');
    orderList.forEach((cat) => groups.set(cat, []));

    filteredItems.forEach((item) => {
      if (!groups.has(item.categoria)) groups.set(item.categoria, []);
      groups.get(item.categoria).push(item);
    });

    return Array.from(groups.entries())
      .filter(([, list]) => list.length > 0)
      .map(([category, list]) => ({ category, list }));
  }, [filteredItems, selectedCategory, categories]);

  return (
    <div className="min-h-screen bg-rustic-wood text-[#f7ede2]">
      <Navbar />

      <main className="relative mx-auto max-w-2xl px-4 pb-20 pt-5 sm:px-6 sm:pt-7">
        {/* Aviso de Modo Demonstração */}
        {!isSupabaseConfigured && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-900/40 bg-[#21130a]/80 px-4 py-2.5 text-xs text-amber-200/90 backdrop-blur">
            <span>
              <strong>Modo Demonstração:</strong> a exibir o cardápio local.
            </span>
            <Link
              to="/admin"
              className="font-bold text-amber-300 underline underline-offset-2 hover:text-amber-200"
            >
              Testar Painel Admin →
            </Link>
          </div>
        )}

        {/* Título com toque gastronómico caloroso e harmonioso */}
        <div className="mb-7 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300/80">
            {RESTAURANT_INFO.socialHandle || '@RestauranteCaseirinho'}
          </span>
          <h2 className="mt-1 font-sans text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] sm:text-5xl">
            Cardápio de
          </h2>
          <p className="font-sans text-2xl font-black capitalize tracking-tight text-amber-300/95 drop-shadow-md sm:text-4xl">
            {selectedCategory === 'Todos' ? diaDaSemanaAtual : selectedCategory}
          </p>
        </div>

        {/* Prato do Dia (mantido no topo) */}
        {!loading && !error && pratoDoDia && !searchTerm && (
          <div className="mb-9">
            <PratoDoDiaCard item={pratoDoDia} />
          </div>
        )}

        {/* Barra de Pesquisa + Abas de Categorias com botões em tom quente suave */}
        <section className="sticky top-0 z-30 -mx-4 mb-8 border-b border-amber-900/40 bg-[#170e08]/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-300/50" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar prato, bebida ou café..."
              aria-label="Pesquisar no cardápio"
              className="w-full rounded-2xl border border-amber-900/40 bg-[#22130b]/90 py-2.5 pl-10 pr-10 text-sm text-stone-100 placeholder-stone-400 outline-none transition focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar pesquisa"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Botões das Abas: tom caramelo/âmbar elegante e suave (sem laranjas néon agressivos) */}
          <div
            className="no-scrollbar mx-auto mt-2.5 flex max-w-xl items-center gap-1.5 overflow-x-auto pb-0.5"
            role="tablist"
            aria-label="Categorias do menu"
          >
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide transition sm:text-sm ${
                    active
                      ? 'border border-amber-500/50 bg-[#8c4b21] text-amber-50 shadow-sm ring-1 ring-amber-400/20'
                      : 'border border-amber-900/35 bg-[#20120a] text-stone-300 hover:border-amber-700/50 hover:text-amber-200'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* Estados de carregamento / erro / vazio */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-amber-200/60">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            <p className="text-sm font-medium">A carregar o cardápio...</p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
            <h3 className="mt-3 text-base font-bold text-red-100">
              Erro ao carregar o menu
            </h3>
            <p className="mt-1 text-sm text-red-200/80">{error}</p>
          </div>
        ) : groupedItems.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-amber-900/40 bg-[#22130b]/90 p-10 text-center">
            <UtensilsCrossed className="mx-auto h-10 w-10 text-amber-400/60" />
            <h3 className="mt-4 text-lg font-bold text-white">
              Nenhum item encontrado
            </h3>
            <p className="mt-1 text-sm text-[#baa99b]">
              Tente outra pesquisa ou explore as categorias.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todos');
              }}
              className="mt-5 rounded-xl border border-amber-600/40 bg-[#2a170d] px-4 py-2 text-sm font-bold text-amber-300 shadow hover:bg-[#341d10]"
            >
              Ver todo o cardápio
            </button>
          </div>
        ) : (
          /* Listagem dos itens com respiro equilibrado */
          <div className="space-y-12">
            {groupedItems.map(({ category, list }) => (
              <section key={category} aria-label={category} className="relative">
                {/* Divisor de categoria com detalhe dourado sutil */}
                <div className="mb-2 flex items-center justify-between border-b border-amber-900/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-1 rounded-full bg-amber-400/80" />
                    <h3 className="font-sans text-lg font-black uppercase tracking-wider text-amber-100 sm:text-xl">
                      {category}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/70">
                    {list.length} {list.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {/* Lista em ziguezague alternado com respiro */}
                <div className="divide-y divide-amber-950/35">
                  {list.map((item, index) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      align={index % 2 === 0 ? 'left' : 'right'}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* RODAPÉ: A MESA DE MADEIRA RÚSTICA E ACOLHEDORA */}
      <footer className="relative mt-12">
        <div className="bg-wood-tabletop relative px-4 pb-12 pt-10 sm:px-6 sm:pb-14">
          <div className="pointer-events-none absolute left-6 top-3 hidden sm:block">
            <GreenLeaf className="h-9 w-9" rotate={-45} />
          </div>
          <div className="pointer-events-none absolute right-8 top-4">
            <GreenLeaf className="h-11 w-11" rotate={35} />
          </div>

          <div className="mx-auto max-w-xl">
            {/* Placa marfim com tipografia quente e nítida */}
            <div className="relative rounded-3xl border border-[#ded0c1] bg-[#fbf7f2] p-5 text-center text-[#22130a] shadow-2xl shadow-black/80 sm:p-6">
              <div className="absolute -right-2 -top-3">
                <GreenLeaf className="h-7 w-7" rotate={20} />
              </div>

              <span className="inline-block rounded-full bg-[#963821] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Restaurante Caseirinho
              </span>

              <h4 className="mt-2 font-script text-3xl font-bold text-[#1a0f0a] sm:text-4xl">
                {RESTAURANT_INFO.shortName}
              </h4>

              <div className="mt-3 flex flex-col items-center justify-center gap-1.5 text-xs font-semibold text-[#543b2d] sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#963821]" />
                  <span>{RESTAURANT_INFO.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#7c4d29]" />
                  <span>{RESTAURANT_INFO.hours}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[#1a0f0a] sm:text-base">
                  <Phone className="h-4 w-4 text-[#2f5e36]" />
                  <span>{RESTAURANT_INFO.phoneDisplay}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-[#e2d5c5] pt-3 text-[11px] text-[#735a49]">
                Preços e pratos sujeitos a confirmação no atendimento presencial
              </div>
            </div>

            {/* Acesso discreto ao painel administrativo */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <Link
                to="/admin"
                title="Área Administrativa"
                aria-label="Aceder à área administrativa"
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/50 bg-[#1c1109]/80 px-3 py-1 text-[11px] font-semibold text-amber-200/70 transition hover:border-amber-600/50 hover:text-white"
              >
                <Lock className="h-3 w-3" />
                <span>Gestão</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
