const express = require('express');
const app = express();
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

require('dotenv').config();
const PORT = process.env.PORT

const { jwtMiddleWare, generateToken } = require('./jwt');

app.listen(PORT, () => {
    console.log(`Server is up on port no ${PORT}`);
})

app.get('/', (req, res) => {
    res.send("API IS UP NOW");
})

// Importing Routes
const userRoutes = require('./routes/userRouter');
const candidateRoutes = require('./routes/candidateRouter');
app.use('/user',userRoutes);
app.use('/candidate',jwtMiddleWare,candidateRoutes);

