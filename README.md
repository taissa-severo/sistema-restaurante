# Sistema de Restaurantes

Este é um sistema web desenvolvido com Node.js e Express que permite cadastrar, listar, consultar e excluir restaurantes. A interface é responsiva graças ao uso do Bootstrap, e os dados são armazenados em um banco de dados PostgreSQL.

## Funcionalidades

- Cadastro de novos restaurantes via formulário HTML
- Listagem de restaurantes com opções de consulta e exclusão
- Consulta detalhada de cada restaurante
- Exclusão de registros diretamente pela interface
- Interface responsiva com Bootstrap

## Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- HTML + CSS
- Bootstrap 5

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/taissa-severo/sistema-restaurante.git

2. Acessar a pasta do projeto:

    cd sistema-restaurante

3. Instale as dependencias:

    npm install

4. Configure o banco de dados PostgresSQL, criando um banco com a tabela 'restaurantes':

    CREATE TABLE restaurantes (
     codigo SERIAL PRIMARY KEY,
     nome VARCHAR(100) NOT NULL,
     endereco VARCHAR(200),
     telefone VARCHAR(20),
     email VARCHAR(100),
     site VARCHAR(100)
    );

5. Inicie o servidor:

    node app.js

6. Acesse no navegador:

    http://localhost:8085/
    
Autora:
Taíssa Severo 
Projeto acadêmico para fins de aprendizado e prática com tecnologias web.