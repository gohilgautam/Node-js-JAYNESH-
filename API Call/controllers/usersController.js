const usersModel = require("../models/usersModel");

const fetchUser = async (req, res) => {
  try {
    const usersData = await usersModel.find({});

    if (usersData) {
      res
        .status(200)
        .json({ msg: "Users records found...", records: usersData });
    } else {
      res.status(200).json({ msg: "Users records not found..." });
    }
  } catch (e) {
    res.status(400).json({ msg: "Something Wrong", err: e });
  }
};

const insertUser = async (req, res) => {
  console.log(req.body);

  try {
    const addUser = await usersModel.create(req.body);

    if (addUser) {
      res
        .status(201)
        .json({ insert: true, msg: "User Inserted Successfully...." });
    } else {
      res.status(400).json({ insert: false, msg: "User Insertion Failed...." });
    }
  } catch (e) {
    res.status(400).json({ msg: "Something Wrong", err: e });
  }
};

//Delete User

const deleteUser = async(req, res) => {
  console.log(req.params.id)

  try{
    const deletedata = await usersModel.findByIdAndDelete(req.params.id );

    if(deleteUser){
      res
        .status(200)
        .json({ deleteData: true, msg: "User deleted Successfully...." });
    }else{
      res.status(200).json({ deleteData: false, msg: "User deletion Failed...." });
    }
  } 
  catch(e){
    res.status(400).json({ msg: "Something Wrong", err: e });
  }
}

//Update User

const updateUsers = async(req, res) => {
  console.log(req.params.id)

  try{
    const UpadateData = await usersModel.findByIdAndUpdate(req.params.id,req.body );

    if(UpadateData){
      res
        .status(200)
        .json({ UpadateData: true, msg: "User Update Successfully...." });
    }else{
      res.status(200).json({ UpadateData: false, msg: "User Updation Failed...." });
    }
  } 
  catch(e){
    res.status(400).json({ msg: "Something Wrong", err: e });
  }
}

module.exports = {
  fetchUser,
  insertUser,
  deleteUser,
  updateUsers,
};