from django.db import models

# Create your models here.
class Project(models.Model):
	SCHOOL="s"
	PERSONAL="p"
	WORK="w"
	CATEGORY_CHOICES = ((PERSONAL, "Personal"), (SCHOOL, "School"), (WORK, "Work"))
	title = models.CharField(max_length=50)
	date = models.DateField()
	category = models.CharField(max_length=1, choices=CATEGORY_CHOICES, default=PERSONAL)
	description = models.TextField()
	featured = models.BooleanField()
	image = models.ImageField(upload_to='projects/')
	image_alt = models.CharField(max_length=50)
	image_link = models.CharField(max_length=100)
	priority = models.IntegerField(default=100)

	def __str__(self):
		return self.title +  "-" + str(self.priority)

	@property
	def formatted_date(self):
		return self.date.strftime('%B %Y')

class ProjectButton(models.Model):
	project = models.ForeignKey(Project, related_name='buttons',on_delete=models.CASCADE)
	is_link = models.BooleanField()
	text = models.CharField(max_length=32)
	action = models.CharField(max_length=100)

class ExperienceItem(models.Model):
	location = models.CharField(max_length=50)
	role = models.CharField(max_length=50)
	start_date = models.DateField()
	end_date = models.DateField()
	current = models.BooleanField()
	priority = models.IntegerField(default=100)

	def __str__(self):
		return self.location + " - " + self.role + " - " + str(self.priority)

	@property
	def formatted_start(self):
		return self.start_date.strftime('%B %Y')

	@property
	def formatted_end(self):
		if self.current:
			return "Present"
		else:
			return self.end_date.strftime('%B %Y')

	@property
	def ordered_bullets(self):
		return self.bullets.order_by('priority')

class ExperienceBullet(models.Model):
	item = models.ForeignKey(ExperienceItem, related_name="bullets", on_delete=models.CASCADE)
	text = models.CharField(max_length=500)
	priority = models.IntegerField(default=100)