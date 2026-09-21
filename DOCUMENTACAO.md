# Documentação — Aplicativo de Avistamentos de Little Ville

## 1. Introdução

Este documento descreve os requisitos funcionais, os requisitos não
funcionais e as regras de negócio do aplicativo desenvolvido para que os
moradores de Little Ville registrem, consultem e acompanhem avistamentos
de criaturas e fenômenos místicos (Pé Grande e afins), conforme solicitado
no projeto final da disciplina de Desenvolvimento de Sistemas Integrados.

## 2. Requisitos Funcionais

| Código  | Descrição |
|---------|-----------|
| RF01 | O sistema deve permitir que um visitante crie uma conta informando nome, email e senha. |
| RF02 | O sistema deve permitir que um morador cadastrado faça login com email e senha. |
| RF03 | O sistema deve emitir um token de sessão (JWT) após o login, exigido para acessar as funcionalidades internas. |
| RF04 | O sistema deve permitir que um morador autenticado registre um novo avistamento, informando criatura/fenômeno, descrição, localização, data/hora da ocorrência, nível de credibilidade e, opcionalmente, uma imagem. |
| RF05 | O sistema deve listar os avistamentos cadastrados, exibindo autor, data, local e status de cada um. |
| RF06 | O sistema deve permitir busca textual (por criatura, local ou descrição) e filtro por status na listagem de avistamentos. |
| RF07 | O sistema deve permitir visualizar os detalhes completos de um avistamento específico. |
| RF08 | O sistema deve permitir que o autor de um avistamento (ou um administrador) edite as informações do relato, incluindo a alteração do status do caso. |
| RF09 | O sistema deve permitir que o autor de um avistamento (ou um administrador) exclua o relato. |
| RF10 | O sistema deve apresentar um dashboard com: total de avistamentos, total de moradores, quantidade de casos por status, criaturas mais relatadas, linha do tempo dos relatos nos últimos 14 dias e os avistamentos mais recentes. |
| RF11 | O sistema deve impedir o acesso às rotas de avistamentos e ao dashboard sem autenticação válida. |

## 3. Requisitos Não Funcionais

| Código  | Descrição |
|---------|-----------|
| RNF01 | A interface deve ser responsiva, funcionando corretamente em smartphones, tablets e desktops. |
| RNF02 | As senhas dos usuários devem ser armazenadas com hash (bcrypt), nunca em texto puro. |
| RNF03 | A comunicação entre frontend e backend deve ocorrer via API RESTful, trocando dados em JSON. |
| RNF04 | Credenciais e configurações sensíveis (segredo do JWT, credenciais de banco) devem ficar em variáveis de ambiente (`.env`), fora do controle de versão. |
| RNF05 | O backend deve ser independente do banco de dados escolhido (SQLite para desenvolvimento/demonstração, com suporte a PostgreSQL/MySQL em produção), graças ao uso de um ORM (Sequelize). |
| RNF06 | O sistema deve retornar mensagens de erro claras e em português para o usuário final. |
| RNF07 | O tempo de resposta das operações de CRUD e do dashboard deve ser adequado para uso interativo (consultas otimizadas com índices/agrupamentos no banco). |
| RNF08 | O código deve ser organizado em camadas (rotas, controllers, models) para separar responsabilidades e facilitar a manutenção. |

## 4. Regras de Negócio

| Código  | Descrição |
|---------|-----------|
| RN01 | Cada morador deve ter um email único no sistema; não é permitido cadastro duplicado com o mesmo email. |
| RN02 | A senha do morador deve ter, no mínimo, 6 caracteres. |
| RN03 | Todo avistamento pertence a um único morador (autor), identificado automaticamente pelo usuário autenticado no momento do registro. |
| RN04 | Apenas o autor de um avistamento ou um usuário com papel de "administrador" pode editar ou excluir aquele avistamento. |
| RN05 | Todo avistamento deve possuir obrigatoriamente: criatura/fenômeno, descrição, localização e data/hora da ocorrência. |
| RN06 | O nível de credibilidade de um avistamento é classificado como "baixo", "médio" ou "alto". |
| RN07 | O status de um avistamento segue o ciclo: "pendente" (padrão ao criar) → "confirmado" ou "descartado", alterado apenas por edição explícita do autor ou de um administrador. |
| RN08 | O dashboard considera apenas os avistamentos efetivamente cadastrados no banco de dados no momento da consulta (dados sempre atualizados, sem cache). |
| RN09 | Um morador com papel "administrador" tem as mesmas permissões de um morador comum, além de poder editar e excluir avistamentos de qualquer autor. |

## 5. Modelo de dados (resumo)

**Usuario**
- `id`, `nome`, `email` (único), `senha` (hash), `papel` (`morador` | `administrador`), `createdAt`, `updatedAt`

**Avistamento**
- `id`, `criatura`, `descricao`, `localizacao`, `dataHoraOcorrencia`,
  `nivelCredibilidade` (`baixo` | `medio` | `alto`), `status`
  (`pendente` | `confirmado` | `descartado`), `imagemUrl` (opcional),
  `userId` (chave estrangeira para Usuario), `createdAt`, `updatedAt`

Relacionamento: **um Usuário possui muitos Avistamentos** (1:N).

## 6. Arquitetura

O sistema segue uma arquitetura em três camadas:

1. **Frontend (React)** — interface com o morador, consome a API via Axios.
2. **Backend (Node.js/Express)** — expõe a API RESTful, aplica autenticação
   JWT e as regras de negócio.
3. **Banco de dados (SQLite/PostgreSQL/MySQL via Sequelize)** — persiste
   usuários e avistamentos.

Essa separação permite que cada camada evolua de forma independente e
facilita o trabalho colaborativo entre os integrantes da equipe.
