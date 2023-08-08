// adminController.js


const Localadmin = require('../models/localadminModel')
const { securePassword } = require("../config/bcryptConfig");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const adminEmail = "admin@gmail.com";
const adminPassword = "123";

const adminLogin = (req, res) => {
  if (req.body.email === adminEmail && req.body.password === adminPassword) {
    const admin_Secret = jwt.sign({ id: "thisIsAdmin" }, process.env.admin_Secret, {
      expiresIn: "1d",
    });
    res.status(200).send({
      message: "Admin logged in successfully",
      success: true,
      admin_Secret,
    });
  } else {
    res.status(200).send({ message: "Username or password is incorrect", success: false });
  }
};

const getUsersList = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send({ message: "Users fetched successfully", success: true, users });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong on the server side" });
    }
  };

  const getLocaladminList = async (req , res ) => {
    try {
        const localadmin = await Localadmin.find();
        res
          .status(200)
          .send({ message: "Admins fetched successsfully", success: true, localadmin });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong on server side" });
      }
  }

  const checkblock = async ( req , res ) => {
    try {
        const admin = await Localadmin.findById(req.body.id);
    
        if (!admin) {
          return res.status(200).send({ message: "Admin not found", success: false });
        }
    
        admin.isBlocked = !admin.isBlocked; // Toggle the blocked status
    
        await admin.save();
    
        return res.status(200).send({
          message: `Admin ${admin.isBlocked ? 'blocked' : 'unblocked'} successfully`,
          success: true
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side error", success: false });
      }
  }

  const blockUserById = async (req, res) => {
    try {
      const userId = req.body.id;
      const data = await User.findByIdAndUpdate(userId, { status: 'blocked' }, { new: true });
  
      if (data) {
        res.status(200).send({ message: "User blocked successfully", success: true });
      } else {
        res.status(200).send({ message: "User not found", success: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server side error", success: false });
    }
  };

  const getUserData = async (req, res) => {
    try {
        const data = await User.findOne({ _id: req.body.id });
        if (data) {
          res
            .status(200)
            .send({
              message: "User data fetched successfully",
              success: true,
              data,
            });
        } else {
          res.status(200).send({ message: "User not found", success: false });
        }
      } catch (error) {
        res.status(500).send({ message: "Server Side Error", success: false });
      }
  }

  const editUserinfo = async (req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.body.id, {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile
        });
        if(data){
          res.status(200).send({message: "User updated succesfully" , success: true})
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "server side error", success: false });
      }
  }

  const addUser = async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
          return res
            .status(200)
            .send({ message: "User already exist", success: false });
        }
        const hashedPassword = await securePassword(req.body.password);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
        await user.save();
        res
          .status(200)
          .send({ message: "User created successfully", success: true });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "server side error", success: false });
      }
  }

module.exports = {
  adminLogin,
  getUsersList,
  getLocaladminList,
  checkblock,
  blockUserById,
  getUserData,
  editUserinfo,
  addUser


};
