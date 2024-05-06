

//express_demo.js 文件
var express = require('express');
var session = require('express-session');
const csurf = require('csurf');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
const getDb = require("./dbUtil");
const db = getDb();
const crypto = require('crypto');

// 使用 express-session 中间件
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(cookieParser());

// 使用 csurf 中间件
app.use(csurf({ cookie: true }));

function generateAuthToken() {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
}


 app.set('view engine', 'ejs');
// 使用 body-parser 中间件解析请求主体
app.use('/public', express.static('public'));
app.use('/', express.static('public'));


// 解析 JSON 类型的请求体，并设置大小限制为 1MB
app.use(bodyParser.json({ limit: '20mb' }));

// 解析 URL 编码类型的请求体，并设置大小限制为 1MB
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
const authMap = {};
function authenticate(req, res, next) {
    const authCookie = req.cookies.auth;
    console.log(req.csrfToken(),"req.csrfToken()",  req.headers)
    // 验证 CSRF 令牌
    if (req.cookies.csrf !== req.session.csrf) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    const userright = authMap[authCookie];
    // 检查是否存在 auth Cookie
    if (!authCookie) {
        res.status(401).send('Unauthorized');
        return;
    }

    // 在此处进行验证 auth Cookie 的逻辑

    // 示例逻辑：比较 auth Cookie 的哈希值与预期值
    const sessionAuth = req.session && req.session.auth;
    if(sessionAuth!==authCookie){
        res.status(401).send('Unauthorized');
        return;
    }else{
        if(req.path.includes("getAuth")){
            res.send("success");
        }else{
            next();
        }
    }
}

// 放行的路径列表
const allowedPaths = [ '/signin'];

// 应用 authenticate 中间件，但排除放行的路径
app.use((req, res, next) => {
    // 检查当前请求的路径是否在放行的路径列表中
    if (allowedPaths.includes(req.path)) {
        next(); // 放行请求
    } else {
        authenticate(req, res, next); // 执行权限验证
    }
});
app.get('/', function (req, res) {
   // res.send('Hello World');
    res.sendFile( __dirname + "/" + "public/index.html" );
})


app.get('/index', function (req, res) {
    res.sendFile( __dirname + "/" + "public/index.html" );
 })

