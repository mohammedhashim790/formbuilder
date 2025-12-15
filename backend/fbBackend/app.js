require('dotenv').config();
const express = require('express');
const cors = require('cors');

const formsRouter = require('./routes/forms');
const assetsRouter = require('./routes/assets');
const rulesRouter = require('./routes/rules');
const recordsRouter = require('./routes/records');

const authRouter = require('./routes/auth');

const authMiddleware = require('./middleware/auth');
const {auth} = require("./auth/auth");

const app = express();

app.use(express.json());

app.use(cors());


app.use((req, res, next) => auth(req, res, next))


app.use('/auth', authRouter);
app.get('/health', (_req, res) => res.json({status: 'ok'}));

app.use(authMiddleware);


app.use('/forms', formsRouter);
app.use('/assets', assetsRouter);
app.use('/rules', rulesRouter);
app.use('/record', recordsRouter);


app.get('/health', (_req, res) => {
    res.json({status: 'ok'});
});

// Error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});

module.exports = app;
