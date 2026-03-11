 
const multer = require('multer');//specifies how to handle the files
const path = require('path');//is a tool to help the file names
const fs = require('fs');//file system allows to create the folders in my computer
const { v4: uuid } = require('uuid');//to generate the unique id for file name
 
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
 
//it tells the multer where to put the file and what to call
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = uuid();
        cb(null, uniqueName + path.extname(file.originalname));//here the path.extname(file.originalname) will take out the extension form the image path ie like photo.jpg ,this line will take only the jpg
    }
});
 
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});
 
module.exports = upload;
 