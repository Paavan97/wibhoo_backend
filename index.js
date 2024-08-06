require('dotenv').config();
const cors = require("cors")
const express = require('express');
const cookieparser = require('cookie-parser')
const connection = require('./config/db')
const router = require('./routes/index')
// const category = require('./routes/Categories')

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieparser());


connection();

app.use("/api",router);
// app.use("/api/categories",category);
const port = process.env.PORT || 3000;


app.listen(port, (err)=>{
    if(err) console.log(err);
    else console.log("server is running of port ", port);
})
// WIBHOO
module.exports = {app};
