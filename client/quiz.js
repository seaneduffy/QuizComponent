'use strict';

var React = require('react'),
	Question = require('./question'),
	imageload = require('./imageload');

module.exports = React.createClass({

	answerQuestion: function(correct) {
		if(correct) {
			this.setState({
				correctCount : this.state.correctCount+1
			});
		}
		this.nextQuestion();
	},

	nextQuestion: function() {
		var questionIndex = this.state.questionIndex,
			nextIndex = questionIndex + 1;
		if(questionIndex >= this.state.quiz.questions.length-1) {
			this.endQuiz();
			return;
		}
		this.refs['question-'+questionIndex].hide();
		setTimeout( ()=> {
			this.refs['question-'+nextIndex].show();
		}, 500);
		var bg = this.state.quiz.questions[nextIndex].background !== 'undefined' ? this.state.quiz.questions[nextIndex].background : this.state.homeBackground;
		this.setState({
			questionIndex : nextIndex,
			background : 'url(' + bg + ')'
		});
		
	},

	startQuiz: function() {
		var bg = this.state.quiz.questions[0].background !== 'undefined' ? this.state.quiz.questions[0].background : this.state.homeBackground,
			bgsToLoad = [this.state.quiz.background];
		this.state.quiz.questions.forEach(function(q){
			bgsToLoad.push(q.background);
		});
		imageload(bgsToLoad).then(()=>{
			this.setState({
				questionIndex : 0,
				background : 'url(' + bg + ')',
				questionClass: 'question-container',
				resultClass: 'result-container hide'
			});
			requestAnimationFrame(()=>{
				this.setState({
					questionClass: 'question-container animateIn'
				});
			});
			this.refs['question-'+this.state.questionIndex].show();
		});
	},

	endQuiz: function() {
		this.setState({
			background : this.state.homeBackground,
			questionClass: 'question-container animateOut'
		});
		setTimeout( ()=> {
			this.setState({
				questionClass: 'question-container hide',
				resultClass: 'result-container'
			})
			requestAnimationFrame(()=>{
				this.setState({
					resultClass: 'result-container animateIn'		
				})
			});
		}, 500);
	},

	componentWillMount: function() {
		this.state = {
			quiz: {
				title: '',
				questions: []
			},
			background: '',
			homeBackground: '',
			questionIndex: 0,
			correctCount: 0,
			questionClass: 'question-container',
			resultClass: 'result-container hide'
		};
	},

	componentDidMount: function() {
		fetch(this.props.quizUri).then( result => {
			return result.json();
		}).then( data => {
			this.setState({
				quiz:data,
				background: 'url(' + data.background + ')',
				homeBackground: 'url(' + data.background + ')'
			});
			this.startQuiz();
		}).catch( error => {
			this.setState({quiz:{
				title: 'Could not load quiz: ' + error
			}});
		});
	},

	render: function() {
		var questionsDom = this.state.quiz.questions.map((question,i) => {
			return <Question ref={'question-'+i} data={question} onAnswer={this.answerQuestion} key={i} />
		}),
		answersDom = this.state.quiz.questions.map((question,i) => {
			if(question.type === 'multiple') {
				return <li key={i}>{question.text} - {question.choices[question.answer]}</li>;
			}
			return <li key={i}>{question.text} - {question.answer}</li>;
		});
		return (
			<div className="quiz-component" style={{backgroundImage:this.state.background}}>
				<h1>{ this.state.quiz.title }</h1>
				<div className="container">
					<div className={this.state.questionClass}>
						{questionsDom}
					</div>
					<div className={this.state.resultClass}>
						<h2>Results</h2>
						<p>You got {this.state.correctCount} correct out of {this.state.quiz.questions.length}!</p>
						<ul>
							{answersDom}
						</ul>
					</div>
				</div>
			</div>
		);
	}

});