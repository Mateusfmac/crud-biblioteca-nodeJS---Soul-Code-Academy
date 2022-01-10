const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express()
const port = 8000

//connection db
mongoose.connect("YOUR DB !", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//model db
const Livros = mongoose.model("produtos", {
  titulo: String,
  autor: String,
  categoria: String,
  valor: String
})
const User = mongoose.model("users", {
  login: String,
  password: String
})

//middleware
app.use(session({
  secret: "admin"
}))
app.use(bodyParser.urlencoded({
  extended: true
}))

app.set("view engine", "ejs")
app.set("views", __dirname, "/views")
app.use(session({
  secret: "muitobom",
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

var login = "admin"
var password = "admin"

// rota home
app.get("/", (req, res) => {
  res.render("index")
})


//rota login
app.post("/", (req, res) => {
  let usuario = new User()

  usuario.login = req.body.login
  usuario.password = req.body.password

  usuario.save(err => {
    if (err)
      return res.status(500).send("erro ao logar")
    if (usuario.login === login && usuario.password === password)
      return res.redirect("/livros")
    else
      return res.redirect("/livrosUser")
  })
})



//rota usuario logado
app.get("/livrosUser", (req, res) => {
  Livros.find({}, (err, produto) => {
    if (err)
      return res.status(500).send("Erro ao listar")

    res.render("livrosUser", {
      livro: produto
    })
  })
})


//lista livros
app.get("/livros", (req, res) => {
  Livros.find({}, (err, produto) => {
    if (err)
      return res.status(500).send("Erro ao listar")

    res.render("livros", {
      livro: produto
    })
  })
})

// rota cadastro livros
app.get("/cadastro", (req, res) => {
  res.render("cadastrar")
})



// post DB
app.post("/cadastro", (req, res) => {
  let livro = new Livros()

  livro.titulo = req.body.titulo
  livro.autor = req.body.autor
  livro.categoria = req.body.categoria
  livro.valor = req.body.valor

  livro.save(err => {
    if (err)
      return res.status(500).send("Erro ao cadastrar")

    return res.redirect("/livros")
  })
})

//edit
app.get("/editar/:id", (req, res) => {
  Livros.findById(req.params.id, (err, produto) => {
    if (err)
      return res.status(500).send("erro ao editar")
    res.render("editar", {
      item: produto
    })
  })
})


//save edit
app.post("/editar", (req, res) => {
  var id = req.body.id
  Livros.findById(id, (err, produto) => {
    if (err)
      return res.status(500).send("erros ao salvar")
    produto.titulo = req.body.titulo
    produto.autor = req.body.autor
    produto.categoria = req.body.categoria
    produto.valor = req.body.valor

    produto.save(err => {
      if (err)
        return res.status(500).send("erro ao editar")
      return res.redirect("/livros")
    })
  })
})

//delete
app.get("/deletar/:id", (req, res) => {
  var abelha = req.params.id

  Livros.deleteOne({
    _id: abelha
  }, (err, result) => {
    if (err)
      return res.status(500).send("erro ao deletar")
  })
  res.redirect("/livros")
})


//pesquisar admin
app.get("/pesquisar", (req, res) => {
  var busca = req.query.pesquisa
  console.log(busca)
  Livros.find({
    $or: [{
      titulo: busca
    }, {
      autor: busca
    }, {
      valor: busca
    }, {
      categoria: busca
    }]
  }, (err, produto) => {
    if (err)
      return res.status(500).send("Erro ao listar")

    res.render("livros", {
      livro: produto
    })
  })
})

//pesquisar Usuario
app.get("/pesquisarUser", (req, res) => {
  var busca = req.query.pesquisaUser
  console.log(busca)
  Livros.find({
    $or: [{
      titulo: busca
    }, {
      autor: busca
    }, {
      valor: busca
    }, {
      categoria: busca
    }]
  }, (err, produto) => {
    if (err)
      return res.status(500).send("Erro ao listar")

    res.render("livrosUser", {
      livro: produto
    })
  })
})

//port server
app.listen(port, () => {
  console.log(`server runing on port ${port}`)
})