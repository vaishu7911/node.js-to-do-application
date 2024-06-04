const express = require('express');
const router = express.Router();
const mid1 = require('./mid');
const loginController = require('./controller');
const taskController = require('./taskcontroller')

// Create a new login
router.post('/createtask', loginController.createlogin);
router.post('/login', loginController.loginTask);
router.get('/task/:taskId', mid1.mid1, loginController.getTaskProfile);
router.put('/updatetask/:taskId', mid1.mid1, loginController.updateprofile);
router.delete('/deletetask/:taskId', mid1.mid1, loginController.deleteTaskByid)

// Create a new task
router.post('/tasks', mid1.mid1, taskController.createTask);
router.get('/getAllTask', mid1.mid1, taskController.getAllTask);
router.put('/updatetasks/:taskId', mid1.mid1, taskController.updateTaskById);
router.delete('/deletetasks/:taskId', mid1.mid1, taskController.deleteTask);


module.exports = router;