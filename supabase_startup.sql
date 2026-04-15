-- Eliminar Tabelas Existentes se já criadas
drop table if exists news;
drop table if exists events;
drop table if exists team;
drop table if exists members;
drop table if exists join_requests;

-- 1. Criação da tabela Notícias
create table news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  "publishedAt" timestamp with time zone not null,
  "createdAt" timestamp with time zone default now()
);

-- 2. Criação da tabela Eventos
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date timestamp with time zone not null,
  location text not null,
  category text not null,
  "createdAt" timestamp with time zone default now()
);

-- 3. Criação da tabela Equipa
create table team (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  image text,
  "createdAt" timestamp with time zone default now()
);

-- 4. Criação da tabela Membros (Base de Dados Geral)
create table members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  age integer,
  points integer,
  avatar text,
  "createdAt" timestamp with time zone default now()
);

-- 5. Criação da tabela Pedidos de Adesão (Junta-te)
create table join_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  citizen_card_number text,
  birth_date text,
  mobile text,
  phone text,
  street text,
  door_number text,
  floor text,
  parish text,
  postal_code text,
  council text,
  district text,
  professional_status text,
  registration_council text,
  motivation text,
  referenced_by text,
  document_name text,
  document_type text,
  document_size integer,
  document_data_uri text,
  status text default 'Pendente',
  "createdAt" timestamp with time zone default now()
);

-- CONFIGURAÇÃO DE SEGURANÇA BÁSICA (RLS)
-- Como não usas contas com password para o backend atualmente (o sistema Admin está por bypass mágico), vamos desativar a restrição de escrita temporariamente para o site funcionar de qualquer lado. Desativa com moderação em projetos que não sejam públicos.

alter table news disable row level security;
alter table events disable row level security;
alter table team disable row level security;
alter table members disable row level security;
alter table join_requests disable row level security;
