import express from 'express';

const app = express();

const port = 8000;

app.use('/', (req, res) => {
    res.send('Hello from Express server!');
});

app.listen(port, () => {
    console.log("Server is running at http://localhost:" + port);
});


