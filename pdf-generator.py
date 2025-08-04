#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import sys
import os
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import requests

def generate_movimientos_contables_pdf(data, output_path):
    """
    Genera un PDF de movimientos contables con estructura específica
    
    Args:
        data (dict): Datos del reporte incluyendo movimientos contables
        output_path (str): Ruta donde guardar el PDF
    """
    
    # Crear el documento en orientación horizontal (landscape)
    from reportlab.lib.pagesizes import A4
    landscape_pagesize = A4[1], A4[0]  # Intercambiar ancho y alto para landscape
    
    doc = SimpleDocTemplate(output_path, pagesize=landscape_pagesize, 
                           leftMargin=0.5*inch, rightMargin=0.5*inch,
                           topMargin=0.5*inch, bottomMargin=0.5*inch)
    story = []
    
    # Estilos
    styles = getSampleStyleSheet()
    
    # Estilo para el título principal
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=14,
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    # Estilo para información de empresa
    company_style = ParagraphStyle(
        'CompanyInfo',
        parent=styles['Normal'],
        fontSize=9,
        spaceAfter=3,
        alignment=TA_LEFT,
        fontName='Helvetica'
    )
    
    # Estilo para metadatos del reporte
    metadata_style = ParagraphStyle(
        'Metadata',
        parent=styles['Normal'],
        fontSize=9,
        spaceAfter=3,
        alignment=TA_RIGHT,
        fontName='Helvetica'
    )
    
    # Estilo para texto normal
    normal_style = ParagraphStyle(
        'Normal',
        parent=styles['Normal'],
        fontSize=9,
        spaceAfter=6,
        alignment=TA_LEFT,
        fontName='Helvetica'
    )
    
    # Función para crear encabezado de página
    def create_page_header(page_num):
        header_elements = []
        
        # Crear tabla de encabezado con logo y metadatos
        header_data = [
            ['', '', '']  # 3 columnas: logo, título, metadatos
        ]
        
        header_table = Table(header_data, colWidths=[2.5*inch, 6*inch, 2.5*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'LEFT'),    # Logo
            ('ALIGN', (1, 0), (1, 0), 'CENTER'),  # Título
            ('ALIGN', (2, 0), (2, 0), 'RIGHT'),   # Metadatos
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        
        # Agregar logo si existe
        logo_path = 'logo_script.png'
        if os.path.exists(logo_path):
            try:
                logo = Image(logo_path, width=2*inch, height=1*inch)
                header_elements.append(logo)
            except:
                pass
        
        # Agregar título principal
        if 'TitReporte1' in data:
            title = Paragraph(data['TitReporte1'], title_style)
            header_elements.append(title)
        
        # Agregar metadatos
        fecha_actual = datetime.now().strftime('%d/%m/%Y')
        hora_actual = datetime.now().strftime('%I:%M:%S%p')
        metadata_text = f"Fecha: {fecha_actual}<br/>Hora: {hora_actual}<br/>Página: {page_num}"
        metadata = Paragraph(metadata_text, metadata_style)
        header_elements.append(metadata)
        
        return header_elements
    
    # Función para crear tabla de datos
    def create_data_table(movimientos, start_index=0, max_rows_per_page=25):
        if not movimientos:
            return []
        
        # Encabezados de la tabla
        headers = ['Cuenta', 'Descripción', 'Tipo']
        table_data = [headers]
        
        # Calcular cuántas filas mostrar en esta página
        end_index = min(start_index + max_rows_per_page, len(movimientos))
        page_movimientos = movimientos[start_index:end_index]
        
        # Agregar datos
        for movimiento in page_movimientos:
            table_data.append([
                movimiento.get('cuenta', ''),
                movimiento.get('descripcion', ''),
                movimiento.get('tipo', '')
            ])
        
        # Crear tabla
        table = Table(table_data, colWidths=[2*inch, 6.5*inch, 2.5*inch])
        table.setStyle(TableStyle([
            # Estilo para encabezados
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('TOPPADDING', (0, 0), (-1, 0), 8),
            # Estilo para datos
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 4),
            ('TOPPADDING', (0, 1), (-1, -1), 4),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
        ]))
        
        return table, end_index
    
    # Obtener movimientos
    movimientos = data.get('movimientos', [])
    
    # Generar páginas
    current_index = 0
    page_num = 1
    max_rows_per_page = 35  # Más filas por página en orientación horizontal
    
    while current_index < len(movimientos):
        # Encabezado de página
        story.extend(create_page_header(page_num))
        story.append(Spacer(1, 20))
        
        # Tabla de datos para esta página
        table, current_index = create_data_table(movimientos, current_index, max_rows_per_page)
        story.append(table)
        
        # Agregar salto de página si hay más datos
        if current_index < len(movimientos):
            story.append(PageBreak())
            page_num += 1
    
    # Totales al final
    if 'LinTotales' in data:
        story.append(Spacer(1, 20))
        story.append(Paragraph(data['LinTotales'], normal_style))
    
    # Construir el PDF
    doc.build(story)
    return output_path

def main():
    """
    Función principal que recibe datos desde la línea de comandos
    """
    if len(sys.argv) < 3:
        print("Uso: python pdf-generator.py <datos_json> <ruta_salida>")
        sys.exit(1)

    try:
        # Leer datos JSON desde argumento de línea de comandos
        data_json = sys.argv[1]
        output_path = sys.argv[2]

        # Parsear JSON
        data = json.loads(data_json)

        # Generar PDF
        result_path = generate_movimientos_contables_pdf(data, output_path)
        print(f"PDF generado exitosamente: {result_path}")

    except Exception as e:
        print(f"Error generando PDF: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
