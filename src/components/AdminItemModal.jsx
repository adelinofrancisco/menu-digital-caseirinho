import { useEffect, useState } from 'react';
import { Flame, Image as ImageIcon, Loader2, Save, X } from 'lucide-react';
import { MENU_CATEGORIES } from '../lib/formatters';
import { LOCAL_PHOTO_PRESETS } from '../data/seedMenu';

const INITIAL_FORM = {
  nome: '',
  preco: '',
  categoria: MENU_CATEGORIES[0],
  descricao: '',
  imagem_url: '',
  prato_do_dia: false,
  disponivel: true,
};

export default function AdminItemModal({
  isOpen,
  onClose,
  onSave,
  editingItem = null,
  existingCategories = [],
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [customCategory, setCustomCategory] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const allCategories = Array.from(
    new Set([...MENU_CATEGORIES, ...existingCategories].filter(Boolean))
  );

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setShowGallery(false);

    if (editingItem) {
      const knownCat = allCategories.includes(editingItem.categoria);
      setForm({
        nome: editingItem.nome || '',
        preco: String(editingItem.preco ?? ''),
        categoria: knownCat ? editingItem.categoria : allCategories[0],
        descricao: editingItem.descricao || '',
        imagem_url: editingItem.imagem_url || '',
        prato_do_dia: Boolean(editingItem.prato_do_dia),
        disponivel: editingItem.disponivel !== false,
      });
      setUseCustomCategory(!knownCat && Boolean(editingItem.categoria));
      setCustomCategory(!knownCat ? editingItem.categoria || '' : '');
    } else {
      setForm(INITIAL_FORM);
      setUseCustomCategory(false);
      setCustomCategory('');
    }
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalCategory = useCustomCategory ? customCategory.trim() : form.categoria;
    const numericPrice = Number(form.preco);

    if (!form.nome.trim()) {
      setError('O nome do item é obrigatório.');
      return;
    }
    if (!finalCategory) {
      setError('Selecione ou indique uma categoria.');
      return;
    }
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setError('Introduza um preço válido em Kwanzas.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...form,
        preco: numericPrice,
        categoria: finalCategory,
      });
      onClose();
    } catch (err) {
      setError(err?.message || 'Erro ao guardar o item. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-item-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-stone-800 bg-[#191f1b] shadow-2xl">
        {/* Cabeçalho do Modal */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-800 bg-[#191f1b]/95 px-6 py-4 backdrop-blur">
          <div>
            <h2
              id="admin-item-modal-title"
              className="text-lg font-bold text-stone-50"
            >
              {editingItem ? 'Editar Item do Cardápio' : 'Adicionar Novo Item'}
            </h2>
            <p className="text-xs text-stone-400">
              Preencha os detalhes abaixo. As alterações refletem-se em tempo real no menu.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 transition hover:bg-stone-800 hover:text-stone-100"
            aria-label="Fechar janela"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Nome do Prato ou Bebida *
              </label>
              <input
                type="text"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Bitoque, Sumo de Maracujá, Caldeirada..."
                className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Preço (KZ) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="50"
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: e.target.value })}
                placeholder="Ex: 1500"
                className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Categoria *
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomCategory((prev) => !prev)}
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                >
                  {useCustomCategory ? 'Usar lista' : '+ Nova categoria'}
                </button>
              </div>

              {useCustomCategory ? (
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Nome da nova categoria"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              ) : (
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-4 py-2.5 text-sm text-stone-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-300">
              Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Breve descrição dos ingredientes ou acompanhamentos..."
              className="w-full rounded-xl border border-stone-700 bg-stone-900/90 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Imagem URL + Galeria rápida de fotos locais */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                URL da Imagem (Opcional)
              </label>
              <button
                type="button"
                onClick={() => setShowGallery((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                {showGallery ? 'Ocultar galeria local' : 'Escolher da galeria local'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.imagem_url}
                onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                placeholder="/images/pratos/bitoque.jpg ou https://..."
                className="flex-1 rounded-xl border border-stone-700 bg-stone-900/90 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              {form.imagem_url && (
                <img
                  src={form.imagem_url}
                  alt="Pré-visualização"
                  className="h-11 w-11 shrink-0 rounded-xl border border-amber-500/50 object-cover"
                />
              )}
            </div>

            {showGallery && (
              <div className="mt-3 grid max-h-44 grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-stone-800 bg-stone-950/70 p-2.5 sm:grid-cols-4">
                {LOCAL_PHOTO_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, imagem_url: preset.url });
                      setShowGallery(false);
                    }}
                    className={`group overflow-hidden rounded-xl border text-left transition ${
                      form.imagem_url === preset.url
                        ? 'border-amber-400 ring-2 ring-amber-400/30'
                        : 'border-stone-800 hover:border-amber-500/50'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="h-14 w-full object-cover"
                    />
                    <span className="block truncate px-1.5 py-1 text-[10px] font-medium text-stone-300">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interruptores rápidos */}
          <div className="grid gap-3 rounded-2xl border border-stone-800 bg-stone-900/50 p-4 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <div>
                <span className="block text-sm font-semibold text-stone-100">
                  Disponível em Stock
                </span>
                <span className="text-xs text-stone-400">
                  Visível para clientes no menu
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.disponivel}
                onChange={(e) => setForm({ ...form, disponivel: e.target.checked })}
                className="h-5 w-5 accent-amber-500"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-300">
                  <Flame className="h-4 w-4 text-red-500" />
                  Prato do Dia
                </span>
                <span className="block text-xs text-stone-400">
                  Destaca no topo (exclusivo)
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.prato_do_dia}
                onChange={(e) =>
                  setForm({
                    ...form,
                    prato_do_dia: e.target.checked,
                    disponivel: e.target.checked ? true : form.disponivel,
                  })
                }
                className="h-5 w-5 accent-red-600"
              />
            </label>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-700 px-5 py-2.5 text-sm font-semibold text-stone-300 transition hover:bg-stone-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>A guardar...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{editingItem ? 'Guardar Alterações' : 'Adicionar ao Menu'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
