from rest_framework import serializers

from .models import LandRecord, AcquisitionProofRequest


class LandRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = LandRecord
        fields = '__all__'


class AcquisitionProofRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = AcquisitionProofRequest
        fields = '__all__'
        read_only_fields = [
            'status',
            'officer_remarks',
            'reviewed_by',
            'reviewed_at',
            'created_at',
            'updated_at',
        ]