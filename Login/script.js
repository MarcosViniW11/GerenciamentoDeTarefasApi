const URL_BASE = "http://localhost:8080/users";

const formLogin = document.getElementById('formLogin');
const btnEntrar = document.getElementById('btnEntrar');
const mensagemErro = document.getElementById('mensagemErro');
const btnToggle = document.getElementById('btnToggle');
const inputSenha = document.getElementById('senha');

// Alternar visibilidade da senha
btnToggle.addEventListener('click', () => {
    const isPassword = inputSenha.type === "password";
    inputSenha.type = isPassword ? "text" : "password";
    
    const icon = btnToggle.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Feedback visual de carregamento
        mensagemErro.classList.add('hidden');
        btnEntrar.disabled = true;
        btnEntrar.textContent = "Autenticando...";

        const dados = {
            email: document.getElementById('email').value,
            senha: inputSenha.value
        };

        try {
            const response = await fetch(`${URL_BASE}/Logar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                const data = await response.json();
                
                // Armazenamento seguro para as próximas requisições
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);

                window.location.href = "../Tarefa/tarefas.html";
            } else {
                exibirErro("E-mail ou senha inválidos.");
            }
        } catch (error) {
            console.error("Erro no login:", error);
            exibirErro("Não foi possível conectar ao servidor.");
        } finally {
            btnEntrar.disabled = false;
            btnEntrar.textContent = "Entrar na Conta";
        }
    });
}

function exibirErro(msg) {
    mensagemErro.textContent = msg;
    mensagemErro.classList.remove('hidden');
}