import rest_framework.serializers

from django.db.models import Model
from django.conf import settings

class ModelSerializer(rest_framework.serializers.ModelSerializer):
    def __init__(self, instance=None, data=None, files=None,
                 context=None, partial=False, many=None,
                 allow_add_remove=False, **kwargs):
        '''
        Allow for instances to be passed instead of strictly pks
        '''
        super(ModelSerializer, self).__init__(instance=instance, data=data,
                files=files, context=context, partial=partial, many=many,
                allow_add_remove=allow_add_remove, **kwargs)

        if isinstance(self.init_data, dict):
            for k,v in self.init_data.iteritems():
                if issubclass(v.__class__, Model):
                    self.init_data[k] = v.pk

    def quicksave(self):
        '''
        A convenience method only allowed in a testing environment. DRF by
        default only lets you save serializer instances after running is_valid.
        This clutters up the tests a bit.
        '''
        if not settings.TESTING:
            raise NotImplementedError('quicksave only avalible in testing mode')

        if self.is_valid():
            return self.save()
        else:
            raise AssertionError(self.errors)
