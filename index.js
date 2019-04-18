"use strict";
const linebot = require('linebot');
const util = require("util")
const line = require('@line/bot-sdk');
const express = require("express");
const request = require("request");
const configGet= require('config');
const app = express();
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "medical.cg1fvo9lgals.ap-southeast-1.rds.amazonaws.com",
  user: "admin",
  password: "12345678",
  database: "medical"
});
db.connect();

const bot = linebot({
  channelId: '1561441777',
  channelSecret: configGet.get("CHANNEL_SECRET"),
  channelAccessToken: configGet.get("CHANNEL_ACCESS_TOKEN")
});
const linebotParser = bot.parser();
const config = {
  channelAccessToken: configGet.get("CHANNEL_ACCESS_TOKEN"),
  channelSecret: configGet.get("CHANNEL_SECRET")
};

 
app.post('/webhook', linebotParser,function (req, res) {
    console.log('webhook in')
    console.log('res: '+res)
    // db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`=?",['A123456789'] , (error, results, fields) => {
    // console.log('results: '+results[0].ID)
        console.log(JSON.stringify(res))     
    // })
});



bot.on('message', function (event) {
    if(event.message.text == "A123456789") {
        db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`=?",["A123456789"] , (error, results, fields) => {
            console.log(results)})
            if(resuslt == true){
                let replyMsg = request.db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`= ?",["A123456789"])
                console.log(replyMsg);
                event.reply(util.inspect(replyMsg,{depth:null}))
            }
    } else {
        event.reply(['你好，請輸入預約掛號或查詢預約已進行操作。']).then(function (data) {
            console.log(event.message.text)}).catch(function (error) {
        });
    } 
})
    


//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});


