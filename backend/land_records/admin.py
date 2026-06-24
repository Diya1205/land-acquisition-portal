from django.contrib import admin

from .models import (
    LandRecord,
    ReportRequest
)


class LandRecordAdmin(admin.ModelAdmin):

    list_display = (
        'district',
        'taluka',
        'village',
        'gat_number',
        'survey_number',
        'project_name',
    )

    search_fields = (
        'district',
        'taluka',
        'village',
        'survey_number',
        'gat_number',
    )


admin.site.register(
    LandRecord,
    LandRecordAdmin
)

@admin.register(ReportRequest)
class ReportRequestAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'applicant_name',
        'mobile_number',
        'district',
        'taluka',
        'village',
        'generated_at',
        'pdf_file'
    )

    search_fields = (
        'applicant_name',
        'mobile_number',
        'district',
        'taluka',
        'village'
    )

    list_filter = (
        'district',
        'taluka',
        'generated_at'
    )

    readonly_fields = (
        'generated_at',
    )