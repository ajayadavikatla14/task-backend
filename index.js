require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const jwt=require('jsonwebtoken');
const mysql=require('mysql');
const bcrypt=require('bcrypt');


const db=mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'1234',
    database:'task',
})

//middlewares
app.use(express.json());
app.use(cors());

app.get('/api/register',(req,res)=>{
    res.send("welcome");
})

app.post('/api/register',(req,res)=>{
      const  name=req.body.name;
      const  email=req.body.email;
      const  phone=req.body.phone;
      const  pwd=req.body.pwd;
      const  pwd2=req.body.pwd2;
        db.query("insert into userdata(name,email,phone,pwd,pwd2) values(?,?,?,?,?)",[name,email,phone,pwd,pwd2],
        (err,data)=>{
            if(err){
                console.log((err));
            }else{
                console.log("succedd");
                res.send({status:'success'});
            }
        }
        )
})


app.get('/api/login',(req,res)=>{
    const email=req.body.email;
    const pwd=req.body.pwd;
    db.query("select * from userdata",
    (err,data)=>{
        if(err){
            console.log(err);
        }
            if(data.length > 0){
                bcrypt.compare(pwd,data[0].pwd,(err,re)=>{
                    const id=data[0].id;
                    const token=jwt.sign({id},"jwtSecret",{
                        expiresIn:600,
                    })
                    // req.session.email=data;
                    res.send({auth:true,token:token,data:data})
                })
                
            }else{
                res.send({message:'user doesnt exist'})
            }
        
    })

    
})

const verifyJwt=(req,res,next)=>{
    const token=req.headers["x-access-token"]
    if(!token){
        res.send("come on you need to be authenticated");
    }else{
        jwt.verify(token,"jwtSecret",
        (err,decoded)=>{
            if(err){
                res.send({auth:false,message:'dont fake .. you need to be authenticated'})
            }else{
                req.useId=decoded.id;
                next();
            }
        }
        )
    }
}


app.get('/api/dashboard',verifyJwt,(rer,res)=>{
    res.send('---good youre a authorized user ---')
})











const port=process.env.PORT || 1200;
app.listen(port,()=>{
    console.log(`server listening at  ${port} `);
})





