const { securePassword } = require("../config/bcryptConfig");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
          
cloudinary.config({ 
  cloud_name: 'doflo05dy', 
  api_key: '495613638731729', 
  api_secret: 'FvTPQYqeAPuKVin9IhNkUnjJUyI' 
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const otpGenerate = () => {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    return otp;
  };


  const sendResetPasswordEmail = async (email, otp) => {
    try {
      await User.updateOne({ email: email }, { $set: { otp: otp } });
  
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "dortha.collier11@ethereal.email",
          pass: "MxGKCrjdWpurnmWs6v",
        },
      });
  
      const mailOptions = {
        from: 'smtp.ethereal.email',
        to: email,
        subject: 'Password Reset OTP',
        html: `<p>Your password reset OTP is: ${otp}</p>`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log('Password reset email sent', info.response);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.status(404).send({ message: 'User not found', success: false });
      }
  
      const otp = otpGenerate();
      await sendResetPasswordEmail(email, otp);
  
      res.status(200).send({ message: 'Password reset OTP sent successfully', success: true });
    } catch (error) {
      res.status(500).send({ message: 'Something went wrong', success: false });
      console.log(error)
    }
  };
  
  const resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email: email, otp: otp });
  
      if (!user) {
        return res.status(404).send({ message: 'Invalid OTP or User not found', success: false });
      }
  
      // Reset the user's password
      const hashedPassword = await securePassword(newPassword);
      await User.updateOne({ email: email }, { $set: { password: hashedPassword }, $unset: { otp: 1 } });
  
      res.status(200).send({ message: 'Password reset successful', success: true });
    } catch (error) {
      res.status(500).send({ message: 'Something went wrong', success: false });
    }
  };


  
  const sendVerifyMail = async (name, email) => {
    try {
      const otp = otpGenerate();
      const subOtp = otp.toString();
      await User.updateOne({ email: email }, { $set: { otp: subOtp } });
      console.log(subOtp, 'sendle');
  
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "dortha.collier11@ethereal.email",
          pass: "MxGKCrjdWpurnmWs6v",
        },
      });
  
      const mailOptions = {
        from: 'dortha.collier11@ethereal.email',
        to: email,
        subject: 'Verification Mail',
        html: `<p>Hi ${name}, this is your OTP: ${otp}</p>`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log('Email has been sent', info.response);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const register = async (req, res) => {
    try {
      const { name, email, password, mobile } = req.body;
      const userExists = await User.findOne({ email: email });
      if (userExists) {
        return res.status(200).send({ message: 'User already exists', success: false });
      }
  
      const hashedPassword = await securePassword(password);
  
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        mobile: mobile,
      });
  
      await user.save();
      sendVerifyMail(name, email);
      res.status(200).send({ message: 'OTP has been sent', success: true });
    } catch (error) {
      res.status(500).send({ message: 'There was an error while creating the user', error, success: false });
    }
  };
  
  const otpVerification = async (req, res) => {
    try {
      const userOtp = await User.findOne({ email: req.body.email, otp: req.body.otp });
  
      if (!userOtp) {
        return res.status(200).send({ message: 'Invalid OTP, please check again', success: false });
      }
  
      await User.updateOne({ email: req.body.email }, { $unset: { otp: 1 }, $set: { isVerified: true } });
  
      res.status(200).send({ message: 'Registration successful', success: true });
    } catch (error) {
        console.log(error)
      res.status(500).send({ message: 'Something went wrong', success: false });
    }
  };

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res
            .status(200)
            .send({ message: "User does not exist", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res
            .status(200)
            .send({ message: "Password is incorrect", success: false });
        } else {
          const token = jwt.sign({ id: user._id }, process.env.JWT_Secret, {
            expiresIn: "1d",
          });
          res
            .status(200)
            .send({ message: "User logged in successfully", success: true, token });
        }
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ message: "error while logging in", success: false, error });
      }
}

const getuserinfo = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
          return res
            .status(200)
            .send({ message: "User not found", success: false });
        } else {
          res.status(200).send({
            success: true,
            data: {
              name: user.name,
              email: user.email,
              profile: user.profile,
              mobile: user.mobile
            },
          });
        }
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error getting user info", success: false, error });
      }
}

const edituser = async (req , res) => {
    try {
        const result = await User.findByIdAndUpdate(req.body.userId, {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile
        });
        if (result) {
          res
            .status(200)
            .send({ message: "User profile updated successfully", success: true });
        } else {
          res
            .status(200)
            .send({ message: "User profile not updated", success: false });
        }
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error getting user info", success: false, error });
      }
}


const uploadimage = async (req, res) => {
    try {
        const image = req.body.image;
        const imageUpload = await cloudinary.uploader.upload(image, opts)
        await User.findByIdAndUpdate(req.body.userId , {
          profile: imageUpload.secure_url
        })
        res.status(200).send({message: "Profile updated succesfully " , success: true })
      } catch (error) {
        res.status(500).send({
          message: "Error updating profile picture",
          success: false,
          error,
        });
      }
}

module.exports ={
    register,
    login,
    otpVerification,
    resetPassword,
    forgotPassword,
    sendResetPasswordEmail,
    getuserinfo,
    edituser,
    uploadimage,
    

}