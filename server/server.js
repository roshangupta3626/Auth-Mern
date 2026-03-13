import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigin = process.env.CLIENT_URL?.replace(/\/$/, '');
    if (!origin || origin.replace(/\/$/, '') === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.get('/', (req, res) => res.send('API is running... fine Roshan Gupta'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));