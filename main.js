import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey1 = "AIzaSyCTVnyDpBA9cdgYoKCKpTHiTv_GYDPLvXE";
const apiKey2 = "AIzaSyD-2x4yTz6M6n3aXsQ9J5vZDzJjF3cR8F0";
const apiKey3 = "AIzaSyB-8l0kQ4w2a3bZk1z9m4Mf5Jd0ZqK0Z2U";

let nombreBot, prompt, imgBot;
let genAI, model, chat;

document.addEventListener("DOMContentLoaded", function() {
    nombreBot = window.nombreBot;
    prompt = window.prompt;
    imgBot = window.imgBot;

    // Inicializa el bot y configura GoogleGenerativeAI
    const apis = [apiKey1, apiKey2, apiKey3];
    let indice = 0;
    genAI = new GoogleGenerativeAI(apis[indice]);

    model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: prompt,
    });
    chat = model.startChat({
        history: [],
    });

    // Carga los datos del chat desde el localstorage
    loadDataFromLocalstorage();
});

const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

const API_KEY = genAI ? genAI.apiKey : null;

// Copia el texto de respuesta del chatbot
const copyResponse = (copyBtn) => {
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

// Envía el mensaje del usuario al presionar el botón de enviar
sendButton.addEventListener("click", () => {
    handleOutgoingChat();
});

// Copia el texto de respuesta del chatbot al presionar el botón de copiar
chatContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("material-symbols-rounded")) {
        copyResponse(e.target);
    }
});

// Carga los datos del chat desde el localstorage
const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("themeColor");
    
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
    <h1>ChatBOT</h1>
    <p>Empieza una conversacion con ${nombreBot}.<br> El historial del chat sera mostrado aqui.</p>
    </div>`;
    
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

// Crea un elemento de chat
const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
}

let userText = null;

// Obtiene la respuesta del chatbot
const getChatResponse = async (incomingChatDiv) => {
    const promptText = userText;  // Usamos el texto del usuario como prompt para generar contenido

    try {
        // Generamos contenido usando el modelo obtenido previamente
        const result = await chat.sendMessage(promptText);
        const generatedText = result.response.text();

        // Creamos un elemento <p> para mostrar la respuesta generada
        const pElement = document.createElement("p");
        pElement.textContent = generatedText;

        // Actualizamos la interfaz de usuario con la respuesta generada
        incomingChatDiv.querySelector(".typing-animation").remove();
        incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
        localStorage.setItem("all-chats", chatContainer.innerHTML);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);

    } catch (error) {
        if (indice < 2) {
            indice++;
        } else {
            indice = 0;
        }
        genAI = new GoogleGenerativeAI(apis[indice]);
        // Manejamos errores en caso de que falle la generación de contenido
        const pElement = document.createElement("p");
        pElement.classList.add("error");
        pElement.textContent = "Algo anduvo mal. Por favor, intenta de nuevo.";

        incomingChatDiv.querySelector(".typing-animation").remove();
        incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
        localStorage.setItem("all-chats", chatContainer.innerHTML);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    }
}

// Muestra la animación de escritura
const showTypingAnimation = () => {
    const html = `<div class="chat-content">
    <div class="chat-details">
    <img src="${imgBot}" alt="chatbot-img">
    <div class="typing-animation">
    <div class="typing-dot" style="--delay: 0.2s"></div>
    <div class="typing-dot" style="--delay: 0.3s"></div>
    <div class="typing-dot" style="--delay: 0.4s"></div>
    </div>
    </div>
    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
    </div>`;
    
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const initialInputHeight = chatInput.scrollHeight;

// Maneja el chat saliente
const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;
    
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;
    
    const html = `<div class="chat-content">
    <div class="chat-details">
    <img src="images/user.svg" alt="user-img">
    <p>${userText}</p>
    </div>
    </div>`;
    
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    if (confirm("Seguro queres eliminar todo el chat?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

// Ajusta la altura del input de chat
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});
