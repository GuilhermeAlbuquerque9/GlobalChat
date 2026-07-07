import { createTopic } from "./firebase.js";

const form = document.getElementById("createTopicForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const ageInput = document.getElementById("age");

form.addEventListener("submit", onSubmit);

async function onSubmit(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const age = Number(ageInput.value);

    if (!title) {

        alert("Digite um título.");

        titleInput.focus();

        return;

    }

    if (!description) {

        alert("Digite uma descrição.");

        descriptionInput.focus();

        return;

    }

    const button = form.querySelector("button");

    button.disabled = true;

    button.textContent = "Criando...";

    try {

        const id = await createTopic({

            title,
            description,
            age

        });

        alert("Tópico criado com sucesso!");

        location.href = `topic.html?id=${encodeURIComponent(id)}`;

    } catch (error) {

        console.error(error);

        alert("Erro ao criar o tópico.");

        button.disabled = false;

        button.textContent = "Criar tópico";

    }

}
