#!/usr/bin/env node

const fs = require('fs');
const TODO_FILE = 'todos.txt';

// Function to read todos from the file
function readTodos() {
    try {
        const data = fs.readFileSync(TODO_FILE, 'utf8');
        return data.split('\n').filter(todo => todo.trim() !== '').map(JSON.parse);
    } catch (err) {
        return [];
    }
}

// Function to write todos to the file
function writeTodos(todos) {
    const data = todos.map(todo => JSON.stringify(todo)).join('\n');
    fs.writeFileSync(TODO_FILE, data, 'utf8');
}

// Function to add a new task
function addTask(title, assignee) {
    const todos = readTodos();
    const id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
    const newTodo = {
        id,
        title,
        assignee,
        done: false
    };
    todos.push(newTodo);
    writeTodos(todos);
    console.log('Task added successfully!');
}

// Function to list all tasks
function listTasks() {
    const todos = readTodos();
    if (todos.length === 0) {
        console.log('No tasks found.');
    } else {
        console.log('All Tasks:');
        todos.forEach(todo => {
            console.log(`ID: ${todo.id}, Title: ${todo.title}, Assignee: ${todo.assignee}, Done: ${todo.done ? 'Yes' : 'No'}`);
        });
    }
}

// Get assignee from environment variable or use "Unknown" if not set
const assignee = process.env.TODO_USERNAME || 'Unknown';

// Parse command line arguments
const [command, ...args] = process.argv.slice(2);

// Handle commands
switch (command) {
    case 'add':
        addTask(args.join(' '), assignee);
        break;
    case 'list':
        listTasks();
        break;
    default:
        listTasks();
}