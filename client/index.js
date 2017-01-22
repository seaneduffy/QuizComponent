'use strict';

var Quiz = require('./quiz'),
	React = require('react'),
	ReactDOM = require('react-dom'),
	quizDomElement = document.getElementById('quiz');

ReactDOM.render(
  <Quiz quizUri="quiz.json" />,
  quizDomElement
);