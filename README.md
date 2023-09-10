# NestJS Clean Architecture

Este projeto implementa uma API RESTful em Node.js utilizando o framework NestJS, orientado por princípios de arquitetura limpa (Clean Architecture) e design orientado a domínio (Domain Driven Design - DDD). O objetivo é ser uma aplicação robusta, testável e escalável, seguindo boas práticas de desenvolvimento.

## :scroll: Regras de Negócio (RN)

- Os campos name, email e password são obrigatórios.
- O campo createdAt é opcional.
- Não é permitido o cadastro de usuários com e-mails duplicados.

## :white_check_mark: Requisitos Funcionais (RF)

- Cadastro de usuário.
- Autenticação de usuário.
- Exibição de dados de usuário.
- Listagem de todos os usuários.
- Atualização do nome de um usuário.
- Atualização da senha de um usuário.
- Exclusão de usuário.

## :gear: Requisitos Não-Funcionais (RNF)

- Senha do usuário é armazenada de forma criptografada.
- Persistência dos dados em um banco de dados PostgreSQL.
- Paginação com 15 itens por página para listas de dados.
- Autenticação de usuário por meio de JWT (JSON Web Token).

## :hammer_and_wrench: Tecnologias Utilizadas

- Node.js.
- Docker.
- CLI do NestJS.
- CLI do Prisma ORM.

## :test_tube: Funcionalidades e Testes

Este projeto apresenta um módulo de usuários que engloba desde a definição da entidade até as funcionalidades de CRUD, validação de dados, autenticação JWT e paginação. Tudo isso é desenvolvido seguindo uma arquitetura baseada em DDD e Clean Architecture.

As características incluem:

- Organização das camadas da aplicação para separação clara de responsabilidades.
- Implementação de testes automatizados, abrangendo testes unitários, de integração e end-to-end.
- Tratamento adequado de erros e exceções.

O framework NestJS é utilizado para cuidar das funcionalidades de infraestrutura, enquanto a aplicação é construída em conformidade com as melhores práticas de desenvolvimento e design.

## :memo: Convenção de Commits

**Importante:** Este projeto segue a convenção de **Conventional Commits** para estruturar as mensagens de commit.

## :clipboard: Como configurar

### :hammer: Crie os arquivos de configuração

- Na raiz do projeto, crie dois arquivos chamados `.env.test` e `.env.development` e adicione as configurações fornecidas:

No `.env.test`

```env
PORT=3000
NODE_ENV=test
DATABASE_URL="postgresql://postgres:docekr@localhost:5433/projectdb?schema=test"

JWT_SECRET=fake_secret
JWT_EXPIRES_IN=86400
```

No `.env.development`

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:docekr@localhost:5433/projectdb?schema=public"

JWT_SECRET=fake_secret
JWT_EXPIRES_IN=86400
```

### :hammer: Configurar o banco de dados

- Execute o seguinte comando para criar um container Docker com as configurações básicas do banco de dados:

```bash
docker compose up -d
```

### :hammer: Instale as dependências do projeto

- Baixe todas as dependências do projeto executando o comando:

```bash
npm install
```

### :hammer: Gerar os modelos Prisma

- Execute o seguinte comando para gerar os modelos Prisma com base no arquivo de esquema `schema.prisma`:

```bash
npx prisma generate --schema src/shared/infrastructure/database/prisma/schema.prisma
```

### :hammer: Inicie o projeto

- Para iniciar o projeto, execute o comando:

```bash
npm run dev
```

### :white_check_mark: Acesse a documentação Swagger

- Acesse a documentação Swagger do projeto na seguinte URL:

```url
http://localhost:3000/api
```

### :white_check_mark: Execute os testes

- Para testes unitários:

```bash
npm run test:unit
```

- Para testes de integração:

```bash
npm run test:int
```

- Para testes de ponta a ponta (e2e):

```bash
npm run test:e2e
```
