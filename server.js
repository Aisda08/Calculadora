const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function resolverPosfixa(expressao) {
    const tokens = expressao.trim().split(/\s+/);
    const pilha = [];

    const operadores = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    };

    for (const token of tokens) {
        if (token in operadores) {
            if (pilha.length < 2) {
                throw new Error("Expressão inválida: operandos insuficientes.");
            }
            const b = pilha.pop();
            const a = pilha.pop();
            const resultado = operadores[token](a, b);
            pilha.push(resultado);
        } else {
            const numero = parseFloat(token);
            if (isNaN(numero)) {
                throw new Error(`Token inválido: '${token}'`);
            }
            pilha.push(numero);
        }
    }

    if (pilha.length !== 1) {
        throw new Error("Expressão inválida: operandos sobrando.");
    }

    return pilha[0];
}

app.post('/', (req, res) => {
    let { expressao } = req.body;
    
    expressao = expressao.replace(/×/g, '*').replace(/÷/g, '/');

    try {
        const resultado = resolverPosfixa(expressao);
        res.json({ resultado });
    } catch (error) {
        console.log("Erro no cálculo:", error.message);
        res.status(400).json({ erro: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
