

//express_demo.js 文件
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const mysql = require('mysql');
const getDb = require("./dbUtil");
const db = getDb();
const ejs = require('ejs');

const connection = mysql.createConnection({
  host: 'localhost',     // 数据库主机名
  user: 'pal_db', // 数据库用户名
  password: 'li12345780', // 数据库密码
  database: 'pal_db'  // 数据库名称
});

 app.set('view engine', 'ejs');
// 使用 body-parser 中间件解析请求主体
app.use('/public', express.static('public'));
app.use('/', express.static('public'));


// 解析 JSON 类型的请求体，并设置大小限制为 1MB
app.use(bodyParser.json({ limit: '20mb' }));

// 解析 URL 编码类型的请求体，并设置大小限制为 1MB
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

app.get('/', function (req, res) {
   res.send('Hello World');
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

app.get('/pal_list',(req,res) => {

   res.sendFile( __dirname + "/"+"public/pal_list.html" );
   
});

app.get('/pal_reg',(req,res) => {

   res.sendFile( __dirname + "/"+"public/pal_reg.html" );
   
});

app.get('/cart',(req,res) => {

  res.sendFile( __dirname + "/"+"public/cart.html" );
  
});

app.get('/detail',(req,res) => {

  res.sendFile( __dirname + "/"+"public/detail.html" );
  
});


app.get('/pals', (req, res) => {
   connection.query('SELECT * FROM pals', (error, results) => {
     if (error) {
       console.error('Error retrieving pals from database:', error);
       res.status(500).send('Internal Server Error');
     } else {
      // res.render('pal_list', { results: results });
      // res.sendFile( __dirname + "/"+"public/pal_list.html" );
      res.json(results);
      // res.render("/public/pal_list",results)
      // const renderedHTML = ejs.render(fileContent, { result: results });
     }
   });
   
 });

app.post('/additem', (req, res) => {

  db.insert("pals", req.body)
    .then((results) => {
      console.log('Insert results:', results);
      res.json({success:"true"})
    })
    .catch((err) => {
      console.error('Error inserting data:', err);
      res.json({success:"false"})
    });
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
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})