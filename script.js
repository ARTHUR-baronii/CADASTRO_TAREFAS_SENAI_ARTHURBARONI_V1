const campo = document.getElementById("campo-tarefa");
const botao = document.getElementById("botao-adicionar");
const lista = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador-tarefas");
const botaoTema = document.getElementById("botao-alternar-tema");

// 1. Carrega as tarefas salvas no localStorage (ou inicia com lista vazia)
let tarefas = JSON.parse(localStorage.getItem("tarefas_app")) || [];

// 2. Carrega o tema salvo
if (localStorage.getItem("tema_app") === "escuro") {
    document.body.classList.add("tema-escuro", "modo-escuro");
    botaoTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

// Exibe as tarefas salvas ao abrir a página
mostrarTarefas();

// Função para salvar a lista no localStorage
function salvarNoStorage() {
    localStorage.setItem("tarefas_app", JSON.stringify(tarefas));
}

// Adicionar tarefa
botao.addEventListener("click", function () {
    const texto = campo.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa!");
        return;
    }

    // Guarda um objeto com o texto e o status de concluída
    tarefas.push({
        texto: texto,
        concluida: false
    });

    campo.value = "";
    salvarNoStorage();
    mostrarTarefas();
});

// Renderizar tarefas na tela
function mostrarTarefas() {
    lista.innerHTML = "";

    tarefas.forEach(function (tarefa, index) {
        let item = document.createElement("li");

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        item.innerHTML = `
            <span>${tarefa.texto}</span>

            <div>
                <button onclick="concluir(${index})">
                    <i class="fa-solid fa-circle-check"></i>
                </button>

                <button onclick="excluir(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        lista.appendChild(item);
    });

    contador.textContent = tarefas.length + 
        (tarefas.length === 1 ? " tarefa na lista" : " tarefas na lista");
}

// Marcar / desmarcar como concluída
function concluir(index) {
    tarefas[index].concluida = !tarefas[index].concluida;
    salvarNoStorage();
    mostrarTarefas();
}

// Excluir tarefa
function excluir(index) {
    tarefas.splice(index, 1);
    salvarNoStorage();
    mostrarTarefas();
}

// Alternar e salvar preferência de Tema (Claro / Escuro)
botaoTema.addEventListener("click", function() {
    document.body.classList.toggle("tema-escuro");
    document.body.classList.toggle("modo-escuro");

    if (document.body.classList.contains("tema-escuro")) {
        botaoTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem("tema_app", "escuro");
    } else {
        botaoTema.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem("tema_app", "claro");
    }
});