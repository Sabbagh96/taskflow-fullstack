const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title:{
        type: String,
        // required: [ true, "Title is required" ],
        // minlength: [ 3, "Title must be at least 3 characters long" ],
        // trim: true
    },
    completed :{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

const Todo = mongoose.model('Todo',todoSchema);
module.exports = Todo;