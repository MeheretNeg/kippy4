import express from 'express';
import cors from 'cors';
import { absencesRouter } from './routes/absences.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS with specific options
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add headers for Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
  );
  next();
});

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Kippy4 API Server is running!' });
});
app.use('/api/absences', absencesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
