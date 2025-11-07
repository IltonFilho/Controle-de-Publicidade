# Controle de Publicidade (Node.js + Express + MySQL)

Projeto pronto para a 2ª Avaliação de DAC (APS).

## Instalação local
1. Copie `.env.example` para `.env` e preencha as credenciais do banco.
2. Crie o banco: `mysql -u root -p < sql/banco.sql` (ou via phpMyAdmin).
3. Instale dependências: `npm install`
4. Inicie: `npm start`
5. Acesse: `http://localhost:3000/`

## Deploy rápido
- **Render**: criar novo Web Service usando Node, configurar variáveis de ambiente conforme `.env.example`.
- **Hostinger**: é necessário plano com suporte a Node.js/SSH ou usar um host que suporte Node.

## Endpoints principais
- `POST /api/usuarios/register` {nome,email,senha}
- `POST /api/usuarios/login` {email,senha} -> {token}
- `GET /api/usuarios` (precisa Authorization: Bearer TOKEN)
- `GET /api/campanhas` (precisa token)
- `POST /api/campanhas` (precisa token)
- `GET /api/midias?campanha_id=1` (precisa token)
- etc.

## Explicação curta para apresentação
- Backend: Express + MySQL (mysql2/promise).
- Autenticação: JWT (token no localStorage), rotas protegidas por middleware.
- CRUDs: Usuários, Campanhas, Mídias.
- Banco: relaçõess: campanhas.usuario_id -> usuarios.id; midias.campanha_id -> campanhas.id.

