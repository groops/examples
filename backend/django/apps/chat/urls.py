from django.conf.urls import patterns, url, include
from rest_framework import routers
import views as chat_views

router = routers.SimpleRouter()
router.register(r'room', chat_views.RoomViewSet)
router.register(r'message', chat_views.MessageViewSet)

router_patterns = patterns('',
    url(r'^api/', include(router.urls)),
)

non_router_patterns = patterns('',
    url(r'^room/(?P<slug>[0-9a-zA-Z_-]+)$', chat_views.get_room),
)

urlpatterns = router_patterns + non_router_patterns
