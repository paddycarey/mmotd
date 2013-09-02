from django.conf.urls import patterns, url
from compat.sessions import views

urlpatterns = patterns(
    '',
    url(r'^clean-up/$', views.SessionCleanUpCron.as_view(), {}, name='session-clean-up'),
)
