require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT;

const cors = require('cors');

const todosRoutes = require('./routes/todos');



mongoose.connect(process.env.MONGODB_URI)
.then(() =>console.log("MongoDB connected"))
.catch((err)=> console.log(err));

app.use(express.json());
app.use(cors());

app.use('/api',todosRoutes);


//logger
app.use((req,res, next)=>{
    console.log(`${req.method} ${req.url}`);
    next();
});




app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});


