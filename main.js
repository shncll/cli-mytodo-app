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
function listTasks(doneOnly = false, undoneOnly = false) {
    const todos = readTodos();
    let filteredTodos = todos;
    if (doneOnly) {
        filteredTodos = todos.filter(todo => todo.done);
    } else if (undoneOnly) {
        filteredTodos = todos.filter(todo => !todo.done);
    }

    if (filteredTodos.length === 0) {
        console.log('No tasks found.');
    } else {
        let status = 'All';
        if (doneOnly) status = 'Done';
        else if (undoneOnly) status = 'Undone';

        console.log(`${status} Tasks:`);
        filteredTodos.forEach(todo => {
            console.log(`ID: ${todo.id}, Title: ${todo.title}, Assignee: ${todo.assignee}, Done: ${todo.done ? 'Yes' : 'No'}`);
        });
    }
}

// Function to mark a task as done
function markTaskAsDone(id) {
    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex === -1) {
        console.log('Task not found.');
    } else {
        todos[todoIndex].done = true;
        writeTodos(todos);
        console.log('Task marked as done.');
    }
}

// Function to mark a task as undone
function markTaskAsUndone(id) {
    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex === -1) {
        console.log('Task not found.');
    } else {
        todos[todoIndex].done = false;
        writeTodos(todos);
        console.log('Task marked as undone.');
    }
}

// Function to delete a task
function deleteTask(id) {
    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex === -1) {
        console.log('Task not found.');
    } else {
        todos.splice(todoIndex, 1);
        writeTodos(todos);
        console.log('Task deleted successfully.');
    }
}

// Function to update a task
function updateTask(id, title) {
    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex === -1) {
        console.log('Task not found.');
    } else {
        todos[todoIndex].title = title;
        writeTodos(todos);
        console.log('Task updated successfully.');
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
        if (args.includes('--done')) {
            listTasks(true);
        } else if (args.includes('--undone')) {
            listTasks(false, true);
        } else {
            listTasks();
        }
        break;
    case 'done':
        markTaskAsDone(args[0]);
        break;
    case 'undone':
        markTaskAsUndone(args[0]);
        break;
    case 'delete':
        deleteTask(args[0]);
        break;
    case 'update':
        updateTask(args[0], args.slice(1).join(' '));
        break;
    default:
        listTasks();
}