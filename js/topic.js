import {
    getTopic,
    sendMessage,
    editMessage,
    deleteMessage,
    updateTopic,
    deleteTopic,
    db
} from "./firebase.js";

import {
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ======================================================
// Parâmetros
// ======================================================

const params = new URLSearchParams(window.location.search);

const topicId = params.get("id");

if (!topicId) {

    location.href = "index.html";

}

// ======================================================
// Dono deste navegador
// ======================================================

const ownerId = localStorage.getItem(
    "globalchat_userid"
);

// ======================================================
// Elementos
// ======================================================

const topicTitle =
    document.getElementById("topicTitle");

const topicDescription =
    document.getElementById("topicDescription");

const topicAge =
    document.getElementById("topicAge");

const messages =
    document.getElementById("messages");

const form =
    document.getElementById("messageForm");

const messageInput =
    document.getElementById("message");

// ======================================================
// Aviso de idade
// ======================================================

const ageWarning =
    document.getElementById("ageWarning");

const warningAge =
    document.getElementById("warningAge");

const continueButton =
    document.getElementById("continueButton");

const cancelButton =
    document.getElementById("cancelButton");

// ======================================================
// Nome de usuário
// ======================================================

const usernameModal =
    document.getElementById("usernameModal");

const usernameInput =
    document.getElementById("username");

const usernameButton =
    document.getElementById("usernameButton");

// ======================================================
// Botões do tópico
// ======================================================

const editTopicButton =
    document.getElementById("editTopicButton");

const deleteTopicButton =
    document.getElementById("deleteTopicButton");

// ======================================================
// Modal editar tópico
// ======================================================

const editTopicModal =
    document.getElementById("editTopicModal");

const editTopicTitle =
    document.getElementById("editTopicTitle");

const editTopicDescription =
    document.getElementById("editTopicDescription");

const editTopicAge =
    document.getElementById("editTopicAge");

const saveTopicButton =
    document.getElementById("saveTopicButton");

const cancelEditTopicButton =
    document.getElementById("cancelEditTopicButton");

// ======================================================
// Modal apagar tópico
// ======================================================

const deleteTopicModal =
    document.getElementById("deleteTopicModal");

const confirmDeleteTopicButton =
    document.getElementById("confirmDeleteTopicButton");

const cancelDeleteTopicButton =
    document.getElementById("cancelDeleteTopicButton");

// ======================================================

let username =
    localStorage.getItem(
        "globalchat_username"
    ) || "Anônimo";

let currentTopic = null;

// ======================================================

loadTopic();

// ======================================================

async function loadTopic() {

    try {

        currentTopic =
            await getTopic(topicId);

        if (!currentTopic) {

            alert(
                "Tópico não encontrado."
            );

            location.href =
                "index.html";

            return;

        }

        topicTitle.textContent =
            currentTopic.title;

        topicDescription.textContent =
            currentTopic.description;

        topicAge.textContent =
            Number(currentTopic.age) === 0
            ? "Livre"
            : currentTopic.age + "+";

        // ============================
        // Apenas o criador
        // ============================

        if (
            currentTopic.owner === ownerId
        ) {

            editTopicButton.style.display =
                "inline-block";

            deleteTopicButton.style.display =
                "inline-block";

        } else {

            editTopicButton.style.display =
                "none";

            deleteTopicButton.style.display =
                "none";

        }

        // ============================

        if (
            Number(currentTopic.age) > 0
        ) {

            warningAge.textContent =
                currentTopic.age + " anos";

            ageWarning.classList.remove(
                "hidden"
            );

        } else {

            showUsernameModal();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Erro ao carregar o tópico."
        );

    }

}

// ======================================================

continueButton.addEventListener(
    "click",
    () => {

        ageWarning.classList.add(
            "hidden"
        );

        showUsernameModal();

    }
);

cancelButton.addEventListener(
    "click",
    () => {

        location.href =
            "index.html";

    }
);

// ======================================================

function showUsernameModal() {

    usernameInput.value =
        localStorage.getItem(
            "globalchat_username"
        ) || "";

    usernameModal.classList.remove(
        "hidden"
    );

    usernameInput.focus();

}

usernameButton.addEventListener(
    "click",
    () => {

        username =
            usernameInput.value.trim();

        if (!username) {

            username = "Anônimo";

        }

        localStorage.setItem(
            "globalchat_username",
            username
        );

        usernameModal.classList.add(
            "hidden"
        );

        startChat();

    }
);

// ======================================================
// Chat em tempo real
// ======================================================

function startChat() {

    const q = query(

        collection(
            db,
            "topics",
            topicId,
            "messages"
        ),

        orderBy("created")

    );

    onSnapshot(q, snapshot => {

        messages.innerHTML = "";

        if (snapshot.empty) {

            messages.innerHTML = `
                <div class="loading">
                    Ainda não há mensagens.
                </div>
            `;

            return;

        }

        snapshot.forEach(document => {

            addMessage(

                document.id,

                document.data()

            );

        });

        messages.scrollTop =
            messages.scrollHeight;

    });

}

// ======================================================
// Exibir mensagem
// ======================================================

function addMessage(messageId, message) {

    const div =
        document.createElement("div");

    div.className = "message";

    let actions = "";

    if (message.owner === ownerId) {

        actions = `

            <div class="messageActions">

                <button
                    class="editMessageButton"
                    data-id="${messageId}"
                >
                    Editar
                </button>

                <button
                    class="deleteMessageButton"
                    data-id="${messageId}"
                >
                    Apagar
                </button>

            </div>

        `;

    }

    div.innerHTML = `

        <div class="messageUser">

            ${escapeHtml(
                message.user || "Anônimo"
            )}

        </div>

        <div class="messageDate">

            ${formatDate(
                message.created
            )}

            ${message.edited
                ? " • editada"
                : ""}

        </div>

        <div class="messageText">

            ${escapeHtml(
                message.text
            )}

        </div>

        ${actions}

    `;

    messages.appendChild(div);

    if (message.owner === ownerId) {

        div
        .querySelector(".editMessageButton")
        .addEventListener(
            "click",
            () => {

                openEditMessage(
                    messageId,
                    message.text
                );

            }
        );

        div
        .querySelector(".deleteMessageButton")
        .addEventListener(
            "click",
            () => {

                openDeleteMessage(
                    messageId
                );

            }
        );

    }

}

// ======================================================
// Enviar mensagem
// ======================================================

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const text =
            messageInput.value.trim();

        if (!text) return;

        const button =
            form.querySelector("button");

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

            alert(
                "Não foi possível enviar a mensagem."
            );

        }

        button.disabled = false;

    }
);

