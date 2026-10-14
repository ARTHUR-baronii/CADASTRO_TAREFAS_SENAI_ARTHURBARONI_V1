const campo = document.getElementById("campo-tarefa");
const botao = document.getElementById("botao-adicionar");
const lista = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador-tarefas");
const botaoTema = document.getElementById("botao-tema");

const filtros = document.querySelectorAll(".filtro");

let tarefas = JSON.parse(localStorage.getItem("tarefas_app")) || [];
let filtroAtual = "todas";

// Salvar tarefas
function salvar() {
    localStorage.setItem("tarefas_app", JSON.stringify(tarefas));
}

// Mostrar tarefas
function mostrarTarefas() {
    lista.innerHTML = "";

    let concluidas = tarefas.filter(t => t.concluida).length;
    let total = tarefas.length;

    let porcentagem = total === 0
        ? 0
        : Math.round((concluidas / total) * 100);

    document.getElementById("texto-progresso").textContent =
        `${concluidas} de ${total} tarefas concluídas`;

    document.getElementById("preenchimento").style.width =
        porcentagem + "%";

    document.getElementById("porcentagem").textContent =
        porcentagem + "%";

    contador.textContent = total +
        (total === 1 ? " tarefa na lista" : " tarefas na lista");

    tarefas.forEach(function(tarefa, index) {
        if (filtroAtual === "pendentes" && tarefa.concluida) return;
        if (filtroAtual === "concluidas" && !tarefa.concluida) return;

        const item = document.createElement("li");

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        const texto = document.createElement("span");
        texto.textContent = tarefa.texto;

        const botoes = document.createElement("div");

        const concluir = document.createElement("button");
        concluir.innerHTML = tarefa.concluida
            ? '<i class="fa-solid fa-rotate-left"></i>'
            : '<i class="fa-solid fa-check"></i>';

        concluir.title = tarefa.concluida
            ? "Desmarcar tarefa"
            : "Concluir tarefa";

        concluir.onclick = function() {
            tarefas[index].concluida = !tarefas[index].concluida;
            salvar();
            mostrarTarefas();
        };

        const excluir = document.createElement("button");
        excluir.innerHTML = '<i class="fa-solid fa-trash"></i>';
        excluir.title = "Excluir tarefa";

        excluir.onclick = function() {
            tarefas.splice(index, 1);
            salvar();
            mostrarTarefas();
        };

        botoes.appendChild(concluir);
        botoes.appendChild(excluir);

        item.appendChild(texto);
        item.appendChild(botoes);

        lista.appendChild(item);
    });
}

// Adicionar tarefa
function adicionarTarefa() {
    const texto = campo.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa!");
        return;
    }

    tarefas.push({
        texto: texto,
        concluida: false
    });

    campo.value = "";

    salvar();
    mostrarTarefas();
}

botao.addEventListener("click", adicionarTarefa);

campo.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        adicionarTarefa();
    }
});

// Filtrar tarefas
filtros.forEach(function(botaoFiltro) {
    botaoFiltro.addEventListener("click", function() {
        filtroAtual = botaoFiltro.dataset.filtro;

        filtros.forEach(function(botao) {
            botao.classList.remove("ativo");
        });

        botaoFiltro.classList.add("ativo");

        mostrarTarefas();
    });
});

// Alternar tema
function aplicarTema(tema) {
    document.body.classList.toggle("tema-escuro", tema === "escuro");

    botaoTema.innerHTML = tema === "escuro"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
}

botaoTema.addEventListener("click", function() {
    const tema = document.body.classList.contains("tema-escuro")
        ? "claro"
        : "escuro";

    aplicarTema(tema);
    localStorage.setItem("tema_app", tema);
});

// Carregar as configurações salvas
aplicarTema(localStorage.getItem("tema_app") || "claro");
mostrarTarefas();