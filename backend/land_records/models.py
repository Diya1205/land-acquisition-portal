from django.db import models


class LandRecord(models.Model):

    office = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    district = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    taluka = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    village = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    project_name = models.TextField(
        blank=True,
        null=True
    )

    nivada_number = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    Nvd_Name = models.TextField(
        blank=True,
        null=True
    )  

    nivada_date = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    survey_number = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    gat_number = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    land_area = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    volume_number = models.BigIntegerField(
        blank=True,
        null=True
    )

    file_number = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        
        indexes = [
            models.Index(fields=['district']),
            models.Index(fields=['taluka']),
            models.Index(fields=['village']),
            models.Index(fields=['survey_number']),
            models.Index(fields=['gat_number']),
            models.Index(fields=['project_name']),
        ]

        ordering = ['district', 'taluka', 'village']

    def __str__(self):
        return f"{self.village} - {self.gat_number}"
    

class ReportRequest(models.Model):

    applicant_name = models.CharField(
        max_length=255
    )

    mobile_number = models.CharField(
        max_length=20
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    district = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    taluka = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    village = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    project_name = models.TextField(
        blank=True,
        null=True
    )
    nivada_name = models.TextField(
        blank=True,
        null=True
    )
    survey_number = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    gat_number = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    generated_at = models.DateTimeField(
        auto_now_add=True
    )
    pdf_file = models.FileField(
        upload_to='reports/',
        blank=True,
        null=True
    )

    def __str__(self):

        return f"{self.applicant_name} - {self.village}"
    

class Nivada(models.Model):
    id = models.BigIntegerField(primary_key=True)

    nvd_office = models.CharField(max_length=255, blank=True, null=True)
    nvd_district = models.CharField(max_length=255, blank=True, null=True)
    nvd_tahsil = models.CharField(max_length=255, blank=True, null=True)
    nvd_village = models.CharField(max_length=255, blank=True, null=True)
    nvd_project = models.TextField(blank=True, null=True)
    nvd_nivada = models.CharField(max_length=100, blank=True, null=True)
    nvd_nivadadate = models.CharField(max_length=100, blank=True, null=True)
    nvd_name = models.TextField(blank=True, null=True)

    nvd_survey = models.CharField(max_length=100, blank=True, null=True)
    nvd_gatno = models.CharField(max_length=100, blank=True, null=True)
    nvd_gat_no = models.CharField(max_length=100, blank=True, null=True)
    nvd_land_numb = models.CharField(max_length=255, blank=True, null=True)
    nvd_land_no_type = models.CharField(max_length=255, blank=True, null=True)
    entryno = models.BigIntegerField(blank=True,null=True)
    nvd_area = models.CharField(max_length=100, blank=True, null=True)
    page_no = models.BigIntegerField(blank=True,null=True)
    volume_no = models.BigIntegerField(blank=True, null=True)
    nvd_fileno = models.CharField(max_length=255, blank=True, null=True)
    nvd_remarks = models.TextField(blank=True, null=True)
    nvd_doctype = models.CharField(max_length=255, blank=True, null=True)
    nvd_nivadadt = models.CharField(max_length=100, blank=True, null=True)
    unit = models.CharField(max_length=100, blank=True, null=True)
    marathiname = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'nivada'

    def __str__(self):
        return f"{self.nvd_village} - {self.nvd_gatno or self.nvd_gat_no or self.nvd_survey}"
    



class OfficerMaster(models.Model):

    officer_id = models.IntegerField(
        db_column="OfficerId",
        primary_key=True
    )

    district = models.CharField(
        db_column="District",
        max_length=255,
        null=True,
        blank=True
    )

    taluka = models.CharField(
        db_column="Taluka",
        max_length=255,
        null=True,
        blank=True
    )

    village = models.CharField(
        db_column="Village",
        max_length=255,
        null=True,
        blank=True
    )

    location = models.CharField(
        db_column="Location",
        max_length=255,
        null=True,
        blank=True
    )

    officer_name = models.CharField(
        db_column="Officer_Name",
        max_length=255
    )

    email_id = models.EmailField(
        db_column="Email_Id",
        null=True,
        blank=True
    )
    password = models.CharField(
        db_column="password",
        max_length=100,
        null=True,
        blank=True
    )
    contact_no = models.CharField(
        db_column="Contact_No",
        max_length=100,
        null=True,
        blank=True
    )

    address = models.TextField(
        db_column="Address",
        null=True,
        blank=True
    )

    from_date = models.DateField(
        db_column="From_Date",
        null=True,
        blank=True
    )

    to_date = models.DateField(
        db_column="To_Date",
        null=True,
        blank=True
    )

    designation_id = models.IntegerField(
        db_column="Designation_Id",
        null=True,
        blank=True
    )

    class Meta:
        managed = False
        db_table = "Officer_Master"

    def __str__(self):
        return self.officer_name


class Designation(models.Model):

    designation_id = models.IntegerField(
        db_column="Designation_Id",
        primary_key=True
    )

    designation = models.CharField(
        db_column="Designation",
        max_length=255
    )

    class Meta:
        managed = False
        db_table = "mstDesignation"

    def __str__(self):
        return self.designation

   
class CertificateRequest(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    record_id = models.BigIntegerField()
    volume_no = models.BigIntegerField(
        null=True,
        blank=True
    )
    
    page_no = models.BigIntegerField(
        null=True,
        blank=True
    )
    
    entryno = models.BigIntegerField(
        null=True,
        blank=True
    )
    officer_id = models.IntegerField(
        null=True,
        blank=True
    )

    applicant_name = models.CharField(
        max_length=255
    )

    mobile_number = models.CharField(
        max_length=20
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    address_district = models.CharField(
        max_length=255
    )

    address_taluka = models.CharField(
        max_length=255
    )

    address_village = models.CharField(
        max_length=255
    )

    district = models.CharField(
        max_length=255
    )

    taluka = models.CharField(
        max_length=255
    )

    village = models.CharField(
        max_length=255
    )

    project_name = models.TextField(
        null=True,
        blank=True
    )

    nivada_name = models.TextField(
        null=True,
        blank=True
    )

    survey_number = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    gat_number = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    requested_at = models.DateTimeField(
        auto_now_add=True
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True
    )

    generated_pdf_path = models.TextField(
        null=True,
        blank=True
    )
    pdf_file = models.FileField(
        upload_to="certificates/",
        null=True,
        blank=True
    )
    
    signed_pdf_file = models.FileField(
        upload_to="signed_certificates/",
        null=True,
        blank=True
    )
    class Meta:
        db_table = "Certificate_Request"

    def __str__(self):
        return (
            f"{self.applicant_name} - "
            f"{self.status}"
        )


class ScanPg(models.Model):

    document_id = models.BigIntegerField(
        primary_key=True
    )

    volume_no = models.BigIntegerField()

    page_no = models.BigIntegerField()

    imageimg = models.BinaryField()

    thumbimg = models.BinaryField(
        null=True,
        blank=True
    )

    class Meta:
        managed = False
        db_table = "scanpg"