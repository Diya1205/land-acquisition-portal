from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from django.conf import settings
from django.http import HttpResponse
from datetime import datetime, timedelta
from django.template.loader import get_template
from weasyprint import HTML
from io import BytesIO
from django.core.files.base import ContentFile
from django.core.mail import send_mail
from django.utils import timezone
from django.core.mail import EmailMessage
from django.db.models.functions import Length
from .models import (
    ReportRequest,
    Nivada,
    OfficerMaster,
    CertificateRequest,
    Designation,
    ScanPg,

)
from weasyprint import HTML
from pdf2image import convert_from_bytes
from io import BytesIO
from django.db import transaction
import base64
from land_records.pagination import NivadaPagination

@api_view(['GET'])
def get_districts(request):
    return Response(["अहमदनगर"])

def has_value(value):
    return value not in [None, "", "nan", "NaN", "-"]


def is_land_acquired(record):
    return (
        has_value(record.nvd_land_numb)
        and record.nvd_land_no_type in [
            'Survey No',
            'Gat No'
        ]
    )

def valid_records():
    return (
        Nivada.objects
        .filter(nvd_district='अहमदनगर')
    )


def apply_common_filters(queryset, request, skip_field=None):
    district = request.GET.get('district')
    taluka = request.GET.get('taluka')
    village = request.GET.get('village')
    project_name = request.GET.get('project_name')
    nivada_name = request.GET.get('nivada_name')
    survey_number = request.GET.get('survey_number')
    gat_number = request.GET.get('gat_number')

    if district and skip_field != 'district':
        queryset = queryset.filter(nvd_district=district)

    if taluka and skip_field != 'taluka':
        queryset = queryset.filter(nvd_tahsil=taluka)

    if village and skip_field != 'village':
        queryset = queryset.filter(nvd_village=village)

    if project_name and skip_field != 'project':
        queryset = queryset.filter(nvd_project=project_name)

    if nivada_name and skip_field != 'nivada_name':
        queryset = queryset.filter(nvd_name=nivada_name)

    if survey_number and skip_field != 'survey_number':
        queryset = queryset.filter(
            nvd_land_no_type='Survey No',
            nvd_land_numb=survey_number
        )

    if gat_number and skip_field != 'gat_number':
        queryset = queryset.filter(
            nvd_land_no_type='Gat No',
            nvd_land_numb=gat_number
        )

    return queryset


def get_survey_value(record):
    if record.nvd_land_no_type == 'Survey No':
        return record.nvd_land_numb
    return '-'


def get_gat_value(record):
    if record.nvd_land_no_type == 'Gat No':
        return record.nvd_land_numb
    return '-'


@api_view(['GET'])
def get_talukas(request):
    queryset = apply_common_filters(
        valid_records(),
        request,
        skip_field='taluka'
    )

    talukas = (
        queryset
        .exclude(nvd_tahsil__isnull=True)
        .exclude(nvd_tahsil='')
        .exclude(nvd_tahsil='-')
        .values_list('nvd_tahsil', flat=True)
        .distinct()
        .order_by('nvd_tahsil')
    )

    return Response(list(talukas))


@api_view(['GET'])
def get_villages(request):
    queryset = apply_common_filters(
        valid_records(),
        request,
        skip_field='village'
    )

    villages = (
        queryset
        .exclude(nvd_village__isnull=True)
        .exclude(nvd_village='')
        .exclude(nvd_village='-')
        .values_list('nvd_village', flat=True)
        .distinct()
        .order_by('nvd_village')
    )

    return Response(list(villages))


@api_view(['GET'])
def get_projects(request):
    queryset = apply_common_filters(
        valid_records(),
        request,
        skip_field='project'
    )

    projects = (
        queryset
        .exclude(nvd_project__isnull=True)
        .exclude(nvd_project='')
        .exclude(nvd_project='-')
        .values_list('nvd_project', flat=True)
        .distinct()
        .order_by('nvd_project')
    )

    return Response(list(projects))


