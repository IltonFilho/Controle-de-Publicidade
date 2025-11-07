const express = require('express');
const router = express.Router();
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'trocasenha_secreta';

function auth(req,res,next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({error:'Sem token'});
  const parts = authHeader.split(' ');
  try{
    req.user = require('jsonwebtoken').verify(parts[1], JWT_SECRET);
    next();
  }catch(e){ return res.status(401).json({error:'Token inválido'}); }
}

// List campanhas
router.get('/', auth, async (req,res)=>{
  try{
    const [rows] = await db.query('SELECT * FROM campanhas ORDER BY data_inicio DESC');
    res.json(rows);
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Create campanha
router.post('/', auth, async (req,res)=>{
  try{
    const {titulo,cliente,custo,alcance,resultado,data_inicio,data_fim} = req.body;
    const [result] = await db.query(
      'INSERT INTO campanhas (titulo,cliente,custo,alcance,resultado,data_inicio,data_fim,usuario_id) VALUES (?,?,?,?,?,?,?,?)',
      [titulo,cliente,custo,alcance,resultado,data_inicio,data_fim, req.user.id]
    );
    res.json({id: result.insertId});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Edit campanha
router.put('/:id', auth, async (req,res)=>{
  try{
    const id = req.params.id;
    const {titulo,cliente,custo,alcance,resultado,data_inicio,data_fim} = req.body;
    await db.query('UPDATE campanhas SET titulo=?,cliente=?,custo=?,alcance=?,resultado=?,data_inicio=?,data_fim=? WHERE id=?',
                  [titulo,cliente,custo,alcance,resultado,data_inicio,data_fim,id]);
    res.json({ok:true});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Delete campanha
router.delete('/:id', auth, async (req,res)=>{
  try{
    const id = req.params.id;
    await db.query('DELETE FROM campanhas WHERE id=?',[id]);
    res.json({ok:true});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

module.exports = router;
