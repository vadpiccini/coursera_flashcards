// displayGptResponse.js
document.addEventListener('DOMContentLoaded', checkForData);

function displayFlashcards(flashcardsRaw) {
    // Process and display flashcards
            const flashcardsList = document.getElementById('flashcardsContent');
            flashcardsList.innerHTML = ''; // Clear placeholder text
            const flashcards = flashcardsRaw.split("\n").filter(line => line.startsWith("Question:"));
            flashcards.forEach(card => {
                const [question, answer] = card.split(" | Answer: ");
                const li = document.createElement('li');
                li.textContent = `${question.replace("Question: ", "")} - ${answer}`;
                flashcardsList.appendChild(li);
            });
}

function checkForData() {
    chrome.storage.local.get(['gptResponse'], function(result) {
        if (result.gptResponse && result.gptResponse.choices && result.gptResponse.choices.length > 0) {
            const content = result.gptResponse.choices[0].message.content;

            // Assuming the content structure is as expected, separate summary and flashcards
            const parts = content.split("\n\nFlashcards:\n");
            const summary = parts[0].replace("Summary:\n", "").trim();
            const flashcardsRaw = parts[1] ? parts[1].trim() : "";

            // Update summary section
            document.getElementById('summaryContent').textContent = summary;

            // Display flashcards
            displayFlashcards(flashcardsRaw);

            // Clear the stored data after displaying it
            chrome.storage.local.remove(['gptResponse']);
        } else {
            // If no data is found, or it's not in the expected format, keep checking
            setTimeout(checkForData, 1000); // Check again after 1 second
        }
    });
}

