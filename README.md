<h1 align="center" style="font-weight: bold;">Egleston-API</h1>

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Índice

- [Descrição](#descrição)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Documentação Swagger](#documentação-swagger)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Endpoints da API](#endpoints-da-api)
  - [Estudantes](#estudantes)
- [Autenticação](#autenticação)
- [Testes](#testes)
  - [Utilizando a Extensão REST Client do VS Code](#utilizando-a-extensão-rest-client-do-vs-code)
- [Autores e Agradecimentos](#autores-e-agradecimentos)

## Descrição

Egleston-API é uma API REST projetada para gerir as operações de uma escola, incluindo a gestão de estudantes, professores, turmas e disciplinas. Esta API é a base do sistema de gestão escolar Egleston, que possui um frontend integrado para uma experiência completa.

## Funcionalidades Principais

- **Gestão de Estudantes**: Registro, atualização e consulta de informações dos estudantes.
- **Gestão de Professores**: Registro, atualização e consulta de informações dos professores.
- **Gestão de Turmas**: Criação e gestão de turmas.
- **Gestão de Disciplinas**: Atribuição e gestão de disciplinas oferecidas pela escola.

## Documentação Swagger

A documentação completa da API pode ser acessada através da interface Swagger

- [Documentação Swagger Online](#)
- Para acessar localmente, inicie a API e navegue até http://localhost:8000/swagger.

## Tecnologias Utilizadas

**Egleston-API** foi construída usando um conjunto moderno de tecnologias para garantir desempenho, escalabilidade e facilidade de manutenção. Aqui estão as principais tecnologias utilizadas:

1. **Node.js**: Plataforma JavaScript para desenvolvimento de servidores, garantindo alta performance e escalabilidade.
2. **TypeScript**: Linguagem de programação que adiciona tipagem estática ao JavaScript, melhorando a robustez e a produtividade no desenvolvimento.
3. **Fastify**: Framework web para Node.js focado em performance e simplicidade, ideal para construção de APIs rápidas e eficientes.
4. **Swagger**: Ferramenta para documentação de APIs REST, permitindo que os desenvolvedores entendam e interajam facilmente com os serviços oferecidos.
5. **Swagger UI**: Interface gráfica para a documentação Swagger, proporcionando uma experiência interativa para explorar os endpoints da API.
6. **Zod**: Biblioteca para validação de esquemas e parsing de dados, garantindo que os dados recebidos e enviados estejam em conformidade com os formatos esperados.
7. **Prisma**: ORM moderno para Node.js e TypeScript, facilitando o acesso a bancos de dados e a manipulação de dados com segurança e eficiência.
8. **PostgreSQL**: Sistema de gestão de banco de dados relacional, utilizado como a principal base de dados para armazenar informações da escola.
9. **Docker**: Plataforma de contêineres que permite a execução da aplicação em ambientes isolados, garantindo consistência e facilitando a implantação.
10. **Docker Compose**: Ferramenta para definir e gerir aplicativos Docker compostos por múltiplos contêineres, simplificando o processo de configuração e execução do ambiente completo.

## Requisitos

- **Node.js** v20 ou superior
- **NPM** v10 ou superior
- **PostgreSQL** v13 ou superior (ou via Docker Compose)
- **Docker** e **Docker Compose** (opcional, para execução do PostgreSQL via contêiner)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/mateusvalecelestino/egleston-api.git
   cd egleston-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
DATABASE_URL="postgresql://user:password@127.0.0.1:5432/egleston"
SERVER_PORT=8000
```

### Configuração do PostgreSQL com Docker Compose

Para facilitar a configuração do banco de dados PostgreSQL, utilizei o Docker Compose para gerir o contêiner do PostgreSQL. No diretório do projeto, você encontrará o arquivo `docker-compose.yml`.

**Exemplo de `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  postgres:
    image: bitnami/postgresql:latest
    container_name: egleston_db
    environment:
      - POSTGRESQL_USERNAME=user
      - POSTGRESQL_PASSWORD=password
      - POSTGRESQL_DATABASE=egleston
      - ALLOW_EMPTY_PASSWORD=no
    ports:
      - '5432:5432'
    volumes:
      - egleston_data:/bitnami/postgresql
      - ./initdb:/docker-entrypoint-initdb.d

volumes:
  egleston_data:
```

Para iniciar o contêiner do PostgreSQL, use o comando:

```bash
docker-compose up
```

Obs: Podes adicionar a flag -d para o comando ser executado em segundo plano no terminal, ex.:

```bash
docker-compose up -d
```

Isso irá iniciar o contêiner do PostgreSQL, que ficará disponível em `127.0.0.1:5432` ou `localhost:5432`.

### Configurar as Migrações do Prisma

O Prisma utiliza migrações para gerir o esquema do banco de dados. Execute o comando abaixo para executar as migrações:

```bash
npx prisma migrate dev
```

Isso aplicará todas as migrações pendentes e atualizará o esquema do banco de dados especificado no arquivo `.env`.

**Obs**: Certifique-se de que o banco de dados esteja acessível e que você tenha as configurações corretas definidas no arquivo `.env`.

## Execução

### Iniciando com Node.js

Inicie o servidor da API com o seguinte comando:

```bash
npm start
```

A API estará disponível em `http://localhost:8000`.

### Conectando ao PostgreSQL com Docker Compose

Se você estiver usando o Docker Compose para o PostgreSQL, certifique-se de que o contêiner do banco de dados está em execução (veja a secção de configuração acima).

## Endpoints da API

### Estudantes

#### GET /api/estudantes

Retorna uma lista de todos os estudantes registrados.

- **URL**: `/api/estudantes`
- **Método HTTP**: `GET`
- **Respostas**:
  - `200 OK`: Lista de estudantes.
  - `401 Unauthorized`: Falha na autenticação.

#### POST /api/estudantes

Adiciona um novo estudante.

- **URL**: `/api/estudantes`
- **Método HTTP**: `POST`
- **Corpo da Requisição**:
  ```json
  {
    "nomeCompleto": "Mateus Vale",
    "nomeCompletoPai": "Nelito Toquessa",
    "nomeCompletoMae": "Ana João",
    "numeroBi": "000000001LA000",
    "dataNascimento": "2005-06-01",
    "genero": "M",
    "bairro": "Simeone",
    "rua": "4 de Abril",
    "numeroCasa": 73,
    "telefone": "954454120",
    "email": "mateus@mateus.com"
  }
  ```
- **Respostas**:
  - `201 Created`: Estudante criado com sucesso.
  - `400 Bad Request`: Dados de entrada inválidos.

## Autenticação

A API utiliza autenticação baseada em tokens JWT. Para acessar os endpoints protegidos, é necessário incluir o token JWT no cabeçalho `Authorization` das requisições.

- **Formato do cabeçalho**: `Authorization: Bearer <seu-token-jwt>`

## Testes

### Utilizando a Extensão REST Client do VS Code

Para facilitar os testes dos endpoints, incluímos arquivos `.http` na pasta `requests`. Esses arquivos podem ser usados com a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) do VS Code.

1. **Instale a Extensão REST Client**: No VS Code, vá até a secção de extensões (`Ctrl+Shift+X`) e procure por "REST Client". Instale a extensão desenvolvida por `Huachao Mao`.
2. **Abra a Pasta de Requests**: Navegue até a pasta `requests` no seu projeto.

3. **Execute as Requisições**: Abra um dos arquivos `.http` e clique no link "Send Request" que aparece acima da primeira linha de cada requisição.

Os arquivos `.http` contêm exemplos de chamadas aos endpoints da API, permitindo que você teste rapidamente as funcionalidades diretamente do VS Code.

## Autores e Agradecimentos

- **Mateus Vale Celestino** - _Desenvolvedor Principal_ - [Mateus Vale Celestino](https://github.com/mateusvalecelestino)
