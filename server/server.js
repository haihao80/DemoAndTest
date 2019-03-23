const path = require('path');
const express = require('express');
const app = express();
const router = require('./router');

app.use(express.static('./app/static'))

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use('/waterfall', router);


const server = app.listen(8081, function() {
  console.log(`server is served on 8081`);
})