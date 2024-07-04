import { GoogleGenerativeAI } from "@google/generative-ai";

// Fetch your API_KEY
const API_KEY = "AIzaSyAc9Xy5AchZHKWc1IEu4foNIYpMPDKxEKE";
// Reminder: This should only be for local testing

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

async function run(prompt) {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
}

function detectLanguage(text) {
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const matches = [...text.matchAll(codeRegex)];
    return matches.map(match => ({
        language: match[1] || 'plaintext',
        code: match[2]
    }));
}

document.getElementById('generate-button').addEventListener('click', async (event) => {
    event.preventDefault();
    const userInput = document.getElementById('chat-input').value;
    const outputContainer = document.getElementById('output-container');
    
    // Menampilkan input pengguna
    const userInputElement = document.createElement('div');
    userInputElement.classList.add('message', 'user-message', 'poppins-regular');
    userInputElement.innerHTML = `<p>${userInput}</p>`;
    outputContainer.appendChild(userInputElement);
    
    // Menampilkan hasil dari AI
    const resultText = await run(userInput);
    const resultElement = document.createElement('div');
    resultElement.classList.add('message', 'ai-message', 'poppins-regular');
    
    const detectedLanguages = detectLanguage(resultText);
    if (detectedLanguages.length > 0) {
        detectedLanguages.forEach(({ language, code }) => {
            const codeElement = document.createElement('pre');
            codeElement.innerHTML = `<code class="language-${language}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
            resultElement.appendChild(codeElement);
        });
    } else {
        resultElement.innerHTML = `<img src="./img/icons8-robot-48.png" alt=""><p>${resultText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
    }
    
    outputContainer.appendChild(resultElement);
});