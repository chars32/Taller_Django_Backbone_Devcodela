from django.shortcuts import render
from django.views.generic import TemplateView

from .models import Category, Payment, City, Restaurant

class IndexView(TemplateView):

	template_name = 'index.html'

	def get_context_data(self, **kwargs):
	    context = super(IndexView, self).get_context_data(**kwargs)
	    context['categories'] = Category.objects.all()
	    context['payments'] = Payment.objects.all()
	    context['cities'] = City.objects.all()
	    #-----como pasar los tips-----
	    # 1. declaramos variable restaurant que contendra la consulta al modelo
	    #Restaurant y filtrara los ultimos 5
	    restaurants = Restaurant.objects.all()[:5]
	    #2. Creamos una varible tips que almacena una lista que contabiliza el 
	    #numero de tips por restauran
	    tips = [ restaurant.tip_set.all().count() for restaurant in restaurants]
	    #3. pasamos al contexto de restaurants los tips y restaurants
	    context['restaurants'] = zip(restaurants, tips)
	    return context