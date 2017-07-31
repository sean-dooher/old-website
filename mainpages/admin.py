from django.contrib import admin
from .models import *

# Register your models here.

class ButtonInline(admin.StackedInline):
	model = ProjectButton

class ProjectAdmin(admin.ModelAdmin):
	inlines = [ButtonInline]

class BulletInline(admin.StackedInline):
	model = ExperienceBullet

class ExperienceAdmin(admin.ModelAdmin):
	inlines = [BulletInline]

admin.site.register(Project, ProjectAdmin)
admin.site.register(ExperienceItem, ExperienceAdmin)
