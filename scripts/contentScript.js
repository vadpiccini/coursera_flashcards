// contentScript.js

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`request: received form background script! The request:`, request);
    if (request.action === "extractNotesFromCoursera") {
        const notes = extractCourseraNotes();
        console.log(`Notes extracted: `, notes);
        if (notes) {
            sendResponse({status: "success", data: notes});
        } else {
            sendResponse({status: "error", message: "No notes found"});
        }
    }
    return true; // Keep the messaging channel open for sendResponse
});

function extractCourseraNotes() {
    // Selector targets <span> elements with the class "css-4s48ix"
    const selector = ".css-4s48ix";
    const elements = document.querySelectorAll(selector);
    let allText = [];

    elements.forEach((element) => {
        // Extract and clean text from each element
        const text = element.innerText.trim();
        if (text) allText.push(text);
    });

    // Join all extracted text into a single string, separated by spaces
    // This assumes that the span elements break mid-sentence and should be concatenated directly
    return allText.length > 0 ? allText.join(" ") : null;
}

