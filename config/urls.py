from django.conf.urls import patterns, include


urlpatterns = patterns('',
    (r'', include('mmotd.urls')),
    (r'^appengine_sessions/', include('compat.sessions.urls')),
)
