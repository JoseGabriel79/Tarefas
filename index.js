const express = require('express')
const app = express()
const bp = require('body-parser') //conversor do corpo
const cors = require('cors')
const sqlite3 = require("sqlite3")
const path = require('path')
const db = new sqlite3.Database("./db.sqlite")

var PORT = 8080

app.use(cors())
app.use(bp.urlencoded())
app.use(bp.json())
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, ()=>{
    console.log("Servidor aberto na porta " + PORT)
})

db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS Tarefas(
             id INTEGER PRIMARY KEY AUTOINCREMENT,
            tarefa VARCHAR(50) NOT NULL,
            categoria TEXT

    )`)
})

app.get("/tarefas", (req,res)=>{
    //res.send(listaTarefas)

    db.all(`SELECT *FROM Tarefas`,[], (err, rows)=>{
        res.json(rows)
    })
})
app.post("/tarefa", (req,res)=>{
    console.log(req.body.categoria)
   db.run(`INSERT INTO Tarefas (tarefa, categoria) VALUES (?,?)`, [req.body.tarefa, req.body.categoria],
    function(err) {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Tarefa adicionada com sucesso!" });
})
})

app.delete("/tarefa/:index",(req,res)=>{
    db.run(`DELETE FROM Tarefas WHERE id == (?)`,[req.params.index])
})

app.put("/tarefa/:index", (req,res)=>{
    db.run(`UPDATE Tarefas 
        SET tarefa = (?), categoria = (?)
        WHERE id == (?)`, [req.body.tarefa,req.body.categoria,req.params.index])
})
app.get("/home",(req, res)=>{
    res.sendFile(path.join(__dirname,'public', 'index.html',))
})