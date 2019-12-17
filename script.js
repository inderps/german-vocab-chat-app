const translations = {
  'Head': 'Das Kopf',
  'Monkey': 'Effe',
  'Road': 'Weg',
  'Father': 'Das Vater'
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function Game() {

  this.init = function() {
    this.score = 0;
    this.questions = shuffle(Object.keys(translations));
    this.currentQuestionIndex = -1;
    this.userAnswer = '';
    this.$answerBox = document.getElementById("answerBox");
  }

  this.start = function() {
    this.init();
    this.bindInputListener();
    this.typeNextQuestion();
  }

  this.incrementScore = function() {
    this.score += 1;
  }

  this.isUserAnswerCorrect = function() {
    return true;
    return this.questions[this.currentQuestionIndex] === this.userAnswer;
  }

  this.hasAllQuestionsAsked = function() {
    return (this.questions.length - 1) === this.currentQuestionIndex;
  }

  this.typeNextQuestion = function() {
    this.currentQuestionIndex += 1;

    const computerBubbleTemplate = document.getElementById("computerBubbleTemplate").innerHTML;
    const chatBox = document.getElementById("chatBox");
    chatBox.insertAdjacentHTML("beforeend", computerBubbleTemplate);

    const $questions = document.querySelectorAll(".bubble.computer");
    const $lastQuestion = $questions[$questions.length - 1];

    $lastQuestion.innerHTML = this.questions[this.currentQuestionIndex];

    this.$answerBox.focus();
  }

  this.sendUserAnswer = function(answer) {
    this.userAnswer = this.$answerBox.value;

    const youBubbleTemplate = document.getElementById("youBubbleTemplate").innerHTML;
    const chatBox = document.getElementById("chatBox");
    chatBox.insertAdjacentHTML("beforeend", youBubbleTemplate);

    const $answers = document.querySelectorAll(".bubble.you");
    const $lastAnswer = $answers[$answers.length - 1];

    $lastAnswer.innerHTML = this.userAnswer;

    if (this.isUserAnswerCorrect()) {
      $lastAnswer.classList.add("correct");
    } else {
      $lastAnswer.classList.add("wrong");
    }
  }

  this.bindInputListener = function() {
    this.$answerBox.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.sendUserAnswer(this.$answerBox.value);
        this.$answerBox.value = '';
    
        if (this.isUserAnswerCorrect()) {
          this.typeNextQuestion();

        } else {

        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  game.start();
});
