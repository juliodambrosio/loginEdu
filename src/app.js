// App Default config
const express = require('express');
const app = express();
const port = 8080;

//.env file
require('dotenv').config();

//Connect to Postgresql
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Crypt User Password
const bcrypt = require("bcrypt");
const saltRounds = 10;

//CORS
const cors = require('cors');

// //Token
const { signToken, isTokenValid } = require('./token/manageToken');

// const jwt = require('jsonwebtoken');
// const tokenConfig = {
//   expiresIn: '1h',
// }

//Apply configuration
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


app.post('/login', async (req, res) => {
  try {
    const loginData = await login(req.body.email, req.body.password);

    if (loginData != false) {
      res.status(200).json({Token: loginData})
      //res.status(200).json({ message: 'User was found!! Your login is approved!!' });
      console.log('User was found!! Your login is approved!!');
      return loginData;
    }
    else {
      res.status(401).json({ message: 'User is incorrect !! Verify your email or passwords!!' });
      console.log('User is incorrect !! Verify your email or passwords!!');
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
 
app.get('/token', async (req, res) =>{
  try {
     const token = await isTokenValid(req,res);
     
  } catch (error) {
    console.log('Error: ' + error);
  }
});

app.post('/search', async (req, res) => {
  try {
    const users = await findUsers(req);
    if (users != null) {
      res.status(200).json({ message: 'User was found!! ' });

    }
    else {
      res.status(404).json({ message: 'Not Found!! ' });
    }


  }
  catch (error) {
    console.log("Error: " + error)
    res.status(500).json({ message: 'Internal Server Error' });
  }



});


app.post('/add', (req, res) => {
  try {
    addUser(req);
    res.status(200).json({ message: 'New User is Added!!' });
  }
  catch (error) {
    console.log("Error: " + error);
  }


});



async function addUser(req) {
  try {
    req.body.password = await cryptpassword(req.body.password);
    await prisma.users.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
    });

  }
  catch (error) {
    console.error('The function addUser() has returned an error: ', error);
  }
  finally {
    await prisma.$disconnect();
  }

}

async function findUsers(req) {
  try {
    const user = await prisma.users.findMany({

    });

    console.log(user)
    return user;
  }
  catch (error) {
    console.log('The function findUsers() has returned an error: ' + error)
  }
  finally {
    await prisma.$disconnect();
  }
}

async function login(user, pass) {
  try {
    const userData = await prisma.users.findUnique({
      where: {
        email: user
      }
    });

    if (userData != null) {
      const isPasswordValid = await comparePasswordHashes(pass, userData.password);
      if (isPasswordValid) {
        return await signToken(userData);
      }
      else {
        return false;
      }

    }
    else {
      return false;
    }

  } catch (error) {
    console.log('The function login() has returned an error: ' + error);
  }

  finally {
    await prisma.$disconnect();
  }

}

async function cryptpassword(pass) {
  try {
    const hashpass = await bcrypt.hash(pass, saltRounds);
    return hashpass;
  } catch (error) {
    console.log('The function cryptpassword() has returned an error: ' + error);
  }

}

async function comparePasswordHashes(pass, hash) {
  try {
    const comparation = await bcrypt.compare(pass, hash);
    return comparation;
  } catch (error) {
    console.log('The function comparePasswordHashes() has returned an error: ' + error);
  }

}

// async function signToken(userData) {
//   try {
//     const token = jwt.sign(userData, process.env.SECRETKEY, tokenConfig);
//     return token;
//   } catch (error) {
//     console.log('Error to generate token: ' + error)
    
//   }
// }