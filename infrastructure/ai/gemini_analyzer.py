# infrastructure/ai/gemini_analyzer.py
import json
import google.generativeai as genai
from core.domain.exceptions import InvalidDocumentError # Import the custom exception

class GeminiStartupAnalyzer:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def analyze(self, pitch_deck_text: str) -> dict:
        """
        Analyzes text and raises an error if it appears to be a template.
        """
        prompt = f"""
        Act as an expert Venture Capital analyst. Your primary goal is to parse a startup's pitch deck to find inputs for a lead generation tool.

        **Important Instructions:**
        - Ignore any text that is generic, instructional, or appears to be a template.
        - If you cannot find a specific company name because the text is a guide, you MUST return "Not found in document" for the "companyName" field.
        - For "sectors", identify a list of relevant industries, technologies, or verticals. Be specific (e.g., "AI", "Healthcare Tech", "B2B SaaS").

        Extract the following information and return it ONLY as a valid JSON object:
        1.  **companyName**: The official name of the startup.
        2.  **description**: A single, concise sentence describing what the company does.
        3.  **problem**: The core problem the startup is solving.
        4.  **solution**: The startup's proposed solution.
        5.  **fundingInfo**: The specific funding amount and round they are seeking (e.g., "$5M Series A", "Seed Round"). If not found, leave as null.
        6.  **sectors**: A JSON list of keywords, sectors, and verticals that describe the company's focus.

        Pitch Deck Text:
        ---
        {pitch_deck_text}
        ---
        """
        
        try:
            print("SYSTEM: Sending text to AI for detailed analysis...")
            response = self.model.generate_content(prompt)
            cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
            data = json.loads(cleaned_response)
            print("SYSTEM: AI analysis complete.")

            if data.get("companyName") == "Not found in document":
                raise InvalidDocumentError("The document appears to be a template, not a specific pitch deck.")
            
            # Ensure sectors is always a list, even if the model returns a single string
            if data.get("sectors") and not isinstance(data["sectors"], list):
                data["sectors"] = [str(data["sectors"])]

            return data

        except InvalidDocumentError:
            # Re-raise the custom exception to be handled by the calling code.
            raise
        except Exception as e:
            print(f"ERROR: AI analysis or JSON parsing failed. Details: {e}")
            # For other errors, we can return an empty dict or raise a different error.
            return {}