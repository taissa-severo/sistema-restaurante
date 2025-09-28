const express = require('express')
const app = express()
const porta = 8085
const ipDoServidor = '127.0.0.1'
//inclui o componente body-parser na aplicacao
const bodyParser = require('body-parser')

//configuracao de uso do body-parser
//parse application/x-www-form-urlencoded (dados vem no body da req. HTTP)
app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json (se os dados viessem em formato JSON na requisição)
//app.use(bodyParser.json())


const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "restaurantes",
    password: "postgres",
    port: 5432,
});

app.get('/cadastro_restaurante', (req, res) => {
    res.sendFile(__dirname + "/cadRes.html");
});

app.get('/', (req, res) => {
    res.redirect('/listar-res');
});

app.get('/listar-res', async function (req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT codigo, nome, telefone FROM restaurantes ORDER BY nome ASC');
        const Restaurantes = result.rows;
        let table = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Lista de Restaurantes</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container mt-4">
  <h1 class="mb-4">Lista de Restaurantes</h1>
  <a href="/cadastro_restaurante" class="btn btn-primary mb-3">Cadastrar Novo Restaurante</a>
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Código</th>
        <th>Nome</th>
        <th>Telefone</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
`;

        Restaurantes.forEach((r) => {
            table += `
    <tr>
      <td>${r.codigo}</td>
      <td>${r.nome}</td>
      <td>${r.telefone}</td>
      <td>
        <a href="/consultar-restaurante/${r.codigo}" class="btn btn-info btn-sm">Consultar</a>
        <a href="/Excluir_restaurante/${r.codigo}" class="btn btn-danger btn-sm">Excluir</a>
      </td>
    </tr>
  `;
        });

        table += `
    </tbody>
  </table>
</body>
</html>
`;

        res.send(table);


        Restaurantes.forEach((r) => {
            table += `<tr>
                <td>${r.codigo}</td>
                <td>${r.nome}</td>
                <td>${r.telefone}</td>
                <td>
                    <a href="/consultar-restaurante/${r.codigo}">Consultar</a> |
                    <a href="/Excluir_restaurante/${r.codigo}">Excluir</a>
                </td>
            </tr>`;
        });

        table += '</table>';
        client.release();
        res.send(table);

    } catch (err) {
        console.error('Erro ao executar consulta:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


app.get('/consultar-restaurante/:codigo', async function (req, res) {

    var codigo = req.params.codigo
    console.log(codigo)

    //res.send("rota consultar a noticia de codigo = "+codigo)

    try {

        const client = await pool.connect();
        const result = await client.query('SELECT * FROM restaurantes WHERE codigo=' + codigo);
        const Restaurantes = result.rows;

        if (Restaurantes.length === 0) {
            res.status(404).send('Registro não encontrado');
        }
        else {
            const registro = Restaurantes[0];
            res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Consulta de Restaurante</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container mt-5">
  <h1 class="mb-4">Dados do Restaurante</h1>
  <table class="table table-bordered">
    <tr><th>Código</th><td>${registro.codigo}</td></tr>
    <tr><th>Nome</th><td>${registro.nome}</td></tr>
    <tr><th>Endereço</th><td>${registro.endereco}</td></tr>
    <tr><th>Telefone</th><td>${registro.telefone}</td></tr>
    <tr><th>Email</th><td>${registro.email}</td></tr>
    <tr><th>Site</th><td>${registro.site}</td></tr>
  </table>
  <a href="/listar-res" class="btn btn-secondary mt-3">Voltar para a listagem</a>
</body>
</html>
`);

        };
    }

    catch (err) {
        console.error('Erro ao executar consulta:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/Excluir_restaurante/:codigo', async function (req, res) {

    var codigo = req.params.codigo
    console.log(codigo)

    try {
        const client = await pool.connect();
        const result = await client.query('DELETE FROM restaurantes WHERE codigo =' + codigo);

        res.redirect("/listar-res")

    }
    catch (err) {
        console.error('Erro ao executar consulta:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }

});


app.get('/FormAvancado', function (req, res) {
    res.sendFile(__dirname + "/cadRes.html")
});

app.post("/cadastro_restaurante", function (req, res) {

    var pagina_dinamica = " ";

    pagina_dinamica = pagina_dinamica + "<br /> Cadastro de restaurentes "

    pagina_dinamica = pagina_dinamica + "<br /> nome = " + req.body.nome;
    pagina_dinamica = pagina_dinamica + "<br /> endereço = " + req.body.end;
    pagina_dinamica = pagina_dinamica + "<br /> telefone = " + req.body.telefone;
    pagina_dinamica = pagina_dinamica + "<br /> email = " + req.body.email;
    pagina_dinamica = pagina_dinamica + "<br /> site = " + req.body.site;

    var minhaConsulta = "INSERT INTO restaurantes (nome, endereco, telefone, email, site) VALUES ('" + req.body.nome + "', '" + req.body.end + "', '" + req.body.telefone + "', '" + req.body.email + "', '" + req.body.site + "')";

    console.log(minhaConsulta);

    //aqui vai o insert
    pool.query(minhaConsulta,
        function (error, results, fields) {

            if (error) throw error;
            //senao esta conectado!
        });

    res.send(pagina_dinamica)
});



app.listen(porta, ipDoServidor, function () {
    console.log('/n Aplicação web executando em http://' + ipDoServidor + ':' + porta);
})