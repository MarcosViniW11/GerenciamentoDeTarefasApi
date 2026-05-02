const API_URL = "http://localhost:8080";
const token = localStorage.getItem('token');

if (!token) window.location.href = "../Login/login.html";

async function fetchAuth(url, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    if (body) options.body = JSON.stringify(body);
    
    try {
        const response = await fetch(`${API_URL}${url}`, options);
        if (response.status === 403) logout();
        return response;
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}

// --- GESTÃO DE CATEGORIAS ---
async function carregarCategorias() {
    const response = await fetchAuth('/categorias');
    const categorias = await response.json();
    
    const select = document.getElementById('taskCatId');
    const lista = document.getElementById('listaCategorias');
    
    select.innerHTML = '<option value="">Categoria...</option>';
    lista.innerHTML = '';

    categorias.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
        lista.innerHTML += `<li><i class="fa-regular fa-hashtag"></i> ${cat.nome}</li>`;
    });
}

async function criarCategoria() {
    const input = document.getElementById('catNome');
    if (!input.value) return;

    const response = await fetchAuth('/categorias', 'POST', { nome: input.value });
    if (response.ok) {
        input.value = '';
        carregarCategorias();
    }
}

// --- GESTÃO DE TAREFAS ---
async function carregarTarefas() {
    const response = await fetchAuth('/tasks');
    const tasks = await response.json();
    const container = document.getElementById('listaTarefas');
    container.innerHTML = '';

    if (tasks.length === 0) {
        container.innerHTML = `<p style="color: #94a3b8">Nenhuma tarefa encontrada. Comece criando uma!</p>`;
        return;
    }

    tasks.forEach(task => {
        const isConcluida = task.status === 'CONCLUIDO';
        container.innerHTML += `
            <div class="task-item ${isConcluida ? 'done' : ''}">
                <span class="category-tag">${task.nomeCategoria || 'Geral'}</span>
                <h4>${task.titulo}</h4>
                <p>${task.descricao || 'Sem descrição'}</p>
                <div class="actions">
                    <button class="btn-complete" onclick="alternarStatus(${task.id})">
                        <i class="fa-solid ${isConcluida ? 'fa-rotate-left' : 'fa-check'}"></i> 
                        ${isConcluida ? 'Refazer' : 'Concluir'}
                    </button>
                    <button class="btn-delete" onclick="deletarTarefa(${task.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

document.getElementById('formTarefa').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        titulo: document.getElementById('taskTitulo').value,
        descricao: document.getElementById('taskDesc').value,
        categoryId: document.getElementById('taskCatId').value
    };

    const response = await fetchAuth('/tasks', 'POST', body);
    if (response.ok) {
        e.target.reset();
        carregarTarefas();
    }
});

async function deletarTarefa(id) {
    // Usando um confirm mais discreto do navegador
    if (confirm("Deseja realmente excluir esta tarefa?")) {
        const response = await fetchAuth(`/tasks/${id}`, 'DELETE');
        if (response.ok) carregarTarefas();
    }
}

async function alternarStatus(id) {
    const response = await fetchAuth(`/tasks/${id}/status`, 'PATCH');
    if (response.ok) carregarTarefas();
}

function logout() {
    localStorage.clear();
    window.location.href = "../Login/login.html";
}

// Inicialização
const role = localStorage.getItem('role');
document.getElementById('userRole').innerText = role ? `Perfil: ${role}` : 'Usuário';
carregarCategorias();
carregarTarefas();