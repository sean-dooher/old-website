/*
* @Author: sean
* @Date:   2017-04-26 19:08:37
* @Last Modified by:   sean-dooher
* @Last Modified time: 2017-07-14 23:44:09
*/

'use strict';
var isScrolling = false;
var scrollTarget = 0;
var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

function scrollToY(y, duration) {
	var startY = window.pageYOffset;
	scrollTarget = Math.min(y, height - window.innerHeight);
	var localTarget = scrollTarget;
	var diff = scrollTarget - startY;
	var start;

	function step(timeStamp) {
		if(!start) {
			start = timeStamp;
		}

		function easeOutCubic(t) { return (--t)*t*t+1 }
		var scrollPos = easeOutCubic((timeStamp - start) / duration) * diff;
		window.scrollTo(0, startY +  scrollPos);

		if(localTarget === scrollTarget && timeStamp - start < duration) {
			window.requestAnimationFrame(step);
		} else if(timeStamp - start >= duration) {
			isScrolling = false;
		}
		else {
			return;
		}
	}
	if(Math.abs(diff) > 10) {
		window.requestAnimationFrame(step);
	} else {
		isScrolling = false;
	}
}

function changeActiveNav(newNavElement) {
	if(!isScrolling) {
		var activeNode = document.getElementsByClassName("navbar-item active")[0];
		activeNode.classList.remove('active');
		newNavElement.classList.add('active');
	}		
}

document.onclick = function (e) {
  e = e ||  window.event;
  var element = e.target || e.srcElement;
  if (element.tagName == 'LI' && element.classList.contains("navbar-item")) {
  	var destinationName = element.firstChild.data.toLowerCase();
  	var destination = document.getElementById(destinationName);
  	isScrolling = false;
  	if(element === document.getElementsByClassName("navbar-item")[0]) {
  		scrollToY(0, 1500);
  	} else {
  		scrollToY(destination.offsetTop, 1500);
  	}
  	changeActiveNav(element);
  	return false;
  }
};

