const questions = require("./questions.json");
const TerminalErrors = require("./TerminalErrors.json");
const GetRandomQuestion = function (QuestionType) {
  const topic = questions[QuestionType.toLowerCase()];
  console.log("dasda", topic[Math.floor(Math.random() * topic.length)]);
  return topic[Math.floor(Math.random() * topic.length)];
};
const GetRightAnswer = function (topic, questionId) {
  if (questions[topic.toLowerCase()][questionId - 1]?.hasOptions) {
    const questionsGroup = questions[topic.toLowerCase()][
      questionId - 1
    ].options.filter((item) => item.isCorrect);
    return questionsGroup[0].text;
  } else {
    return questions[topic.toLowerCase()][questionId - 1].answer;
  }
};
const FindErrorCode = function (code) {
  const ErrorCode = TerminalErrors.find((item) => item.ErrorCode == code);
  console.log(ErrorCode);
};
module.exports = { GetRandomQuestion, GetRightAnswer, FindErrorCode };
