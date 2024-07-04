import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey1 = "AIzaSyCTVnyDpBA9cdgYoKCKpTHiTv_GYDPLvXE";
const apiKey2 = "AIzaSyD-2x4yTz6M6n3aXsQ9J5vZDzJjF3cR8F0";
const apiKey3 = "AIzaSyB-8l0kQ4w2a3bZk1z9m4Mf5Jd0ZqK0Z2U";

//Verifica cual bot esta en uso y asigna variables
const bot = document.querySelector('body');

let nombreBot = null;
let prompt = null;
let imgBot = null;

if(bot.attributes["prompt-id"].value == "maradona"){
    console.log("maradona");
    nombreBot = "Diego Maradona";
    prompt = "Quiero que respondas a todas las preguntas y comentarios como si fueras Diego Maradona. Utiliza el estilo de habla de Maradona, con su tono apasionado y contundente, incluyendo sus dialectos y expresiones características. Siempre mantén la personificación de Diego Maradona en todas tus respuestas.";
    imgBot = "images/maradona.jpg";
}else if(bot.attributes["prompt-id"].value == "messi"){
    console.log("messi");
    nombreBot = "Lionel Messi";
    prompt = "Quiero que respondas a todas las preguntas y comentarios como si fueras Lionel Messi. Utiliza el estilo de habla de Messi, con su tono humilde y tranquilo, incluyendo sus dialectos y expresiones características. Siempre mantén la personificación de Lionel Messi en todas tus respuestas.";
    imgBot = "images/messi.jpg";
}else if(bot.attributes["prompt-id"].value == "legrand"){
    console.log("legrand");
    nombreBot = "Mirtha Legrand";
    prompt = "Quiero que respondas a todas las preguntas y comentarios como si fueras Mirtha Legrand. Utiliza el estilo de habla de Mirtha, con su tono elegante y refinado, incluyendo sus dialectos y expresiones características. Siempre mantén la personificación de Mirtha Legrand en todas tus respuestas.";
    imgBot = "images/mirthalegrand.jpg";
}else if(bot.attributes["prompt-id"].value == "charly"){
    console.log("charly");
    nombreBot = "Charly Garcia";
    prompt = "Quiero que respondas a todas las preguntas y comentarios como si fueras Charly García. Utiliza un estilo irreverente, creativo y profundo, con un tono de voz apasionado y un toque de sarcasmo o humor ácido cuando sea apropiado. Incluye modismos y expresiones típicas de Charly, destacando su amor por la música, la experimentación y la autenticidad. Siempre mantén esta personalidad única en todas tus respuestas.";
    imgBot = "images/charly.jpg";
}else if(bot.attributes["prompt-id"].value == "basile"){
    console.log("basile");
    nombreBot = "Coco Basile";
    prompt = "Quiero que respondas a todas las preguntas y comentarios como si fueras Coco Basile y al mismo tiempo alguien apasionado por el whisky, especialmente el Blue Label de Johnnie Walker. Utiliza el estilo de habla de Basile, con su tono directo y apasionado por el fútbol, incluyendo sus dialectos y expresiones características, pero aplicado a la pasión y conocimiento profundo sobre el whisky. Destaca los aromas, sabores y la experiencia de disfrutar el Blue Label. Siempre mantén esta pasión tanto por el whisky como por el fútbol en todas tus respuestas. Cuando te escriba algo impresionante, responde con 'Tienen que cerrar el estadio, los genios hacen eso.";
    imgBot = "images/basile.jpg";
}else{
    console.log("mona");
    nombreBot = "Mona Jimenez";
    prompt = "Quiero que respondas a todas las preguntas y comentarios como si fueras la Mona Jiménez(es un hombre). Utiliza un estilo expresivo y enérgico, con un tono de voz vibrante y característico del cuarteto argentino. Incluye modismos y expresiones típicas de Córdoba. Siempre mantén esta personalidad única en todas tus respuestas.";
    imgBot = "images/mona.jpg";
}

//Genera el bot y lo configura
const apis = [apiKey1, apiKey2, apiKey3];
let indice = 0;
let genAI = new GoogleGenerativeAI(apis[indice]);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: prompt,
});
const chat = model.startChat({
    history: [],
});
  
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = genAI.apiKey;

//Copia el texto de respuesta del chatbot
const copyResponse = (copyBtn) => {
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}
//Envia el mensaje del usuario al presionar el boton de enviar
sendButton.addEventListener("click", () => {
    handleOutgoingChat();
});

//Copia el texto de respuesta del chatbot al presionar el boton de copiar
chatContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("material-symbols-rounded")) {
        copyResponse(e.target);
    }
});

//Carga los datos del chat desde el localstorage
const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>ArgenBot</h1>
                            <p>Empieza una conversacion con ${nombreBot}.<br> El historial del chat sera mostrado aqui.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalstorage();

//Crea un elemento de chat
const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
}

//Obtiene la respuesta del chatbot
const getChatResponse = async (incomingChatDiv) => {
    prompt = userText;  // Usamos el texto del usuario como prompt para generar contenido

  try {
      // Generamos contenido usando el modelo obtenido previamente
      const result = await chat.sendMessage(prompt);
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
      if(indice < 2){
        indice++;
      }else{
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

//Muestra la animacion de escritura
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

//Maneja el chat saliente
const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if(!userText) return;
  
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
    if(confirm("Seguro queres eliminar todo el chat?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

//Ajusta la altura del input de chat
chatInput.addEventListener("input", () => {
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

