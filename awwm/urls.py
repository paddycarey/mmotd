# third-party imports
from django.conf.urls import patterns
from django.conf.urls import url
from django.core.urlresolvers import reverse_lazy
from django.views.generic import RedirectView


urlpatterns = patterns('',

    # AWWM routes
    url(r'^$', RedirectView.as_view(url=reverse_lazy('awwm-login')), name='awwm-index'),
    url(r'^lobby/$', 'awwm.views.lobby.lobby_view', {}, name='awwm-lobby'),
    url(r'^lobby/new/$', 'awwm.views.lobby.newgame_view', {}, name='awwm-newgame'),
    url(r'^lobby/(\d+)/$', 'awwm.views.lobby.pregame_view', {}, name='awwm-pregame'),
    url(r'^lobby/(\d+)/channel_control/chat/$', 'awwm.views.lobby.pregame_chat_view', {}, name='awwm-pregame-chat'),
    url(r'^lobby/(\d+)/channel_control/replay_chat/$', 'awwm.views.lobby.pregame_replay_chat_view', {}, name='awwm-pregame-replay-chat'),
    url(r'^lobby/(\d+)/channel_control/status_update/$', 'awwm.views.lobby.pregame_status_update_view', {}, name='awwm-pregame-status-update'),
    url(r'^login/$', 'awwm.views.auth.login_view', {}, name='awwm-login'),

    # taskqueue routes
    url(r'^_async/replay_chat/$', 'awwm.views.async.replay_chat', {}, name='awwm-async-replay-chat'),

)
