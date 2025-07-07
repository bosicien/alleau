import os
import json
import PyPDF2  # For reading PDF files

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
    
    # Split the text into lines
    lines = text_content.splitlines()
    
    # Assuming the first half of the lines are questions and the second half are answers
    num_lines = len(lines)
    if num_lines % 2 != 0:
        print("Warning: The number of lines is odd. The last line will be ignored.")
    
    # Create flashcards by pairing questions and answers
    for i in range(0, num_lines - 1, 2):  # Step by 2 to get pairs
        question = lines[i].strip()
        answer = lines[i + 1].strip() if (i + 1) < num_lines else "No answer provided"
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