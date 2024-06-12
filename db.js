const mongoose = require('mongoose');

require('dotenv').config();
// Define Mongodb URL
// const mongoURL = process.env.MONGO_URL_LOCAL;
const mongoURL = process.env.MONGO_URL_GLOBAL;

// Setup Mongodb Connection
mongoose.connect(mongoURL,{
    useNewUrlParser : true,
    useUnifiedTopology:true,
})

// Get the default connection
const db = mongoose.connection;

// Define Event Listeners
db.on('connected',()=>{
    console.log('Connected to MongoDB server')
}) 

db.on('error',(err)=>{
    console.error('MongoDb connection Error',err)
})

db.on('disconnected',()=>{
    console.log('MongoDB server Disconnected')
})

module.exports = db;