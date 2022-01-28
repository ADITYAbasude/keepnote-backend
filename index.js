const connectingToMongoose = require('./database');
const express = require('express');
const cors = require('cors')
const router = require('./routes/auth');
connectingToMongoose();

const app = express();

const port = 5000;
app.use(express.json())
app.use(cors())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

