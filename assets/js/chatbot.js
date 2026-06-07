const aiChatPopup = document.getElementById("aiChatPopup");
const aiChatPopupText = document.getElementById("aiChatPopupText");
const aiChatPopupClose = document.getElementById("aiChatPopupClose");


const aiChatToggle = document.getElementById("aiChatToggle");
const aiChatClose = document.getElementById("aiChatClose");
const aiChatWindow = document.getElementById("aiChatWindow");
const aiChatForm = document.getElementById("aiChatForm");
const aiChatInput = document.getElementById("aiChatInput");
const aiChatMessages = document.getElementById("aiChatMessages");
const quickButtons = document.querySelectorAll(".ai-chatbot__quick button");

function openChat() {
    hideChatPopup();
    aiChatWindow.classList.add("active");
    aiChatInput.focus();
}

function closeChat() {
    aiChatWindow.classList.remove("active");
}

aiChatToggle.addEventListener("click", () => {
    if (aiChatWindow.classList.contains("active")) {
        closeChat();
    } else {
        openChat();
    }
});

aiChatClose.addEventListener("click", closeChat);

function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `ai-message ${sender}`;

    const avatarDiv = document.createElement("div");
    avatarDiv.className = "ai-message__avatar";

    const icon = document.createElement("i");
    icon.className = sender === "user" ? "bx bx-user" : "bx bx-bot";
    avatarDiv.appendChild(icon);

    const textDiv = document.createElement("div");
    textDiv.className = "ai-message__text";
    textDiv.textContent = text;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(textDiv);

    aiChatMessages.appendChild(messageDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

function addTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "ai-message bot typing";
    typingDiv.id = "aiTyping";

    typingDiv.innerHTML = `
        <div class="ai-message__avatar">
            <i class='bx bx-bot'></i>
        </div>
        <div class="ai-message__text">
            <span class="ai-dot"></span>
            <span class="ai-dot"></span>
            <span class="ai-dot"></span>
        </div>
    `;

    aiChatMessages.appendChild(typingDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById("aiTyping");
    if (typing) {
        typing.remove();
    }
}

async function sendMessage(message) {
    addMessage(message, "user");
    addTyping();

    const sendButton = aiChatForm.querySelector("button");
    sendButton.disabled = true;
    aiChatInput.disabled = true;

    try {
        const response = await fetch("/.netlify/functions/chatbot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        removeTyping();
        addMessage(data.answer || "Sorry, I could not answer that.", "bot");
    } catch (error) {
        removeTyping();
        addMessage("Sorry, something went wrong. Please try again.", "bot");
    } finally {
        sendButton.disabled = false;
        aiChatInput.disabled = false;
        aiChatInput.focus();
    }
}

aiChatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = aiChatInput.value.trim();

    if (!message) {
        return;
    }

    aiChatInput.value = "";
    await sendMessage(message);
});

quickButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const question = button.getAttribute("data-question");
        openChat();
        await sendMessage(question);
    });
});



const popupMessages = [
    "Need any help?",
    "Are you bored?",
    "Ask me about Arman's projects.",
    "Want to know Arman's CGPA?",
    "Need Arman's contact info?"
];

let popupIndex = 0;

function showChatPopup() {
    if (!aiChatPopup || aiChatWindow.classList.contains("active")) {
        return;
    }

    aiChatPopupText.textContent = popupMessages[popupIndex];
    aiChatPopup.classList.add("active");

    popupIndex = (popupIndex + 1) % popupMessages.length;

    setTimeout(() => {
        aiChatPopup.classList.remove("active");
    }, 6000);
}

function hideChatPopup() {
    if (aiChatPopup) {
        aiChatPopup.classList.remove("active");
    }
}

setTimeout(showChatPopup, 1500);

setInterval(showChatPopup, 10000);

if (aiChatPopupClose) {
    aiChatPopupClose.addEventListener("click", hideChatPopup);
}