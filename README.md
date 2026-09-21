# Avistamentos de Little Ville

Aplicativo web para que os moradores de Little Ville registrem e acompanhem
avistamentos de criaturas e fenômenos misteriosos (Pé Grande e afins),
desenvolvido para a disciplina de Desenvolvimento de Sistemas Integrados.

Projeto full-stack com **frontend em React**, **backend em Node.js/Express**
e **banco de dados relacional via Sequelize (ORM)**.

## Sumário

- [Visão geral](#visão-geral)
- [Stack utilizada](#stack-utilizada)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Como rodar o projeto localmente](#como-rodar-o-projeto-localmente)
- [Usuário de demonstração](#usuário-de-demonstração)
- [Endpoints da API](#endpoints-da-api)
- [Publicação (deploy)](#publicação-deploy)

## Visão geral

Funcionalidades implementadas:

- **Cadastro e login** de moradores com autenticação via JWT e senhas
  protegidas com hash `bcrypt` (nunca armazenadas em texto puro).
- **CRUD completo de Avistamentos**: qualquer morador autenticado pode
  criar, listar, editar e excluir seus próprios relatos (administradores
  podem gerenciar todos).
- **Dashboard** com estatísticas: total de avistamentos, moradores
  cadastrados, casos por status, criaturas mais relatadas, linha do tempo
  dos últimos 14 dias e relatos mais recentes.
- **Interface responsiva**, funcionando em celulares, tablets e desktops.
- **Busca e filtros** na listagem de avistamentos (por criatura, texto
  livre e status).

## Stack utilizada

**Frontend**
- React + Vite
- React Router
- Axios
- Recharts (gráficos do dashboard)

**Backend**
- Node.js + Express (API RESTful)
- JWT (`jsonwebtoken`) para autenticação
- `bcryptjs` para hash de senhas
- Sequelize (ORM)

**Banco de dados**
- SQLite por padrão (arquivo local, zero configuração — ideal para rodar o
  projeto e para a demonstração ao vivo)
- Totalmente compatível com PostgreSQL ou MySQL trocando apenas variáveis
  de ambiente (veja `backend/.env.example`)

## Estrutura do repositório

```
little-ville/
├── backend/                 API REST (Node.js + Express + Sequelize)
│   ├── src/
│   │   ├── config/          Configuração da conexão com o banco
│   │   ├── models/          Modelos Sequelize (User, Avistamento)
│   │   ├── controllers/     Regras de negócio de cada recurso
│   │   ├── middleware/      Autenticação JWT
│   │   ├── routes/          Definição das rotas da API
│   │   ├── server.js        Ponto de entrada da aplicação
│   │   └── seed.js          Script opcional para popular dados de exemplo
│   ├── package.json
│   └── .env.example
├── frontend/                 Aplicação React (Vite)
│   ├── src/
│   │   ├── api/              Instância do Axios
│   │   ├── context/           Contexto de autenticação
│   │   ├── components/        Componentes reutilizáveis
│   │   ├── pages/              Telas da aplicação
│   │   └── styles/              Estilos globais
│   ├── package.json
│   └── .env.example
├── DOCUMENTACAO.md            Requisitos funcionais, não funcionais e regras de negócio
└── README.md
```

## Como rodar o projeto localmente

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior instalado.

### 1. Backend

```bash
cd backend
cp .env.example .env       # ajuste as variáveis se quiser (não é obrigatório)
npm install
npm run seed                # opcional: popula o banco com dados de exemplo
npm run dev                  # inicia a API em http://localhost:3001
```

A API sobe usando SQLite por padrão — um arquivo `database.sqlite` é criado
automaticamente na pasta `backend/`, sem precisar instalar nenhum servidor
de banco de dados.

Para usar PostgreSQL ou MySQL, edite o `.env` conforme os comentários do
`.env.example` (defina `DB_DIALECT`, `DB_HOST`, `DB_NAME`, `DB_USER`,
`DB_PASSWORD`) e instale o driver correspondente:

```bash
npm install pg pg-hstore     # para PostgreSQL
# ou
npm install mysql2           # para MySQL
```

### 2. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env         # já aponta para http://localhost:3001/api
npm install
npm run dev                   # inicia em http://localhost:5173
```

Abra `http://localhost:5173` no navegador, crie uma conta (ou use o usuário
de demonstração abaixo) e comece a registrar avistamentos.

## Usuário de demonstração

Se você rodou `npm run seed` no backend, já existem contas prontas:

| Papel          | Email                       | Senha      |
|----------------|------------------------------|------------|
| Morador        | tomas@littleville.com        | senha123   |
| Morador        | clarice@littleville.com      | senha123   |
| Administrador  | admin@littleville.gov        | senha123   |

## Endpoints da API

Base URL: `http://localhost:3001/api`

| Método | Rota                     | Descrição                                  | Autenticado |
|--------|---------------------------|---------------------------------------------|-------------|
| POST   | `/auth/registrar`         | Cria uma conta de morador                    | Não         |
| POST   | `/auth/login`              | Autentica e retorna um token JWT             | Não         |
| GET    | `/auth/me`                  | Retorna os dados do morador logado           | Sim         |
| GET    | `/avistamentos`             | Lista avistamentos (filtros: `busca`, `status`, `criatura`) | Sim |
| POST   | `/avistamentos`              | Registra um novo avistamento                  | Sim         |
| GET    | `/avistamentos/:id`           | Detalha um avistamento                        | Sim         |
| PUT    | `/avistamentos/:id`             | Atualiza um avistamento (autor ou admin)      | Sim         |
| DELETE | `/avistamentos/:id`               | Exclui um avistamento (autor ou admin)        | Sim         |
| GET    | `/dashboard`                       | Estatísticas para o painel visual             | Sim         |

## Publicação (deploy)

- **Backend**: pode ser publicado em serviços como Render, Railway ou
  Fly.io. Defina as variáveis de ambiente do `.env.example` no painel do
  serviço escolhido.
- **Frontend**: publique em **Netlify** ou **Vercel** rodando
  `npm run build` (gera a pasta `dist/`) e apontando a variável
  `VITE_API_URL` para a URL pública do backend já publicado.

---

Boa sorte com a apresentação — que a tecnologia traga luz ao mistério do
Pé Grande! 🌲
