/*
* @Author: sean
* @Date:   2017-04-26 19:08:37
* @Last Modified by:   sean-dooher
* @Last Modified time: 2017-07-30 18:04:21
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
		var activeNode = document.getElementsByClassName("active")[0];
		if(activeNode !== newNavNode) {
			activeNode.classList.remove('active');
			newNavNode.classList.add('active');
		}
	}		
}

document.onclick = function (e) {
  e = e || window.event;
  var element = e.target || e.srcElement;
  if (e.which === 1 && element.tagName === 'A' 
  	  && element.parentElement.tagName === 'NAV') {
  	var destinationName = element.getAttribute("href").replace("#", "");
  	var destination = document.getElementById(destinationName);
  	isScrolling = false;
  	changeActiveNav(element);
  	if(element === document.getElementsByTagName('nav')[0].children[0]) {
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

var contentBoxes = document.getElementsByTagName("section");
function findActiveNav() {
	var center = window.pageYOffset + window.innerHeight / 2;
	for(var i = 0; i < contentBoxes.length; i++) {
		if(center >= contentBoxes[i].offsetTop 
			&& center <= contentBoxes[i].offsetTop + contentBoxes[i].offsetHeight) {
			changeActiveNav(document.querySelectorAll('a[href="#' + contentBoxes[i].id + '"]')[0]);
		}
	}
}

window.onscroll = findActiveNav;
window.onresize = function() {
	if(window.matchMedia("screen and (min-width: 850px)").matches) {
		closeSideBar();
		document.getElementsByTagName("nav")[0].classList.remove("animated");
	}
	findActiveNav();
};

function openSideBar() {
	if(!sideBarOpen) {
		html.classList.add("hidden");
		document.getElementsByClassName("menubar")[0].classList.add("sidebar");
		document.getElementsByTagName("nav")[0].classList.add("sidebar");
		document.getElementsByTagName("nav")[0].classList.add("animated");
		var menuIcon = document.getElementById('menuButton');
		menuIcon.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
		sideBarOpen = true;
	}
}

function closeSideBar() {
	if(sideBarOpen) {
		html.classList.remove("hidden");
		document.getElementsByClassName("menubar")[0].classList.remove("sidebar");
		document.getElementsByTagName("nav")[0].classList.remove("sidebar");
		var menuIcon = document.getElementById('menuButton');
		menuIcon.innerHTML = '&#9776;';
		sideBarOpen = false;
	}
}

function toggleSideBar() {
	if(sideBarOpen) {
		closeSideBar();
	} else {
		openSideBar();
	}
}

function adjust_textarea(h) {
    h.style.height = "20px";
    h.style.height = (h.scrollHeight)+"px";
}

function sendMessage() {
	var form = document.getElementById("contactForm");
	form.classList.add("submitted");
	var loaderText = document.querySelector('.load-container p');
	loaderText.innerHTML = "Sending Message..."
	for (var i = 0; i < form.elements.length; i++) {
		console.log(form.elements[i].value);
		form.elements[i].disabled = true;
	}

	function onComplete() {
		form.classList.add('load-complete');
		loaderText.innerHTML = "Message Sent!";
	}
	setTimeout(onComplete, 1000);
	return false;
}