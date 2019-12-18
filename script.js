const translations = {
  'Page': 'die Seite',
  'Foot': 'der Fuss',
  'Road': 'der Weg',
  'Bake': 'backen',
  'Word': 'das Wort',
  'Love': 'Lieben',
  'Voice': 'die Stimme',
  'To try': 'Versuchen',
  'Ant': 'die Ameise',
  'Banana': 'die Banane',
  'Boat': 'das Boot',
  'Bus': 'der Bus',
  'Roof': 'das Dach',
  'Strawberry': 'die Erdbeere',
  'Window': 'das Fenster',
  'Factory': 'die Fabrik',
  'Island': 'die Insel',
  'Jacket': 'die Jacke',
  'Cook': 'der Koch',
  'Cheese': 'der Kase',
  'King': 'der Kong',
  'Teacher': 'der Lehrer',
  'Lamb': 'das Lamm',
  'Moon': 'der Mond',
  'Mouse': 'die Maus',
  'Night': 'die Nacht',
  'Side': 'der Nebel',
  'Nose': 'die Nase',
  'Fruit': 'das Obst',
  'Granda': 'der Opa',
  'Horse': 'das Pferd',
  'Heart': 'das Herz',
  'Tooth': 'der Zahn',
  'Dog': 'der Hund',
  'House': 'das Haus',
  'Head': 'Der Kopf',
  'Monkey': 'der Affe',
  'Father': 'der Vater'
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
    this.$score = document.getElementById("score");
    this.$chatBox = document.getElementById("chatBox");
    document.getElementById("total").innerHTML = `/(${this.questions.length})`;
  }

  this.start = function() {
    this.init();
    this.bindInputListener();
    this.typeNextQuestion();
  }

  this.incrementScore = function() {
    this.score += 1;
    this.$score.innerHTML = this.score;
  }

  this.correctAnswer = function() {
    return translations[this.questions[this.currentQuestionIndex]];
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
    this.currentQuestionIndex += 1;
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
          this.incrementScore();
          if (this.hasAllQuestionsAsked()) {
            this.typeAsComputer(`Congratulations. You have answered all questions correct`);
          } else {
            this.typeNextQuestion();
          }
        } else {
          this.typeAsComputer(`Correct Answer: "${this.correctAnswer()}". Game Over. Good luck next time`);
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  game.start();
});
