import bodyParser from 'body-parser';
import config from 'config';
import express from 'express';
import { NotFound } from 'throw.js';

import routes from './routes';

const app = express();
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({ extended: false }));

// Apply config to each request for convenience
app.use((req, res, next) => {
  req.config = config;
  next();
});

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new NotFound());
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.statusCode >= 500) {
    console.error(err);
  }

  res.status(err.statusCode).json({
    status: err.statusCode,
    error: err.name,
    message: err.message,
  });
});

export default app;
