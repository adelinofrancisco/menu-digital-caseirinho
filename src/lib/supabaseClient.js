import { createClient } from '@supabase/supabase-js';
import { SEED_MENU_ITEMS } from '../data/seedMenu';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Indica se as variáveis de ambiente reais do Supabase estão configuradas.
 * Quando não estiverem (ex: primeiro arranque local), a app funciona em Modo Demonstração
 * com persistência em localStorage usando o cardápio completo do Restaurante Caseirinho.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('seu-projeto.supabase.co') &&
    !supabaseAnonKey.includes('sua-chave-publica')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// --- Suporte transparente ao Modo Demonstração (localStorage) ---
const DEMO_STORAGE_KEY = 'caseirinho_demo_menu_items_v1';
const DEMO_SESSION_KEY = 'caseirinho_demo_session_v1';

function readDemoItems() {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(SEED_MENU_ITEMS));
      return [...SEED_MENU_ITEMS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_MENU_ITEMS];
  } catch {
    return [...SEED_MENU_ITEMS];
  }
}

function writeDemoItems(items) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(items));
}

/**
 * Serviço de Autenticação (Supabase Auth + fallback de demonstração)
 */
export const authService = {
  async getSession() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }

    const demoSession = localStorage.getItem(DEMO_SESSION_KEY);
    return demoSession ? JSON.parse(demoSession) : null;
  },

  async signInWithPassword(email, password) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data.session;
    }

    // Em modo demonstração, aceita qualquer credencial preenchida para testar o painel
    if (!email || !password) {
      throw new Error('Introduza o e-mail e a senha para entrar.');
    }
    const fakeSession = {
      user: { email, role: 'authenticated' },
      demo: true,
    };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(fakeSession));
    return fakeSession;
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return;
    }
    localStorage.removeItem(DEMO_SESSION_KEY);
  },

  onAuthStateChange(callback) {
    if (isSupabaseConfigured && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
      });
      return () => subscription.unsubscribe();
    }
    return () => {};
  },
};

/**
 * Serviço CRUD da tabela `menu_items`
 */
export const menuService = {
  /**
   * Lista todos os itens (ou apenas os disponíveis para o menu público)
   */
  async listItems({ onlyAvailable = false } = {}) {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('menu_items')
        .select('*')
        .order('categoria', { ascending: true })
        .order('nome', { ascending: true });

      if (onlyAvailable) {
        query = query.eq('disponivel', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    const items = readDemoItems();
    return onlyAvailable ? items.filter((item) => item.disponivel) : items;
  },

  /**
   * Cria um novo item no menu
   */
  async createItem(payload) {
    const cleanPayload = {
      nome: payload.nome.trim(),
      descricao: payload.descricao?.trim() || null,
      preco: Number(payload.preco),
      categoria: payload.categoria.trim(),
      imagem_url: payload.imagem_url?.trim() || null,
      prato_do_dia: Boolean(payload.prato_do_dia),
      disponivel: payload.disponivel !== false,
    };

    if (isSupabaseConfigured && supabase) {
      // Se o novo item for marcado como Prato do Dia, desativar os restantes primeiro
      if (cleanPayload.prato_do_dia) {
        const { error: resetErr } = await supabase
          .from('menu_items')
          .update({ prato_do_dia: false })
          .eq('prato_do_dia', true);
        if (resetErr) throw resetErr;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert([cleanPayload])
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const items = readDemoItems();
    const nextId = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    const updatedBase = cleanPayload.prato_do_dia
      ? items.map((item) => ({ ...item, prato_do_dia: false }))
      : items;

    const newItem = {
      id: nextId,
      created_at: new Date().toISOString(),
      ...cleanPayload,
    };
    writeDemoItems([newItem, ...updatedBase]);
    return newItem;
  },

  /**
   * Atualiza os dados de um item existente
   */
  async updateItem(id, payload) {
    const cleanPayload = {
      nome: payload.nome.trim(),
      descricao: payload.descricao?.trim() || null,
      preco: Number(payload.preco),
      categoria: payload.categoria.trim(),
      imagem_url: payload.imagem_url?.trim() || null,
      prato_do_dia: Boolean(payload.prato_do_dia),
      disponivel: Boolean(payload.disponivel),
    };

    if (isSupabaseConfigured && supabase) {
      if (cleanPayload.prato_do_dia) {
        const { error: resetErr } = await supabase
          .from('menu_items')
          .update({ prato_do_dia: false })
          .neq('id', id)
          .eq('prato_do_dia', true);
        if (resetErr) throw resetErr;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .update(cleanPayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const items = readDemoItems();
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, ...cleanPayload };
      }
      if (cleanPayload.prato_do_dia && item.prato_do_dia) {
        return { ...item, prato_do_dia: false };
      }
      return item;
    });
    writeDemoItems(updated);
    return updated.find((item) => item.id === id);
  },

  /**
   * Toggle exclusivo do Prato do Dia:
   * - Se enable = true: desativa todos os outros pratos do dia e ativa o escolhido (garantindo disponibilidade).
   * - Se enable = false: desativa o prato escolhido (permitindo ficar sem prato do dia).
   */
  async setPratoDoDia(id, enable) {
    if (isSupabaseConfigured && supabase) {
      if (enable) {
        const { error: resetErr } = await supabase
          .from('menu_items')
          .update({ prato_do_dia: false })
          .eq('prato_do_dia', true);
        if (resetErr) throw resetErr;

        const { error: activateErr } = await supabase
          .from('menu_items')
          .update({ prato_do_dia: true, disponivel: true })
          .eq('id', id);
        if (activateErr) throw activateErr;
      } else {
        const { error: disableErr } = await supabase
          .from('menu_items')
          .update({ prato_do_dia: false })
          .eq('id', id);
        if (disableErr) throw disableErr;
      }
      return;
    }

    const items = readDemoItems();
    const updated = items.map((item) => {
      if (enable) {
        if (item.id === id) {
          return { ...item, prato_do_dia: true, disponivel: true };
        }
        return item.prato_do_dia ? { ...item, prato_do_dia: false } : item;
      }
      return item.id === id ? { ...item, prato_do_dia: false } : item;
    });
    writeDemoItems(updated);
  },

  /**
   * Controlo rápido de stock (Ativo / Esgotado)
   */
  async toggleDisponibilidade(id, disponivel) {
    if (isSupabaseConfigured && supabase) {
      const updates = disponivel
        ? { disponivel: true }
        : { disponivel: false, prato_do_dia: false };

      const { error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const items = readDemoItems();
    const updated = items.map((item) => {
      if (item.id !== id) return item;
      return disponivel
        ? { ...item, disponivel: true }
        : { ...item, disponivel: false, prato_do_dia: false };
    });
    writeDemoItems(updated);
  },

  /**
   * Exclui permanentemente um item do cardápio
   */
  async deleteItem(id) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const items = readDemoItems().filter((item) => item.id !== id);
    writeDemoItems(items);
  },

  /**
   * Restaura o cardápio inicial (disponível apenas em modo demonstração)
   */
  resetDemoData() {
    if (!isSupabaseConfigured) {
      writeDemoItems(SEED_MENU_ITEMS);
    }
  },
};
