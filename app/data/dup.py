import json

def load_flashcards(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_flashcards(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def eliminate_duplicates(flashcards):
    seen = set()
    unique_flashcards = []
    
    for card in flashcards:
        question = card["question"]
        if question not in seen:
            seen.add(question)
            unique_flashcards.append(card)
    
    return unique_flashcards

def main():
    input_file_path = r"C:\Users\bosic\Documents\websites\french\flashcards.json"
    output_file_path = r"C:\Users\bosic\Documents\websites\french\cleaned_flashcards.json"
    
    # Load flashcards
    data = load_flashcards(input_file_path)
    flashcards = data["learn-french"]["flashcards"]
    
    # Eliminate duplicates
    unique_flashcards = eliminate_duplicates(flashcards)
    
    # Save cleaned flashcards
    data["learn-french"]["flashcards"] = unique_flashcards
    save_flashcards(output_file_path, data)
    
    print(f"Removed duplicates. {len(flashcards) - len(unique_flashcards)} duplicates found and removed.")

if __name__ == "__main__":
    main()