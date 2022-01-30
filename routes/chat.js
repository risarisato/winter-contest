// router index.js はトップページ
// この2行は決まった書き方、expressを読込み、使うぐらいの意味
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  // 表示はhttp://localhost:8000/chat
  res.render('chat');
});


router.get('/word', function(req, res) {
  // 表示はこれhttp://localhost:8000/chat/word
  res.send("asdasdfadf../client.html文字表示OKです");
});


module.exports = router;