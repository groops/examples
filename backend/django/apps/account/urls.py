from django.conf.urls import patterns, url, include
from rest_framework import routers
import views as acct_views

router = routers.SimpleRouter()
router.register(r'user', acct_views.UserViewSet)
router.register(r'profile', acct_views.ProfileViewSet)

router_patterns = patterns('',
    url(r'^api/', include(router.urls)),
)

non_router_patterns = patterns('',
    url(r'^main$', acct_views.main, name='main'),
    url(r'^register$', acct_views.register, name='register'),
    url(r'^login$', acct_views.login, name='login'),
    url(r'^authenticate$', acct_views.authenticate, name='authenticate'),
    url(r'^$', acct_views.intro),
)

urlpatterns = router_patterns + non_router_patterns
