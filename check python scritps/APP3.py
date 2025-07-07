import json
import pandas as pd
from IPython.display import display

# Use a raw string for the file path
file_path = r"C:\Users\bosic\Documents\websites\french\flashcards\flashcards.json"

# Load the JSON data
try:
    with open(file_path, 'r') as f:
        raw_content = f.read()  # Read the raw content to check for issues
        print(raw_content)  # Print the raw content to check for issues

    # Now load the JSON data
    data = json.loads(raw_content)  # Use json.loads to load from the raw content

    # Flatten the data for easier visualization
    flashcards = []
    for pdf_file, content in data.items():
        for card in content['flashcards']:
            flashcards.append({
                'pdf_file': pdf_file,
                'question': card['question'],
                'answer': card['answer']
            })

    # Create a DataFrame
    df = pd.DataFrame(flashcards)

    # Display the DataFrame
    display(df)

except json.JSONDecodeError as e:
    print(f"JSONDecodeError: {e}")
except FileNotFoundError:
    print(f"File not found: {file_path}")
except Exception as e:
    print(f"An error occurred: {e}")