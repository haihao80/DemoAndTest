const express = require('express');
const router = express.Router();

router.get('/:num', function(req, res) {
  let num = req.params.num;
  let data = [];
  for(let i=0; i<20; i++) {
    data.push(`/static/images-waterfall/${i+20*num}.jpg`);
  }
  res.json({data: data});
})

module.exports = router;