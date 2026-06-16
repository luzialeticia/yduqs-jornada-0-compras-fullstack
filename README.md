# Jornada 0 – Compras (Matrícula de Cursos)

Aplicação fullstack onde o usuário visualiza ofertas de cursos, escolhe a
modalidade e a forma de parcelamento e realiza a matrícula informando seus
dados pessoais.

> O enunciado original do desafio está em [`DESAFIO.md`](./DESAFIO.md).

## ✨ Stack

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | NestJS, TypeScript, TypeORM, PostgreSQL, class-validator, Swagger, Pino (logs) |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Radix UI (padrão shadcn/ui), Context API |
| **Testes** | Jest + Supertest (back), Vitest + React Testing Library (front) |
| **Infra** | Docker (PostgreSQL), migrations com TypeORM |

## 🗂️ Estrutura do monorepo

```
.
├── backend/    # API NestJS (ofertas e matrículas)
├── frontend/   # SPA React (jornada de matrícula)
└── docker-compose.yml   # PostgreSQL
```

A arquitetura do backend é em **camadas** (`controller → service → repository`),
o que manteve a regra de negócio isolada do ORM. O frontend organiza-se por
**features** (`offers`, `enrollment`, `success`) com uma camada de `api`, `ui`
(componentes) e o estado da jornada em **Context API**.

## 🧭 Funcionalidades da jornada

1. **Listagem de ofertas** por modalidade (Presencial / Digital (EAD)) e turno,
   com preço promocional, parcelamento, **valor à vista** e **campus/endereço**.
2. **Ofertas sem preço ("tapume")**: quando o valor não é divulgado, o card
   convida o usuário a se inscrever e o fluxo segue **sem seleção de parcela**.
3. **Escolha do parcelamento** em um modal ("Mais detalhes").
4. **Matrícula** com dados pessoais validados (CPF, e-mail, telefone, data de
   nascimento) e aceite de termos obrigatório; **ano de conclusão do ensino
   médio é opcional**.
5. **Confirmação** com número de protocolo.

---

## ✅ Pré-requisitos

- Node.js 20+ e Yarn (Classic)
- Docker + Docker Compose (para o PostgreSQL)

## 🚀 Como rodar

### 1. Banco de dados

```bash
docker compose up -d db
```

> O `docker-compose.yml` expõe o Postgres na porta **5433** do host
> (mapeada para a 5432 do container).

### 2. Backend

```bash
cd backend
cp .env.example .env          # ajuste a DATABASE_URL se necessário
yarn install
yarn migration:run            # cria as tabelas
yarn db:seed                  # popula ofertas de exemplo
yarn start:dev                # API em http://localhost:3000
```

- **Swagger:** http://localhost:3000/docs
- **Endpoints:** `GET /offers`, `GET /offers/:id`, `POST /enrollments`, `GET /enrollments/:id`

### 3. Frontend

```bash
cd frontend
cp .env.example .env          # VITE_API_URL aponta para o backend
yarn install
yarn dev                      # app em http://localhost:5173
```

---

## 🧪 Testes

```bash
# Backend (unitários — não precisam de banco)
cd backend && yarn test

# Backend (integração e2e — precisa do banco no ar + seed)
yarn test:e2e

# Frontend
cd frontend && yarn test
```

---

## 🔎 Destaques de implementação

- **Validações fortes** no backend (DTOs com `class-validator`): CPF com dígitos
  verificadores, e-mail, telefone (DDD), data de nascimento no passado e aceite
  de termos obrigatório. O frontend replica as regras para feedback imediato.
- **Privacidade (LGPD):** o CPF é armazenado só com dígitos e **retornado
  mascarado** pela API.
- **Precisão monetária:** colunas `decimal` com um `ValueTransformer` que evita o
  retorno como string do driver do Postgres.
- **Logs estruturados** (Pino), incluindo um log de domínio na criação da
  matrícula sem dados sensíveis.
- **Feedback de UX:** estados de _loading_, _erro_ (com “tentar novamente”) e
  _sucesso_ em toda a jornada; design responsivo (mobile e desktop).
- **Testes com factories + Faker** (seed fixo) no backend e React Testing
  Library cobrindo loading/erro e o fluxo de envio do formulário no frontend.

## 🧱 Decisões técnicas

- **TypeORM** (em vez de Prisma) pela integração nativa com o NestJS e por ser
  uma das opções de migrations sugeridas no desafio.
- **shadcn/ui (Radix + Tailwind)** para reproduzir a identidade visual do
  handoff com controle total sobre o tema.
- **`@faker-js/faker` fixado na v8** porque a v10 é ESM-only e quebra o
  ts-jest (CommonJS).

## 🔭 Próximos passos / evolução do modelo

Pontos conscientemente deixados para uma evolução futura (mantidos simples pelo
escopo do desafio):

- **Normalizar `Campus` e `Course` como entidades próprias.** Hoje `campusName`,
  `campusAddress` e `courseName` são colunas da `Offer`, o que **duplica** dados
  quando várias ofertas compartilham o mesmo campus ou curso. O modelo de
  produção seria:

  ```
  Course 1—N Offer N—1 Campus
  ```

  Com `Offer` referenciando `courseId` e `campusId` (FK), o endereço/contato do
  campus ficam numa única fonte da verdade, com integridade garantida e
  consultas naturais (ex.: "cursos disponíveis no campus X"). Foi mantido plano
  por YAGNI, mas é a evolução natural da modelagem.
- **Autenticação/autorização** para a área administrativa (CRUD de ofertas).
- **Paginação e filtros** na listagem de ofertas (por modalidade, campus, etc.).
- **Idempotência** na criação de matrícula (evitar duplicidade em reenvios).
- **Estado da jornada no frontend** é mantido em memória (Context API), então um
  _refresh_ reinicia o fluxo, e não há rota por etapa (sem deep-link nem botão
  "voltar" do navegador). Foi uma escolha consciente pelo escopo; a evolução
  natural é adotar `react-router` (uma rota por etapa) e/ou persistir o estado.
