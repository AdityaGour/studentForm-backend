const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors')
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'});

const students = require('./models/studentSchema');

const app = express();

app.use(express.static('public'));
app.use(function (req, res, next) {
    // res.header('Access-Control-Allow-Origin', 'http://3.9.177.87');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,enviroment,x-access-token,apikey');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    process.env.NODE_ENV = 'development';
    next();
  });

//   app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
//   });
// app.use(cors());

app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());





  // Connect to MongoDB database
  mongoose.connect('mongodb://localhost:27017/addWebStudents',  { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('....................... ERROR CONNECT TO DATABASE');
    console.log(err);
  } else {
    console.log('....................... CONNECTED TO DATABASE');
  }
})



app.get('/api' , async(req,res) => {
    const allStudents =  await students.find();
    // console.log('allStudents' + JSON.stringify(allStudents));
    //   res.send(allStudents);
    console.log('allStudents' + allStudents)
    res.send(allStudents)
    // res.json({
    //     message:'Welcome'
    // })
})

app.post('/api/details',verifyTokens,(req,res) => {
    jwt.verify(req.token,'screatKey',(error,userData) =>{
        if(error){
            res.sendStatus(403);
        
        } else{
            res.json({message:'Posts Created...',
            userData
        });
        }

    })
    
})

app.post('/api/auth/login' ,async (req,res) => {
    console.log(req.body);
    const user = await students.findOne({ email: req.body.email });
    console.log('userdetails' + user)
    if(!user){
        res.sendStatus(401)
    } else{
       await bcrypt.compare(req.body.password, user.password);
       jwt.sign({user:user}, 'screatKey',{expiresIn: '5m'}, async(err,token) => {
        res.send({user,token})
    })
    }
})


app.post('/api/auth/register',(req,res) => {
    console.log(req.body);
    const user = new students( {
        uid: req.body.uid,
        firstName :req.body.firstName,
        lastName :req.body.lastName,
        fatherName :req.body.fatherName,
        dob :req.body.dob,
        email:req.body.email,
        password:req.body.password,
        gender:req.body.gender,
        country:req.body.country,
        address:req.body.address,
        role:'user'
    })
    jwt.sign({user:user}, 'screatKey',{expiresIn: '5m'}, async(err,token) => {
        await user.save();
        res.send({user,token})
    })
})

app.get('/api/allstudents', async(req,res) => {
    const allStudents =  await students.find();
    res.send(allStudents)
})

app.post('/api/upload',  (req, res) => {
    // console.log('req' + JSON.stringify(req.body) );
    console.log(req.files);
    if(req.files) {
        res.json(req.file);
    }
    else throw 'error';
});

// verifyUser Token 
function verifyTokens(req,res,next){
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.send(403);
    }
}

app.listen(5000, () => console.log('server started'))