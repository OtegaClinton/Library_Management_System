require("dotenv").config();
const express = require("express");
require("./config/database");
const bookRouter = require('./routers/bookRouter');
// const keepServerAlive = require("./keepServerAlive");


const PORT = process.env.PORT || 2024;

const app = express();
app.use(express.json());

app.use('/api/v1', bookRouter);


// Call keepServerAlive to keep the server active
// keepServerAlive();


// Test route to check server status
app.get('/1', (req, res) => {
    res.send('Server is alive!');
});

app.listen(PORT,()=>{
    console.log(`server is listening to PORT:${PORT}.`)
})