# use_cases/parse_pitch_deck.py
from core.domain.models import StartupProfile
from infrastructure.parsing.pdf_extractor import PDFTextExtractor
from infrastructure.ai.gemini_analyzer import GeminiStartupAnalyzer

class ParsePitchDeck:
    def __init__(self, extractor: PDFTextExtractor, analyzer: GeminiStartupAnalyzer):
        self.extractor = extractor
        self.analyzer = analyzer

    def execute(self, pdf_path: str) -> StartupProfile | None:
        """Orchestrates the parsing workflow."""
        text_content = self.extractor.extract(pdf_path)
        if not text_content:
            return None
        
        startup_data = self.analyzer.analyze(text_content)
        if not startup_data:
            return None
            
        return StartupProfile(**startup_data)