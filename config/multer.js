  //Multer Config
  const path = require('path')
  const multer = require('multer')
  const storage = multer.diskStorage({
      destination : (req,file,cb) => {
          cb(null,path.join(__dirname, '../public/product_images'))
      },
      filename : (req,file,cb)=>{
          const name = Date.now()+'-'+file.originalname;
          cb(null,name)
      }
  })
  
  
  const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
          if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/webp" 
            
          ) {
            cb(null, true);
          } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg .webp format allowed!"));
          }
        }
  })

module.exports = {
    upload,
};
