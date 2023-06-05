const express = require('express')
const app = express()
const bcrpt = require('bcrypt')
const { use } = require('bcrypt/promises')

app.use(express.json())

// use db to store , for example using an array
const users = []


app.get('/users',(req,res)=>{
    res.json(users)
})

//storing hash(salt +  password)
app.post('/users',async (req,res)=>{
    try{
        // generating salt
        const salt = await bcrpt.genSalt()
        // salt hashing the password
        const hashedPassword = await bcrpt.hash(req.body.password,salt)
        // creating object with name and hashed password to store in db
        const user = {name:req.body.name,password:hashedPassword}
        users.push(user)

        res.status(201).send()

    }catch(err){
        res.status(500).send()
    }
})


// trying to login
app.post('/users/login',async (req,res)=>{
    // finding the user
    const user = users.find(user => user.name == req.body.name)

    // if user does not exists
    if(user == null)return res.status(400).send('Cannot find user')

            // if exists ,comparing it with stored salted hash 
        try{
            // returns boolean
           if(await bcrpt.compare(req.body.password,user.password)){
            res.status(200).send('Success ')
            }else{
            res.status(403).send('Error')
           }

         }catch{
        res.status(500).send()
        }

}) 

app.listen(3000)