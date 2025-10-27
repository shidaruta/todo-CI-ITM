const cors = require('cors');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is working' });
});