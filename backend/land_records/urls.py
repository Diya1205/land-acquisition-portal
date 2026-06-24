from django.urls import path
from . import views 

from .views import (
    certificate_preview,
    get_districts,
    get_nivada_names,
    get_talukas,
    get_villages,
    officer_login,
    search_records,
    get_gat_numbers,
    get_survey_numbers,
    get_projects,
    export_pdf,
    get_nivada_numbers,
    login_mobile,
    create_certificate_request,
    officer_requests,
    approve_request,
    request_status,
    generate_certificate_pdf,
    upload_signed_pdf,
    original_record_image,
    original_record,
)

urlpatterns = [

    path(
        'districts/',
        get_districts
    ),

    path(
        'talukas/',
        get_talukas
    ),

    path(
        'villages/',
        get_villages
    ),

    path(
        'user/',
        search_records
    ),
    path(
        'gat-numbers/',
        get_gat_numbers
    ),
    path(
        'nivada-numbers/',
        get_nivada_numbers
    ),
    path(
    'nivada-names/',
        get_nivada_names
    ),
    path(
        'survey-numbers/',
        get_survey_numbers
    ),

    path(
        'projects/',
        get_projects
    ),
    
    path(
        'export/pdf/',
        export_pdf
    ),
    path(
        'login/',
        login_mobile
    ),
    path(
        'certificate/request/',
        create_certificate_request
    ),
    path(
        "officer/requests/<int:officer_id>/",
        officer_requests
    ),
    path(
        "officer/request/approve/<int:request_id>/",
        approve_request
    ),
   path(
        "officer/login/",
        officer_login
    ),
    path(
        "request/status/",
        request_status
    ),
    path(
        "officer/request/generate-pdf/<int:request_id>/",
        generate_certificate_pdf
    ),
    path(
        "officer/request/upload-signed/<int:request_id>/",
        upload_signed_pdf
    ),
    path(
        "designations/",
        views.get_designations
    ),
    path(
        "certificate-preview/",
        certificate_preview
    ),
    path(
        "original-record/<int:record_id>/",
        original_record,
    ),

    path(
        "original-record-image/<int:record_id>/",
        original_record_image,
    ),
    path(
        "request-status/",
        request_status
    ),
]