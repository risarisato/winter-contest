'use strict';
// 新しくphotos.jsを作成した
// やり方的にはindex・usersのrouter内をコピペするのが一般的
let express = require('express');
let router = express.Router();


// アクセスがあったら「Some photos」を返す
// ライブラリ（モジュール）をapp.jsに追加する必要がある
router.get('/', function(req, res, next) {
  res.send('Some photosこのページは新規作成中');
});

// photos/testページを返す
router.get('/test', function(req, res, next) {
  res.send('test test Some photosこのページはtest');
});

// photos/kousei の画像を返す
router.get('/kousei', function(req, res, next) {
  // res.renderで処理している
  res.render('photos');
});


module.exports = router;