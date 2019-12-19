function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}

function Game(type) {

  this.init = function() {
    this.translations = window[type]
    this.wrongAnswerCount = 0;
    this.questions = shuffle(Object.keys(this.translations));
    this.currentQuestionIndex = -1;
    this.userAnswer = '';
    this.$answerBox = document.getElementById("answerBox");
    this.$questionNum = document.getElementById("questionNum");
    this.$chatBox = document.getElementById("chatBox");
    document.getElementById("total").innerHTML = `/(${this.questions.length})`;
    document.getElementById("type").innerHTML = type;
  }

  this.start = function() {
    this.init();
    this.bindInputListener();
    this.typeNextQuestion();
  }

  this.incrementQuestionIndex = function() {
    this.currentQuestionIndex += 1;
    this.$questionNum.innerHTML = this.currentQuestionIndex + 1;
  }

  this.correctAnswer = function() {
    return this.translations[this.questions[this.currentQuestionIndex]];
  }

  this.isUserAnswerCorrect = function() {
    return this.correctAnswer().toLowerCase() === this.userAnswer.toLowerCase();
  }

  this.hasAllQuestionsAsked = function() {
    return (this.questions.length - 1) === this.currentQuestionIndex;
  }

  this.scrollToBottom = function() {
    this.$chatBox.scrollTop = this.$chatBox.scrollHeight;
  }

  this.typeAsComputer = function(text) {
    const computerBubbleTemplate = document.getElementById("computerBubbleTemplate").innerHTML;
    this.$chatBox.insertAdjacentHTML("beforeend", computerBubbleTemplate);

    const $computerChats = document.querySelectorAll(".bubble.computer");
    const $lastChat = $computerChats[$computerChats.length - 1];

    $lastChat.innerHTML = text;

    this.scrollToBottom();
  }

  this.typeNextQuestion = function() {
    this.incrementQuestionIndex();
    this.typeAsComputer(this.questions[this.currentQuestionIndex]);
    this.$answerBox.focus();
  }

  this.typeAsUser = function(answer) {
    this.userAnswer = this.$answerBox.value;

    const youBubbleTemplate = document.getElementById("youBubbleTemplate").innerHTML;
    this.$chatBox.insertAdjacentHTML("beforeend", youBubbleTemplate);

    const $answers = document.querySelectorAll(".bubble.you");
    const $lastAnswer = $answers[$answers.length - 1];

    $lastAnswer.innerHTML = this.userAnswer;

    if (this.isUserAnswerCorrect()) {
      $lastAnswer.classList.add("correct");
    } else {
      $lastAnswer.classList.add("wrong");
    }

    this.scrollToBottom();
  }

  this.bindInputListener = function() {
    this.$answerBox.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.typeAsUser(this.$answerBox.value);
        this.$answerBox.value = '';
    
        if (this.isUserAnswerCorrect()) {
          if (this.hasAllQuestionsAsked()) {
            this.typeAsComputer(`Congratulations. The quiz is over and your score is ${this.questions.length - this.wrongAnswerCount}/${this.questions.length}`);
          } else {
            this.typeNextQuestion();
          }
        } else {
          this.wrongAnswerCount += 1;
          this.typeAsComputer(`Correct Answer: "${this.correctAnswer()}". Please type again`);
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  const game = new Game(getQueryStringValue('type') || 'nouns');

  game.start();
});
