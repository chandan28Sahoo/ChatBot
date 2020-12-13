const TelegramBot = require("node-telegram-bot-api");
const token = "1447090760:AAFP9gRU-Bh8Wnz7APA8zxfICEc_0oGZQqE";
const bot = new TelegramBot(token, { polling: true });
const fs = require("fs");

bot.onText(/\/say/, (msg) => {
    let input = msg.text;
    msgarray = input.split(" ");
    msgarray.shift();
    msgs = msgarray.join(" ");
    bot.sendMessage(msg.chat.id, msgs);
});

var x = fs.readFileSync("question.json");
var jdata = JSON.parse(x);

function question(index) {
    return jdata[index];
}

let no_of_questions = 0;
var correct = 0;
var incorrect = 0;
bot.onText(/\/startquiz/, async(msg) => {
    let data1 = question(no_of_questions);
    const timerObj = setTimeout(() => {
        bot.sendMessage(msg.chat.id, data1.question, {
            reply_markup: {
                keyboard: [
                    [{ text: data1.answers[0] }, { text: data1.answers[1] }],
                    [{ text: data1.answers[2] }, { text: data1.answers[3] }],
                ],
            },
        });
    }, 1500);
});

var startcontroller = 0;
bot.on("message", async(msgs) => {
    if (
        msgs.text === "/start" ||
        msgs.text === "/startquiz" ||
        startcontroller > 0
    ) {
        startcontroller++;
        console.log(startcontroller);
        if (msgs.text == "/start") {
            return await bot.sendMessage(
                msgs.chat.id,
                `Welcome  ${msgs.from.first_name}!  The bot has started !!!`
            );
        }
        if (msgs.text !== "/startquiz") {
            console.log(jdata.length);
            let data1 = question(no_of_questions);
            if (data1.answers.includes(msgs.text)) {
                if (no_of_questions !== jdata.length) {
                    if (msgs.text === data1.correct_answer) {
                        bot.sendMessage(msgs.chat.id, " CORRECT wait for next question");
                        no_of_questions++;
                        correct++;
                    } else {
                        bot.sendMessage(msgs.chat.id, " INCORRECT  wait for next question");
                        incorrect++;
                        no_of_questions++;
                    }
                    if (no_of_questions === jdata.length) {
                        startcontroller = 0;
                        const timerObj = setTimeout(async() => {
                            await bot.sendMessage(
                                msgs.chat.id,
                                `Game has finished,Your score is correct ${correct} , incorrect  ${incorrect} , in ${no_of_questions} questions`
                            );
                            correct = 0;
                            incorrect = 0;
                            no_of_questions = 0;
                            bot.sendMessage(
                                msgs.chat.id,
                                "if you want to want play again so enter /startquiz", {
                                    parse_mode: "HTML",
                                    reply_markup: { remove_keyboard: true },
                                }
                            );
                        }, 1200);
                    } else {
                        let data1 = question(no_of_questions);
                        const timerObj = setTimeout(() => {
                            console.log(jdata.length);
                            bot.sendMessage(msgs.chat.id, data1.question, {
                                reply_markup: {
                                    keyboard: [
                                        [{ text: data1.answers[0] }, { text: data1.answers[1] }],
                                        [{ text: data1.answers[2] }, { text: data1.answers[3] }],
                                    ],
                                },
                            });
                        }, 1500);
                    }
                }
            } else {
                bot.sendMessage(msgs.chat.id, "ENTER VALID INPUT");
            }
        }
    } else {
        await bot.sendMessage(msgs.chat.id, "ENTER VALID INPUT");
        bot.sendMessage(
            msgs.chat.id,
            "if you want to play again, please click here /startquiz"
        );
    }
});