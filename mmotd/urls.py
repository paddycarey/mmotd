# third-party imports
from django.conf.urls import patterns
from django.conf.urls import url



urlpatterns = patterns('',

    # mmotd routes
    url(r'^$', 'mmotd.views.template.unauthed.splash_view', name='template-unauthed-splash'),
    url(r'^game/$', 'mmotd.views.template.authed.splash_view', name='template-authed-game'),

    # taskqueue routes
    url(r'^api/channel/relay/$', 'mmotd.views.api.channel.relay', name='api-channel-relay'),

)
