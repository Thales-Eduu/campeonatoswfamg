const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { mensagem: null });
});

app.post('/inscrever', async (req, res) => {
    try {
        const { discord, nome_jogo, nome_time, mapas, funcao } = req.body;

        const { error } = await supabase
            .from('inscricoes')
            .insert([{ discord, nome_jogo, nome_time, mapas, funcao }]);

        if (error) {
            console.error('Erro do Supabase:', error);
            return res.render('index', { mensagem: 'Erro ao realizar inscrição: ' + error.message });
        }

        res.render('index', { mensagem: 'Inscrição realizada com sucesso!' });
    } catch (err) {
        res.render('index', { mensagem: 'Erro crítico: ' + err.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}

module.exports = app;