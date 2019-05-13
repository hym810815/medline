"use strict";

const linebot = require('linebot');
const util = require("util")
// const line = require('@line/bot-sdk');
const express = require("express");
const request = require("request");
const configGet = require('config');
const app = express();
const mysql = require("mysql");
const moment = require('moment');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
// const authentication = require("./authentication");

const db = mysql.createConnection({
    host: "medical.cg1fvo9lgals.ap-southeast-1.rds.amazonaws.com",
    user: "administrator",
    password: "1qaz2wsx",
    database: "medical"
});
db.connect();

const bot = linebot({
    channelId: "1563853948",
    channelSecret: "54bec8ea7ff9f4cebedad2ef196095f7",
    channelAccessToken:
        "3xy2S0/lj5fXOC5LNR7Ly86ettyCR0ohfNgB7f6G6JoxA45dfE4dbOL+KvIBikANeCqidzdXCAqQBJknsiM8wp8HPH5tfFL5grAJxgsB7RQWu22iuBu0VrHUzwdk2zx7sXpmZ5GkxgEH88k5mhhTNQdB04t89/1O/w1cDnyilFU="
});

const linebotParser = bot.parser();

app.post('/webhook', linebotParser, function (req, res) {
    console.log('webhook in');
});

var appointment_time = [];
var search_time = [];
const new_user = [];


bot.on('message', function (event) {
    var userinput = event.message.text;
    var id_regex = /^[A-Z]\d{9}$/;

    if (userinput == "掛號") {
        appointment_time.push(event.timestamp);
        console.log(appointment_time);
        event.reply('請問要掛哪一科？');
    } else if (userinput == '牙科' || userinput == '胸腔科') {
        event.reply('請輸入身分證字號以進行掛號:');
        appointment_time.push(event.timestamp);
        console.log(appointment_time.length);
    } else if (appointment_time.length >= 2 && userinput.match(id_regex)) {
        db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`= ?", [userinput], (error, results, fields) => {
            if (results.length == true) {
                event.reply({ type: 'text', text: '你有已掛號的紀錄，請輸入查詢以檢視相關資訊' });
            } else {
                event.reply([{ type: 'text', text: '目前沒有你的掛號紀錄，請至以下網址來進行掛號' }, {
                    type: 'text',
                    text: 'https://forms.gle/jmkDAB5xYSv4ZMwn9'
                }]);
                
                // db.query('insert into `med_appointment_sub` set ?', val, (error, results, fields) => {
                //     console.log(results)
                // });
            }
        });
        appointment_time = [];
        console.log(appointment_time.length);
    } else if (!userinput.match(id_regex) && new_user == null) {
        console.log('wrong id value');
        event.reply('wrong id value');
    }

    if (userinput == "查詢") {
        search_time.push(event.timestamp);
        console.log(search_time);
        event.reply('請輸入身分證字號');
    } else if (search_time.length >= 1 && userinput.match(id_regex)) {
        db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`= ?", [userinput], (error, results, fields) => {
            if (results.length == false) {
                console.log('wrong input');
                event.reply("wrong input");
            } else {
                console.log([{ type: 'text', text: '查詢資訊:' }, { type: 'text', text: '醫生:' + results[0].Doctor }, { type: 'text', text: '科別:' + results[0].Subject }, { type: 'text', text: '看診時間:' + moment(results[0].App_time).format('YYYY/MM/DD') }]);
                event.reply([{ type: 'text', text: '查詢資訊:' }, { type: 'text', text: '醫生:' + results[0].Doctor }, { type: 'text', text: '科別:' + results[0].Subject }, { type: 'text', text: '看診時間:' + moment(results[0].App_time).format('YYYY/MM/DD') }]);
            }
        });
        search_time = [];
        console.log(search_time.length);
    }
});

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
