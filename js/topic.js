const params = new URLSearchParams(location.search);
const topicId = params.get("id");

const topicTitle = document.getElementById("topicTitle");
const topicDescription = document.getElementById("topicDescription");
const topicAge = document.getElementById("topicAge");

const messages = document.getElementById("messages");

const form = document.getElementById("messageForm");
const messageInput = document.getElementById("message");

const ageWarning = document.getElementById("ageWarning");
const warningAge = document.getElementById("warningAge");

const continueButton = document.getElementById("continueButton");
const cancelButton = document.getElementById("cancelButton");

let currentTopic = null;
let ageConfirmed = false;

if (!topicId) {

    location.href = "index.html";

}

continueButton.addEventListener("click", () => {

    ageWarning.classList.add("hidden");

    ageConfirmed = true;

    loadMessages();

});

cancelButton.addEventListener("click", () => {

    location.href = "index.html";

});

form.addEventListener("submit", sendMessage);

loadTopic();

async function loadTopic() {

    try {

        currentTopic = await getTopic(topicId);

        if (!currentTopic) {

            alert("Tópico não encontrado.");

            location.href = "index.html";

            return;

        }

        topicTitle.textContent = currentTopic.title;
        topicDescription.textContent = currentTopic.description;

        if (Number(currentTopic.age) === 0) {

            topicAge.textContent = "Livre";

            ageConfirmed = true;

            loadMessages();

        } else {

            topicAge.textContent = currentTopic.age + "+";

            warningAge.textContent = currentTopic.age + " anos";

            ageWarning.classList.remove("hidden");

        }

    } catch (error) {

        console.error(error);

        alert("Erro ao carregar o tópico.");

        location.href = "index.html";

    }

}

async function loadMessages() {

    if (!ageConfirmed) return;

    try {

        const list = await getMessages(topicId);

        messages.innerHTML = "";

        if (!list || list.length === 0) {

            messages.innerHTML = `
                <div class="loading">
                    Ainda não há mensagens.
                </div>
            `;

            return;

        }

        list.forEach(addMessage);

        messages.scrollTop = messages.scrollHeight;

    } catch (error) {

        console.error(error);

        messages.innerHTML = `
            <div class="loading">
                Erro ao carregar mensagens.
            </div>
        `;

    }

}

function addMessage(message) {

    const div = document.createElement("div");

    div.className = "message";

    div.innerHTML = `
        <div class="messageUser">
            ${escapeHtml(message.user)}
        </div>

        <div class="messageDate">
            ${escapeHtml(message.date)}
        </div>

        <div class="messageText">
            ${escapeHtml(message.text)}
        </div>
    `;

    messages.appendChild(div);

}

async function sendMessage(event) {

    event.preventDefault();

    const text = messageInput.value.trim();

    if (!text) return;

    const button = form.querySelector("button");

    button.disabled = true;

    try {

        await sendMessageAPI({

            topic: topicId,
            text: text

        });

        messageInput.value = "";

        await loadMessages();

    } catch (error) {

        console.error(error);

        alert("Não foi possível enviar a mensagem.");

    }

    button.disabled = false;

}

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text ?? "";

    return div.innerHTML;

}