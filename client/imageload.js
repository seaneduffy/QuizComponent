'use strict';

function loadImage(src) {
	return new Promise(function(resolve, reject){
		var image = new Image();
		image.onload = function(){
			if(image.width === 0 && image.height === 0) {
				reject();
			}
			resolve();
		}
		image.src = src;
	});
}

module.exports = function(...params) {
	var promises = [];
	[].forEach.call(arguments, arg => {
		if(typeof arg === 'string') {
			promises.push(loadImage(arg));
		} else if(arg.length) {
			arg.forEach( str => {
				promises.push(loadImage(str));
			});
		}
	});
	return Promise.all(promises);
}