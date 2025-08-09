import { createServer } from 'http';
import app from './app.js';

const PORT = process.env.PORT || 10000;
createServer(app).listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});