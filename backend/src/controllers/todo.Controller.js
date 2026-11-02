const Todo = require("../models/Todo");
const mongoose = require("mongoose");
const {body , param, validationResult} = require("express-validator");


const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
  }
}

const getTodoByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.log(error);
  }
}

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updates = {};
    if (title !== undefined)
      updates.title = typeof title === "string" ? title.trim() : title;
    if (completed !== undefined) updates.completed = completed === true;

    const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.log(error);
  }
}

const createTodo = async (req, res) => {
  try {
    const { title, completed } = req.body;

    // if (!title || typeof title !== "string" || !title.trim()) {
    //   return res
    //     .status(400)
    //     .json({ message: "Title is required and must be a non-empty string" });
    // }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todo = new Todo({
      title: title.trim(),
      completed: completed === true,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

const deleteTodo = async (req,res) =>{
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid ID"});
        }

        const todo = await Todo.findByIdAndDelete(id);
        if(!todo){
            return res.status(404).json({message: "Todo not found"});
        }

        res.status(204).json({message: "Todo deleted successfully"});
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    getTodos,
    getTodoByID,
    updateTodo,
    createTodo,
    deleteTodo    
}