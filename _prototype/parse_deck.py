# parse_deck.py

import os
import fitz  # This is the PyMuPDF library
import google.generativeai as genai

# --- CONFIGURATION ---
# Replace the placeholder text with your actual key
GOOGLE_API_KEY = "AIzaSyAh5WeIZcgsidy7YKVEPFB7_GebYOyFyGc"

# --- FUNCTION 1: Read the PDF ---
def extract_text_from_pdf(pdf_path: str) -> str:
    """Opens a PDF file and returns all its text content."""
    try:
        doc = fitz.open(pdf_path)
        full_text = ""
        for page in doc:
            full_text += page.get_text()
        doc.close()
        print("SYSTEM: PDF text extracted successfully.")
        return full_text
    except Exception as e:
        print(f"ERROR: Could not read PDF file. Make sure 'sample_pitch_deck.pdf' exists. Details: {e}")
        return ""

# --- FUNCTION 2: Ask the AI to Analyze the Text ---
def get_startup_info(pitch_deck_text: str) -> str:
    """Sends the text to the Gemini API and asks it to extract info."""
    if not pitch_deck_text:
        return "ERROR: No text to analyze."
        
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
    except Exception as e:
        print(f"ERROR: AI configuration failed. Check your API Key. Details: {e}")
        return ""

    prompt = f"""
    Analyze the following text from a startup's pitch deck.
    Your task is to extract two key pieces of information:
    1. The name of the company.
    2. A single, concise sentence describing what the company does.

    Return ONLY a valid JSON object with the keys "companyName" and "description".

    Pitch Deck Text:
    ---
    {pitch_deck_text}
    ---
    """
    
    try:
        print("SYSTEM: Sending text to AI for analysis...")
        response = model.generate_content(prompt)
        print("SYSTEM: AI analysis complete.")
        return response.text
    except Exception as e:
        print(f"ERROR: AI generation failed. Details: {e}")
        return ""

# --- MAIN EXECUTION BLOCK ---
if __name__ == "__main__":
    SAMPLE_PDF = "sample_pitch_deck.pdf" 
    
    extracted_text = extract_text_from_pdf(SAMPLE_PDF)
    
    if extracted_text:
        startup_data = get_startup_info(extracted_text)
        print("\n--- SCRIPT RESULT ---")
        print(startup_data)
        print("---------------------\n")