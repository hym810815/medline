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

const db = mysql.createConnection({
    host: "medical.cg1fvo9lgals.ap-southeast-1.rds.amazonaws.com",
    user: "admin",
    password: "12345678",
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

// var inputarr = []

bot.on('message', function (event) {
    var userinput = event.message.text;
    var id_regex = /^[A-Z]\d{9}$/;
    //     if (userinput == '查詢') {
    //         console.log(userinput);
    //         event.reply({ type: 'text', text: '請輸入身分證已進行查詢: ' })
    //         userinput = ''
    //         userinput = event.message.text
    //         if (userinput == /^[A-Z]\d{9}$/) {
    //             console.log('userinput = ' + userinput)
    //         }
    //         time.push(event.timestamp)
    //         console.log(time)
    //         time = []
    //         // console.log(time)
    //     }
    //     if (userinput == '掛號') {
    //         console.log(userinput)
    //         event.reply({ type: 'text', text: '請問你要掛哪一科?請輸入牙科或胸腔科' });
    //         time.push(event.timestamp)
    //         console.log(time)
    //         time = []
    //         console.log(time)
    //     }
    //     if (userinput == '牙科') {
    //         console.log(userinput)
    //         event.reply({ type: 'text', text: '請輸入身分證已進行驗證: ' })
    //         time.push(event.timestamp)
    //         console.log(time)
    //         time = []
    //         console.log(time)
    //     }
    //     if (userinput == '胸腔科') {
    //         console.log(userinput)
    //         event.reply({ type: 'text', text: '請輸入身分證已進行驗證: ' })
    //         time.push(event.timestamp)
    //         console.log(time)
    //         time = []
    //         console.log(time)
    //     }
    // });
    if (userinput == "查詢") {
        event.reply('請輸入身分證字號');
    } else if (userinput.match(id_regex)) {
        db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`= ?", [userinput], (error, results, fields) => {
            if (results.length == false) {
                console.log('wrong input');
                event.reply("wrong input");
            } else {
                console.log([{ type: 'text', text: '掛號資訊:' }, { type: 'text', text: '醫生:' + results[0].Doctor }, { type: 'text', text: '科別:' + results[0].Subject }, { type: 'text', text: '看診時間:' + moment(results[0].App_time).format('YYYY/MM/DD hh:mm') }]);
                event.reply([{ type: 'text', text: '掛號資訊:' }, { type: 'text', text: '醫生:' + results[0].Doctor }, { type: 'text', text: '科別:' + results[0].Subject }, { type: 'text', text: '看診時間:' + moment(results[0].App_time).format('YYYY/MM/DD hh:mm') }]);
            }
        });
    }

    if (userinput == "掛號") {
        event.reply('請問要掛哪一科？');
    } else if (userinput == '牙科' || userinput == '胸腔科') {
        db.query("SELECT Name, Doctor FROM `med_appointment_sub` WHERE `Subject`= ?", [userinput], (error, results, fields) => {
            if (results.length == false) {
                console.log('wrong input');
                event.reply("wrong input");
            } else {
            console.log([{ type: 'text', text: '掛號資訊:' }, { type: 'text', text: '醫生:' + results[0].Doctor }, { type: 'text', text: '科別:' + results[0].Subject }, { type: 'text', text: '看診時間:' + moment(results[0].App_time).format('YYYY/MM/DD hh:mm') }]);
            event.reply([{ type: 'text', text: '掛號資訊:' }, { type: 'text', text: '醫生:' + results[0].Doctor }, { type: 'text', text: '科別:' + results[0].Subject }, { type: 'text', text: '看診時間:' + moment(results[0].App_time).format('YYYY/MM/DD hh:mm') }]);
            }
        });
    }
});

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
