// router index.js はトップページ
// この2行は決まった書き方、expressを読込み、使うぐらいの意味
var express = require('express');
var router = express.Router();

// indexはトップページアクセスがあったらスラッシュ
// getアクセスを受け付ける書き方でrouter.get
router.get('/', function(req, res, next) {
  // タイトルのオブジェクトで引数の「Express」を表示させる
  res.render('index', { title: 'Express', user: req.user });
});

module.exports = router;
