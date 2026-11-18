import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Loader2,
  Lock,
  Phone,
  Search,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PratoDoDiaCard from '../components/PratoDoDiaCard';
import MenuItemCard from '../components/MenuItemCard';
import { isSupabaseConfigured, menuService } from '../lib/supabaseClient';
import { MENU_CATEGORIES, RESTAURANT_INFO, getWhatsAppUrl } from '../lib/formatters';

export default function PublicMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Destaque do dia (apenas se estiver marcado e disponível)
  const pratoDoDia = useMemo(
    () => items.find((item) => item.prato_do_dia && item.disponivel) || null,
    [items]
  );

  // Categorias dinâmicas ordenadas segundo a ordem lógica do cardápio físico
  const categories = useMemo(() => {
    const present = new Set(items.map((item) => item.categoria).filter(Boolean));
    const ordered = MENU_CATEGORIES.filter((cat) => present.has(cat));
    const extras = Array.from(present).filter((cat) => !MENU_CATEGORIES.includes(cat));
    return ['Todos', ...ordered, ...extras];
  }, [items]);

  // Filtragem por aba e pesquisa por nome/descrição
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

  // Agrupamento por categoria quando a aba "Todos" está ativa
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
    <div className="min-h-screen bg-chalkboard text-stone-100">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        {/* Aviso discreto apenas em Modo Demonstração */}
        {!isSupabaseConfigured && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
            <span>
              <strong>Modo Demonstração:</strong> a exibir o cardápio local do Restaurante Caseirinho. Configure o <code className="rounded bg-black/30 px-1 py-0.5">.env</code> para ligar ao Supabase.
            </span>
            <Link
              to="/admin"
              className="font-bold text-amber-300 underline decoration-amber-400/60 underline-offset-2 hover:text-amber-200"
            >
              Testar Painel Admin →
            </Link>
          </div>
        )}

        {/* Secção Destaque: Prato do Dia */}
        {!loading && !error && pratoDoDia && !searchTerm && (
          <div className="mb-8">
            <PratoDoDiaCard item={pratoDoDia} />
          </div>
        )}

        {/* Barra sticky de Pesquisa + Abas de Categorias */}
        <section className="sticky top-0 z-30 -mx-4 mb-7 border-b border-stone-800/80 bg-[#141816]/92 px-4 py-3.5 backdrop-blur-md sm:-mx-6 sm:px-6">
          {/* Pesquisa rápida */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar prato, sumo, café ou aperitivo..."
              aria-label="Pesquisar no cardápio"
              className="w-full rounded-2xl border border-stone-800 bg-[#1c221e] py-3 pl-10 pr-10 text-sm text-stone-100 placeholder-stone-400 outline-none transition focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar pesquisa"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filtros rápidos em Abas (Tabs) */}
          <div
            className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-0.5"
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
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition sm:text-sm ${
                    active
                      ? 'bg-red-600 text-white shadow-md shadow-red-950/50 ring-1 ring-red-400/40'
                      : 'border border-stone-800 bg-[#1b201d] text-stone-300 hover:border-amber-500/40 hover:text-amber-300'
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
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-stone-400">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm font-medium">A carregar o cardápio do dia...</p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-2xl border border-red-500/40 bg-red-950/30 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
            <h2 className="mt-3 text-base font-bold text-red-100">
              Erro ao carregar o menu
            </h2>
            <p className="mt-1 text-sm text-red-200/80">{error}</p>
          </div>
        ) : groupedItems.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-stone-800 bg-[#1a1f1c] p-10 text-center">
            <UtensilsCrossed className="mx-auto h-10 w-10 text-amber-500/60" />
            <h2 className="mt-4 text-lg font-bold text-stone-100">
              Nenhum item encontrado
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Não encontrámos pratos correspondentes à sua pesquisa.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todos');
              }}
              className="mt-5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-950 hover:bg-amber-400"
            >
              Ver todo o cardápio
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedItems.map(({ category, list }) => (
              <section key={category} aria-label={category}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-red-500 to-amber-500" />
                    <h2 className="font-serif-display text-2xl font-bold tracking-wide text-stone-50 sm:text-3xl">
                      {category}
                    </h2>
                  </div>
                  <span className="rounded-full border border-stone-800 bg-stone-900/70 px-2.5 py-0.5 text-xs font-semibold text-stone-400">
                    {list.length} {list.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
                  {list.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Rodapé com contacto e link discreto para a área administrativa */}
      <footer className="border-t border-stone-800/80 bg-[#111513]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left">
          <div>
            <p className="font-script text-3xl font-bold text-stone-100">
              {RESTAURANT_INFO.shortName}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              {RESTAURANT_INFO.location} • {RESTAURANT_INFO.hours}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-800 bg-stone-900 px-3.5 py-2 text-xs font-semibold text-amber-300 transition hover:border-amber-500/50"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{RESTAURANT_INFO.phoneDisplay}</span>
            </a>

            <Link
              to="/admin"
              title="Área Administrativa"
              aria-label="Aceder à área administrativa"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-800/80 p-2 text-stone-500 transition hover:border-amber-500/40 hover:text-amber-400"
            >
              <Lock className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
