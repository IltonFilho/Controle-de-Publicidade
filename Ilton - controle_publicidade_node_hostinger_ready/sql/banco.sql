-- banco.sql
CREATE DATABASE IF NOT EXISTS controle_publicidade CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE controle_publicidade;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campanhas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  cliente VARCHAR(150),
  custo DECIMAL(10,2) DEFAULT 0,
  alcance INT DEFAULT 0,
  resultado TEXT,
  data_inicio DATE,
  data_fim DATE,
  usuario_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS midias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_midia VARCHAR(150) NOT NULL,
  tipo VARCHAR(100),
  orcamento DECIMAL(10,2) DEFAULT 0,
  campanha_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campanha_id) REFERENCES campanhas(id) ON DELETE CASCADE
);

-- dados de exemplo
INSERT INTO usuarios (nome,email,senha_hash) VALUES
('Professor','prof@exemplo.com','$2b$10$CwTycUXWue0Thq9StjUM0uJ8z1Gq3Qf3Y8bWv1k6Zz0Yl4E/0YbK'); -- senha qualquer hashed

INSERT INTO campanhas (titulo,cliente,custo,alcance,resultado,data_inicio,data_fim,usuario_id) VALUES
('Campanha Lançamento','Cliente A',1500.00,20000,'Ótimo desempenho','2025-09-01','2025-09-30',1);

INSERT INTO midias (nome_midia,tipo,orcamento,campanha_id) VALUES
('Facebook Ads','Social',800.00,1),
('Instagram Ads','Social',700.00,1);