@api_view(['GET'])
def get_nivada_numbers(request):
    queryset = apply_common_filters(valid_records(), request)

    nivada_numbers = (
        queryset
        .exclude(nvd_nivada__isnull=True)
        .exclude(nvd_nivada='')
        .exclude(nvd_nivada='-')
        .values_list('nvd_nivada', flat=True)
        .distinct()
        .order_by('nvd_nivada')
    )

    return Response(list(nivada_numbers))


@api_view(['GET'])
def get_nivada_names(request):
    queryset = apply_common_filters(
        valid_records(),
        request,
        skip_field='nivada_name'
    )
    
    nivada_names = (
        queryset
        .exclude(nvd_name__isnull=True)
        .exclude(nvd_name='')
        .exclude(nvd_name='-')
        .values_list('nvd_name', flat=True)
        .distinct()
        .order_by('nvd_name')
    )

    return Response(list(nivada_names))


@api_view(['GET'])
def get_survey_numbers(request):
    queryset = apply_common_filters(
        valid_records(),
        request,
        skip_field='survey_number'
    ).filter(
        nvd_land_no_type='Survey No'
    )

    survey_numbers = (
        queryset
        .exclude(nvd_land_numb__isnull=True)
        .exclude(nvd_land_numb='')
        .exclude(nvd_land_numb='-')
        .values_list('nvd_land_numb', flat=True)
        .distinct()
        .order_by('nvd_land_numb')
    )

    return Response(list(survey_numbers))


@api_view(['GET'])
def get_gat_numbers(request):
    queryset = apply_common_filters(
        valid_records(),
        request,
        skip_field='gat_number'
    ).filter(
        nvd_land_no_type='Gat No'
    )

    gat_numbers = (
        queryset
        .exclude(nvd_land_numb__isnull=True)
        .exclude(nvd_land_numb='')
        .exclude(nvd_land_numb='-')
        .values_list('nvd_land_numb', flat=True)
        .distinct()
        .order_by('nvd_land_numb')
    )

    return Response(list(gat_numbers))

@api_view(['GET'])
def search_records(request):

    queryset = apply_common_filters(
        valid_records(),
        request
    )
    
    # Hide records without a valid owner name
    queryset = queryset.exclude(
        Q(nvd_name__isnull=True) |
        Q(nvd_name="") |
        Q(nvd_name="-")
    )
    
    queryset = queryset.order_by(
        'nvd_district',
        'nvd_tahsil',
        'nvd_village',
        'nvd_project',
        'nvd_name'
    )

    paginator = NivadaPagination()

    page = paginator.paginate_queryset(
        queryset,
        request
    )

    data = []

    for record in page:

        data.append({
            "id": record.id,
            "volume_no": record.volume_no,
            "page_no": record.page_no,
            "entryno": record.entryno,
            "office": record.nvd_office,
            "district": record.nvd_district,
            "taluka": record.nvd_tahsil,
            "village": record.nvd_village,
            "project_name": record.nvd_project,
            "nivada_number": record.nvd_nivada,
            "nivada_date": record.nvd_nivadadate or record.nvd_nivadadt,
            "Nvd_Name": record.nvd_name,
            "survey_number": get_survey_value(record),
            "gat_number": get_gat_value(record),
            "land_area": record.nvd_area,
            "file_number": record.nvd_fileno,
            "remarks": record.nvd_remarks,
        })

    return paginator.get_paginated_response(data)



