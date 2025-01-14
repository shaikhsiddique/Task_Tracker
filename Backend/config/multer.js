const Multer = require('multer');
const FirebaseStorage = require('multer-firebase-storage');
const fbAdmin = require('firebase-admin');
const serviceCredentials = require('../ecommerce-ab165-firebase-adminsdk-y4bcm-b53ce9ae6e.json');
require('dotenv').config();

const storage = FirebaseStorage({
  bucketName: process.env.FIRE_BASE,
  credentials: fbAdmin.credential.cert(serviceCredentials),
  public: true,
  unique: true,
});


const upload = Multer({ storage }).single('profile'); 
module.exports = upload;