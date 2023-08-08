const express = require('express');
const localadminController = require('../Controller/localadminController')
const router = express.Router()
const auth = require('../middlewares/localadminauthMiddleware')
const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination:function(req,file,cb) {
      cb(null,path.join(__dirname,'../client/src/projectimg'))
  },
  filename:function(req,file,cb){
      const name = Date.now()+'-'+file.originalname 
      cb(null,name)
  }
})
const upload = multer({storage:storage})
          
cloudinary.config({ 
  cloud_name: 'doflo05dy', 
  api_key: '495613638731729', 
  api_secret: 'FvTPQYqeAPuKVin9IhNkUnjJUyI' 
});



  router.post('/register', localadminController.register);

  router.post('/otpVerification',localadminController.otpVerification)

  router.post("/login", localadminController.login);
  
  router.post("/profile", auth, localadminController.profile);
  
  router.post("/editprofile", auth, localadminController.editprofile);
  
  router.post("/uploadImage", auth, localadminController.uploadimage);

  router.post('/addproject', upload.array('image',3) ,localadminController.addproject);

  router.get('/projects', localadminController.showproject);

  router.post('/uploadImage', localadminController.uploadImage);

  router.post('/addcompanydetails',auth,localadminController.addcompanydetails)
  
  router.post('/showcompany',auth, localadminController.showcompany);
  
  module.exports = router;
  
  





