from io import BytesIO
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from ..schemas import ResumeOut
from .base import ExportedResume, ResumeExporter


def _text(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, (list, tuple)):
        return ", ".join(str(item) for item in value if item)
    return str(value).strip()


class PdfResumeExporter(ResumeExporter):
    format_name = "pdf"

    def export(self, resume: ResumeOut) -> ExportedResume:
        buffer = BytesIO()
        document = SimpleDocTemplate(
            buffer, pagesize=LETTER, rightMargin=0.65 * inch,
            leftMargin=0.65 * inch, topMargin=0.55 * inch, bottomMargin=0.55 * inch,
            title=resume.filename.rsplit(".", 1)[0], author="Job Buddy",
        )
        styles = getSampleStyleSheet()
        name_style = ParagraphStyle("ResumeName", parent=styles["Title"], fontSize=21, leading=25, alignment=TA_CENTER, textColor=colors.HexColor("#172033"), spaceAfter=3)
        sub_style = ParagraphStyle("ResumeSub", parent=styles["Normal"], fontSize=10, leading=14, alignment=TA_CENTER, textColor=colors.HexColor("#46536b"), spaceAfter=4)
        heading_style = ParagraphStyle("ResumeHeading", parent=styles["Heading2"], fontSize=11, leading=14, textColor=colors.HexColor("#173f73"), spaceBefore=11, spaceAfter=4)
        body_style = ParagraphStyle("ResumeBody", parent=styles["BodyText"], fontSize=9.5, leading=13, spaceAfter=3)
        title_style = ParagraphStyle("ResumeEntry", parent=body_style, fontName="Helvetica-Bold", spaceAfter=1)
        story = []
        form = resume.form or {}
        name = _text(form.get("fullName")) or resume.filename.rsplit(".", 1)[0]
        story.append(Paragraph(escape(name), name_style))
        headline = _text(form.get("headline")) or resume.target
        if headline:
            story.append(Paragraph(escape(headline), sub_style))
        contact = [form.get(key) for key in ("email", "phone", "location", "profiles") if _text(form.get(key))]
        if contact:
            story.append(Paragraph(escape("  •  ".join(_text(item) for item in contact)), sub_style))
        story.append(Spacer(1, 5))

        def add_section(title: str, entries: list, *, skills: bool = False) -> None:
            valid = [entry for entry in entries if isinstance(entry, dict)]
            if not valid:
                return
            story.append(Paragraph(escape(title.upper()), heading_style))
            for entry in valid:
                if skills:
                    label = _text(entry.get("title"))
                    values = _text(entry.get("skills"))
                    if label or values:
                        story.append(Paragraph(f"<b>{escape(label)}</b>{': ' if label and values else ''}{escape(values)}", body_style))
                    continue
                heading = " — ".join(part for part in (_text(entry.get("title")), _text(entry.get("subtitle"))) if part)
                if heading:
                    story.append(Paragraph(escape(heading), title_style))
                for detail in entry.get("details", []) or []:
                    if _text(detail):
                        story.append(Paragraph(f"• {escape(_text(detail))}", body_style))

        add_section("Projects", form.get("projects") or [])
        add_section("Skills", form.get("skillGroups") or [], skills=True)
        add_section("Experience", form.get("experience") or [])
        add_section("Education", form.get("education") or [])
        if not any(form.get(key) for key in ("projects", "skillGroups", "experience", "education")):
            if resume.skills:
                add_section("Skills", [{"title": "", "skills": resume.skills}], skills=True)
            if resume.target:
                story.append(Paragraph("RESUME", heading_style))
                story.append(Paragraph(escape(resume.target), body_style))
        document.build(story)
        return ExportedResume(buffer.getvalue(), "application/pdf", "pdf")
