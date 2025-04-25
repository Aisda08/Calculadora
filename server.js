const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
    let { expressao } = req.body;
    
    expressao = expressao.replace(/×/g, '*').replace(/÷/g, '/');

    try {
        const resultado = eval(expressao);
        res.json({ resultado });
    } catch (error) {
        res.status(400).json({ erro: 'Expressão inválida' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
