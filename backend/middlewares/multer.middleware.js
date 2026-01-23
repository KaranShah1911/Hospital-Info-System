// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, file.originalname)
//     }
//   })
  
// export const upload = multer({ 
//     storage, 
// })


const multer = require("multer");
const fs = require("fs");
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const basePath = path.resolve("public/uploads");
    const folderName = req.user ? req.user._id.toString() : "guest"; // make new folder for each user
    const uploadPath = path.join(basePath, folderName);

    // create if not exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

module.exports = upload