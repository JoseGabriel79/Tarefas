const olHTML = document.getElementById("listaDeTarefas")

async function baixarTarefas() {

    olHTML.innerHTML = ""
    var tarefas = await fetch("https://tarefas-bw3f.onrender.com")
    var listaDeTarefas = await tarefas.json()
    listaDeTarefas.forEach((tarefa, index) => {
        const liHTML = document.createElement("li")
        var tarefaPadronizada = capitalizarPrimeiraLetra(tarefa.tarefa)
        if (tarefa.categoria == "casa") {
            liHTML.innerHTML = `<div class="linha"><span class = texto><img src = "lar.gif">` + " " + tarefaPadronizada +`</span>`+
                `<div class="botoes"><button onclick='excluirTarefa(${tarefa.id})'>Excluir</button>
                    <button onclick='abrirModal("${tarefa.tarefa}", ${tarefa.id})'>Editar</button></div></div>
                     `
            olHTML.appendChild(liHTML)
        } else {
            liHTML.innerHTML = `<div class="linha"><span class = texto><img src = "empresa.gif">` + " " + tarefaPadronizada +`</span>`+
                `<div class="botoes"><button onclick='excluirTarefa(${tarefa.id})'>Excluir</button>
                     <button onclick='abrirModal("${tarefa.tarefa}", ${tarefa.id})'>Editar</button></div></div>
                     `
            olHTML.appendChild(liHTML)
        }
    })
    
}
function capitalizarPrimeiraLetra(str) {
    if (str.length === 0) return str;  // Verifica se a string não está vazia
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


async function salvarTarefa() {
    let tarefa = document.getElementById("tarefa").value
    let categoria = document.getElementById("categoria").value
    if (!tarefa || !categoria) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    let req = await fetch("https://tarefas-bw3f.onrender.com", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ tarefa, categoria })
    })
    tarefa.value = ""
    olHTML.innerHTML = ""
    baixarTarefas()
}


async function excluirTarefa(index) {
    let req = await fetch("https://tarefas-bw3f.onrender.com/" + index,
        { method: "DELETE" }
    )
    olHTML.innerHTML = ""
    baixarTarefas()
}



baixarTarefas()
let modal = document.getElementById("modal");



// Função para abrir o modal com os dados da tarefa
function abrirModal(tarefaOri, index) {
    var tarefaPadronizada = capitalizarPrimeiraLetra(tarefaOri)
    modal.style.display = "block";  // Exibe o modal
    var divModal = document.getElementById("modal-content")
    divModal.innerHTML = `
                <span class="close" onclick="fecharModal()">&times;</span>
                <h2>Editar Tarefa -- <span>${tarefaPadronizada} </span>--</h2>
                <input id="novoNome" type="text" placeholder="Novo nome" required>
                <select name="" id="categoriaNova">
                    <option value="" disabled selected required>Nova categoria</option>
                    <option value="casa">Casa</option>
                    <option value="trabalho">Trabalho</option>
                </select>
                <br>
                <button id="confirmarCadastroBtn">Confirmar cadastro</button>
                `

    // Adiciona o evento ao botão
    document.getElementById("confirmarCadastroBtn").onclick = async function () {
        await editarTarefa(index)
    }
    olHTML.innerHTML = ""
    baixarTarefas()
}

async function editarTarefa(index) {
    let tarefa = document.getElementById("novoNome").value
    let categoria = document.getElementById("categoriaNova").value
    if (!tarefa || !categoria) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    let req = await fetch("https://tarefas-bw3f.onrender.com" + index,
        {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ tarefa, categoria, index })
        }
    )
    olHTML.innerHTML = ""
    baixarTarefas()
    fecharModal()
}
// Função para fechar o modal
function fecharModal() {
    modal.style.display = "none";  // Oculta o modal
    location.reload();
}

// Fechar o modal se o clique for fora da área de conteúdo
window.onclick = function(event) {
    if (event.target === modal) {
        fecharModal(); // Fecha o modal se o clique for fora da área do conteúdo
    }
}