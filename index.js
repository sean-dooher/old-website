/*
* @Author: sean
* @Date:   2017-04-26 19:08:37
* @Last Modified by:   sean-dooher
* @Last Modified time: 2017-07-16 01:05:16
*/

'use strict';
var isScrolling = false;
var sideBarOpen = false;
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
	isScrolling = true;
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

function changeActiveNav(newNavNode) {
	if(!isScrolling) {
		var activeNode = document.getElementsByClassName("navbar-item active")[0];
		if(activeNode !== newNavNode) {
			activeNode.classList.remove('active');
			newNavNode.classList.add('active');
		}
	}		
}

function detectLeftButton(event) {
    if ('buttons' in event) {
        return event.buttons === 1;
    } else if ('which' in event) {
        return event.which === 1;
    } else {
        return event.button === 1;
    }
}

document.onclick = function (e) {
  e = e ||  window.event;
  var element = e.target || e.srcElement;
  if (e.which === 1 && element.tagName == 'A' 
  	  && element.parentElement.classList.contains("navbar-item")) {
  	var destinationName = element.getAttribute("href").replace("#", "");
  	var destination = document.getElementById(destinationName);
  	isScrolling = false;
  	changeActiveNav(element.parentElement);
  	if(element.parentElement === document.getElementsByClassName("navbar-item")[0]) {
  		scrollToY(0, 1500);
  	} else {
  		scrollToY(destination.offsetTop, 1500);
  	}
  	if(sideBarOpen) {
  		closeSideBar();
  	}
  	return false;
  }
};

var contentBoxes = document.getElementsByClassName("content-box");
function findActiveNav() {
	var center = window.pageYOffset + window.innerHeight / 2;
	for(var i = 0; i < contentBoxes.length; i++) {
		if(center >= contentBoxes[i].offsetTop 
			&& center <= contentBoxes[i].offsetTop + contentBoxes[i].offsetHeight) {
			changeActiveNav(document.querySelectorAll('a[href="#' + contentBoxes[i].id + '"]')[0].parentElement);
		}
	}
}

window.onscroll = findActiveNav;
window.onresize = function() {
	if(window.matchMedia("screen and (min-width: 850px)").matches && sideBarOpen) {
		closeSideBar();
	}
	findActiveNav();
};

function openSideBar() {
	if(!sideBarOpen) {
		html.classList.add("hidden");
		document.getElementsByTagName("nav")[0].classList.add("sidebar");
		sideBarOpen = true;
	}
}

function closeSideBar() {
	if(sideBarOpen) {
		html.classList.remove("hidden");
		document.getElementsByTagName("nav")[0].classList.remove("sidebar");
		sideBarOpen = false;
	}
}

function adjust_textarea(h) {
    h.style.height = "20px";
    h.style.height = (h.scrollHeight)+"px";
}