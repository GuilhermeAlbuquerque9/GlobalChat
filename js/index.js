const topicsList = document.getElementById("topicsList");

loadTopics();

async function loadTopics() {

    topicsList.innerHTML = `
        <div class="loading">
            Carregando tópicos...
        </div>
    `;

    try {

        const topics = await getTopics();

        if (!topics || topics.length === 0) {

            topicsList.innerHTML = `
                <div class="loading">
                    Nenhum tópico encontrado.
                </div>
            `;

            return;
        }

        topicsList.innerHTML = "";

        topics.forEach(createTopicCard);

    } catch (error) {

        console.error(error);

        topicsList.innerHTML = `
            <div class="loading">
                Erro ao carregar os tópicos.
            </div>
        `;

    }

}

function createTopicCard(topic) {

    const card = document.createElement("div");
    card.className = "topic";

    const ageText = Number(topic.age) === 0
        ? "Livre"
        : `${topic.age}+`;

    card.innerHTML = `
        <h2>${escapeHtml(topic.title)}</h2>

        <p>${escapeHtml(topic.description)}</p>

        <span class="age">${ageText}</span>

        <br><br>

        <button>
            Entrar
        </button>
    `;

    card.querySelector("button").addEventListener("click", () => {

        location.href = `topic.html?id=${encodeURIComponent(topic.id)}`;

    });

    topicsList.appendChild(card);

}

function escapeHtml(text) {

    const div = document.createElement("div");
    div.textContent = text ?? "";

    return div.innerHTML;

}