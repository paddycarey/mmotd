# third-party imports
from django.conf.urls import patterns
from django.conf.urls import url



urlpatterns = patterns('',

    # mmotd routes
    url(r'^$', 'mmotd.views.template.unauthed.splash_view', name='template-unauthed-splash'),
    url(r'^game/$', 'mmotd.views.template.authed.game_view', name='template-authed-game'),

    # api routes
    url(r'^api/channel_relay/$', 'mmotd.views.api.channel.relay_view', name='api-channel-relay'),
    url(r'^api/channel_token/$', 'mmotd.views.api.ajax.token_view', name='api-ajax-token'),
    url(r'^api/game(?:/(?P<game_id>\d+))?/$', 'mmotd.views.api.ajax.game_view', name='api-ajax-game'),

)
