'use strict';

// いろいなライブラリ(モジュール)を読込む設定
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let helmet = require('helmet');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

// 外部認証などのライブラリ仕様はコピペするもの
//  passport が GitHub の OAuth 認証のストラテジモジュール>決まり文
let session = require('express-session');
let passport = require('passport');
let GitHubStrategy = require('passport-github2').Strategy;

// 外部認証トークン、パスワードは変化しないで変数は慣習的に大文字
let GITHUB_CLIENT_ID = '85f1681091c85049fb77';
let GITHUB_CLIENT_SECRET = '8d82bfc46b09b6c5802f926c57aac23f265eacb1';




// 外部認証シリアライズがセッションに登録(保存)
passport.serializeUser(function (user, done) {
  done(null, user);
});

// 外部認証デシアライズが保存されたデータを取得(読み出す)
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// 外部認証ストラテジモジュールのリファレンス通りにカキコする
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    // 非同期の処理、ログイン処理はI/Oイベントで重い
    // コールバックは、関数Aの引数に関数Bを設定するときの関数Bのこと
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));


// 変数を宣言して、各ルータを読込む
let indexRouter = require('./routes/index');
let chatRouter = require('./routes/chat');
let photosRouter = require('./routes/photos');



// express本体とhelmetを使う
app.use(helmet());


// viewsファイルがどこにあるの？＞’views’の__dirnameにある＞決まり文
app.set('views', path.join(__dirname, 'views'));
// テンプレートエンジンにpugを指定
app.set('view engine', 'pug');

// faviconを使うときはコメント外す
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// pugでは静止画を扱うときに必要
app.use(express.static(path.join(__dirname, 'public')));


/* ここはひな形なので知っておく程度 */
// loggerロガーはログを書き込むためのツール設定し’dev’は開発環境
app.use(logger('dev'));
// json形式を解釈して作成できる設定
app.use(express.json());
// urlencodedを使う設定でextendedを(false)使わない設定
app.use(express.urlencoded({ extended: false }));
// クッキー扱う設定
app.use(cookieParser());
// publicを公開する場所を設定＞expressで静的ファイルをpublicという
// 静的ファイル(js, img, css)の格納ディレクトリを教える
app.use(express.static(path.join(__dirname, 'public')));




//  GitHub 認証を行うための処理＞リファレンス通り
app.use(session({ secret: '417cce55dcfcfaeb', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());




// ルーティングの設定
/* expressってapp.useの処理順に見ていく
  各、処理にアクセスがあるかどうかの処理
  各、処理のres.renderが呼ばれる
  res.renderがなければnext(createError(404))を返す
*/
/* アクセスがあったら、分岐先のルータに処理を渡す */
//トップページにアクセスあれば、indexRouterを呼び出す
app.use('/', indexRouter);

// '/photos'にアクセスがあれば、photosを呼び出す
app.use('/photos', photosRouter);

// '/chat'にアクセスがあれば、chatRouterを呼び出す
app.use('/chat', chatRouter);



// 外部認証のルータパスもリファレンス通りカキコ
// こちらにアクセスがあればGitHubページ飛ばして認証します
app.get('/auth/github',
  // パスポート認証はメールアドレス
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
});
// 認証したら、こちらのURL＝/auth/github/callbackのハンドラを登録
app.get('/auth/github/callback',
  // パスポート認証を失敗したら再度/loginにする
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // 成功しらた'/'トップページに送る
    res.redirect('/');
});


// app.get("/"ここの「 / 」にサーバ接続
app.get("/", (req, res) => {
  // __dirnameは現在のディレクトリから階層を読込む
});

// /login に GET でアクセスがあった時に
app.get('/login', function (req, res) {
  // renderファイルでlogin.pug というテンプレート
  res.render('login');
});
// /logout に GET でアクセスがあった時にログアウト
app.get('/logout', function (req, res) {
  req.logout();
  //  / にリダイレクトさせる
  res.redirect('/');
});


/* ページがなかったら処理で404を設定 */
// nextはapp.use(funtion)のerrを渡しに行く
// ＞indexRouter,usersRouterにヒットしないなら404ってこと
app.use(function(req, res, next) {
  // ここでは単純404を返すだけでエラーページを作成してない
  next(createError(404));
});

// next 関数で次の呼び出し
app.use(function(err, req, res, next) {
  // localsは手元環境のエラーメッセージとして表示
  res.locals.message = err.message;
  // 環境が…開発中ならばエラー表示、本番だったらエラーをださない（三項演算子）
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // views/error.pugの処理に進む
  res.render('error');
});

module.exports = app;

http.listen(3000, function() {
  console.log('Docker8000:node3000サーバ起動中 ' + http.address().port);
});

// フレームワークを信用する、ひな形を気にしすぎると作りたいものが作れない！