@api_view(['GET'])
def export_pdf(request):
    record_id = request.GET.get('record_id')

    applicant_name = request.GET.get('applicant_name')
    mobile_number = request.GET.get('mobile_number')
    address_village = request.GET.get('address_village')
    address_taluka = request.GET.get('address_taluka')
    address_district = request.GET.get('address_district')

    try:
        record = Nivada.objects.get(id=record_id)

    except Nivada.DoesNotExist:
        return Response(
            {"error": "Record not found"},
            status=404
        )

    def has_value(value):
        return value not in [None, "", "nan", "NaN", "-"]

    is_acquired = is_land_acquired(record)

    record_data = {
        "id": record.id,
        "office": record.nvd_office,
        "district": record.nvd_district,
        "taluka": record.nvd_tahsil,
        "village": record.nvd_village,
        "project_name": record.nvd_project,
        "nivada_number": record.nvd_nivada,
        "nivada_date": record.nvd_nivadadate or record.nvd_nivadadt,
        "Nvd_Name": record.nvd_name,
        "survey_number": get_survey_value(record),
        "gat_number": get_gat_value(record),
        "land_area": record.nvd_area,
        "volume_number": record.volume_no,
        "file_number": record.nvd_fileno,
        "remarks": record.nvd_remarks,
    }

    template = get_template('reports/nivada_report.html')

    context = {
        'record': record_data,
        'applicant_name': applicant_name,
        'mobile_number': mobile_number,
        'address_village': address_village,
        'address_taluka': address_taluka,
        'address_district': address_district,
        'current_date': datetime.now().strftime("%d/%m/%Y"),
        'is_acquired': is_acquired,
        'font_path': (
            settings.BASE_DIR
            / 'static'
            / 'fonts'
            / 'NotoSerifDevanagari-Regular.ttf'
        ).as_uri(),
        'bold_font_path': (
            settings.BASE_DIR
            / 'static'
            / 'fonts'
            / 'NotoSerifDevanagari-Bold.ttf'
        ).as_uri(),
        'logo_path': 'file:///D:/land_acquisition_portal/backend/assets/logo.png',
    }

    html = template.render(context)

    pdf_buffer = BytesIO()

    HTML(
        string=html,
        base_url=request.build_absolute_uri('/')
    ).write_pdf(target=pdf_buffer)

    pdf_buffer.seek(0)

    pdf_content = pdf_buffer.getvalue()

    report_request = ReportRequest.objects.create(
        applicant_name=applicant_name,
        mobile_number=mobile_number,
        district=record.nvd_district,
        taluka=record.nvd_tahsil,
        village=record.nvd_village,
        project_name=record.nvd_project,
        nivada_name=record.nvd_name,
        survey_number=get_survey_value(record),
        gat_number=get_gat_value(record),
    )

    file_name = f"report_{report_request.id}.pdf"

    report_request.pdf_file.save(
        file_name,
        ContentFile(pdf_content)
    )

    response = HttpResponse(
        pdf_content,
        content_type='application/pdf'
    )

    response['Content-Disposition'] = (
        f'inline; filename="{file_name}"'
    )

    return response



@api_view(['POST'])
def login_mobile(request):

    mobile = request.data.get('mobile_number')

    if not mobile:
        return Response({
            'success': False,
            'message': 'Mobile number required'
        })

    latest_request = (
        CertificateRequest.objects
        .filter(mobile_number=mobile)
        .order_by('-requested_at')
        .first()
    )

    if latest_request:

        return Response({
            'success': True,
            'mobile_number': mobile,

            'last_request': {
                'applicant_name': latest_request.applicant_name,
            
                'email': latest_request.email,
                'mobile_number': latest_request.mobile_number,
                'address_district':
                    latest_request.address_district,
            
                'address_taluka':
                    latest_request.address_taluka,
            
                'address_village':
                    latest_request.address_village,
            
                'district': latest_request.district,
                'taluka': latest_request.taluka,
                'village': latest_request.village,
                'project_name': latest_request.project_name,
                'nivada_name': latest_request.nivada_name,
                'survey_number': latest_request.survey_number,
                'gat_number': latest_request.gat_number,
            }
        })

    return Response({
        'success': True,
        'mobile_number': mobile,
        'last_request': None
    })


