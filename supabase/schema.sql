-- ============================================================================
-- RESTAURANTE CASEIRINHO — MENU DIGITAL
-- Script SQL completo para Supabase (Tabela, Índices, RLS e Dados Iniciais)
-- Localização: Lubango - Centro-Comercial Millennium | WhatsApp: +244 940 901 354
-- ============================================================================

-- 1. Criação da tabela principal de itens do menu
create table if not exists public.menu_items (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nome text not null,
  descricao text,
  preco numeric(12, 2) not null check (preco >= 0),
  categoria text not null,
  imagem_url text,
  prato_do_dia boolean not null default false,
  disponivel boolean not null default true
);

-- Índices úteis para filtragem rápida no menu público e no painel admin
create index if not exists idx_menu_items_categoria on public.menu_items (categoria);
create index if not exists idx_menu_items_disponivel on public.menu_items (disponivel);
create index if not exists idx_menu_items_prato_do_dia on public.menu_items (prato_do_dia) where prato_do_dia = true;

-- 2. Ativar Row Level Security (RLS)
alter table public.menu_items enable row level security;

-- Remover políticas antigas caso o script seja reexecutado
drop policy if exists "Leitura pública do menu" on public.menu_items;
drop policy if exists "Inserção restrita a utilizadores autenticados" on public.menu_items;
drop policy if exists "Atualização restrita a utilizadores autenticados" on public.menu_items;
drop policy if exists "Exclusão restrita a utilizadores autenticados" on public.menu_items;

-- Política de Leitura (Pública): qualquer utilizador anónimo ou autenticado pode ler o cardápio
create policy "Leitura pública do menu"
  on public.menu_items
  for select
  to anon, authenticated
  using (true);

-- Políticas de Escrita (Restritas): apenas administradores autenticados podem criar, editar ou apagar
create policy "Inserção restrita a utilizadores autenticados"
  on public.menu_items
  for insert
  to authenticated
  with check (true);

create policy "Atualização restrita a utilizadores autenticados"
  on public.menu_items
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Exclusão restrita a utilizadores autenticados"
  on public.menu_items
  for delete
  to authenticated
  using (true);

-- 3. Dados Iniciais (Seed SQL baseado no cardápio físico do Restaurante Caseirinho)
-- Nota: Se quiser reiniciar os dados, descomente a linha abaixo:
-- truncate table public.menu_items restart identity;

