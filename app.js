// Configuração do servidor Node.js com Express
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('public'));

// Configuração da conexão com o banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'teste10',
  database: 'eco_consciente',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Converter pool de conexões para usar Promises
const promisePool = pool.promise();

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Rota para a página home
app.get('/home.html', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});

// API para registro de usuários
app.post('/api/usuarios/cadastro', async (req, res) => {
  try {
    const { nome, email, telefone, senha } = req.body;
    
    // Verificar se o email já existe
    const [existingUsers] = await promisePool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    // Hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    
    // Inserir novo usuário
    const [result] = await promisePool.query(
      'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, senhaHash]
    );
    
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// API para login de usuários
app.post('/api/usuarios/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Buscar usuário pelo email
    const [users] = await promisePool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    const usuario = users[0];
    
    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Remover senha do objeto de resposta
    delete usuario.senha;
    
    res.status(200).json({
      message: 'Login realizado com sucesso',
      usuario
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// API para registro de empresas
app.post('/api/empresas/cadastro', async (req, res) => {
  try {
    const { nome, cnpj, nome_contato, email, telefone, senha } = req.body;
    
    // Verificar se o CNPJ ou email já existem
    const [existingCompanies] = await promisePool.query(
      'SELECT * FROM empresas WHERE cnpj = ? OR email = ?',
      [cnpj, email]
    );
    
    if (existingCompanies.length > 0) {
      if (existingCompanies.some(company => company.cnpj === cnpj)) {
        return res.status(400).json({ error: 'CNPJ já cadastrado' });
      } else {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
    }
    
    // Hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    
    // Inserir nova empresa
    const [result] = await promisePool.query(
      'INSERT INTO empresas (nome, cnpj, nome_contato, email, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, cnpj, nome_contato, email, telefone, senhaHash]
    );
    
    res.status(201).json({
      message: 'Empresa cadastrada com sucesso',
      empresaId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao cadastrar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// API para login de empresas
app.post('/api/empresas/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Buscar empresa pelo email
    const [companies] = await promisePool.query('SELECT * FROM empresas WHERE email = ?', [email]);
    
    if (companies.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    const empresa = companies[0];
    
    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, empresa.senha);
    
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Remover senha do objeto de resposta
    delete empresa.senha;
    
    res.status(200).json({
      message: 'Login realizado com sucesso',
      empresa
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
    
    

// API para obter artigos do blog
app.get('/api/artigos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const [rows] = await promisePool.query(
      'SELECT id, titulo, resumo, imagem, autor, data_publicacao FROM artigos WHERE status = "publicado" ORDER BY data_publicacao DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    const [countResult] = await promisePool.query('SELECT COUNT(*) as total FROM artigos WHERE status = "publicado"');
    const totalArtigos = countResult[0].total;
    
    res.status(200).json({
      artigos: rows,
      pagination: {
        total: totalArtigos,
        page,
        limit,
        pages: Math.ceil(totalArtigos / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// API para obter um artigo específico pelo ID
app.get('/api/artigos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    const [rows] = await promisePool.query('SELECT * FROM artigos WHERE id = ? AND status = "publicado"', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Artigo não encontrado' });
    }
    
    const artigo = rows[0];
    
    // Buscar comentários do artigo
    const [comentarios] = await promisePool.query(`
      SELECT c.id, c.comentario, c.data_comentario, u.nome as nome_usuario
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.artigo_id = ?
      ORDER BY c.data_comentario DESC
    `, [id]);
    
    artigo.comentarios = comentarios;
    
    res.status(200).json(artigo);
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});