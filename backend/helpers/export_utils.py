from io import BytesIO
import pandas as pd
from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet


def export_to_excel(queryset, fields, filename, sheet_name='Sheet1'):
    """
    Generic Excel export function
    
    Args:
        queryset: Django queryset or list of dicts
        fields: List of field names to export
        filename: Output filename without extension
        sheet_name: Excel sheet name
    """
    df = pd.DataFrame(list(queryset.values(*fields)))
    output = BytesIO()
    
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name=sheet_name)
    
    output.seek(0)
    response = HttpResponse(
        output,
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}.xlsx"'
    return response


def export_to_pdf(queryset, fields, filename, title='Report', headers=None):
    """
    Generic PDF export function
    
    Args:
        queryset: Django queryset or list of dicts
        fields: List of field names to export
        filename: Output filename without extension
        title: PDF document title
        headers: Custom column headers (optional)
    """
    output = BytesIO()
    doc = SimpleDocTemplate(output, pagesize=A4)
    elements = []
    
    # Add title
    styles = getSampleStyleSheet()
    title_para = Paragraph(title, styles['Title'])
    elements.append(title_para)
    
    # Prepare data
    data = list(queryset.values(*fields))
    
    # Use custom headers or field names
    table_headers = headers if headers else fields
    table_data = [table_headers]
    
    # Add rows
    for item in data:
        row = [str(item.get(field, '')) for field in fields]
        table_data.append(row)
    
    # Create table
    table = Table(table_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    output.seek(0)
    response = HttpResponse(output, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}.pdf"'
    return response
