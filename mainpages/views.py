from django.shortcuts import render
from django.http import HttpResponseBadRequest, HttpResponse
from .models import Project, ExperienceItem
from django.core.mail import EmailMessage

constant_values = {
			'about_text':"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a tristique est. Nunc tincidunt convallis ex non sollicitudin. Phasellus fermentum urna orci, quis venenatis odio vestibulum vitae. Duis faucibus suscipit balandit. Ut et convallis tellus. Nam pulvinar, purus nec pulvinar blandit, quam magna accumsan orci, vel efficitur nunc tortor sed erat. In felis mauris, bibendum at pellentesque id, fermentum at felis. Morbi dignissim diam id venenatis accumsan. Vivamus tempus lectus vitae turpis vehicula, vitae placerat tellus semper. Fusce facilisis dolor non faucibus tempor. Vestibulum lacinia rutrum condimentum. Nullam feugiat rutrum vulputate. Ut scelerisque porta mauris, id rutrum ipsum dapibus id. Pellentesque eget mi eu libero fermentum posuere. Suspendisse vel ultrices odio.",
			'profile_header':"Sean Dooher",
			'profile_subheader':"Computer Science",
			'profile_occupation':"UC Berkeley",
			}
def constants(request):
	return constant_values

def main(request):
	projects = Project.objects.filter(featured=True)
	experience = ExperienceItem.objects.all()
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