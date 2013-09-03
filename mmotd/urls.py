# third-party imports
from django.conf.urls import patterns
from django.conf.urls import url
from django.core.urlresolvers import reverse_lazy
from django.views.generic import RedirectView


urlpatterns = patterns('',

    # mmotd routes
    url(r'^$', RedirectView.as_view(url=reverse_lazy('mmotd-login')), name='mmotd-index'),
    url(r'^lobby/$', 'mmotd.views.lobby.lobby_view', {}, name='mmotd-lobby'),
    url(r'^lobby/new/$', 'mmotd.views.lobby.newgame_view', {}, name='mmotd-newgame'),
    url(r'^lobby/(\d+)/$', 'mmotd.views.lobby.pregame_view', {}, name='mmotd-pregame'),
    url(r'^lobby/(\d+)/channel_control/chat/$', 'mmotd.views.lobby.pregame_chat_view', {}, name='mmotd-pregame-chat'),
    url(r'^lobby/(\d+)/channel_control/replay_chat/$', 'mmotd.views.lobby.pregame_replay_chat_view', {}, name='mmotd-pregame-replay-chat'),
    url(r'^lobby/(\d+)/channel_control/status_update/$', 'mmotd.views.lobby.pregame_status_update_view', {}, name='mmotd-pregame-status-update'),
    url(r'^login/$', 'mmotd.views.auth.login_view', {}, name='mmotd-login'),

    # taskqueue routes
    url(r'^_async/replay_chat/$', 'mmotd.views.async.replay_chat', {}, name='mmotd-async-replay-chat'),

)