app.post('/process_post', function (req, res) {

   // 输出 JSON 格式
   var response = {
       "first_name":req.body.first_name,
       "last_name":req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

app.post('/signin',(req,res)=>{
    console.log(req.body);
    var params = {
        "name":req.body.username,
        "password":req.body.userpwd
    };
    // 通过数据库查找同名用户是否存在
    db.query("select * from user_list where username = ?",[params.name])
        .then((users)=> {
            console.log(users);
            if (!users.length) {
                //接口必须返回 res.send 或者 res.end
                res.send("Non-existent User!");

                return;
            }
            // 如果存在比较数据库中的密码和传过来的密码是否一致
            const user = users[0];
            if (user.userpwd !== params.password) {
                //接口必须返回 res.send 或者 res.end
                res.send("Incorrect Password!");
                return;
            }

            const authToken = generateAuthToken();
            const csrfToken = req.csrfToken();
            res.cookie('auth', authToken, {
                httpOnly: true,
                secure: true, // 仅在 HTTPS 连接中发送Cookie
                maxAge: 2 * 24 * 60 * 60 * 1000, // 过期时间为2天
            });
            res.cookie('csrf', csrfToken,{
                httpOnly: true,
                    secure: true, // 仅在 HTTPS 连接中发送Cookie
                    maxAge: 2 * 24 * 60 * 60 * 1000, // 过期时间为2天
            });
            req.session.csrf = csrfToken;
            authMap[authToken] = user.userright;
            req.session.auth = authToken;
            res.send("success");
            // res.redirect('/pal_list');
        })
    //bcrypt这个在头部引入
    //const bcrypt = require('bcrypt');
    // 假设您已经生成了身份验证令牌并存储在 token 变量中
    // const hashedToken = bcrypt.hashSync(name, 10);
    // // 将令牌设置到 Cookie 中，使用 httpOnly 和 Secure 标志
    // res.cookie('auth', hashedToken, {
    //     httpOnly: true,
    //     secure: true,
    //     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie 在 0 到 3 天之间保持有效
    // });

})


app.get('/pal_list',(req,res) => {

   // res.sendFile( __dirname + "/"+"public/pal_list.html" );
    res.redirect('/pal_list.html');
});

app.get('/pal_reg',(req,res) => {

   res.sendFile( __dirname + "/"+"public/pal_reg.html" );

});

app.get('/cart',(req,res) => {

  res.sendFile( __dirname + "/"+"public/cart.html" );

});

app.get('/pal_detail',(req,res) => {

  res.sendFile( __dirname + "/"+"public/pal_detail.html" );

});


app.get('/pals', async(req, res) => {
    console.log("error");
   db.query('SELECT * FROM pals').then((results, error) => {
       console.log("error", error, results);
      // res.render('pal_list', { results: results });
      // res.sendFile( __dirname + "/"+"public/pal_list.html" );
      res.json(results);
      // res.render("/public/pal_list",results)
      // const renderedHTML = ejs.render(fileContent, { result: results });
   }).catch((error) => {
       if (error) {
           console.error('Error retrieving pals from database:', error);
           res.status(500).send('Internal Server Error');
       }
   });

 });

app.post('/additem', (req, res) => {
    if(req.body.pid){
        db.update("pals", req.body, "pid = " + req.body.pid )
            .then((results) => {
                console.log('Insert results:', results);
                res.json({success:"true"})
            })
            .catch((err) => {
                console.error('Error inserting data:', err);
                res.json({success:"false"})
            });
    }else{
        db.insert("pals", req.body)
            .then((results) => {
                console.log('Insert results:', results);
                res.json({success:"true"})
            })
            .catch((err) => {
                console.error('Error inserting data:', err);
                res.json({success:"false"})
            });
    }

  });

app.get('/item_detail',(req,res)=>{
    db.query('SELECT * FROM pals WHERE pid = 1').then(results=> {
        // res.render('pal_list', { results: results });
        // res.sendFile( __dirname + "/"+"public/pal_list.html" );
        res.json(results?results[0]:{});
        // res.render("/public/pal_list",results)
        // const renderedHTML = ejs.render(fileContent, { result: results });
    }).catch(error=>{
        console.error('Error retrieving pals from database:', error);
        res.status(500).send('Internal Server Error');
    });
})

app.post('/login',(req,res) => {
    // 输出 JSON 格式
    var params = {
        "name":req.body.username,
        "password":req.body.userpassword
    };
    // 通过数据库查找同名用户是否纯在
    const users = db.query("select * from user where name = $name");
    if(!users.length){
        //接口必须返回 res.send 或者 res.end
        res.end("密码或账号不正确！");
      return;
    }
    // 如果存在比较数据库中的密码和传过来的密码是否一致
    const user = users[0];
    if(user.password !== params.password){
        //接口必须返回 res.send 或者 res.end
        res.end("密码或账号不正确！");
      return;
    }
    //bcrypt这个在头部引入
    //const bcrypt = require('bcrypt');
    // 假设您已经生成了身份验证令牌并存储在 token 变量中
    const hashedToken = bcrypt.hashSync(name, 10);
    // 将令牌设置到 Cookie 中，使用 httpOnly 和 Secure 标志
    res.cookie('auth', hashedToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie 在 0 到 3 天之间保持有效
    });
    res.send("success");
});

  //  const jsonFilePath = 'public/testingjson.json';

  //  // 读取本地 JSON 文件
  //  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  //    if (err) {
  //      console.error('Error reading JSON file:', err);
  //      res.status(500).send('Error reading JSON file');
  //      return;
  //    }

  //    try {
  //      const jsonData = JSON.parse(data);

  //      // 执行 SQL 查询
  //      const sql = 'INSERT INTO items (pid,catid,name, price,des) VALUES (?, ?)';
  //      const values = [jsonData.pid, jsonData.catid,jsonData.name,jsonData.price,jsonData.des];

  //      pool.query(sql, values, (err, results) => {
  //        if (err) {
  //          console.error('Error adding item:', err);
  //          res.status(500).send('Error adding item');
  //          return;
  //        }

  //        console.log('Item added successfully');
  //        res.status(200).send('Item added successfully');
  //      });
  //    } catch (error) {
  //      console.error('Error parsing JSON file:', error);
  //      res.status(500).send('Error parsing JSON file');
  //    }
  //  });


// app.post('/api/data', (req, res) => {
//    // 从请求中获取数据
//    const newData = req.body;

//    // 执行 MySQL 插入操作
//    connection.query('INSERT INTO your_table SET ?', newData, (error, results) => {
//      if (error) {
//        console.error('Error inserting data:', error);
//        res.status(500).send('Internal Server Error');
//      } else {
//        res.status(200).send('Data inserted successfully');
//      }
//    });
//  });

var server = app.listen(80, function () {

  var host = server.address().address
  var port = server.address().port


  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})