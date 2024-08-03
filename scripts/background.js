// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractNotes") {
        // Tell the content script to extract notes
        chrome.tabs.query({active: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "extractNotesFromCoursera"}, function(response) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    sendResponse({status: "Error", message: "Message send failed"});
                    return;
                }
                if(response.status === "success" && response.data) {
                    // Open gptResponse.html in a new tab immediately
                    chrome.tabs.create({url: chrome.runtime.getURL('../html/gptResponse.html')}, function(newTab) {
                        // After the tab is opened, call OpenAI with the extracted notes
                        callOpenAI(response.data, (data) => {
                            console.log(`OpenAI response: `, data);
                            // Store the GPT response data temporarily
                            chrome.storage.local.set({gptResponse: data}, () => {
                                chrome.tabs.update(newTab.id, {active: true});
                            });
                        });
                    });                
                } else {
                    // Handle the case where notes extraction failed
                    sendResponse({status: "Error", message: "No notes extracted."});
                }
            });
        });
        return true; // Indicates an asynchronous response
    }
});

function getStoredSettings(callback) {
    chrome.storage.local.get(['apiKey', 'model'], (result) => {
        if (result.apiKey && result.model) {
            callback(result);
        } else {
            console.error('API Key or model not set.');
        }
    });
}

const system_prompt = `This is a transcript from a Coursera video lesson. Please provide a brief summary on the topic and generate flashcards for key concepts. Format your response exactly as follows:
 Summary:
 [Your summary here.]
 
 Flashcards:
 Question: [Question 1] | Answer: [Answer 1]
 Question: [Question 2] | Answer: [Answer 2]
`; 

function callOpenAI(textToProcess, callback) {
    getStoredSettings(({ apiKey, model }) => {
        const url = `https://api.openai.com/v1/chat/completions`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };

        // Constructing the chat conversation
        const body = JSON.stringify({
            model: model,
            messages: [
                { 
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": textToProcess
                }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            // Additional parameters as needed
        });
        console.log(`Sending request to openAI: `, body)
        fetch(url, { method: 'POST', headers, body })
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Error calling OpenAI:', error));
    });
}
