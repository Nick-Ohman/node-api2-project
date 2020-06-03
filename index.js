const express = require('express');

const server = express();
server.use(express.json())

const PostRouter = require('./PostRouter')

server.get('/', (req, res) => {
    res.send(
    `<h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>`
  )
})

server.use('/api/posts', PostRouter);


server.listen(5001, () => {
    console.log('\n*** Server Running on http://localhost:5001 ***\n');
  });