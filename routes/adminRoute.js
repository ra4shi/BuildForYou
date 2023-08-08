const express = require("express");
const router = express.Router();

const adminController =require('../Controller/adminController')
const auth = require('../middlewares/adminauthMiddleware')


router.post('/admin-login', adminController.adminLogin);

//get users list
router.post('/users-list', adminController.getUsersList);

//get admin list
router.post("/localadmin-list",auth,adminController.getLocaladminList)

//blocK admin by id
router.post("/block-unblock-admin", auth , adminController.checkblock)
 



//delete user by id

router.post('/block-localadmin-by-id', auth , adminController.blockUserById);

//get user data
router.post("/get-user-data", auth , adminController.getUserData)

//edit user info
router.post("/edit-user-info",auth , adminController.editUserinfo)

//add new user
router.post("/add-user", auth , adminController.addUser)  

module.exports = router;
