'use strict';

var React = require('react');

module.exports = React.createClass({

	componentWillMount: function() {
		this.state = {
			questionClass: 'question hide'
		};
	},

	show: function() {
		this.setState({questionClass : 'question animateIn'});
	},

	hide: function() {
		this.setState({questionClass : 'question animateOut'});
		setTimeout( ()=>{
			this.setState({questionClass : 'question hide'});
		}, 500);
	},

	render: function() {

		var input,

			userAnswer,

			textInput,

			selectedElement,

			updateText = e=>{
				userAnswer = e.target.value;
			},

			select = e=>{
				if(!!selectedElement) {
					selectedElement.classList.remove('selected');
				}
				selectedElement = e.target;
				userAnswer = selectedElement.getAttribute('data-index');
				selectedElement.classList.add('selected');
			},
			
			submit = e=>{
				if(typeof userAnswer === 'undefined') {
					return;
				}
				if(this.props.data.type === 'multiple') {
					userAnswer *= 1;
				} else if(this.props.data.type === 'text') {
					userAnswer = userAnswer.trim().toLowerCase();
				}
				this.props.onAnswer( this.props.data.answer === userAnswer );
			};

		if(this.props.data.type === 'multiple') {

			var choices = this.props.data.choices.map( (txt, i) => {
				return <li key={i} data-index={i} onClick={select}><span>></span> {txt}</li>;
			});

			input = <div><ul>{choices}</ul><div><button onClick={submit}>Submit answer</button></div></div>;

		} else if(this.props.data.type === 'text') {
			input = <div><div><input type="text" placeholder="answer" onChange={updateText} /></div><div><button onClick={submit}>Submit answer</button></div></div>;			
		}

		return (
			<div className={this.state.questionClass}><h2>{ this.props.data.text }</h2>{input}</div>
		);
	}

});