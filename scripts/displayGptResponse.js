// displayGptResponse.js
document.addEventListener('DOMContentLoaded', () => {
    checkForData();
    document.getElementById('exportFlashcardsBtn').addEventListener('click', exportFlashcardsToCSV);
});

let flashcardsRaw = '';

function displayFlashcards() { // Now accepts flashcardsRaw as a parameter
    const flashcardsList = document.getElementById('flashcardsContent');
    flashcardsList.innerHTML = ''; // Clear placeholder text
    const flashcards = flashcardsRaw.split("\n").filter(line => line.startsWith("Question:"));
    flashcards.forEach(card => {
        const [question, answer] = card.split(" | Answer: ");
        const flashcardItem = document.createElement('li');
        flashcardItem.className = 'flashcard'; // Add class for styling
        // Ensuring that we remove "Question: " prefix correctly
        flashcardItem.innerHTML = `<strong>Q:</strong> ${question.substring("Question: ".length)}<br><strong>A:</strong> ${answer}`;
        flashcardsList.appendChild(flashcardItem);
    });
}

function exportFlashcardsToCSV() {
    // Convert flashcards to CSV format
    const flashcards = flashcardsRaw.split("\n").filter(line => line.startsWith("Question:"));
    let csvContent = "data:text/csv;charset=utf-8,Question,Answer\n";
    flashcards.forEach(card => {
        const [question, answer] = card.split(" | Answer: ");
        csvContent += `"${question.replace("Question: ", "")}","${answer}"\n`;
    });

    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flashcards.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link); // Clean up
}

function checkForData() {
    chrome.storage.local.get(['gptResponse'], function(result) {
        if (result.gptResponse && result.gptResponse.choices && result.gptResponse.choices.length > 0) {
            try {
                const content = result.gptResponse.choices[0].message.content;

                // Assuming the content structure is as expected, separate summary and flashcards
                const parts = content.split("\n\nFlashcards:\n");
                const summary = parts[0].replace("Summary:\n", "").trim();
                flashcardsRaw = parts[1] ? parts[1].trim() : "";

                // Update summary section
                document.getElementById('summaryContent').textContent = summary;

                // Display flashcards
                displayFlashcards(); // Assuming displayFlashcards uses the global flashcardsRaw variable
            } catch (error) {
                console.error('An error occurred:', error);
                // Handle the error appropriately, maybe show a message to the user
            } finally {
                // Ensure the stored data is always removed after processing
                chrome.storage.local.remove(['gptResponse']);
            }
        } else {
            // If no data is found, or it's not in the expected format, keep checking
            setTimeout(checkForData, 1000); // Check again after 1 second
        }
    });
}