@api_view(['POST'])
def create_certificate_request(request):

    record_id = request.data.get("record_id")
    volume_no = request.data.get("volume_no")
    page_no = request.data.get("page_no")
    entryno = request.data.get("entryno")
    applicant_name = request.data.get(
        "applicant_name"
    )

    mobile_number = request.data.get(
        "mobile_number"
    )

    email = request.data.get(
        "email"
    )

    address_district = request.data.get(
        "address_district"
    )

    address_taluka = request.data.get(
        "address_taluka"
    )

    address_village = request.data.get(
        "address_village"
    )

    district = request.data.get(
        "district"
    )

    taluka = request.data.get(
        "taluka"
    )

    village = request.data.get(
        "village"
    )

    project_name = request.data.get(
        "project_name"
    )

    nivada_name = request.data.get(
        "nivada_name"
    )

    survey_number = request.data.get(
        "survey_number"
    )

    gat_number = request.data.get(
        "gat_number"
    )

    if not applicant_name:
        return Response(
            {"error": "Applicant name required"},
            status=400
        )

    if not mobile_number:
        return Response(
            {"error": "Mobile number required"},
            status=400
        )

    if not taluka:
        return Response(
            {"error": "Taluka required"},
            status=400
        )
    
    last_request = (
        CertificateRequest.objects
        .filter(
            mobile_number=mobile_number
        )
        .order_by("-requested_at")
        .first()
    )
    
    if (
        last_request and
        timezone.now() - last_request.requested_at < timedelta(hours=24)
    ):
        return Response(
            {
                "error": "Request already submitted today."
            },
            status=400
        )

    TALUKA_MAPPING = {

        "राहाता": "शिर्डी",
        "कोपरगाव": "शिर्डी",
    
        "शेवगाव": "पाथर्डी",
    
        "पारनेर": "श्रीगोंदा",
    
        "जामखेड": "कर्जत",
    
        "अकोले": "संगमनेर",
    
        "राहुरी": "श्रीरामपूर",
    
        "नेवासा": "अहमदनगर",
    
    }
    
    mapped_taluka = TALUKA_MAPPING.get(
        taluka,
        taluka
    )
    
    officer = OfficerMaster.objects.filter(
        taluka=mapped_taluka,
        
    ).first()

    certificate_request = (
        CertificateRequest.objects.create(

            record_id=record_id,
            volume_no=volume_no,
            page_no=page_no,
            entryno=entryno,
            officer_id=(
                officer.officer_id
                if officer
                else None
            ),

            applicant_name=applicant_name,

            mobile_number=mobile_number,

            email=email,

            address_district=
            address_district,

            address_taluka=
            address_taluka,

            address_village=
            address_village,

            district=district,

            taluka=taluka,

            village=village,

            project_name=project_name,

            nivada_name=nivada_name,

            survey_number=survey_number,

            gat_number=gat_number,

            status="Pending"
        )
    )

    send_mail(
        subject="New Certificate Request",
        message=f"""
    Applicant Name: {applicant_name}

    Mobile Number: {mobile_number}

    Taluka: {taluka}

    Village: {village}

    Project: {project_name}

    Request Id: {certificate_request.id}
    """,
        from_email=None,
        recipient_list=[
            "diya.patil1205@gmail.com"
        ],
        fail_silently=False,
    )

    return Response({

        "success": True,

        "request_id":
        certificate_request.id,

        "officer_id":
        certificate_request.officer_id,

        "officer_name":
        officer.officer_name
        if officer
        else None,

        "officer_email":
        officer.email_id
        if officer
        else None,

        "status":
        certificate_request.status
    })



@api_view(["GET"])
def officer_requests(request, officer_id):

    officer = OfficerMaster.objects.filter(
        officer_id=officer_id
    ).first()

    if officer and officer.designation_id in [1, 2, 26, 3, 4]:

        requests = (
            CertificateRequest.objects
            .filter(status="Pending")
            .order_by("-requested_at")
        )

    else:

        requests = (
            CertificateRequest.objects
            .filter(
                officer_id=officer_id,
                status="Pending"
            )
            .order_by("-requested_at")
        )

    data = []

    for r in requests:
        data.append({

            "id": r.id,

            "applicant_name": r.applicant_name,

            "mobile_number": r.mobile_number,

            "address_district": r.address_district,

            "address_taluka": r.address_taluka,

            "address_village": r.address_village,

            "district": r.district,

            "taluka": r.taluka,

            "village": r.village,

            "project_name": r.project_name,

            "nivada_name": r.nivada_name,

            "survey_number": r.survey_number,

            "gat_number": r.gat_number,

            "status": r.status,

            "requested_at": r.requested_at,

            "pdf_file":
                r.pdf_file.url
                if r.pdf_file
                else None,

            "signed_pdf_file":
                r.signed_pdf_file.url
                if r.signed_pdf_file
                else None,
        })

    return Response(data)

