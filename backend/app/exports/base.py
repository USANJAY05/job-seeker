from abc import ABC, abstractmethod
from dataclasses import dataclass

from ..schemas import ResumeOut


@dataclass(frozen=True)
class ExportedResume:
    content: bytes
    media_type: str
    extension: str


class ResumeExporter(ABC):
    """Implement this interface to add a resume output format."""

    format_name: str

    @abstractmethod
    def export(self, resume: ResumeOut) -> ExportedResume:
        raise NotImplementedError
