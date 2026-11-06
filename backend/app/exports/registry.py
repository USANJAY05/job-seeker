from .base import ResumeExporter
from .pdf import PdfResumeExporter


class ExporterRegistry:
    def __init__(self, exporters: list[ResumeExporter] | None = None):
        self._exporters: dict[str, ResumeExporter] = {}
        for exporter in exporters or []:
            self.register(exporter)

    def register(self, exporter: ResumeExporter) -> None:
        self._exporters[exporter.format_name.lower()] = exporter

    def get(self, format_name: str) -> ResumeExporter | None:
        return self._exporters.get(format_name.lower())

    @property
    def formats(self) -> tuple[str, ...]:
        return tuple(sorted(self._exporters))


resume_exporters = ExporterRegistry([PdfResumeExporter()])
