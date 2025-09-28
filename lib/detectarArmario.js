import cors from "cors"
import express from "express"

const app = express()
app.use(cors({}))
app.use(express.json())

let ultimoArmario = null
let ultimoObjetoDetectado = null

app.post("/distancia", (req, res) => {
  const { armario, objeto_detectado } = req.body
  console.log(`Armário ${armario} - Objeto detectado? ${objeto_detectado}`)
  ultimoArmario = armario
  ultimoObjetoDetectado = objeto_detectado
  res.json({ armario, objeto_detectado })
})

app.get("/distancia/enviar", (req, res) => {
  res.json({
    armario: ultimoArmario,
    objeto_detectado: ultimoObjetoDetectado
  })
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})