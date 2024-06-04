const Taskmodel = require('./taskmodel');
const redis = require("redis");
const promisify  = require("util");

// const redisClient = redis.createClient(
//     12111,
//     "redis-12111.c264.ap-south-1-1.ec2.cloud.redislabs.com",
//     { no_ready_check: true }
// );
// redisClient.auth("3WdcphRZFG39cn3wZohzc1dpQ1OIe76c", function (err) {
//     if (err) throw err;
// });
// redisClient.on("connect", async function () {
//     console.log("Connected to Redis..");
// });
// const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
// const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const createTask = async function (req, res) {
    try {
        const data = req.body;
        const createdBy = req.decodeToken.userId;
        await Taskmodel.create(data);
        return res.status(201).json({ message: 'Task created successfully', data });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllTask = async function (req, res) {
    try {
        const taskId = req.params.taskId;
        const tokentaskId = req.decodeToken.taskId;
        let perPage = 10;
        let page = req.query.page || 1;
        const taskProfile = await Taskmodel.find().skip((perPage * page) - perPage)
            .limit(perPage)
            .exec()
        if (!taskProfile) {
            return res.status(404).send({ status: false, message: "User doesn't exits" });
        }
        return res.status(200).send({ status: true, message: "Success", data: taskProfile, page });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


const updateTaskById = async function (req, res) {
    try {
        let data = req.body;
        let taskId = req.params.taskId;
        let { title, description, completed } = data;
        let taskProfile = await Taskmodel.findOne({ _id: taskId });
        if (!taskProfile) return res.status(404).send({ status: false, message: "No user found" });
        if (req.decodeToken.role !== "admin") {
            return res.status(403).send({ status: false, message: "Unauthorized access" });
        }
        taskProfile.title = title;
        taskProfile.description = description;
        taskProfile.completed = completed;
        const savedata = await taskProfile.save();
        res.status(200).send({ status: true, message: "task profile updated", data: savedata });

    } catch (err) {
        return res.status(500).send({ status: false, err: err.message });
    }
};

const deleteTask = async function (req, res) {
    try {
        const taskId = req.params.taskId;
        const task = await Taskmodel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (req.decodeToken.role !== "admin") {
            return res.status(403).send({ status: false, message: "Unauthorized access" });
        }
        await Taskmodel.findByIdAndDelete(taskId);
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createTask, getAllTask, updateTaskById, deleteTask };