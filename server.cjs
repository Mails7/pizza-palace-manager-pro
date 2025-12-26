const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve arquivos estáticos da pasta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Todas as rotas redirecionam para index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Pizza Palace Manager rodando na porta ' + PORT);
});
