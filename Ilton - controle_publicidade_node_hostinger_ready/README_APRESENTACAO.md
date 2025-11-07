README_APRESENTACAO.md - Respostas prontas para a avaliação
===========================================================

Projeto: Controle de Publicidade
Tecnologias: Node.js, Express, MySQL, JWT, Bootstrap (front-end)

1) Sistema publicado na Web
- URL (exemplo): https://SEU_HOSTING_URL/
- Backend: Node.js + Express
- Frontend: pasta /public (HTML + JS) consumindo API REST

2) Cadastro 1 (Usuários) - O que foi implementado
- Endpoints:
  - POST /api/usuarios/register  -> cria usuário (nome,email,senha)
  - POST /api/usuarios/login     -> autentica e retorna token JWT
  - GET /api/usuarios            -> lista usuários (protegido)
  - PUT /api/usuarios/:id        -> edita usuário (protegido)
  - DELETE /api/usuarios/:id     -> remove usuário (protegido)
- Explicação técnica curta (para apresentação):
  - Armazenamento de senha: usamos bcrypt para gerar `senha_hash` (não armazenamos senha em texto).
  - Fluxo de registro: o endpoint recebe nome/email/senha -> verifica email duplicado -> faz bcrypt.hash(senha) -> insere no banco.
  - Fluxo de login: compara hash via `bcrypt.compare()`; se ok, gera JWT com `jsonwebtoken.sign({id,nome,email}, JWT_SECRET)` e retorna ao cliente.
  - Rotas protegidas: middleware `auth` lê cabeçalho `Authorization: Bearer TOKEN`, verifica com `jwt.verify()` e adiciona `req.user`.

3) Perguntas que podem cair sobre o código de Usuários (exemplos e respostas)
- Q: Onde as senhas são verificadas?
  - R: No arquivo `routes/usuarios.js`, rota `/login` com `bcrypt.compare(senha, user.senha_hash)`.
- Q: Como as rotas são protegidas?
  - R: Middleware `auth` (em `routes/usuarios.js` e copiado em outras rotas) valida o header `Authorization`.
- Q: Por que JWT é usado?
  - R: Permite guardar estado de autenticação no cliente (token) e validar sem consultar DB a cada requisição. Tokens expiram e podem ser invalidados no servidor por rotação de segredo.

4) Cadastro 2 (Campanhas) - O que foi implementado
- Endpoints:
  - GET /api/campanhas
  - POST /api/campanhas
  - PUT /api/campanhas/:id
  - DELETE /api/campanhas/:id
- Estrutura da tabela `campanhas`:
  - id, titulo, cliente, custo, alcance, resultado, data_inicio, data_fim, usuario_id
- Explicação técnica curta:
  - `usuario_id` referencia quem criou a campanha (FK para `usuarios.id`).
  - O backend recebe dados via JSON, faz INSERT/UPDATE no MySQL usando `mysql2/promise`.

5) Pergunta sobre o código do cadastro 2 (exemplos)
- Q: Onde a relação usuário→campanha é definida?
  - R: No SQL (`campanhas.usuario_id` com FOREIGN KEY para `usuarios.id`) e no insert usamos `req.user.id` para popular `usuario_id`.
- Q: Como prevenir injeção SQL?
  - R: Usamos queries parametrizadas via `db.query('INSERT ...', [params])` que escapam valores automaticamente.

6) Cadastro 3 (Mídias)
- Endpoints:
  - GET /api/midias?campanha_id=ID
  - POST /api/midias
  - PUT /api/midias/:id
  - DELETE /api/midias/:id
- Explicação: midias.campanha_id referencia campanhas.id; útil para listar todas as mídias associadas a uma campanha.

7) Login no sistema (com botão cadastrar novo usuário)
- Implementado no front: `public/index.html` inclui formulários de login e registro.
- Ao logar, token é salvo em `localStorage` e enviado no header `Authorization` para chamadas protegidas.
- Botão de cadastrar: formulário "Registrar usuário" na mesma página.

8) Perguntas sobre o código de login (respostas prontas)
- Q: Onde o token é salvo no cliente?
  - R: `localStorage.setItem('token', data.token)` no `public/index.html` (script).
- Q: Como o cliente envia o token?
  - R: Fetch inclui header `Authorization: Bearer <token>` no helper `api()`.

9) Entrega na data correta
- Data limite: 06/11 (aceita até 23/11). Explique que o projeto está funcional e foi publicado.
- Para comprovar entrega, inclua print da URL pública no Moodle e um arquivo `readme_de_entrega.txt` com a URL e instruções.

10) Algo a mais (diferenciais)
- Sugestões prontas para apontar na apresentação:
  - UI com Bootstrap para melhor aparência.
  - Export CSV das campanhas (pode ser implementado rápido).
  - Gráficos (Chart.js) mostrando custo vs alcance por campanha.
  - Filtro e pesquisa por campanha.
  - Relatórios por período.

Trechos de código para mostrar na apresentação (sugerido)
- `routes/usuarios.js` -> função `register` e `login` (ilustre bcrypt e jwt).
- `models/db.js` -> como criar pool de conexões (mysql2/promise).
- `routes/campanhas.js` -> INSERT com `req.user.id` (mostra ligação usuário→campanha).
- `public/index.html` -> helper `api()` que injeta token no header.

Comandos úteis (rápido)
- `npm install`
- `npm start`
- Importar DB: `mysql -u root -p < sql/banco.sql`

Boa apresentação! Lembre-se de ensaiar 5-7 minutos explicando o fluxo: login → criar campanha → ver mídias → exportar relatório.

