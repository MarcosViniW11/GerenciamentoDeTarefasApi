const URL_BASE = "http://localhost:8080/users";

const formCadastro = document.getElementById('formCadastro');
const btnSubmit = document.getElementById('btnSubmit');
const mensagemErro = document.getElementById('mensagemErro');
const toggleSenha = document.getElementById('toggleSenha');
const inputSenha = document.getElementById('senha');

// 1. Lógica para ver/esconder senha
toggleSenha.addEventListener('click', () => {
    const isPassword = inputSenha.type === "password";
    inputSenha.type = isPassword ? "text" : "password";
    
    // Troca o ícone
    const icon = toggleSenha.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// 2. Lógica de submissão
if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpar mensagens e ativar loading
        mensagemErro.classList.add('hidden');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = "Processando...";

        const dados = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            senha: inputSenha.value
        };

        try {
            const response = await fetch(`${URL_BASE}/Cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert("Conta criada com sucesso!");
                window.location.href = "../Login/login.html";
            } else {
                // Tenta extrair a mensagem do seu ErrorResponseDTO do backend
                const erroData = await response.json();
                exibirErro(erroData.message || "Erro ao realizar cadastro.");
            }
        } catch (error) {
            console.error("Erro:", error);
            exibirErro("Não foi possível conectar ao servidor.");
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = "Cadastrar";
        }
    });
}

function exibirErro(msg) {
    mensagemErro.textContent = msg;
    mensagemErro.classList.remove('hidden');
}