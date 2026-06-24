import os
import sys
import django

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'config.settings'
)

django.setup()
import pandas as pd
from land_records.models import LandRecord

# Load Excel
df = pd.read_excel('data/Nivada_Final.xlsx')

# Replace NaN with None
df = df.where(pd.notnull(df), None)

count = 0

for _, row in df.iterrows():

    # Skip completely empty rows
    if not (
        row.get('Nvd_Village') or
        row.get('Nvd_gatno') or
        row.get('Nvd_survey')
    ):
        continue

    LandRecord.objects.create(

        office=row.get('Nvd_office'),

        district=row.get('Nvd_District'),

        taluka=row.get('Nvd_Tahsil'),

        village=row.get('Nvd_Village'),

        project_name=row.get('Nvd_project'),
        Nvd_Name=row.get('Nvd_Name'),

        nivada_number=row.get('Nvd_Nivada'),
        nivada_date=str(row.get('Nvd_nivadadate'))
        if row.get('Nvd_nivadadate')
        else None,

        survey_number=str(row.get('Nvd_survey'))
        if row.get('Nvd_survey')
        else None,

        gat_number=str(row.get('Nvd_gatno'))
        if row.get('Nvd_gatno')
        else None,

        land_area=str(row.get('Nvd_Area'))
        if row.get('Nvd_Area')
        else None,

        volume_number=row.get('VOLUME_NO'),

        file_number=row.get('Nvd_fileno'),

        remarks=row.get('Nvd_remark'),
    )

    count += 1

print(f'Total Imported Records: {count}')