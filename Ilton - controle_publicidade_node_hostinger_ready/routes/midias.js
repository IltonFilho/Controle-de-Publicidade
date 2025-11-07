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

// List midias (optionally by campanha)
router.get('/', auth, async (req,res)=>{
  try{
    const campanhaId = req.query.campanha_id;
    let q = 'SELECT * FROM midias';
    const params = [];
    if(campanhaId){ q += ' WHERE campanha_id = ?'; params.push(campanhaId); }
    const [rows] = await db.query(q, params);
    res.json(rows);
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Create midia
router.post('/', auth, async (req,res)=>{
  try{
    const {nome_midia,tipo,orcamento,campanha_id} = req.body;
    const [result] = await db.query('INSERT INTO midias (nome_midia,tipo,orcamento,campanha_id) VALUES (?,?,?,?)',
                                  [nome_midia,tipo,orcamento,campanha_id]);
    res.json({id: result.insertId});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Edit midia
router.put('/:id', auth, async (req,res)=>{
  try{
    const id = req.params.id;
    const {nome_midia,tipo,orcamento,campanha_id} = req.body;
    await db.query('UPDATE midias SET nome_midia=?,tipo=?,orcamento=?,campanha_id=? WHERE id=?',
                  [nome_midia,tipo,orcamento,campanha_id,id]);
    res.json({ok:true});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

// Delete midia
router.delete('/:id', auth, async (req,res)=>{
  try{
    const id = req.params.id;
    await db.query('DELETE FROM midias WHERE id=?',[id]);
    res.json({ok:true});
  }catch(err){ console.error(err); res.status(500).json({error:'Erro no servidor'}); }
});

module.exports = router;
