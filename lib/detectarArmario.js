import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let ultimaDistancia = 0;

app.post('/distancia', (req, res) => {
  const { distancia } = req.body;
  ultimaDistancia = distancia;
  console.log('Distância recebida do ESP32:', distancia);
  res.sendStatus(200);
});

app.get('/distancia', (req, res) => {
  res.json({ distancia: ultimaDistancia });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3001'));