// =====================================================
// GlobalChat API
// =====================================================

// URL do Aplicativo da Web do Google Apps Script.
const API_URL = "https://script.google.com/macros/s/AKfycbzafZY9FvQLbP3-CXZ8jPqxzgEZMQHEe3KT9NWXcpglv9y8AJ5fSQMbYCFW01h7k8AHKQ/exec";

// =====================================================

async function getTopics() {

    const response = await fetch(
        `${API_URL}?action=getTopics`
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar os tópicos.");
    }

    return await response.json();

}

// =====================================================

async function getTopic(id) {

    const response = await fetch(
        `${API_URL}?action=getTopic&id=${encodeURIComponent(id)}`
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar o tópico.");
    }

    return await response.json();

}

// =====================================================

async function getMessages(topicId) {

    const response = await fetch(
        `${API_URL}?action=getMessages&id=${encodeURIComponent(topicId)}`
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar as mensagens.");
    }

    return await response.json();

}

// =====================================================

async function createTopicAPI(topic) {

    const body = new URLSearchParams();

    body.append("action", "createTopic");
    body.append("title", topic.title);
    body.append("description", topic.description);
    body.append("age", topic.age);

    const response = await fetch(API_URL, {
        method: "POST",
        body: body
    });

    if (!response.ok) {
        throw new Error("Erro ao criar o tópico.");
    }

    return await response.json();

}

// =====================================================

async function sendMessageAPI(message) {

    const body = new URLSearchParams();

    body.append("action", "sendMessage");
    body.append("topic", message.topic);
    body.append("user", message.user || "Anônimo");
    body.append("text", message.text);

    const response = await fetch(API_URL, {
        method: "POST",
        body: body
    });

    if (!response.ok) {
        throw new Error("Erro ao enviar a mensagem.");
    }

    return await response.json();

}
