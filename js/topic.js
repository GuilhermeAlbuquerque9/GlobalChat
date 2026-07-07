import {
    getTopic,
    listenMessages,
    sendMessage
} from "./firebase.js";

// ======================================================
// Parâmetros
// ======================================================

const params = new URLSearchParams(window.location.search);
const topicId = params.get("id");

if (!topicId) {
    location.href = "index.html";
}

// ======================================================
// Elementos
// ======================================================

const topicTitle = document.getElementById("topicTitle");
const topicDescription = document.getElementById("topicDescription");
const topicAge = document.getElementById("topicAge");

const messages = document.getElementById("messages");

const form = document.getElementById("messageForm");
const messageInput = document.getElementById("message");

// Aviso de idade

const ageWarning = document.getElementById("ageWarning");
const warningAge = document.getElementById("warningAge");
const continueButton = document.getElementById("continueButton");
const cancelButton = document.getElementById("cancelButton");

// Nome de usuário

const usernameModal = document.getElementById("usernameModal");
const usernameInput = document.getElementById("username");
const usernameButton = document.getElementById("usernameButton");

let username = localStorage.getItem("globalchat_username") || "Anônimo";

// ======================================================

loadTopic();

// ======================================================

async function loadTopic() {

    try {

        const topic = await getTopic(topicId);

        if (!topic) {

            alert("Tópico não encontrado.");

            location.href = "index.html";

            return;

        }

        topicTitle.textContent = topic.title;
        topicDescription.textContent = topic.description;

        if (Number(topic.age) === 0) {

            topicAge.textContent = "Livre";

            showUsernameModal();

        } else {

            topicAge.textContent = topic.age + "+";

            warningAge.textContent = topic.age + " anos";

            ageWarning.classList.remove("hidden");

        }

    } catch (error) {

        console.error(error);

        alert("Erro ao carregar o tópico.");

    }

}

// ======================================================

continueButton.addEventListener("click", () => {

    ageWarning.classList.add("hidden");

    showUsernameModal();

});

cancelButton.addEventListener("click", () => {

    location.href = "index.html";

});

// ======================================================

function showUsernameModal() {

    usernameInput.value =
        localStorage.getItem("globalchat_username") || "";

    usernameModal.classList.remove("hidden");

    usernameInput.focus();

}

// ======================================================

usernameButton.addEventListener("click", () => {

    username = usernameInput.value.trim();

    if (username === "") {

        username = "Anônimo";

    }

    localStorage.setItem(
        "globalchat_username",
        username
    );

    usernameModal.classList.add("hidden");

    startChat();

});

// ======================================================

function startChat() {

    listenMessages(topicId, (list) => {

        messages.innerHTML = "";

        if (list.length === 0) {

            messages.innerHTML = `
                <div class="loading">
                    Ainda não há mensagens.
                </div>
            `;

            return;

        }

        list.forEach(addMessage);

        messages.scrollTop = messages.scrollHeight;

    });

}

// ======================================================

function addMessage(message) {

    const div = document.createElement("div");

    div.className = "message";

    div.innerHTML = `

        <div class="messageUser">

            ${escapeHtml(message.user || "Anônimo")}

        </div>

        <div class="messageDate">

            ${formatDate(message.created)}

        </div>

        <div class="messageText">

            ${escapeHtml(message.text)}

        </div>

    `;

    messages.appendChild(div);

}

// ======================================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const text = messageInput.value.trim();

    if (text === "") return;

    const button = form.querySelector("button");

    button.disabled = true;

    try {

        await sendMessage(

            topicId,

            username,

            text

        );

        messageInput.value = "";

        messageInput.focus();

    } catch (error) {

        console.error(error);

        alert("Não foi possível enviar a mensagem.");

    }

    button.disabled = false;

});

// ======================================================

function formatDate(timestamp) {

    if (!timestamp) {

        return "";

    }

    if (timestamp.seconds) {

        return new Date(
            timestamp.seconds * 1000
        ).toLocaleString("pt-BR");

    }

    return "";

}

// ======================================================

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text ?? "";

    return div.innerHTML;

}
