// =====================================================
// GlobalChat API
// =====================================================

// Cole aqui a URL do seu Aplicativo da Web.
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

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            action: "createTopic",

            title: topic.title,

            description: topic.description,

            age: topic.age

        })

    });

    if (!response.ok) {
        throw new Error("Erro ao criar o tópico.");
    }

    return await response.json();

}

// =====================================================

async function sendMessageAPI(message) {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            action: "sendMessage",

            topic: message.topic,

            user: message.user,

            text: message.text

        })

    });

    if (!response.ok) {
        throw new Error("Erro ao enviar a mensagem.");
    }

    return await response.json();

}