@api_view(["POST"])
def approve_request(request, request_id):

    certificate_request = (
        CertificateRequest.objects
        .filter(id=request_id)
        .first()
    )

    if not certificate_request:
        return Response(
            {"error": "Request not found"},
            status=404
        )
    # Prevent duplicate approval
    if certificate_request.status == "Approved":
        return Response(
            {
                "error": "Request already approved"
            },
            status=400
        )
    record = Nivada.objects.get(
        id=certificate_request.record_id,
        volume_no=certificate_request.volume_no,
        page_no=certificate_request.page_no,
        entryno=certificate_request.entryno
    )
    officer = OfficerMaster.objects.filter(
        officer_id=certificate_request.officer_id
    ).first()
    record_data = {
        "id": record.id,
        "office": record.nvd_office,
        "district": record.nvd_district,
        "taluka": record.nvd_tahsil,
        "village": record.nvd_village,
        "project_name": record.nvd_project,
        "nivada_number": record.nvd_nivada,
        "nivada_date": record.nvd_nivadadate or record.nvd_nivadadt,
        "Nvd_Name": record.nvd_name,
        "survey_number": get_survey_value(record),
        "gat_number": get_gat_value(record),
        "land_no_type": record.nvd_land_no_type,
        "land_area": record.nvd_area,
        "volume_number": record.volume_no,
        "file_number": record.nvd_fileno,
        "remarks": record.nvd_remarks,
    }

    template = get_template(
        "reports/nivada_report.html"
    )

    context = {
        "record": record_data,
        "applicant_name":
            certificate_request.applicant_name,
        "mobile_number":
            certificate_request.mobile_number,
        "email": certificate_request.email,
        "address_village":
            certificate_request.address_village,
        "address_taluka":
            certificate_request.address_taluka,
        "address_district":
            certificate_request.address_district,
        "officer_address": officer.address if officer else "-",    
        "is_acquired": is_land_acquired(record),
        "officer_email":
            officer.email_id
            if officer
            else "-",
        "officer_name": officer.officer_name if officer else "-",
        "designation_id": officer.designation_id if officer else "-",
        # "officer_designation": officer.designation.designation if officer and officer.designation else "-",
        "current_date":
            datetime.now().strftime("%d/%m/%Y"),
            
        "font_path": (
            settings.BASE_DIR
            / "fonts"
            / "NotoSerifDevanagari-Regular.ttf"
        ).as_uri(),
        
        "bold_font_path": (
            settings.BASE_DIR
            / "fonts"
            / "NotoSerifDevanagari-Regular.ttf"
        ).as_uri(),
        
        "logo_path": (
            settings.BASE_DIR
            / "assets"
            / "logo.png"
        ).as_uri(),
    }

    html = template.render(context)

    pdf_buffer = BytesIO()

    HTML(
        string=html,
        base_url=request.build_absolute_uri("/")
    ).write_pdf(
        target=pdf_buffer
    )

    pdf_buffer.seek(0)

    file_name = (
        f"certificate_{certificate_request.id}.pdf"
    )

    certificate_request.pdf_file.save(
        file_name,
        ContentFile(
            pdf_buffer.getvalue()
        )
    )

    certificate_request.status = "Approved"

    certificate_request.approved_at = (
        timezone.now()
    )

    certificate_request.save()
    print("EMAIL =", certificate_request.email)
    if certificate_request.email:

        email = EmailMessage(
            subject="Land Acquisition Certificate Approved",
            body=f"""
    Dear {certificate_request.applicant_name},

    Your certificate request has been approved.

    Request ID: {certificate_request.id}

    Please find the certificate attached.

    Thank You.
    """,
            from_email=None,
            to=[certificate_request.email],
        )

        email.attach(
            file_name,
            pdf_buffer.getvalue(),
            "application/pdf"
        )

        email.send(
            fail_silently=False
        )



    return Response({
        "success": True,
        "pdf_file":
            certificate_request.pdf_file.url
    })

