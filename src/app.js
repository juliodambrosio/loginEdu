const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const User = require('./users');
//const { Pool } = require('pg');
//const { prisma } = require('./users');


// Middleware para lidar com dados JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});



app.get('/search', (req, res)=>{
  pool.query('SELECT * FROM Users', (err, result) => {
    if (err) {
      console.error('Erro na consulta:', err);
  
      return;
    }
    else{
      console.log('Resultados da consulta:', result.rows);
      res.send('Results'+ res.rows);
      
    }
  });
  
});


app.post('/add', (req, res) =>{
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password

  const newUser = new User(name, email, password);

  console.log('Dados recebidos:', newUser.name + "; " + newUser.email + "; " + newUser.password);
  res.status(200).json({ mensagem: 'Dados recebidos com sucesso!' });

  try {
      console.log('Enviando para o banco de dados!')
      addUser(newUser)
      

  } catch (error) {
    console.log("Error: " + error)
  }

    
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function addUser(user) {
  try {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password
      }
    });

    console.log('Novo usuário adicionado:');
  }
  catch (error) {
    console.error('Erro ao adicionar usuário:', error);
  }
  finally {
    await prisma.$disconnect();
  }

}
