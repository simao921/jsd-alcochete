# JSD Alcochete Web App

Aplicação web institucional e operacional da JSD Alcochete, construída com Vite, React, React Router e Tailwind CSS.

## Arquitetura

```text
/src
  /assets
  /components
  /context
  /data
  /hooks
  /layouts
  /pages
  /services
  App.jsx
  index.css
  main.jsx
```

### Princípios

- `components`: UI reutilizável como `Navbar`, `HeroSection`, `EventCard`, `NewsCard`, `MemberCard`.
- `pages`: páginas públicas, área de membros e painel admin.
- `layouts`: shells globais, `DashboardLayout` e `AdminSidebar`.
- `context`: autenticação e estado global com persistência em `localStorage`.
- `services`: helpers, storage e lógica utilitária.
- `data`: dados seed para notícias, eventos, equipa, membros e pedidos.

## Funcionalidades

- Site institucional com home, sobre, equipa, notícias, eventos e junta-te
- Área de membros com login, registo, perfil, pontos e histórico de atividade
- Painel admin com CRUD simulado de notícias, eventos, equipa e membros
- Persistência completa em `localStorage`
- Dark mode, notificações, animações por scroll e SEO base
- Base preparada para migração futura para Firebase ou backend Node.js

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Contas demo

- Admin: `admin@jsdalcochete.pt` / `admin123`

## Próxima evolução recomendada

- Firebase Auth + Firestore
- Node.js API para workflows internos e analytics
- Chatbot IA para FAQ política, captação e triagem
- Aplicação mobile para ativismo de terreno
