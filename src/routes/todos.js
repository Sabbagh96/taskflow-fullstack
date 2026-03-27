const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const mongoose = require("mongoose");

const {body , param, validationResult} = require("express-validator");

const validateTodo = [
    body('title').trim().notEmpty().withMessage("Title is required"),
    body('completed').optional().isBoolean(),
]
const {
  getTodos,
  getTodoByID,
  updateTodo,
  createTodo,
  deleteTodo,
} = require("../controllers/todo.Controller");

router.get("/todos", getTodos);

router.get("/todos/:id",getTodoByID );

router.put("/todos/:id", updateTodo);

router.post("/todos",validateTodo, createTodo );

router.delete("/todos/:id", deleteTodo)


module.exports = router;
