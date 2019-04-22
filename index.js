"use strict";

const linebot = require('linebot');
const util = require("util")
// const line = require('@line/bot-sdk');
const express = require("express");
const request = require("request");
const configGet = require('config');
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
    channelId: "1563853948",
    channelSecret: "54bec8ea7ff9f4cebedad2ef196095f7",
    channelAccessToken:
        "3xy2S0/lj5fXOC5LNR7Ly86ettyCR0ohfNgB7f6G6JoxA45dfE4dbOL+KvIBikANeCqidzdXCAqQBJknsiM8wp8HPH5tfFL5grAJxgsB7RQWu22iuBu0VrHUzwdk2zx7sXpmZ5GkxgEH88k5mhhTNQdB04t89/1O/w1cDnyilFU="
});

const linebotParser = bot.parser();

app.post('/webhook', linebotParser, function (req, res) {
    console.log('webhook in');
});

bot.on('message', function (event) {
    db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`= ?", [event.message.text], (error, results, fields) => {
        // console.log(results);
        if (results.length == false) {
            console.log('wrong input');
            event.reply("wrong input");
        } else {
            console.log(results[0]);
            event.reply(JSON.stringify(results[0]));
        }
    });
});

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
