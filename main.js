const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");
const { GetRandomQuestion, GetRightAnswer, FindErrorCode } = require("./utils");
require("dotenv").config();
const bot = new Bot(process.env.TELEGABOT_KEY);
FindErrorCode("5@AEE00");
bot.command("start", async (ctx) => {
  const ThemeKeyboard = new Keyboard()
    .text("HTML")
    .text("CSS")
    .text("javascript")
    .text("React")
    .resized();
  await ctx.reply("Выберите тему", {
    reply_markup: ThemeKeyboard,
  });
});
bot.hears(["HTML", "CSS", "javascript", "React"], async (ctx) => {
  const question = GetRandomQuestion(ctx.message?.text);
  let inlineKeyboard;
  if (question.hasOptions) {
    const buttonRow = question?.options?.map((item) => {
      return [
        InlineKeyboard.text(
          item.text,
          JSON.stringify({
            type: `${ctx.message.text}`,
            isCorrect: item.isCorrect,
            questionId: question.id,
          })
        ),
      ];
    });
    inlineKeyboard = InlineKeyboard.from(buttonRow);
  } else {
    inlineKeyboard = new InlineKeyboard().text(
      "Узнать ответ",
      JSON.stringify({
        type: ctx.message?.text,
        questionId: question.id,
      })
    );
  }
  await ctx.reply(`${question?.text}`, {
    reply_markup: inlineKeyboard,
  });
});
bot.on("callback_query:data", async (ctx) => {
  const question = GetRandomQuestion(
    JSON.parse(ctx.update.callback_query?.data).type
  );
  const parsedDatas = JSON.parse(ctx.update.callback_query?.data);
  const rightAnswer = GetRightAnswer(parsedDatas.type, parsedDatas.questionId);
  let inlineKeyboard;
  if (question.hasOptions) {
    const buttonRow = question.options.map((item) => {
      return [
        InlineKeyboard.text(
          item.text,
          JSON.stringify({
            isCorrect: item.isCorrect,
            type: JSON.parse(ctx.update.callback_query?.data).type,
            questionId: question.id,
          })
        ),
      ];
    });
    inlineKeyboard = InlineKeyboard.from(buttonRow);
  } else {
    inlineKeyboard = new InlineKeyboard().text(
      "Узнать ответ",
      JSON.stringify({
        type: JSON.parse(ctx.update.callback_query?.data).type,
        questionId: question.id,
      })
    );
  }
  if (parsedDatas.isCorrect) {
    await ctx.reply("Верно");
  } else if (parsedDatas.isCorrect == false) {
    await ctx.reply(`Неверно,правильный ответ-${rightAnswer}`);
  }
  if (parsedDatas?.isCorrect == undefined) {
    await ctx.reply(rightAnswer);
  }
  await ctx.reply(`${question.text}`, { reply_markup: inlineKeyboard });
});

bot.api.setMyCommands([{ command: "start", description: "Начать" }]);
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
bot.command("test", async (ctx) => {
  await ctx.replyWithPhoto(
    "https://yandex.ru/images/search?from=tabbar&img_url=https%3A%2F%2Fsun9-72.userapi.com%2Fimpf%2Fc636428%2Fv636428147%2F470dd%2FMeGQy2dlsns.jpg%3Fsize%3D1280x800%26quality%3D96%26sign%3D88a4b3b546ab0154da34d50367b2cd5e%26c_uniq_tag%3DMdkz6RcA0_JyO0W6s-UnkmVSmM2yc0TFgZR4D4RvkbI%26type%3Dalbum&lr=191&pos=5&rpt=simage&text=%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D1%83%D0%B8"
  );
});
bot.start();