insert into public.menu_items (nome, descricao, preco, categoria, imagem_url, prato_do_dia, disponivel) values
  -- PRATOS PRINCIPAIS (ALMOÇO)
  ('Bitoque', 'Bife tenro grelhado servido com ovo estrelado, batatas fritas estaladiças, arroz branco e salada fresca.', 7000, 'Pratos Principais', '/images/pratos/bitoque.jpg', true, true),
  ('Prego no Prato', 'Bife macio de vaca grelhado com alho, acompanhado de arroz solto, batata frita e salada mista.', 6000, 'Pratos Principais', '/images/pratos/prego-no-prato.jpg', false, true),
  ('Picanha', 'Suculentas fatias de picanha grelhada na brasa, acompanhadas de arroz branco e batatas fritas douradas.', 8000, 'Pratos Principais', '/images/pratos/picanha.jpg', false, true),
  ('Bife à Casa', 'Bife especial da casa salteado com molho cremoso tradicional, batata frita e guarnição do chef.', 8000, 'Pratos Principais', '/images/pratos/bife-a-casa.jpg', false, true),
  ('Prato Cheio', 'Combinação generosa da casa com carnes selecionadas, arroz, feijão e acompanhamentos frescos.', 8000, 'Pratos Principais', '/images/pratos/prato-cheio.jpg', false, true),
  ('Chouriço Caseiro', 'Chouriço tradicional grelhado na perfeição, servido com guarnições caseiras.', 8000, 'Pratos Principais', '/images/pratos/chourico-caseiro.jpg', false, true),
  ('Calulu', 'Prato tradicional angolano preparado lentamente com peixe/carne, quiabos, gimboa e óleo de palma.', 7000, 'Pratos Principais', '/images/pratos/calulu.jpg', false, true),
  ('Cozido de Corvina', 'Corvina fresca cozida em lume brando com legumes selecionados, batata e tempero caseiro.', 7000, 'Pratos Principais', '/images/pratos/cozido-corvina.jpg', false, true),
  ('Bifana', 'Fatias suculentas de carne marinadas em alho e louro, servidas no prato com acompanhamentos.', 7000, 'Pratos Principais', '/images/pratos/bifana.jpg', false, true),
  ('Febras com Arroz', 'Febras grelhadas bem temperadas acompanhadas de arroz solto, batata frita e salada.', 7000, 'Pratos Principais', '/images/pratos/febras-arroz.jpg', false, true),
  ('Hambúrguer no Prato', 'Hambúrguer artesanal grelhado no prato com ovo estrelado, arroz, batata frita e salada.', 3500, 'Pratos Principais', '/images/pratos/hamburguer-prato.jpg', false, true),
  ('Dose de Arroz', 'Porção extra de arroz branco soltinho preparado no dia.', 1000, 'Pratos Principais', '/images/pratos/dose-arroz.jpg', false, true),
  ('Dose de Feijão', 'Porção de feijão caseiro bem apurado com temperos tradicionais.', 1000, 'Pratos Principais', '/images/pratos/dose-feijao.jpg', false, true),

  -- PEQUENO ALMOÇO
  ('Prego no Pão', 'Pão fresco estaladiço recheado com bife tenro grelhado na chapa com alho.', 1500, 'Pequeno Almoço', '/images/pratos/prego-pao.jpg', false, true),
  ('Hambúrguer Composto', 'Hambúrguer completo com queijo, fiambre, ovo, alface, tomate e batatas fritas.', 3000, 'Pequeno Almoço', '/images/pratos/hamburguer-composto.jpg', false, true),
  ('Hambúrguer Simples', 'Carne grelhada suculenta em pão macio tostado com alface e tomate fresco.', 2500, 'Pequeno Almoço', '/images/pratos/hamburguer-simples.jpg', false, true),
  ('Hambúrguer de Frango', 'Peito de frango crocante e temperado com salada fresca e molho cremoso.', 2500, 'Pequeno Almoço', '/images/pratos/hamburguer-frango.jpg', false, true),
  ('Omelete Composto', 'Omelete fofa recheada com queijo, fiambre, cebola e ervas aromáticas.', 2500, 'Pequeno Almoço', '/images/pratos/omelete.jpg', false, true),
  ('Omelete Simples', 'Omelete leve e dourada preparada com ovos frescos e toque de salsa.', 1500, 'Pequeno Almoço', '/images/pratos/omelete.jpg', false, true),
  ('Tosta', 'Pão torrado dourado na chapa com queijo derretido e fiambre.', 1500, 'Pequeno Almoço', '/images/pratos/tosta.jpg', false, true),
  ('Sandes Mista', 'Pão macio fresco com fatias generosas de queijo e fiambre.', 1000, 'Pequeno Almoço', '/images/pratos/sandes-mista.jpg', false, true),
  ('Sandes de Ovo', 'Pão fresco do dia recheado com ovo preparado na hora.', 800, 'Pequeno Almoço', '/images/pratos/sandes-mista.jpg', false, true),

  -- CAFÉ & CHÁS
  ('Café', 'Expresso encorpado e aromático tirado na hora.', 1000, 'Café & Chás', '/images/pratos/cafe.jpg', false, true),
  ('Galão', 'Café expresso suave servido em copo alto com leite vaporizado cremoso.', 1500, 'Café & Chás', '/images/pratos/galao.jpg', false, true),
  ('Chá de Gengibre', 'Infusão quente e revigorante de gengibre fresco natural.', 500, 'Café & Chás', '/images/pratos/cha-gengibre.jpg', false, true),
  ('Chá de Limão', 'Chá quente aromático com rodelas frescas de limão.', 300, 'Café & Chás', '/images/pratos/cha-limao.jpg', false, true),
  ('Copo de Leite', 'Copo de leite fresco servido quente ou frio.', 1000, 'Café & Chás', '/images/pratos/copo-leite.jpg', false, true),

  -- SUMOS NATURAIS
  ('Sumo de Laranja', 'Sumo 100% natural espremido na hora com laranjas selecionadas.', 1500, 'Sumos Naturais', '/images/pratos/sumo-laranja.jpg', false, true),
  ('Sumo de Maracujá', 'Refrescante sumo natural da polpa de maracujá fresco.', 1500, 'Sumos Naturais', '/images/pratos/sumo-maracuja.jpg', false, true),
  ('Sumo de Melancia', 'Sumo natural de melancia fresca, leve e bem gelado.', 1500, 'Sumos Naturais', '/images/pratos/sumo-melancia.jpg', false, true),
  ('Sumo de Ananás', 'Sumo tropical natural de ananás doce preparado no momento.', 1500, 'Sumos Naturais', '/images/pratos/sumo-ananas.jpg', false, true),
  ('Sumo de Cenoura, Limão com Gengibre', 'Combinação detox energizante de cenoura fresca, limão e toque de gengibre.', 1500, 'Sumos Naturais', '/images/pratos/sumo-cenoura.jpg', false, true),
  ('Sumo de Limão', 'Limonada natural refrescante feita com limões frescos.', 1000, 'Sumos Naturais', '/images/pratos/sumo-limao.jpg', false, true),

  -- APERITIVOS
  ('Asinhas de Frango', 'Asinhas de frango douradas e crocantes, temperadas com especiarias da casa.', 4000, 'Aperitivos', '/images/pratos/asinhas-frango.jpg', false, true),
  ('Coxinhas de Frango', 'Porção de coxinhas de frango estaladiças acompanhadas de batata frita.', 4000, 'Aperitivos', '/images/pratos/coxinhas-frango.jpg', false, true),
  ('Moelinhas', 'Moelas estufadas em molho rico e ligeiramente picante, perfeitas para partilhar.', 4000, 'Aperitivos', '/images/pratos/moelinhas.jpg', false, true),
  ('Dobradinhas', 'Dobradinha tradicional lentamente guisada com temperos aromáticos.', 4000, 'Aperitivos', '/images/pratos/dobradinhas.jpg', false, true),
  ('Calzone', 'Massa dourada assada no forno com recheio generoso e queijo derretido.', 2000, 'Aperitivos', '/images/pratos/calzone.jpg', false, true),
  ('Croissant', 'Croissant folhado e amanteigado, acabado de sair do forno.', 1000, 'Aperitivos', '/images/pratos/croissant.jpg', false, true),
  ('Croquetes de Carne', 'Croquetes artesanais de carne temperada, crocantes por fora e macios por dentro.', 500, 'Aperitivos', '/images/pratos/croquetes.jpg', false, true),
  ('Rissóis', 'Rissóis dourados de massa fina com recheio cremoso tradicional.', 500, 'Aperitivos', '/images/pratos/rissois.jpg', false, true),
  ('Esfirras de Carne', 'Salgado macio assado no forno com recheio suculento de carne picada.', 500, 'Aperitivos', '/images/pratos/esfirras.jpg', false, true),
  ('Fular de Carne', 'Massa tradicional caseira recheada com carnes saborosas.', 500, 'Aperitivos', '/images/pratos/fular-carne.jpg', false, true),
  ('Pãozinhos de Chouriço', 'Pãozinho quente e macio recheado com fatias de chouriço fumado.', 500, 'Aperitivos', '/images/pratos/pao-chourico.jpg', false, true),

  -- SOBREMESAS
  ('Bolo de Bolacha na Taça', 'Clássico bolo de bolacha com creme de café e manteiga servido na taça.', 1500, 'Sobremesas', '/images/pratos/bolo-bolacha.jpg', false, true),
  ('Mousses Diversos', 'Taça de mousse cremosa (chocolate, maracujá ou manga conforme o dia).', 1500, 'Sobremesas', '/images/pratos/mousse.jpg', false, true),
  ('Pudim', 'Pudim caseiro cremoso banhado em calda de caramelo dourado.', 1000, 'Sobremesas', '/images/pratos/pudim.jpg', false, true),
  ('Bolo de Chocolate', 'Fatia generosa de bolo fofo de chocolate com cobertura rica.', 750, 'Sobremesas', '/images/pratos/bolo-chocolate.jpg', false, true),
  ('Bolas de Berlim', 'Massa fofa polvilhada com açúcar e recheio suave de creme.', 500, 'Sobremesas', '/images/pratos/bolas-berlim.jpg', false, true),

  -- BEBIDAS
  ('Sumo Compal Grande', 'Garrafa grande de néctar Compal bem fresco (vários sabores).', 3000, 'Bebidas', '/images/pratos/sumo-laranja.jpg', false, true),
  ('Speed', 'Bebida energética Speed bem gelada.', 2000, 'Bebidas', '/images/pratos/refrigerante.jpg', false, true),
  ('Smirnoff', 'Dose ou garrafa Smirnoff servida bem fresca.', 1500, 'Bebidas', '/images/pratos/drink.jpg', false, true),
  ('Gin Gordon', 'Gin Gordon servido com gelo e rodela de limão.', 1500, 'Bebidas', '/images/pratos/drink.jpg', false, true),
  ('Gasosa em Lata', 'Refrigerante em lata bem gelado.', 1000, 'Bebidas', '/images/pratos/refrigerante.jpg', false, true),
  ('Sumol', 'Refrigerante Sumol com sumo de fruta bem fresco.', 1000, 'Bebidas', '/images/pratos/refrigerante.jpg', false, true),
  ('Cuca', 'Cerveja angolana Cuca servida bem gelada.', 500, 'Bebidas', '/images/pratos/cerveja.jpg', false, true),
  ('Eka', 'Cerveja Eka servida bem gelada.', 500, 'Bebidas', '/images/pratos/cerveja.jpg', false, true),
  ('N''Gola', 'Cerveja tradicional N''Gola do Lubango bem gelada.', 500, 'Bebidas', '/images/pratos/cerveja.jpg', false, true),
  ('Doppel', 'Cerveja preta encorpada Doppel bem fresca.', 500, 'Bebidas', '/images/pratos/cerveja.jpg', false, true),
  ('Booster', 'Cerveja com sabor refrescante Booster bem gelada.', 500, 'Bebidas', '/images/pratos/cerveja.jpg', false, true),
  ('Água Grande', 'Garrafa de água mineral natural grande (1,5L).', 500, 'Bebidas', '/images/pratos/agua.jpg', false, true),
  ('Gasosa SevenUp', 'Refrigerante SevenUp refrescante de lima-limão.', 400, 'Bebidas', '/images/pratos/refrigerante.jpg', false, true),
  ('Pepsi Cola', 'Pepsi Cola servida bem gelada.', 400, 'Bebidas', '/images/pratos/refrigerante.jpg', false, true),
  ('Gasosa Top', 'Gasosa Top servida bem fresca.', 300, 'Bebidas', '/images/pratos/refrigerante.jpg', false, true),
  ('Água Pequena', 'Garrafa de água mineral fresca (500ml).', 300, 'Bebidas', '/images/pratos/agua.jpg', false, true);
