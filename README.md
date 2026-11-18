# Menu Digital — Restaurante Caseirinho

Aplicação web **Mobile-First** de Menu Digital acessível via QR Code com Painel Administrativo protegido, desenvolvida em **React (Vite)**, **Tailwind CSS** e **Supabase** para o **Restaurante Caseirinho** (Lubango - Centro-Comercial Millennium).

## Funcionalidades Principais

- **Menu Público (`/`)**:
  - Destaque automático para o **Prato do Dia** (ocultado automaticamente quando nenhum prato está ativo).
  - Filtros rápidos por categoria (*Pratos Principais*, *Pequeno Almoço*, *Café & Chás*, *Sumos Naturais*, *Aperitivos*, *Sobremesas* e *Bebidas*) e barra de pesquisa em tempo real.
  - Preços formatados em Kwanzas (`1.500,00 KZ`) e botão direto de encomenda via **WhatsApp (`+244 940 901 354`)**.
- **Painel Administrativo (`/admin` e `/login`)**:
  - Autenticação protegida com **Supabase Auth**.
  - **Toggle exclusivo de Prato do Dia**: ativar um prato desativa automaticamente o anterior.
  - **Controlo rápido de stock**: marque itens como *Disponível* ou *Esgotado* com um clique sem os apagar.
  - **CRUD completo**: adicionar, editar e excluir itens (com galeria de fotos locais integrada).
  - **Gerador de QR Code para impressão**: descarregue o cartão em PNG pronto a imprimir para as mesas.

---

## 1. Executar Localmente

```bash
npm install
npm run dev
```

> **Modo Demonstração:** Se ainda não configurou o ficheiro `.env`, a aplicação arranca automaticamente com o cardápio completo do Restaurante Caseirinho guardado em `localStorage`, permitindo testar o menu público e o painel `/admin` de imediato.

---

## 2. Configurar o Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No menu **SQL Editor**, abra e execute todo o conteúdo do ficheiro `supabase/schema.sql` (cria a tabela `menu_items`, ativa o RLS com leitura pública e escrita autenticada, e insere o cardápio inicial).
3. Em **Authentication → Users**, clique em **Add User** e crie a conta de e-mail e senha da gerência para aceder a `/login`.
4. Em **Project Settings → API**, copie o **Project URL** e a chave **anon / public**.
5. Crie o ficheiro `.env` na raiz do projeto com base no `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-anon-aqui
```

6. Reinicie o servidor (`npm run dev`).

---

## 3. Deploy Gratuito (Vercel ou Netlify)

### Opção A — Vercel (Recomendado)
1. Envie o repositório para o GitHub.
2. Aceda a [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Clique em **Deploy**. O ficheiro `vercel.json` já garante o funcionamento das rotas `/login` e `/admin`.

### Opção B — Netlify
1. Aceda a [netlify.com](https://www.netlify.com) → **Add new site → Import an existing project**.
2. Defina:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Em **Site configuration → Environment variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. O ficheiro `public/_redirects` já está incluído para suportar o React Router DOM sem erros 404.
