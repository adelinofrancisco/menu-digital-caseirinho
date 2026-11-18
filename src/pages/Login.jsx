import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, Loader2, Lock, Mail, Sparkles } from 'lucide-react';
import { authService, isSupabaseConfigured } from '../lib/supabaseClient';
import { RESTAURANT_INFO } from '../lib/formatters';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    isSupabaseConfigured ? '' : 'gerencia@caseirinho.ao'
  );
  const [password, setPassword] = useState(isSupabaseConfigured ? '' : 'demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    authService.getSession().then((session) => {
      if (session) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.signInWithPassword(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(
        err?.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos. Verifique as suas credenciais.'
          : err?.message || 'Não foi possível iniciar sessão.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-chalkboard px-4 py-10 text-stone-100">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-stone-400 transition hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Menu Digital</span>
        </Link>

        <div className="overflow-hidden rounded-3xl border border-stone-800 bg-[#191f1b]/95 p-7 shadow-2xl sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Lock className="h-6 w-6" />
            </div>

            <h1 className="mt-4 font-script text-4xl font-bold text-stone-50">
              {RESTAURANT_INFO.shortName}
            </h1>
            <p className="mt-1 text-sm font-semibold text-amber-400">
              Painel Administrativo
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Acesso reservado à gerência do restaurante
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Modo Demonstração Ativo</span>
              </div>
              <p className="mt-1">
                O Supabase ainda não foi ligado no <code className="rounded bg-black/30 px-1">.env</code>. Clique em <strong>Entrar no Painel</strong> com as credenciais preenchidas para testar todas as funcionalidades.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-xs text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-300">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gerencia@caseirinho.ao"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900/90 py-3 pl-10 pr-4 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Senha
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900/90 py-3 pl-10 pr-4 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-900/25 transition hover:bg-amber-400 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>A autenticar...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
