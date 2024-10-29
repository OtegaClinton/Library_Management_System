require("dotenv").config();
const mongoose = require("mongoose");
const URI = process.env.DATABASE_URI;

mongoose.connect(URI)
.then(()=>{
    console.log(`Database connected successfully.`)
})
.catch((error)=>{
    console.log(`Database connection Failed`,error)
});