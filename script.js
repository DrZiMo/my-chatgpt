const chatContainer = document.querySelector(".chat-container");
const messageInput = document.querySelector(".message");
const userChat = document.querySelector(".user-chat");
const computerChat = document.querySelector(".chat-content");
const sendBtn = document.querySelector(".send-btn");
const newChat = document.querySelector(".new-chat");

const getResponse = async () => {
    const message = messageInput.value;

    if (!message) {
        return;
    }

    messageInput.value = "";
    sendBtn.disabled = true;
    sendBtn.classList.add("opacity-[.6]");
    const url = `https://free-chatgpt-api.p.rapidapi.com/chat-completion-one?prompt=${encodeURIComponent(message)}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '5480023b09msh038cecb872c476dp11697ejsn0693b5ecde7d',
            'x-rapidapi-host': 'free-chatgpt-api.p.rapidapi.com'
        }
    };

    const userChat = document.createElement("div");
    userChat.classList.add("user-chat", "bg-light_dark", "w-fit", "py-2", "px-3", "rounded-lg", "self-end");
    userChat.textContent = message;
    chatContainer.append(userChat);

    const computerChat = document.createElement("div");
    computerChat.classList.add("computer-chat", "flex", "gap-3");
    chatContainer.append(computerChat);

    const chatIcon = document.createElement("div");
    chatIcon.classList.add("chat-icon", "bg-light_dark", "h-fit", "px-2", "py-1", "rounded-full", "text-lg");
    chatIcon.innerHTML = '<i class="fa-solid fa-fan"></i>';
    computerChat.append(chatIcon);

    const chatContent = document.createElement("div");
    chatContent.textContent = "Loading ...";
    chatContent.classList.add("chat-content");
    computerChat.append(chatContent);
    const response = await fetch(url, options);
    const result = await response.json();

    sendBtn.disabled = false;
    sendBtn.classList.remove("opacity-[.6]");

    console.log(result)

    if (result.status != "success") {
        chatContent.textContent = "It seems that an error happened ☹️. Try again.";
    } else {
        chatContent.innerHTML = extractRelevantText(convertMarkdown(result.response));
    }
}

const createNewChat = () => {
    chatContainer.textContent = "";
}

const convertMarkdown = (markdown) => {
    if (typeof markdown !== "string" || !isMarkdown(markdown)) {
        return markdown;
    }

    let html = markdown;

    html = html.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>');

    html = html.replace(/^###\s*(.+)/gm, (_, header) =>
        `<h3 class="text-lg font-bold uppercase mt-3">${header.trim()}</h3>`
    );

    html = html.replace(/^\d+\.\s*(.+)/gm, '<li class="ml-4">$1</li>');

    html = html.replace(/^\-\s*(.+)/gm, '<li class="ml-4">$1</li>');

    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, text, url) =>
        `<a href="${url}" class="text-blue-500 underline hover:text-blue-700">${text}</a>`
    );

    html = html.replace(/(<li.*<\/li>)/gms, '<ul class="list-disc pl-5">$1</ul>');

    html = html.replace(/```(\w+)([\s\S]*?)```/g, (_, language, code) =>
        `<div class="mb-4 mt-2 bg-black rounded p-4">
            <span class="block text-sm text-gray-500 mb-1">${language}</span>
            <code class="block">${code.trim()}</code>
        </div>`
    );

    return html.trim();
};

const isMarkdown = (text) => {
    const markdownPatterns = [
        /\*\*(.*?)\*\*/, // Bold
        /^###\s/gm,      // Headers
        /^\d+\.\s/gm,    // Numbered lists
        /^\-\s/gm        // Bullet points
    ];

    // Return true if any Markdown pattern matches
    return markdownPatterns.some((pattern) => pattern.test(text));
};

function extractRelevantText(input) {
    if (input.startsWith("---## ⚙️ Input text analysis")) {
        const startMarker = "## 👤 Humanized text";
        const endMarker = "---";

        const startIndex = input.indexOf(startMarker) + startMarker.length;
        const endIndex = input.indexOf(endMarker, startIndex);

        const relevantText = input.slice(startIndex, endIndex).trim();

        return relevantText;
    }
    else {
        return input;
    }
}

sendBtn.addEventListener("click", getResponse);
newChat.addEventListener("click", createNewChat);