// ======================================================
// Abrir edição
// ======================================================

function openEditMessage(
    messageId,
    text
) {

    currentMessageId =
        messageId;

    editMessageInput.value =
        text;

    editMessageModal.classList.remove(
        "hidden"
    );

    editMessageInput.focus();

}

// ======================================================
// Abrir exclusão
// ======================================================

function openDeleteMessage(
    messageId
) {

    currentMessageId =
        messageId;

    deleteMessageModal.classList.remove(
        "hidden"
    );

}

// ======================================================
// Variáveis da edição
// ======================================================

let currentMessageId = null;

// ======================================================
// Modal editar mensagem
// ======================================================

const editMessageModal =
    document.getElementById("editMessageModal");

const editMessageInput =
    document.getElementById("editMessageInput");

const saveMessageButton =
    document.getElementById("saveMessageButton");

const cancelEditMessageButton =
    document.getElementById("cancelEditMessageButton");

// ======================================================
// Modal apagar mensagem
// ======================================================

const deleteMessageModal =
    document.getElementById("deleteMessageModal");

const confirmDeleteMessageButton =
    document.getElementById("confirmDeleteMessageButton");

const cancelDeleteMessageButton =
    document.getElementById("cancelDeleteMessageButton");

// ======================================================
// Editar mensagem
// ======================================================

saveMessageButton.addEventListener(
    "click",
    async () => {

        const text =
            editMessageInput.value.trim();

        if (!text) {

            alert(
                "Digite uma mensagem."
            );

            return;

        }

        try {

            await editMessage(

                topicId,

                currentMessageId,

                text

            );

            editMessageModal.classList.add(
                "hidden"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Não foi possível editar a mensagem."
            );

        }

    }
);

cancelEditMessageButton.addEventListener(
    "click",
    () => {

        editMessageModal.classList.add(
            "hidden"
        );

    }
);

// ======================================================
// Apagar mensagem
// ======================================================

confirmDeleteMessageButton.addEventListener(
    "click",
    async () => {

        try {

            await deleteMessage(

                topicId,

                currentMessageId

            );

            deleteMessageModal.classList.add(
                "hidden"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Não foi possível apagar a mensagem."
            );

        }

    }
);

cancelDeleteMessageButton.addEventListener(
    "click",
    () => {

        deleteMessageModal.classList.add(
            "hidden"
        );

    }
);

// ======================================================
// Editar tópico
// ======================================================

editTopicButton.addEventListener(
    "click",
    () => {

        editTopicTitle.value =
            currentTopic.title;

        editTopicDescription.value =
            currentTopic.description;

        editTopicAge.value =
            currentTopic.age;

        editTopicModal.classList.remove(
            "hidden"
        );

    }
);

saveTopicButton.addEventListener(
    "click",
    async () => {

        try {

            await updateTopic(

                topicId,

                editTopicTitle.value.trim(),

                editTopicDescription.value.trim(),

                Number(editTopicAge.value)

            );

            currentTopic.title =
                editTopicTitle.value.trim();

            currentTopic.description =
                editTopicDescription.value.trim();

            currentTopic.age =
                Number(editTopicAge.value);

            topicTitle.textContent =
                currentTopic.title;

            topicDescription.textContent =
                currentTopic.description;

            topicAge.textContent =
                currentTopic.age === 0
                ? "Livre"
                : currentTopic.age + "+";

            editTopicModal.classList.add(
                "hidden"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Não foi possível editar o tópico."
            );

        }

    }
);

cancelEditTopicButton.addEventListener(
    "click",
    () => {

        editTopicModal.classList.add(
            "hidden"
        );

    }
);

// ======================================================
// Apagar tópico
// ======================================================

deleteTopicButton.addEventListener(
    "click",
    () => {

        deleteTopicModal.classList.remove(
            "hidden"
        );

    }
);

confirmDeleteTopicButton.addEventListener(
    "click",
    async () => {

        try {

            await deleteTopic(topicId);

            alert(
                "Tópico apagado."
            );

            location.href =
                "index.html";

        } catch (error) {

            console.error(error);

            alert(
                "Não foi possível apagar o tópico."
            );

        }

    }
);

cancelDeleteTopicButton.addEventListener(
    "click",
    () => {

        deleteTopicModal.classList.add(
            "hidden"
        );

    }
);

// ======================================================
// Utilidades
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

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;

}
