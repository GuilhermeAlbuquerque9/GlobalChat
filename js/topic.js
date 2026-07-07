import {
    getTopic,
    getMessages,
    sendMessage
} from "./firebase.js";

const params = new URLSearchParams(window.location.search);
const topicId = params.get("id");

if (!topicId) {
    window.location.href = "index.html";
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

let username =
    localStorage.getItem("globalchat_username") || "Anônimo";

let topic = null;

// ======================================================

loadTopic();

// ======================================================

async function loadTopic() {

    try {

        topic = await getTopic(topicId);

        if (!topic) {

            alert("Tópico não encontrado.");

            location.href = "index.html";

            return;

        }

        topicTitle.textContent = topic.title;
        topicDescription.textContent = topic.description;

        if (Number(topic.age) === 0) {

            topicAge.textContent = "Livre";

            showUsername();

        } else {

            topicAge.textContent = topic.age + "+";

            warningAge.textContent = topic.age + " anos";

            ageWarning.classList.remove("hidden");

        }

    } catch (err) {

        console.error(err);

        alert("Erro ao carregar o tópico.");

    }

}

// ======================================================

continueButton.addEventListener("click", () => {

    ageWarning.classList.add("hidden");

    showUsername();

});

cancelButton.addEventListener("click", () => {

    location.href = "index.html";

});

// ======================================================

function showUsername() {

    usernameInput.value =
        localStorage.getItem("globalchat_username") || "";

    usernameModal.classList.remove("hidden");

    usernameInput.focus();

}

// ======================================================

usernameButton.addEventListener("click", async () => {

    username = usernameInput.value.trim();

    if (username === "") {

        username = "Anônimo";

    }

    localStorage.setItem(
        "globalchat_username",
        username
    );

    usernameModal.classList.add("hidden");

    await loadMessages();

});

// ======================================================

async function loadMessages() {

    try {

        const list = await getMessages(topicId);

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

    } catch (err) {

        console.error(err);

    }

}

// ======================================================

function addMessage(message) {

    const div = document.createElement("div");

    div.className = "message";

    div.innerHTML = `
        <div class="messageUser">
            ${escapeHtml(message.user)}
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

    if (!text) return;

    const button = form.querySelector("button");

    button.disabled = true;

    try {

        await sendMessage(
            topicId,
            username,
            text
        );

        messageInput.value = "";

        await loadMessages();

    } catch (err) {

        console.error(err);

        alert("Erro ao enviar a mensagem.");

    }

    button.disabled = false;

});

// ======================================================

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text ?? "";

    return div.innerHTML;

}

// ======================================================

function formatDate(timestamp) {

    if (!timestamp) return "";

    if (timestamp.seconds) {

        return new Date(
            timestamp.seconds * 1000
        ).toLocaleString("pt-BR");

    }

    return "";

}