@api_view(["POST"])
def officer_login(request):

    designation_id = request.data.get(
        "designation_id"
    )

    password = request.data.get(
        "password"
    )

    officer = OfficerMaster.objects.filter(
        designation_id=designation_id,
        password=password
    ).first()

    if not officer:

        return Response(
            {
                "error":
                "Invalid Designation or Password"
            },
            status=401
        )

    return Response({

        "officer_id":
            officer.officer_id,

        "officer_name":
            officer.officer_name,

        "designation_id":
            officer.designation_id,

        "email":
            officer.email_id,

        "taluka":
            officer.taluka

    })

@api_view(["POST"])
def request_status(request):

    mobile_number = request.data.get(
        "mobile_number"
    )

    if not mobile_number:
        return Response(
            {
                "error": "Mobile number required"
            },
            status=400
        )

    requests = (
        CertificateRequest.objects
        .filter(
            mobile_number=mobile_number
        )
        .order_by("-requested_at")
    )

    data = []

    for r in requests:
        data.append({

            "id": r.id,

            "status": r.status,

            "requested_at": r.requested_at,

            "approved_at": r.approved_at,

            "project_name": r.project_name,

            "nivada_name": r.nivada_name,

            "taluka": r.taluka,

            "village": r.village,
        })

    return Response(data)

@api_view(["POST"])
def generate_certificate_pdf(request, request_id):

    certificate_request = (
        CertificateRequest.objects
        .filter(id=request_id)
        .first()
    )

    if not certificate_request:
        return Response(
            {"error": "Request not found"},
            status=404
        )

    record = Nivada.objects.get(
        id=certificate_request.record_id,
        volume_no=certificate_request.volume_no,
        page_no=certificate_request.page_no,
        entryno=certificate_request.entryno
    )
    officer = OfficerMaster.objects.filter(
        officer_id=certificate_request.officer_id
    ).first()
    record_data = {
        "id": record.id,
        "office": record.nvd_office,
        "district": record.nvd_district,
        "taluka": record.nvd_tahsil,
        "village": record.nvd_village,
        "project_name": record.nvd_project,
        "nivada_number": record.nvd_nivada,
        "nivada_date": record.nvd_nivadadate or record.nvd_nivadadt,
        "Nvd_Name": record.nvd_name,
        "survey_number": get_survey_value(record),
        "gat_number": get_gat_value(record),
        "land_no_type": record.nvd_land_no_type,
        "land_area": record.nvd_area,
        "volume_number": record.volume_no,
        "file_number": record.nvd_fileno,
        "remarks": record.nvd_remarks,
    }

    template = get_template(
        "reports/nivada_report.html"
    )

    context = {
        "record": record_data,
        "applicant_name":
            certificate_request.applicant_name,
        "mobile_number":
            certificate_request.mobile_number,
        "address_village":
            certificate_request.address_village,
        "address_taluka":
            certificate_request.address_taluka,
        "address_district":
            certificate_request.address_district,
        "current_date":
            datetime.now().strftime("%d/%m/%Y"),
        "is_acquired": is_land_acquired(record),
        "officer_email":
            officer.email_id
            if officer
            else "-",
        "officer_address": officer.address if officer else "-",
        "officer_name": officer.officer_name if officer else "-",
        "designation_id": officer.designation_id if officer else "-",
        # "officer_designation": officer.designation.designation if officer and officer.designation else "-",
        "font_path": (
            settings.BASE_DIR
            / "fonts"
            / "NotoSerifDevanagari-Regular.ttf"
        ).as_uri(),
        
        "bold_font_path": (
            settings.BASE_DIR
            / "fonts"
            / "NotoSerifDevanagari-Regular.ttf"
        ).as_uri(),
        
        "logo_path": (
            settings.BASE_DIR
            / "assets"
            / "logo.png"
        ).as_uri(),
    }

    html = template.render(context)

    pdf_buffer = BytesIO()

    HTML(
        string=html,
        base_url=request.build_absolute_uri("/")
    ).write_pdf(
        target=pdf_buffer
    )

    pdf_buffer.seek(0)

    file_name = (
        f"certificate_{certificate_request.id}.pdf"
    )

    certificate_request.pdf_file.save(
        file_name,
        ContentFile(
            pdf_buffer.getvalue()
        )
    )

    certificate_request.save()

    return Response({
        "success": True,
        "pdf_file":
            certificate_request.pdf_file.url
    })


