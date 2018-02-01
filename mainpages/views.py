from django.shortcuts import render
from django.http import HttpResponseBadRequest, HttpResponse
from .models import Project, ExperienceItem
from django.core.mail import EmailMessage

constant_values = {
			'about_text':"Hello, everyone! Thanks for taking the time to visit my website. My name is Sean Dooher and I’m a student studying Computer Science at the University of California, Berkeley. I’m a Bay Area native, born and raised, and am proud of it! I have a strong interest in CS education, machine learning, and mobile and web development. I currently work at theCoderSchool Berkeley teaching kids age 8-17 the fundamentals of computer science and programming. In my free time I enjoy film photography and learning how to cook different cuisines. My lastest challenge is learning how to cook Indian food which just so happens to be my favorite cuisine. Feel free to contact me with the form at the bottom of the page if you have any questions, want to talk about technology, or even if you just want to learn my (not-so) secret naan recipe!",
			'profile_header':"Sean Dooher",
			'profile_subheader':"Computer Science",
			'profile_occupation':"UC Berkeley",
			}
def constants(request):
	return constant_values

def main(request):
	projects = Project.objects.filter(featured=True).order_by('priority').all()
	experience = ExperienceItem.objects.order_by('priority').all()
	information = {'projects':projects, 'experience':experience}
	return render(request, 'index.html', information)

def message(request):
	if request.method == 'POST':
		try:
			name = request.POST['name']
			email = request.POST['email']
			subject = request.POST['subject']
			message = request.POST['message']
		except KeyError:
			return HttpResponseBadRequest('Invalid POST parameters')
		try:
			email_message = EmailMessage(
				subject='Django Message from {}: {}'.format(name, subject),
				body="Name: {}\r\n Email: {} \r\n Subject: {}\r\n Message: {}".format(name, email, subject, message),
				from_email='admin@dooher.net',
				to=['sean@dooher.net'],
				reply_to=[email],
				headers={'Content-Type': 'text/plain'},
			)
			email_message.send()
		except Exception:
			return HttpResponseBadRequest('An unknown error has occured')
		return HttpResponse("Success =)")
	else:
		return HttpResponseBadRequest('This page is only accessible through POST');
