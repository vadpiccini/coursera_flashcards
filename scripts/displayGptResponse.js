document.addEventListener('DOMContentLoaded', () => {
    checkForData();
    document.getElementById('exportFlashcardsBtn').addEventListener('click', exportFlashcardsToCSV);
});

let flashcardsRaw = '';

function displayFlashcards() {
    const flashcardsList = document.getElementById('flashcardsContent');
    flashcardsList.innerHTML = ''; // Clear placeholder text
    const flashcards = flashcardsRaw.split("\n").filter(line => line.startsWith("Question:"));
    flashcards.forEach(card => {
        const [question, answer] = card.split(" | Answer: ");
        const flashcardItem = document.createElement('li');
        flashcardItem.className = 'flashcard'; // Add class for styling
        flashcardItem.innerHTML = `<strong>Q:</strong> ${question.substring("Question: ".length)}<br><strong>A:</strong> ${answer}`;
        flashcardsList.appendChild(flashcardItem);
    });
    document.getElementById('exportFlashcardsBtn').style.display = 'block';
}

function exportFlashcardsToCSV() {
    const flashcards = flashcardsRaw.split("\n").filter(line => line.startsWith("Question:"));
    let csvContent = "data:text/csv;charset=utf-8,";
    flashcards.forEach(card => {
        const [question, answer] = card.split(" | Answer: ");
        csvContent += `"${question.replace("Question: ", "")}","${answer}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flashcards.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function checkForData() {
    let retries = 0;
    const retryInterval = 1000; // 1 second
    const maxRetries = 120; // 2 minutes

    function attemptFetch() {
        chrome.storage.local.get(['gptResponse'], function(result) {
            if (result.gptResponse && result.gptResponse.choices && result.gptResponse.choices.length > 0) {
                const responseData = result.gptResponse.choices[0];
                if (responseData.message) {
                    try {
                        document.getElementById('summaryLoading').remove();
                        document.getElementById('flashcardsLoading').remove();
                        const content = responseData.message.content;
                        const parts = content.split("\n\nFlashcards:\n");
                        const summary = parts[0].replace("Summary:\n", "").trim();
                        flashcardsRaw = parts[1] ? parts[1].trim() : "";

                        document.getElementById('summaryContent').textContent = summary;
                        document.getElementById('summaryContent').style.color = 'black'; // Reset text color
                        displayFlashcards();
                    } catch (error) {
                        console.error('An error occurred:', error);
                        document.getElementById('summaryContent').textContent = 'An error occurred: ' + error.message;
                        document.getElementById('summaryContent').style.color = 'red';
                        document.getElementById('flashcardsSection').style.display = 'none';
                        document.getElementById('exportFlashcardsBtn').style.display = 'none';
                    } finally {
                        chrome.storage.local.remove(['gptResponse']);
                    }
                } else if (responseData.error) {
                    document.getElementById('summaryContent').textContent = responseData.error.message;
                    document.getElementById('summaryContent').style.color = 'red';
                    document.getElementById('flashcardsSection').style.display = 'none';
                    document.getElementById('exportFlashcardsBtn').style.display = 'none';
                }
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(attemptFetch, retryInterval);
            } else {
                document.getElementById('summaryContent').textContent = 'Timeout: No response after 2 minutes. Please try again.';
                document.getElementById('summaryContent').style.color = 'red';
                document.getElementById('flashcardsSection').style.display = 'none';
                document.getElementById('exportFlashcardsBtn').style.display = 'none';
            }
        });
    }

    attemptFetch();
}

