
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRoute from './routes/adminRoute.js';
import userRoute from './routes/userRoute.js'; 
import doctorRoute from './routes/doctorRoute.js';

//app config
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middleware
app.use(cors());
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/user", userRoute);

//api routes
app.get('/', (req, res) => {
  res.send('Welcome to the Backend Server');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
