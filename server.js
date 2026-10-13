const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Configurações do Express
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rota principal (Exibe o formulário)
app.get('/', (req, res) => {
    res.render('index', { mensagem: null });
});

// Rota para receber os dados do formulário e salvar no Supabase
app.post('/inscrever', async (req, res) => {
    const { discord, nome_jogo, nome_time, integrantes, funcao } = req.body;

    const { data, error } = await supabase
        .from('inscricoes')
        .insert([{ discord, nome_jogo, nome_time, integrantes, funcao }]);

    if (error) {
        console.error('Erro detalhado do Supabase:', error); // <- Isso vai mostrar a causa exata no terminal
        return res.render('index', { mensagem: 'Erro ao realizar inscrição. Tente novamente.' });
    }

    res.render('index', { mensagem: 'Inscrição realizada com sucesso!' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});