"""
Authorised template views
"""
# local imports
from mmotd.views.template.decorators import login_required
from mmotd.views.template.decorators import render_with_template


@login_required
@render_with_template('game.html')
def game_view(request, url_frag=None):
    return {}