@api_view(["POST"])
@transaction.atomic
def upload_signed_pdf(request, request_id):

    try:
        certificate_request = (
            CertificateRequest.objects
            .select_for_update()
            .get(id=request_id)
        )
    except CertificateRequest.DoesNotExist:
        return Response(
            {"error": "Request not found"},
            status=404
        )
        
    if certificate_request.status == "Approved":
        return Response(
            {
                "error": "Request already processed"
            },
            status=400
        )

    if certificate_request.signed_pdf_file:
        return Response(
            {
                "error": "Signed PDF already uploaded"
            },
            status=400
        )
    signed_pdf = request.FILES.get(
        "signed_pdf"
    )

    if not signed_pdf:
        return Response(
            {"error": "Signed PDF required"},
            status=400
        )

    certificate_request.signed_pdf_file = (
        signed_pdf
    )

    certificate_request.status = (
        "Approved"
    )

    certificate_request.approved_at = (
        timezone.now()
    )

    certificate_request.save()
    print("EMAIL =", certificate_request.email)
    if certificate_request.email:
        print("ENTERED EMAIL BLOCK")
        email = EmailMessage(
            subject="Land Acquisition Certificate Approved",
            body=f"""
Dear {certificate_request.applicant_name},

Your certificate request has been approved.

Request ID: {certificate_request.id}

Please find the signed certificate attached.
""",
            
            from_email=None,
            to=[
                certificate_request.email
            ]
        )

        signed_pdf.seek(0)

        pdf_bytes = signed_pdf.read()

        print("PDF SIZE =", len(pdf_bytes))

        email.attach(
            signed_pdf.name,
            pdf_bytes,
            "application/pdf"
        )
        print("BEFORE SEND")
        result = email.send(
            fail_silently=False
        )

        print("SEND RESULT =", result)
        print("AFTER SEND")
    return Response({
        "success": True
    })


@api_view(["GET"])
def get_designations(request):

    designations = (
        Designation.objects
        .all()
        .order_by("designation_id")
    )

    data = []

    for d in designations:

        data.append({
            "designation_id": d.designation_id,
            "designation": d.designation
        })

    return Response(data)


