const express = require('express')
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');
const providerRouter = require('./routes/providerRoute');



connectDB()
dotenv.config();
app.use(morgan('dev'))
// app.use(morgan('tiny'))
app.use(express.json());
app.use(cors());

app.use("/provider", providerRouter);
app.use("/admin", adminRouter);
app.use("/", userRouter);

 //CRON// 

const { spawn } = require('child_process');

const deleteExpiredSubscriptionsProcess = spawn('node', ['deleteExpiredSubscriptions.js']);

deleteExpiredSubscriptionsProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

deleteExpiredSubscriptionsProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

deleteExpiredSubscriptionsProcess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
});


const port = process.env.PORT || 4000;
app.listen(port,() => console.log(`server is ranning in port ${port}`) );

