from django.conf.urls import patterns, include, url
from django.contrib import admin
from apps.account import urls as acct_urls
from apps.chat import urls as chat_urls

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'groops.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include(acct_urls)),
    url(r'^', include(chat_urls)),
)
