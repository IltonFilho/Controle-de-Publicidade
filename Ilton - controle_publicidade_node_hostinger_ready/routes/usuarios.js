const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'trocasenha_secreta';

// Create user (register)
router.post('/register', async (req,res)=>{
  try{
    const {nome,email,senha} = req.body;
    if(!nome||!email||!senha) return res.status(400).json({error:'Dados incompletos'});
    const [exists] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if(exists.length) return res.status(400).json({error:'Email já cadastrado'});
    const hash = await bcrypt.hash(senha, 10);
    const [result] = await db.query('INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)',[nome,email,hash]);
    res.json({id: result.insertId, nome, email});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Login
router.post('/login', async (req,res)=>{
  try{
    const {email,senha} = req.body;
    if(!email||!senha) return res.status(400).json({error:'Dados incompletos'});
    const [rows] = await db.query('SELECT id,nome,email,senha_hash FROM usuarios WHERE email = ?', [email]);
    if(!rows.length) return res.status(400).json({error:'Usuário não encontrado'});
    const user = rows[0];
    const ok = await bcrypt.compare(senha, user.senha_hash);
    if(!ok) return res.status(400).json({error:'Senha incorreta'});
    const token = jwt.sign({id:user.id,nome:user.nome,email:user.email}, JWT_SECRET, {expiresIn:'8h'});
    res.json({token});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Middleware to protect routes
function auth(req,res,next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({error:'Sem token'});
  const parts = authHeader.split(' ');
  if(parts.length !== 2) return res.status(401).json({error:'Token inválido'});
  const token = parts[1];
  try{
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  }catch(e){
    return res.status(401).json({error:'Token inválido ou expirado'});
  }
}

// List users (protected)
router.get('/', auth, async (req,res)=>{
  try{
    const [rows] = await db.query('SELECT id,nome,email,created_at FROM usuarios');
    res.json(rows);
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Edit user (protected)
router.put('/:id', auth, async (req,res)=>{
  try{
    const id = req.params.id;
    const {nome,email,senha} = req.body;
    if(senha){
      const hash = await bcrypt.hash(senha,10);
      await db.query('UPDATE usuarios SET nome=?,email=?,senha_hash=? WHERE id=?',[nome,email,hash,id]);
    } else {
      await db.query('UPDATE usuarios SET nome=?,email=? WHERE id=?',[nome,email,id]);
    }
    res.json({ok:true});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Delete user (protected)
router.delete('/:id', auth, async (req,res)=>{
  try{
    const id = req.params.id;
    await db.query('DELETE FROM usuarios WHERE id=?',[id]);
    res.json({ok:true});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

module.exports = router;
