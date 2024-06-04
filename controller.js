const taskmodel = require('./loginmodel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const createlogin = async function (req, res) {
  try {
    let data = req.body
    let { firstname, description, email, password, role } = data;

    let emailCheck = await taskmodel.findOne({ email: email });
    if (emailCheck) return res.status(400).send({ status: false, message: "email already exist" });

    //passowrd bcrypt
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    let obj = { firstname, description, email, password: hashPassword, role };
    let result = await taskmodel.create(obj);
    return res.status(201).send({ status: true, message: 'task created successfully', data: result });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const loginTask = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;
    let getTask = await taskmodel.findOne({ email });
    if (!getTask) return res.status(404).send({ status: false, msg: "User not found or Email Id is invalid" });

    let matchPassword = await bcrypt.compare(password, getTask.password);
    if (!matchPassword) return res.status(401).send({ status: false, msg: "Password is incorrect." });
    let token = jwt.sign(
      {
        taskId: getTask._id,
        role: getTask.role,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      }, "manu@07")

    res.setHeader('authorization', 'Bearer' + token);
    return res.status(200).send({ status: true, message: "task login sucessful", data: { taskId: getTask._id, token: token }, });

  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: false, message: "Error", error: err.message });
  }
};


const getTaskProfile = async function (req, res) {
  try {
    const taskId = req.params.taskId;
    const tokentaskId = req.decodeToken.taskId;
    let perPage = 10;
    let page = req.query.page || 1;

    const taskProfile = await taskmodel.findById({ _id: taskId }).skip((perPage * page) - perPage)
      .limit(perPage)
      .exec()
    if (!taskProfile) {
      return res.status(404).send({ status: false, message: "User doesn't exits" });
    }
    if (tokentaskId !== taskProfile._id.toString()) {
      return res.status(403).send({ status: false, message: "Unauthorized access" });
    }
    return res.status(200).send({ status: true, message: "Success", data: taskProfile, page });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateprofile = async function (req, res) {
  try {
    let data = req.body;
    let taskId = req.params.taskId;
    let { firstname, description, email, password } = data;
    let taskProfile = await taskmodel.findOne({ _id: taskId });
    if (!taskProfile) return res.status(404).send({ status: false, message: "No user found" });
    let tokentaskId = req.decodeToken.taskId;
    if (taskProfile._id.toString() !== tokentaskId)
      return res.status(403).send({ status: false, message: "Unauthorized access" });

    taskProfile.firstname = firstname;
    taskProfile.description = description;
    taskProfile.email = email;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    taskProfile.password = hashPassword;

    await taskProfile.save();
    res.status(200).send({ status: true, message: "task profile updated", data: taskProfile });

  } catch (err) {
    return res.status(500).send({ status: false, err: err.message });
  }
};

const deleteTaskByid = async function (req, res) {
  try {
    const taskId = req.params.taskId;
    const tokenTaskId = req.decodeToken.taskId;

    const taskProfile = await taskmodel.findById({ _id: taskId });
    if (!taskProfile) {
      return res.status(404).send({ status: false, message: "Task doesn't exist" });
    }
    if (tokenTaskId !== taskProfile._id.toString()) {
      return res.status(403).send({ status: false, message: "Unauthorized access" });
    }

    await taskmodel.findByIdAndDelete({ _id: taskId });
    return res.status(200).send({ status: true, message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = { createlogin, loginTask, getTaskProfile, updateprofile, deleteTaskByid }