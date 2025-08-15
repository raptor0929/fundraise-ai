# main.py
import os
import sys
import json
import datetime
import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from use_cases.parse_pitch_deck import ParsePitchDeck
from infrastructure.parsing.pdf_extractor import PDFTextExtractor
from infrastructure.ai.gemini_analyzer import GeminiStartupAnalyzer
from core.domain.exceptions import InvalidDocumentError

# --- THIS IS THE CRITICAL LINE THAT WAS LIKELY MISSING ---
# It must be at the top level of the file, not inside any function.
app = FastAPI(title="Fundraise AI Parser API")

# Allow requests from your frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Add Fabio's Vercel URL here later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def save_profile_to_json(profile):
    """Saves the StartupProfile object to a JSON file."""
    if not profile or not profile.companyName:
        print("ERROR: Cannot save profile without a company name.")
        return

    company_name = "".join(c for c in profile.companyName if c.isalnum() or c in " _-").rstrip()
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{company_name}_profile_{timestamp}.json"
    
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, filename)

    profile_dict = profile.__dict__ # Convert dataclass to dict

    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(profile_dict, f, ensure_ascii=False, indent=4)
        print(f"--- ✅ SUCCESS: Profile saved to {filepath} ---")
    except Exception as e:
        print(f"--- ❌ ERROR: Failed to save JSON file. Details: {e} ---")

@app.post("/api/v1/parse-deck")
async def parse_deck_endpoint(pdf_file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    temp_dir = "temp_files"
    os.makedirs(temp_dir, exist_ok=True)
    temp_pdf_path = os.path.join(temp_dir, pdf_file.filename)
    
    with open(temp_pdf_path, "wb") as buffer:
        shutil.copyfileobj(pdf_file.file, buffer)

    # --- Setup and Execute Use Case ---
    api_key = os.getenv("GOOGLE_API_KEY", "YOUR_API_KEY_HERE")
    
    pdf_extractor = PDFTextExtractor()
    startup_analyzer = GeminiStartupAnalyzer(api_key=api_key)
    parser_use_case = ParsePitchDeck(extractor=pdf_extractor, analyzer=startup_analyzer)

    try:
        profile = parser_use_case.execute(temp_pdf_path)
        if profile:
            save_profile_to_json(profile)
            return profile
        else:
            return {"error": "Could not generate a profile from the PDF."}

    except InvalidDocumentError as e:
        return {"error": str(e)}
    finally:
        # Clean up the temporary file
        os.remove(temp_pdf_path)

# This block is for direct script execution, not used by Uvicorn, but good for testing
if __name__ == "__main__":
    print("This script is an API server. Run it with 'python -m uvicorn main:app --reload'")