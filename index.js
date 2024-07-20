require('dotenv').config();
const express = require('express');
const cookieparser = require('cookie-parser')
const connection = require('./config/db')
const router = require('./routes/User')

const app = express();

// app.use(cors())
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieparser());


connection();

app.use("/api",router);
const port = process.env.PORT || 3000;


app.listen(port, (err)=>{
    if(err) console.log(err);
    else console.log("server is running of port ", port);
})
// WIBHOO