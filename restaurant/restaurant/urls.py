from django.conf.urls import patterns, include, url
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'restaurant.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^', include('apps.restaurants.urls')),

    url(r'^admin/', include(admin.site.urls)),

    #Esta URL sirve para visualizar las imagenes
    url(r'^media/(?P<path>.*)$','django.views.static.serve',
    		#importamos el settings, arriba
    		{'document_root':settings.MEDIA_ROOT,}
    	),

    #esta URL nos la da Python-SocialAOuth, para poder hacer login
    url('', include('social.apps.django_app.urls', namespace='social')),
)
