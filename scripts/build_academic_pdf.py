from pathlib import Path
import re
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Preformatted
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "NutriCare-Academic-Pack.pdf"
DOCS = sorted((ROOT / "docs").glob("*.md"))

def clean(text: str) -> str:
    return (text.replace("–", "-").replace("—", "-").replace("…", "...")
            .replace("’", "'").replace("“", '"').replace("”", '"')
            .replace("→", "->").replace("≤", "<=").replace("≥", ">="))

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=28, leading=34, textColor=colors.HexColor("#173F31"), alignment=TA_CENTER, spaceAfter=12))
styles.add(ParagraphStyle(name="CoverSub", parent=styles["Normal"], fontSize=12, leading=18, textColor=colors.HexColor("#527064"), alignment=TA_CENTER))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=20, leading=25, textColor=colors.HexColor("#173F31"), spaceAfter=12, keepWithNext=True))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=colors.HexColor("#2B775A"), spaceBefore=10, spaceAfter=7, keepWithNext=True))
styles.add(ParagraphStyle(name="H3x", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=colors.HexColor("#365F4E"), spaceBefore=8, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontSize=9.2, leading=13.5, textColor=colors.HexColor("#243D33"), spaceAfter=6))
styles.add(ParagraphStyle(name="Bulletx", parent=styles["BodyText"], fontSize=9, leading=13, leftIndent=12, firstLineIndent=-7, bulletIndent=4, textColor=colors.HexColor("#243D33"), spaceAfter=3))
styles.add(ParagraphStyle(name="Smallx", parent=styles["BodyText"], fontSize=7.5, leading=10, textColor=colors.HexColor("#52675E")))
styles.add(ParagraphStyle(name="Codex", fontName="Courier", fontSize=6.8, leading=9, backColor=colors.HexColor("#F0F5F2"), borderPadding=6, textColor=colors.HexColor("#234337")))

def markup(text: str) -> str:
    text = clean(text).strip()
    text = re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    return text.replace("&", "&amp;").replace("&amp;lt;", "&lt;").replace("&amp;gt;", "&gt;")

def table_flow(lines):
    rows = []
    for line in lines:
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", c) for c in cells):
            continue
        rows.append([Paragraph(markup(c), styles["Smallx"]) for c in cells])
    if not rows:
        return Spacer(1, 1)
    widths = [(A4[0] - 36*mm) / len(rows[0])] * len(rows[0])
    table = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#DDEDE4")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.HexColor("#173F31")),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("GRID", (0,0), (-1,-1), 0.35, colors.HexColor("#B8CCC0")),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#F7FAF8")]),
        ("LEFTPADDING", (0,0), (-1,-1), 5), ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ]))
    return table

def parse_markdown(path: Path):
    lines = clean(path.read_text(encoding="utf-8")).splitlines()
    story, i, in_code, code = [], 0, False, []
    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            if in_code:
                story.append(Preformatted("\n".join(code), styles["Codex"])); code=[]; in_code=False
            else: in_code=True
            i += 1; continue
        if in_code:
            code.append(line); i += 1; continue
        if line.startswith("|") and i+1 < len(lines) and lines[i+1].startswith("|"):
            block=[]
            while i < len(lines) and lines[i].startswith("|"):
                block.append(lines[i]); i+=1
            story.append(table_flow(block)); story.append(Spacer(1, 7)); continue
        if line.startswith("# "): story.append(Paragraph(markup(line[2:]), styles["H1x"]))
        elif line.startswith("## "): story.append(Paragraph(markup(line[3:]), styles["H2x"]))
        elif line.startswith("### "): story.append(Paragraph(markup(line[4:]), styles["H3x"]))
        elif line.startswith("- "): story.append(Paragraph("- " + markup(line[2:]), styles["Bulletx"]))
        elif re.match(r"^\d+\. ", line): story.append(Paragraph(markup(line), styles["Bulletx"]))
        elif line.startswith("> "): story.append(Paragraph(markup(line[2:]), styles["Smallx"]))
        elif line.strip(): story.append(Paragraph(markup(line), styles["Bodyx"]))
        else: story.append(Spacer(1, 3))
        i += 1
    return story

def page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D8E5DE")); canvas.line(18*mm, 18*mm, A4[0]-18*mm, 18*mm)
    canvas.setFont("Helvetica", 7.5); canvas.setFillColor(colors.HexColor("#60766C"))
    canvas.drawString(18*mm, 12*mm, "NutriCare Connect - Academic Demonstration")
    canvas.drawRightString(A4[0]-18*mm, 12*mm, f"Page {doc.page}")
    canvas.restoreState()

OUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=18*mm, bottomMargin=23*mm, title="NutriCare Connect Academic Pack", author="SE2030 Group 2026-Y2-S1-MLB-B5G1-01")
story = [Spacer(1, 35*mm), Paragraph("NutriCare Connect", styles["CoverTitle"]), Paragraph("Web-based Diet Planning & Health Check-up System", styles["CoverSub"]), Spacer(1, 10*mm), Paragraph("Software Engineering Academic Pack", styles["CoverSub"]), Spacer(1, 55*mm), Paragraph("SE2030 - Software Engineering<br/>Year 2, Semester 1 - 2026<br/>Group 2026-Y2-S1-MLB-B5G1-01", styles["CoverSub"]), Spacer(1, 12*mm), Paragraph("Academic demonstration only. No real patient, clinical, or payment data.", styles["Smallx"]), PageBreak()]
for n, path in enumerate(DOCS):
    story.extend(parse_markdown(path))
    if n != len(DOCS)-1: story.append(PageBreak())
doc.build(story, onFirstPage=page, onLaterPages=page)
print(OUT)
