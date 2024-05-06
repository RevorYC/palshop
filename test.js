
const mysql = require('mysql');
const fs = require("fs");
const getDb = require("./dbUtilAsync");
const db = getDb();
 
const jsonFilePath = 'public/testingjson.json';
   // 读取本地 JSON 文件
fs.readFile(jsonFilePath, 'utf8', (err, data) => {

     if (err) {
       return;
     }
     console.log("data", data.pid)
     try {
        const jsonData = JSON.parse(data);
        db.insert("pals",{
            catid: 18812,
            price: 1998,
            name: "王企鹅",
            des: "wangqie"
        }).then(res=>{

        })
        
      }finally{

      }
  });