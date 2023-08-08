const {securePassword} = require('../config/bcryptConfig')
const Localadmin = require('../models/localadminModel')
const jwt = require('jsonwebtoken')
const Project = require('../models/ProjectModel')
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer')
const Company = require('../models/companyModel')
const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

  
  const otpGenerate = () => {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    return otp;
  };





  const sendVerifyMail = async (name, email) => {
    try {
      const otp = otpGenerate();
      const subOtp = otp.toString();
      await Localadmin.updateOne({ email: email }, { $set: { otp: subOtp } });
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
      const { name, username , email, password, mobile } = req.body;
      const userExists = await Localadmin.findOne({ email: email });
      if (userExists) {
        return res.status(200).send({ message: 'Company email already exists', success: false });
      }
      
      const usernameExists = await Localadmin.findOne({ username : username})
      if (usernameExists){
        return res.status(200).send({ message: 'Company Username already exists', success: false });
      }
  
      const hashedPassword = await securePassword(password);
  
      const user = new Localadmin({
        name: name,
        username: username,
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
      const userOtp = await Localadmin.findOne({ email: req.body.email, otp: req.body.otp });
  
      if (!userOtp) {
        return res.status(200).send({ message: 'Invalid OTP, please check again', success: false });
      }
  
      await Localadmin.updateOne({ email: req.body.email }, { $unset: { otp: 1 }, $set: { isVerified: true } });
  
      res.status(200).send({ message: 'Registration successful', success: true });
    } catch (error) {
        console.log(error)
      res.status(500).send({ message: 'Something went wrong', success: false });
    }
  };

const login = async (req, res) => {
    try {
        const localadmin = await Localadmin.findOne({ email: req.body.email });
        if (!localadmin) {
          return res
            .status(200)
            .send({ message: "Admin does not exist", success: false });
        }
        console.log(req.body.password)
        console.log(localadmin.password)
        const isMatch = await bcrypt.compare(req.body.password, localadmin.password);
    
        if (!isMatch) {
          return res
            .status(200)
            .send({ message: "Password is incorrect", success: false });
        } else {
          const token = jwt.sign({ id: localadmin._id }, process.env.local_Secret, {
            expiresIn: "1d",
          });
          res
            .status(200)
            .send({ message: "Localadmin logged in successfully", success: true, token });
        }
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ message: "error while logging in", success: false, error });
      }
}




const profile = async (req, res) => {
    try {
      console.log(req.body.localId)
        const localadmin = await Localadmin.findById(req.body.localId);
        if (!localadmin) {
          return res
            .status(200)
            .send({ message: "Admin not found", success: false });
        } else {
          res.status(200).send({
            success: true,
            data: {
              name: localadmin.name,
              email: localadmin.email,
              profile: localadmin.profile,
              mobile: localadmin.mobile, 
            },  
            
          });
        }
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error getting admin info", success: false, error });
      }
}

const editprofile = async (req, res) => {
    try {
        const result = await Localadmin.findByIdAndUpdate(req.body.localId, {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
        });
        if (result) {
          res
            .status(200)
            .send({ message: "Admin profile updated successfully", success: true });
        } else {
          res
            .status(200)
            .send({ message: "Admin profile not updated", success: false });
        }
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error getting admin info", success: false, error });
      }
}

const uploadimage = async (req, res) => {
    try {
        const image = req.body.image;
        const imageUpload = await cloudinary.uploader.upload(image, opts)
        await Localadmin.findByIdAndUpdate(req.body.localId , {
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


const addcompanydetails = async (req, res) => {
  try {
    const {
      companyname,
      companyusername,
      companycategories,
      aboutcompany,
      certifications,
      license,
      company
    } = req.body;
    const localadmin = await Localadmin.findById(req.body.localId);
    if (!localadmin) {
      return res.status(404).json({ error: 'Localadmin not found' });
    }
    const companyId = req.body.localId;
    const existingCompany = await Company.findOne({ company: companyId });
    if (existingCompany) { 
      return res.status(200).json({  message : ' Company Details Already Added' , success : false, redirectTo: `/localadmin/showcompany/` });
    } else {
      const company = new Company({
        companyname,
        companycategories,
        companyusername,
        aboutcompany,
        certifications,
        license,
        company : companyId   
      });
      console.log(localadmin.username);
      if (company.companyusername === localadmin.username) {
        const savedcompany = await company.save();
        res.status(201).json({ company: savedcompany,success : true, redirectTo: '/localadmin/showcompany' });
      } else {
        res.status(201).json({ message : 'Company username is Wrong' , success : false})
      }   
    }

  } catch (error) {
    console.error('Error Creating Company Details', error);
    res.status(500).json({ error: 'Error creating Company Details' });
  }
};



const showcompany = async (req, res) => {
  try {
    console.log('START')
    const localId = req.body.localId;
    const localadmin = await Localadmin.findById(localId);

    if (!localadmin) {
      return res.status(404).json({ error: 'Localadmin not found' });
    }

    const company = await Company.findOne({ company: localId });
      console.log(company)

    if ( company === null || company.companyusername !== localadmin.username  ) {
      return res.status(200).json({ redirectTo: '/localadmin/addcompanydetails' });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



 

const addproject = async (req, res) => {
    try {
        
      const image = []
        for(let i=0;i<req.files.length;i++){
          image[i]=req.files[i].filename
      }
       const newproject = new Project({
        name: req.body.name,
        companyname:req.body.companyname,
        companyusername : req.body.companyusername,
        category : req.body.category,
        aboutproject: req.body.aboutproject,
        image: image,
       })
       await newproject.save()
       res.status(200).send({messsage : 'successfully created'})
      } catch (err) {
        console.log(err)
        res.status(400).send({ message: err });
      }
}



const showproject = async (req, res) => {
  try {
    const companyId = req.body.id;
    const projects = await Project.find({ companyname : companyId });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const uploadImage = async (req, res) => {
  try {
  
    const { image } = req.body;
    const newProject = await Project.create({ image });
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports={
    register,
    login,
    profile,
    editprofile,
    uploadimage,
    addproject,
    showproject,
    sendVerifyMail,
    otpVerification,
    addcompanydetails,
    uploadImage,
    showcompany
}