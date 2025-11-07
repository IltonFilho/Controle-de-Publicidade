HOSTINGER DEPLOY - Passo a passo específico
===========================================

Observação importante:
- O Hostinger só permite executar aplicações Node.js em planos que ofereçam suporte a Node (Cloud ou VPS). Se você estiver em um plano de hospedagem compartilha (PHP), a solução é:
  1) Fazer deploy do BACKEND Node.js em um serviço gratuito (Render, Railway ou Heroku) e
  2) Fazer deploy do FRONT-END (pasta 'public') no Hostinger como site estático apontando para a URL do backend.
- Abaixo seguem instruções para ambos os cenários.

A) Se seu plano Hostinger suporta Node.js (Cloud/VPS)
----------------------------------------------------
1. Faça upload dos arquivos do projeto (todo o conteúdo do ZIP) para o diretório do app no hPanel.
   - Use o gerenciador de arquivos do Hostinger ou SFTP/SSH.
2. No hPanel, abra a seção "Node.js" ou "Aplicações" (dependendo do painel).
3. Configure a aplicação:
   - Caminho da aplicação: a pasta onde está 'server.js'
   - Comando de inicialização: `npm start`
   - Porta: use a porta que o Hostinger indicar; mantenha `process.env.PORT` no .env
4. No painel, configure as variáveis de ambiente conforme o arquivo `.env.example` (DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET, PORT).
5. Abra o terminal (SSH) ou use a opção do painel para rodar `npm install` na pasta do projeto.
6. Inicie a aplicação via painel (ou `npm start` via SSH).
7. Importe o banco MySQL:
   - Crie o banco no painel MySQL do Hostinger (nome: controle_publicidade).
   - No phpMyAdmin, importe `sql/banco.sql`.
8. Verifique logs no painel se algo falhar.

B) Se seu plano Hostinger NÃO suporta Node.js (Plano compartilhado)
-------------------------------------------------------------------
Opção recomendada (rápida):
1. Faça deploy do BACKEND em Render (ou Railway):
   - Crie conta em https://render.com (gratuito para projetos pequenos).
   - Novo Web Service -> conectar via GitHub (ou faça upload) -> Build Command: `npm install` -> Start Command: `npm start`.
   - Configure variáveis de ambiente no painel do Render (usar .env.example).
   - Deploy. Você terá uma URL pública do backend (ex: https://meu-backend.onrender.com).
2. No Hostinger, suba apenas a pasta `public` (conteúdo estático) para `public_html`.
   - Edite `public/index.html` (linha JS que chama `/api/...`) e altere as chamadas para absoluta `https://meu-backend.onrender.com/api/...`
   - Assim o front consumirá o backend hospedado no Render.
3. Importe o banco no MySQL do Render (use Addon ou use um DB MySQL separado como PlanetScale, Railway DB, etc.) ou continue usando o MySQL do Hostinger e ajuste DB_HOST para o host/public endpoint.

Notas rápidas:
- Se usar Render, você pode também hospedar tanto o backend quanto o banco na plataforma.
- Use HTTPS na URL pública (Render já fornece).
- Se tiver problema na importação do banco via SQL, abra phpMyAdmin no Hostinger e importe `sql/banco.sql` manualmente.

Dicas DEBUG:
- Verifique `process.env` e variáveis no painel.
- Logs: use `console.log` e veja saída no painel Hostinger/Render.
- Firewall/Portas: em VPS abra a porta indicada.

