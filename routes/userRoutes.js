const express = require("express");
const userController = require('../Controller/userController')
const router = express.Router();
const auth = require("../middlewares/authMiddleware");



router.post("/register",userController.register)

router.post("/login", userController.login)

router.post('/otpVerification',userController.otpVerification)

router.post('/forgotPassword', userController.forgotPassword);

router.post('/resetPassword', userController.resetPassword);

router.post("/get-user-info-by-id", auth, userController.getuserinfo)

router.post("/edit-user-profile", auth,userController.edituser)

router.post("/uploadImage", auth, userController.uploadimage)



module.exports = router;
