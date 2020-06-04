require('dotenv').config();
const express = require('express');

const server = express();
server.use(express.json())

const PostRouter = require('./PostRouter')
const port =  process.env.PORT || 5001;
server.get('/', (req, res) => {
    res.send(
    `<h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>`
  )
})

server.use('/api/posts', PostRouter);


server.listen(port, () => {
    console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
  });