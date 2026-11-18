import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ExternalLink,
  Flame,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  QrCode,
  RotateCcw,
  Search,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import AdminItemModal from '../components/AdminItemModal';
import QRCodeModal from '../components/QRCodeModal';
import { authService, isSupabaseConfigured, menuService } from '../lib/supabaseClient';
import { formatKwanza, MENU_CATEGORIES, RESTAURANT_INFO } from '../lib/formatters';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [authChecking, setAuthChecking] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [stockFilter, setStockFilter] = useState('all'); // all | available | out

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3200);
  }, []);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await menuService.listItems({ onlyAvailable: false });
      setItems(data);
    } catch (err) {
      showToast(err?.message || 'Erro ao carregar os itens do menu.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Verificação de sessão obrigatória
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const session = await authService.getSession();
        if (!mounted) return;
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }
        setUserEmail(session.user?.email || 'Gerência');
        setAuthChecking(false);
        loadItems();
      } catch {
        if (mounted) navigate('/login', { replace: true });
      }
    }

    checkAuth();

    const unsubscribe = authService.onAuthStateChange((session) => {
      if (!session) navigate('/login', { replace: true });
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [navigate, loadItems]);

  const categories = useMemo(() => {
    const present = new Set(items.map((item) => item.categoria).filter(Boolean));
    const ordered = MENU_CATEGORIES.filter((cat) => present.has(cat));
    const extras = Array.from(present).filter((cat) => !MENU_CATEGORIES.includes(cat));
    return ['Todas', ...ordered, ...extras];
  }, [items]);

  const pratoDoDiaAtual = useMemo(
    () => items.find((item) => item.prato_do_dia && item.disponivel) || null,
    [items]
  );

  const stats = useMemo(() => {
    const total = items.length;
    const disponiveis = items.filter((item) => item.disponivel).length;
    const esgotados = total - disponiveis;
    return { total, disponiveis, esgotados };
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Todas' || item.categoria === selectedCategory;
      const matchesSearch =
        !query ||
        item.nome.toLowerCase().includes(query) ||
        (item.descricao || '').toLowerCase().includes(query);
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'available' && item.disponivel) ||
        (stockFilter === 'out' && !item.disponivel);

      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [items, selectedCategory, searchTerm, stockFilter]);

  // Toggle exclusivo do Prato do Dia
  const handleTogglePratoDoDia = async (item) => {
    const nextState = !item.prato_do_dia;
    try {
      setBusyId(item.id);
      await menuService.setPratoDoDia(item.id, nextState);
      await loadItems();
      showToast(
        nextState
          ? `"${item.nome}" definido como Prato do Dia!`
          : `"${item.nome}" removido do destaque Prato do Dia.`
      );
    } catch (err) {
      showToast(err?.message || 'Erro ao atualizar Prato do Dia.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  // Controlo rápido de stock (Ativo / Esgotado)
  const handleToggleStock = async (item) => {
    const nextDisponivel = !item.disponivel;
    try {
      setBusyId(item.id);
      await menuService.toggleDisponibilidade(item.id, nextDisponivel);
      await loadItems();
      showToast(
        nextDisponivel
          ? `"${item.nome}" voltou a ficar disponível no menu.`
          : `"${item.nome}" marcado como Esgotado (oculto no menu).`
      );
    } catch (err) {
      showToast(err?.message || 'Erro ao atualizar stock.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  // Criar ou editar item
  const handleSaveItem = async (payload) => {
    if (editingItem) {
      await menuService.updateItem(editingItem.id, payload);
      showToast(`"${payload.nome}" atualizado com sucesso!`);
    } else {
      await menuService.createItem(payload);
      showToast(`"${payload.nome}" adicionado ao cardápio!`);
    }
    await loadItems();
  };

  // Excluir item
  const handleDeleteItem = async (item) => {
    const confirmed = window.confirm(
      `Tem a certeza que deseja excluir permanentemente "${item.nome}" do cardápio?`
    );
    if (!confirmed) return;

    try {
      setBusyId(item.id);
      await menuService.deleteItem(item.id);
      await loadItems();
      showToast(`"${item.nome}" excluído do cardápio.`);
    } catch (err) {
      showToast(err?.message || 'Erro ao excluir item.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/login', { replace: true });
  };

  const handleResetDemo = async () => {
    menuService.resetDemoData();
    await loadItems();
    showToast('Cardápio inicial restaurado.');
  };

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chalkboard text-stone-300">
        <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chalkboard pb-16 text-stone-100">
      {/* Toast de confirmação */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl ${
            toast.type === 'error'
              ? 'border-red-500/40 bg-red-950/95 text-red-100'
              : 'border-emerald-500/40 bg-[#16271d]/95 text-emerald-100'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Cabeçalho do Painel */}
      <header className="sticky top-0 z-30 border-b border-stone-800 bg-[#141816]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-stone-50 sm:text-lg">
                  Gestão {RESTAURANT_INFO.shortName}
                </h1>
                {!isSupabaseConfigured && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">{userEmail}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-xs font-semibold text-stone-200 transition hover:border-amber-500/50 hover:text-amber-300 sm:text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Ver Menu</span>
            </Link>

            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 sm:text-sm"
            >
              <QrCode className="h-4 w-4" />
              <span>QR Code</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setItemModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-stone-950 shadow-md shadow-amber-900/30 transition hover:bg-amber-400 sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Item</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Terminar Sessão"
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900/60 px-3 py-2 text-xs font-semibold text-stone-400 transition hover:border-red-500/40 hover:text-red-300 sm:text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* Cartões de Resumo */}
        <section className="grid gap-3.5 sm:grid-cols-3">
          {/* Prato do Dia atual */}
          <div className="rounded-2xl border border-amber-500/35 bg-gradient-to-br from-[#231d15] to-[#1a1f1c] p-4 sm:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-600/20 text-red-400 ring-1 ring-red-500/30">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                    Prato do Dia Ativo
                  </span>
                  {pratoDoDiaAtual ? (
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5">
                      <h2 className="text-lg font-extrabold text-stone-50">
                        {pratoDoDiaAtual.nome}
                      </h2>
                      <span className="text-sm font-bold text-amber-400">
                        {formatKwanza(pratoDoDiaAtual.preco)}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-0.5 text-sm text-stone-400">
                      Nenhum prato marcado — a secção fica oculta no menu público.
                    </p>
                  )}
                </div>
              </div>

              {pratoDoDiaAtual && (
                <button
                  type="button"
                  disabled={busyId === pratoDoDiaAtual.id}
                  onClick={() => handleTogglePratoDoDia(pratoDoDiaAtual)}
                  className="rounded-xl border border-stone-700 bg-stone-900/70 px-3 py-1.5 text-xs font-semibold text-stone-300 transition hover:border-red-500/50 hover:text-red-300"
                >
                  Desativar destaque
                </button>
              )}
            </div>
          </div>

          {/* Métricas de Stock */}
          <div className="flex items-center justify-around rounded-2xl border border-stone-800 bg-[#191f1b] p-4 text-center">
            <div>
              <span className="block text-2xl font-extrabold text-stone-50">
                {stats.total}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Total
              </span>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div>
              <span className="block text-2xl font-extrabold text-emerald-400">
                {stats.disponiveis}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Ativos
              </span>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div>
              <span className="block text-2xl font-extrabold text-red-400">
                {stats.esgotados}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Esgotados
              </span>
            </div>
          </div>
        </section>

        {/* Barra de Filtros */}
        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-stone-800 bg-[#191f1b] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por nome do prato ou descrição..."
              className="w-full rounded-xl border border-stone-700 bg-stone-900/80 py-2.5 pl-10 pr-9 text-sm text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:text-stone-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filtrar por categoria"
              className="rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              aria-label="Filtrar por disponibilidade"
              className="rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-500"
            >
              <option value="all">Todo o stock</option>
              <option value="available">Apenas disponíveis</option>
              <option value="out">Apenas esgotados</option>
            </select>

            {!isSupabaseConfigured && (
              <button
                type="button"
                onClick={handleResetDemo}
                title="Restaurar cardápio inicial de demonstração"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2.5 text-xs font-semibold text-stone-300 transition hover:border-amber-500/50 hover:text-amber-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Repor Demo</span>
              </button>
            )}
          </div>
        </section>

        {/* Lista de Itens */}
        <section className="mt-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-stone-400">
              <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
              <p className="text-sm">A carregar itens...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-stone-800 bg-[#191f1b] p-12 text-center">
              <p className="text-base font-bold text-stone-200">
                Nenhum item encontrado com estes filtros.
              </p>
              <p className="mt-1 text-xs text-stone-400">
                Ajuste a pesquisa ou adicione um novo item ao menu.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const isBusy = busyId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                      item.prato_do_dia
                        ? 'border-amber-500/50 bg-[#211d16]'
                        : item.disponivel
                          ? 'border-stone-800 bg-[#191f1b]'
                          : 'border-stone-800/70 bg-[#151816] opacity-75'
                    }`}
                  >
                    {/* Foto + Nome + Preço */}
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-amber-500/30 bg-stone-900">
                        {item.imagem_url ? (
                          <img
                            src={item.imagem_url}
                            alt={item.nome}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-stone-600">
                            <UtensilsCrossed className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-bold text-stone-100">
                            {item.nome}
                          </h3>
                          <span className="rounded-full border border-stone-700 bg-stone-900 px-2 py-0.5 text-[11px] font-medium text-stone-300">
                            {item.categoria}
                          </span>
                          {!item.disponivel && (
                            <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
                              Esgotado
                            </span>
                          )}
                        </div>

                        {item.descricao && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-stone-400">
                            {item.descricao}
                          </p>
                        )}

                        <p className="mt-1 text-sm font-extrabold text-amber-400">
                          {formatKwanza(item.preco)}
                        </p>
                      </div>
                    </div>

                    {/* Controlos rápidos: Prato do Dia, Stock, Editar, Excluir */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-800/80 pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
                      {/* Botão exclusivo Prato do Dia */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleTogglePratoDoDia(item)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${
                          item.prato_do_dia
                            ? 'bg-red-600 text-white shadow-md shadow-red-950/40 hover:bg-red-500'
                            : 'border border-stone-700 bg-stone-900/80 text-stone-300 hover:border-amber-500/60 hover:text-amber-300'
                        }`}
                      >
                        <Flame
                          className={`h-3.5 w-3.5 ${
                            item.prato_do_dia ? 'fill-amber-300 text-amber-300' : ''
                          }`}
                        />
                        <span>
                          {item.prato_do_dia ? 'Prato do Dia' : 'Definir do Dia'}
                        </span>
                      </button>

                      {/* Interruptor de Stock */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleToggleStock(item)}
                        aria-pressed={item.disponivel}
                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${
                          item.disponivel
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                            : 'border-stone-700 bg-stone-900 text-stone-400 hover:border-stone-600 hover:text-stone-200'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            item.disponivel ? 'bg-emerald-400' : 'bg-red-500'
                          }`}
                        />
                        <span>{item.disponivel ? 'Disponível' : 'Esgotado'}</span>
                      </button>

                      {/* Editar e Excluir */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setItemModalOpen(true);
                          }}
                          title="Editar item"
                          aria-label={`Editar ${item.nome}`}
                          className="rounded-xl border border-stone-700 bg-stone-900/80 p-2 text-stone-300 transition hover:border-amber-500/60 hover:text-amber-300"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDeleteItem(item)}
                          title="Excluir item"
                          aria-label={`Excluir ${item.nome}`}
                          className="rounded-xl border border-stone-700 bg-stone-900/80 p-2 text-stone-400 transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-red-300 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Modais */}
      <AdminItemModal
        isOpen={itemModalOpen}
        onClose={() => {
          setItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
        existingCategories={categories.filter((c) => c !== 'Todas')}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
}
