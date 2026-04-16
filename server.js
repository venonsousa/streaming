
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // SERVE HTML

const db = new sqlite3.Database("./users.db");

// TABELA
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  pass TEXT
)
`);

// ROTAS HTML
app.get("/", (req,res)=> res.sendFile(path.join(__dirname,"index.html")));
app.get("/register", (req,res)=> res.sendFile(path.join(__dirname,"register.html")));
app.get("/recover", (req,res)=> res.sendFile(path.join(__dirname,"recover.html")));
app.get("/dashboard", (req,res)=> res.sendFile(path.join(__dirname,"dashboard.html")));

// CADASTRO
app.post("/register",(req,res)=>{
  const {name,email,pass} = req.body;

  db.run("INSERT INTO users (name,email,pass) VALUES (?,?,?)",
  [name,email,pass],
  err=>{
    if(err) return res.json({msg:"Erro ao cadastrar"});
    res.json({msg:"Conta criada!"});
  });
});

// LOGIN
app.post("/login",(req,res)=>{
  const {email,pass} = req.body;

  db.get("SELECT * FROM users WHERE email=? AND pass=?",
  [email,pass],
  (err,row)=>{
    if(row){
      res.json({success:true});
    }else{
      res.json({success:false,msg:"Login inválido"});
    }
  });
});

// RECUPERAR
app.post("/recover",(req,res)=>{
  const {email} = req.body;

  db.get("SELECT pass FROM users WHERE email=?",
  [email],
  (err,row)=>{
    if(row){
      res.json({msg:"Senha: "+row.pass});
    }else{
      res.json({msg:"Email não encontrado"});
    }
  });
});

app.listen(3000, ()=>console.log("🚀 http://localhost:3000"));
