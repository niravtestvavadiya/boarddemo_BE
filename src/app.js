import cors from 'cors';
import express from 'express';
import { error as errHandler } from './helpers/response.js';
import routes from './routes/index.js';

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use('/api/v1', routes);

// 404 handler
app.use((req, res) => errHandler(res, 404, 'Not Found'));

app.use((err, req, res, next) => errHandler(res, 500, 'Server Error', err.message));

export default app;
