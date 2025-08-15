# Fundraise AI - Parser Agent

This directory contains the Python backend service responsible for parsing pitch deck documents. It's a key component of the Fundraise AI platform, designed to extract structured data from unstructured PDFs using AI.

## 🚀 Features

* **PDF Text Extraction**: Reads uploaded PDF files and extracts raw text content.
* **AI-Powered Analysis**: Uses the Google Gemini API to analyze the text and extract key information about a startup.
* **Structured Data Output**: Converts the unstructured text of a pitch deck into a structured JSON object containing fields like company name, description, problem, solution, funding info, and industry sectors.
* **Template Detection**: Intelligently identifies and rejects documents that are instructional guides or templates, rather than actual pitch decks for a specific company.
* **Clean Architecture**: The project is organized using Clean Architecture principles, separating concerns into distinct layers (domain, infrastructure, use cases) for maintainability and scalability.
* **API Endpoint**: Exposes a simple REST API endpoint using FastAPI to receive files and return the structured JSON data.

## 🛠️ Tech Stack

* **Language**: Python 3.11
* **API Framework**: FastAPI
* **AI Model**: Google Gemini 1.5 Flash
* **PDF Parsing**: PyMuPDF (`fitz`)
* **Environment Management**: Conda

## ⚙️ Setup and Installation

These instructions will guide you through setting up the local development environment for the parser agent.

### 1. Prerequisites

* **Anaconda/Miniconda**: You must have a working installation of Anaconda or Miniconda to manage the Python environment.
* **Git**: Required for version control.

### 2. Create the Conda Environment

From a terminal (Anaconda Prompt is recommended on Windows), navigate to the project's root directory and create the Conda environment.

```bash
# Navigate to the parser-agent directory
cd backend/parser-agent

# Create a new environment named 'fundraise-env' with Python 3.11
conda create --name fundraise-env python=3.11
