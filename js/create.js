const form = document.getElementById("createTopicForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const ageInput = document.getElementById("age");

form.addEventListener("submit", createTopic);

async function createTopic(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const age = Number(ageInput.value);

    if (!title) {
        alert("Digite um título para o tópico.");
        titleInput.focus();
        return;
    }

    if (!description) {
        alert("Digite uma descrição para o tópico.");
        descriptionInput.focus();
        return;
    }

    const button = form.querySelector("button");

    button.disabled = true;
    button.textContent = "Criando...";

    try {

        await createTopicAPI({
            title,
            description,
            age
        });

        alert("Tópico criado com sucesso!");

        location.href = "index.html";

    } catch (error) {

        console.error(error);

        alert("Não foi possível criar o tópico.");

        button.disabled = false;
        button.textContent = "Criar tópico";

    }

}