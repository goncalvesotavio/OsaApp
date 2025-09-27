import express from "express"
import cors from "cors"

const app = express()
//app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.post("/distancia", (req, res) => {
  const { armario, objeto_detectado } = req.body
  console.log(`Armário ${armario} - Objeto detectado? ${objeto_detectado}`)
  res.json({ status: "ok" })
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})