@api_view(["POST"])
def certificate_preview(request):

    record_id = request.data.get("record_id")
    volume_no = request.data.get("volume_no")
    page_no = request.data.get("page_no")
    entryno = request.data.get("entryno")

    try:
        record = Nivada.objects.get(
            id=record_id,
            volume_no=volume_no,
            page_no=page_no,
            entryno=entryno
        )

    except Nivada.DoesNotExist:
        return Response(
            {"error": "Record not found"},
            status=404
        )

    record_data = {
        "id": record.id,
        "office": record.nvd_office,
        "district": record.nvd_district,
        "taluka": record.nvd_tahsil,
        "village": record.nvd_village,
        "project_name": record.nvd_project,
        "nivada_number": record.nvd_nivada,
        "nivada_date": record.nvd_nivadadate or record.nvd_nivadadt,
        "Nvd_Name": record.nvd_name,
        "survey_number": get_survey_value(record),
        "gat_number": get_gat_value(record),
        "land_no_type": record.nvd_land_no_type,
        "land_area": record.nvd_area,
        "volume_number": record.volume_no,
        "file_number": record.nvd_fileno,
        "remarks": record.nvd_remarks,
    }

    taluka = record.nvd_tahsil

    TALUKA_MAPPING = {
        "राहाता": "शिर्डी",
        "कोपरगाव": "शिर्डी",
        "शेवगाव": "पाथर्डी",
        "पारनेर": "श्रीगोंदा",
        "जामखेड": "कर्जत",
        "अकोले": "संगमनेर",
        "राहुरी": "श्रीरामपूर",
        "श्रीरामपुर": "श्रीरामपूर",
        "नेवासा": "अहमदनगर",
    }

    mapped_taluka = TALUKA_MAPPING.get(
        taluka,
        taluka
    )

    officer = OfficerMaster.objects.filter(
        taluka=mapped_taluka
    ).first()
    

    template = get_template(
        "reports/nivada_preview.html"
    )

    context = {
        "record": record_data,

        "applicant_name":
            request.data.get(
                "applicant_name"
            ),

        "mobile_number":
            request.data.get(
                "mobile_number"
            ),
         "email":
            request.data.get("email"),

        "address_village":
            request.data.get(
                "address_village"
            ),

        "address_taluka":
            request.data.get(
                "address_taluka"
            ),

        "address_district":
            request.data.get(
                "address_district"
            ),

        "current_date":
            datetime.now().strftime("%d/%m/%Y"),

        "is_acquired":
            is_land_acquired(record),

        "officer_name":
            officer.officer_name if officer else "PREVIEW COPY",

        "officer_email":
            officer.email_id if officer else "-",

        "officer_address":
            officer.address if officer else "-",
           

        "preview_mode":
            True,

        "font_path": (
            settings.BASE_DIR
            / "fonts"
            / "NotoSerifDevanagari-Regular.ttf"
        ).as_uri(),

        "bold_font_path": (
            settings.BASE_DIR
            / "fonts"
            / "NotoSerifDevanagari-Regular.ttf"
        ).as_uri(),

        "logo_path": (
            settings.BASE_DIR
            / "assets"
            / "logo.png"
        ).as_uri(),
    }

    html = template.render(context)

    pdf = HTML(
        string=html,
        base_url=str(settings.BASE_DIR)
    ).write_pdf()
    
    # Convert PDF -> Image
    images = convert_from_bytes(pdf)
    
    img = images[0]
    
    buffer = BytesIO()
    
    img.save(
        buffer,
        format="PNG"
    )
    
    image_base64 = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")
    
    return Response({
        "image": image_base64
    })


@api_view(["GET"])
def original_record(request, record_id):

    try:
        nivada = Nivada.objects.get(id=record_id)

    except Nivada.DoesNotExist:
        return Response(
            {"error": "Record not found"},
            status=404
        )

    page = ScanPg.objects.filter(
        volume_no=nivada.volume_no,
        page_no=nivada.page_no
    ).first()

    return Response({
        "record_id": nivada.id,
        "volume_no": nivada.volume_no,
        "page_no": nivada.page_no,
        "image_available": page is not None,
        "image_url": (
            f"/api/original-record-image/{record_id}/"
            if page
            else None
        )
    })

@api_view(["GET"])
def original_record_image(request, record_id):

    try:
        nivada = Nivada.objects.get(
            id=record_id
        )

    except Nivada.DoesNotExist:

        return HttpResponse(
            "Record not found",
            status=404
        )

    try:

        scan_page = ScanPg.objects.get(
            volume_no=nivada.volume_no,
            page_no=nivada.page_no
        )

    except ScanPg.DoesNotExist:

        return HttpResponse(
            "Image not found",
            status=404
        )

    return HttpResponse(
        scan_page.imageimg,
        content_type="image/jpeg"
    )








