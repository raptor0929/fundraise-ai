# infrastructure/parsing/pdf_extractor.py
import fitz  # PyMuPDF

class PDFTextExtractor:
    def extract(self, pdf_path: str) -> str:
        """Opens a PDF file and returns its raw text content."""
        try:
            doc = fitz.open(pdf_path)
            full_text = "".join(page.get_text() for page in doc)
            doc.close()
            print("SYSTEM: PDF text extracted successfully.")
            return full_text
        except Exception as e:
            print(f"ERROR: Could not read PDF. Details: {e}")
            return ""