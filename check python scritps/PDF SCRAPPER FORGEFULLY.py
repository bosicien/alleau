import os
import json
import PyPDF2  # For reading PDF files
import re  # For regular expressions

# Define the base directory for your PDF files
BASE_DIR = r'C:\Users\bosic\Documents\websites\french'  # Change this to your PDF directory
OUTPUT_JSON_FILE = 'pdf_flashcards.json'  # Output JSON file name

def extract_text_from_pdf(file_path):
    """Extract text from a single PDF file."""
    text = []
    try:
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:  # Only add non-empty text
                    text.append(page_text)
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
    return "\n".join(text).strip()  # Return the extracted text

def generate_flashcards(text_content):
    """Generate flashcards from the extracted text content."""
    flashcards = []
    
    # Split the text into lines or sections based on your desired format
    lines = text_content.splitlines()
    
    # Example logic to create flashcards
    for line in lines:
        # Assuming each line contains a question and an answer separated by a delimiter (e.g., " - ")
        # Adjust the regex or split logic based on your actual text format
        match = re.match(r'^(.*?)(?:\s*-\s*(.*))?$', line.strip())
        if match:
            question = match.group(1).strip()
            answer = match.group(2).strip() if match.group(2) else "No answer provided"
            flashcards.append({
                'question': question,
                'answer': answer
            })
    
    return flashcards

def index_pdfs(base_dir):
    """Index all PDF files in the specified directory and extract their text."""
    pdf_flashcards = {}

    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.lower().endswith('.pdf'):
                file_path = os.path.join(root, file)
                text_content = extract_text_from_pdf(file_path)
                flashcards = generate_flashcards(text_content)
                pdf_flashcards[file] = {
                    'file_path': file_path.replace('\\', '/'),  # Use forward slashes
                    'flashcards': flashcards
                }

    return pdf_flashcards

def export_to_json(data, output_file):
    """Export the extracted data to a JSON file."""
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    # Index PDF files and extract text
    pdf_flashcards = index_pdfs(BASE_DIR)

    # Export the extracted flashcards to a JSON file
    export_to_json(pdf_flashcards, OUTPUT_JSON_FILE)
    print(f"Extracted flashcards from PDFs exported to {OUTPUT_JSON_FILE}")