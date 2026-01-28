// --- CONFIGURAÇÃO DE SEGURANÇA ---
const ADMIN_USER = "admin@escola.com";
const ADMIN_PASS = "123456"; // Em produção, isso viria do backend criptografado!

// --- 1. GERENCIAMENTO DE DADOS (Simulando Banco de Dados) ---

// Chave para salvar no navegador
const CHAVE_DB = 'sistema_agendamento_db';

// Função para ler eventos salvos
function lerEventos() {
    const dados = localStorage.getItem(CHAVE_DB);
    // Se tiver dados, converte de volta para Array. Se não, retorna array vazio.
    return dados ? JSON.parse(dados) : [];
}

// Função para salvar a lista atualizada
function salvarNoBanco(listaEventos) {
    localStorage.setItem(CHAVE_DB, JSON.stringify(listaEventos));
}

// --- 2. LÓGICA DE VALIDAÇÃO (Regras de Negócio) ---

function verificarConflito(novoEvento, eventosExistentes) {
    // Filtra apenas eventos APROVADOS ou PENDENTES (rejeitados não ocupam sala)
    const eventosAtivos = eventosExistentes.filter(e => e.status !== 'rejeitado');

    for (let evento of eventosAtivos) {
        // Regra 1: Mesma data e Mesmo local
        if (evento.data === novoEvento.data && evento.local === novoEvento.local) {
            
            // Regra 2: Colisão de Horário
            // (Novo Inicio < Evento Fim) E (Novo Fim > Evento Inicio)
            // Essa fórmula matemática cobre todos os casos de sobreposição
            if (novoEvento.inicio < evento.fim && novoEvento.fim > evento.inicio) {
                return true; // Conflito encontrado!
            }
        }
    }
    return false; // Sem conflitos
}

// --- 3. LÓGICA DO FORMULÁRIO ---

const formSolicitacao = document.getElementById('form-solicitacao');

formSolicitacao.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede a página de recarregar

    // 1. Capturar valores
    const novoEvento = {
        id: Date.now(), // Gera um ID único baseado no tempo
        titulo: document.getElementById('titulo').value,
        data: document.getElementById('data').value,
        inicio: document.getElementById('horaInicio').value,
        fim: document.getElementById('horaFim').value,
        local: document.getElementById('local').value,
        solicitante: document.getElementById('solicitante').value,
        status: 'pendente' // Todo evento nasce pendente
    };

    // 2. Validação Básica: Hora fim deve ser maior que hora inicio
    if (novoEvento.inicio >= novoEvento.fim) {
        alert("Erro: O horário de fim deve ser posterior ao horário de início.");
        return;
    }

    // 3. Validação de Conflito
    const eventos = lerEventos();
    
    if (verificarConflito(novoEvento, eventos)) {
        alert("❌ Erro: Já existe um evento agendado para este local e horário!");
        return;
    }

    // 4. Salvar
    eventos.push(novoEvento);
    salvarNoBanco(eventos);

    // 5. Feedback e Limpeza
    alert("✅ Solicitação enviada com sucesso! Aguarde aprovação do administrador.");
    formSolicitacao.reset();
    
    // Opcional: Voltar para a tela inicial
    // mostrarTela('dashboard'); 
});

// --- 4. NAVEGAÇÃO (Mantida da etapa anterior) ---
function mostrarTela(telaId) {
    // REGRA DE SEGURANÇA: Se tentar entrar no admin sem estar logado
    if (telaId === 'admin') {
        const isLogado = sessionStorage.getItem('usuarioLogado');
        if (!isLogado) {
            mostrarTela('login'); // Redireciona para o login
            return; // Para a execução aqui
        }
    }

    // Lógica padrão de troca de telas
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
        tela.classList.add('oculta');
    });
    
    const telaAtiva = document.getElementById(telaId);
    if(telaAtiva) {
        telaAtiva.classList.remove('oculta');
        telaAtiva.classList.add('ativa');
    }

    // Carregamento de dados
    if (telaId === 'admin') renderizarAdmin();
    if (telaId === 'dashboard') renderizarDashboard();
}

// --- FUNÇÕES DE LOGIN/LOGOUT ---

// Escuta o submit do formulário de login
document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    if (email === ADMIN_USER && senha === ADMIN_PASS) {
        // Sucesso: Salva na sessão
        sessionStorage.setItem('usuarioLogado', 'true');
        alert("🔓 Login realizado com sucesso!");
        
        // Limpa os campos
        document.getElementById('form-login').reset();
        
        // Redireciona para o admin
        mostrarTela('admin');
    } else {
        alert("⛔ E-mail ou senha incorretos!");
    }
});

// Função para sair
window.fazerLogout = function() {
    sessionStorage.removeItem('usuarioLogado'); // Destrói a sessão
    alert("👋 Você saiu do sistema.");
    mostrarTela('dashboard'); // Manda de volta para o início
}

// --- 5. FUNÇÕES AUXILIARES DE FORMATAÇÃO ---
function formatarData(dataISO) {
    // Transforma "2023-12-25" em "25/12/2023"
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

// --- 6. LÓGICA DO PAINEL ADMIN (Renderização) ---

function renderizarAdmin() {
    const container = document.getElementById('lista-eventos-admin');
    const eventos = lerEventos();
    
    container.innerHTML = ''; // Limpa a lista antes de recriar

    if (eventos.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--secondary); padding: 2rem;">📭 Nenhum evento registrado.</div>';
        return;
    }

    // Ordena: Pendentes primeiro, depois por data
    eventos.sort((a, b) => {
        if (a.status !== b.status) return a.status === 'pendente' ? -1 : 1;
        return new Date(a.data + 'T' + a.inicio) - new Date(b.data + 'T' + b.inicio);
    });

    eventos.forEach(evento => {
        // Define classe visual para o status
        let classeStatus = '';
        let iconeStatus = '';
        if(evento.status === 'pendente') {
            classeStatus = 'status-pendente';
            iconeStatus = '⏳';
        }
        else if(evento.status === 'aprovado') {
            classeStatus = 'status-aprovado';
            iconeStatus = '✅';
        }
        else {
            classeStatus = 'status-rejeitado';
            iconeStatus = '❌';
        }

        // Botões de ação dependem do status
        let botoesAcao = '';
        if (evento.status === 'pendente') {
            botoesAcao = `
                <button class="btn-admin-acao btn-aprovar" onclick="alterarStatus(${evento.id}, 'aprovado')" title="Aprovar">
                    ✔ Aprovar
                </button>
                <button class="btn-admin-acao btn-rejeitar" onclick="alterarStatus(${evento.id}, 'rejeitado')" title="Rejeitar">
                    ✖ Rejeitar
                </button>
            `;
        }
        // Botão de excluir sempre aparece
        botoesAcao += `<button class="btn-admin-acao btn-excluir" onclick="excluirEvento(${evento.id})" title="Excluir Definitivamente">🗑 Deletar</button>`;

        const card = document.createElement('div');
        card.className = 'card-admin';
        card.innerHTML = `
            <div class="card-admin-header">
                <div class="card-admin-status-badge">
                    <span class="${classeStatus}">${iconeStatus} ${evento.status.toUpperCase()}</span>
                </div>
                <div class="card-admin-title">
                    <h3>${evento.titulo}</h3>
                </div>
            </div>

            <div class="card-admin-body">
                <div class="info-row">
                    <div class="info-item">
                        <label>📅 Data</label>
                        <p>${formatarData(evento.data)}</p>
                    </div>
                    <div class="info-item">
                        <label>⏰ Horário</label>
                        <p>${evento.inicio} - ${evento.fim}</p>
                    </div>
                </div>

                <div class="info-row">
                    <div class="info-item">
                        <label>📍 Local</label>
                        <p>${traduzirLocal(evento.local)}</p>
                    </div>
                    <div class="info-item">
                        <label>👤 Solicitante</label>
                        <p>${evento.solicitante}</p>
                    </div>
                </div>
            </div>

            <div class="card-admin-footer">
                ${botoesAcao}
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 7. AÇÕES DO ADMINISTRADOR (Aprovar/Excluir) ---

// Precisamos anexar ao objeto window para o HTML poder "enxergar" essas funções dentro do onclick
window.alterarStatus = function(id, novoStatus) {
    let eventos = lerEventos();
    const index = eventos.findIndex(e => e.id === id);
    
    if (index !== -1) {
        // Se for aprovar, fazemos uma dupla checagem de conflito (segurança)
        if (novoStatus === 'aprovado') {
            const eventoAlvo = eventos[index];
            // Remove ele mesmo da lista para comparar com os outros
            const outrosEventos = eventos.filter(e => e.id !== id);
            
            if (verificarConflito(eventoAlvo, outrosEventos)) {
                alert("⚠️ Ação bloqueada: Ao aprovar este evento, ele entrará em conflito com outro já aprovado!");
                return;
            }
        }

        eventos[index].status = novoStatus;
        salvarNoBanco(eventos);
        renderizarAdmin(); // Atualiza a tela instantaneamente
    }
};

window.excluirEvento = function(id) {
    if(confirm('Tem certeza que deseja excluir este evento permanentemente?')) {
        let eventos = lerEventos();
        // Filtra mantendo apenas os que NÃO são o ID clicado
        eventos = eventos.filter(e => e.id !== id);
        salvarNoBanco(eventos);
        renderizarAdmin();
    }
};

// --- 8. VISUALIZAÇÃO PÚBLICA (Dashboard) ---

function renderizarDashboard() {
    const container = document.getElementById('lista-eventos-publica');
    const filtroData = document.getElementById('filtroData').value;
    let eventos = lerEventos();

    // FILTRO 1: Segurança - Apenas Aprovados
    eventos = eventos.filter(e => e.status === 'aprovado');

    // FILTRO 2: Data (se o usuário selecionou alguma)
    if (filtroData) {
        eventos = eventos.filter(e => e.data === filtroData);
    }

    // Ordenar por data e hora
    eventos.sort((a, b) => {
        if (a.data !== b.data) return a.data.localeCompare(b.data);
        return a.inicio.localeCompare(b.inicio);
    });

    container.innerHTML = ''; // Limpa a tela

    if (eventos.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: gray;">Nenhum evento confirmado para este período.</p>';
        return;
    }

    // Gera os Cards
    // Substitua a parte que cria o card por isso:
    eventos.forEach(evento => {
        const card = document.createElement('div');
        card.className = 'card-evento'; // O CSS já cuida do resto!

        card.innerHTML = `
            <h3>${evento.titulo}</h3>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1rem;">
                📅 ${formatarData(evento.data)} <br>
                ⏰ ${evento.inicio} às ${evento.fim}
            </p>
            <div style="background: #f1f5f9; padding: 0.8rem; border-radius: 8px; font-size: 0.9rem; font-weight: 500;">
                📍 ${traduzirLocal(evento.local)}
            </div>
            <p style="margin-top: 15px; font-size: 0.8rem; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                👤 Solicitado por: <strong>${evento.solicitante}</strong>
            </p>
        `;

        container.appendChild(card);
    });
}

// Helper para mostrar nome bonito do local
function traduzirLocal(codigo) {
    const locais = {
        'auditorio': 'Auditório Principal',
        'sala1': 'Laboratório de Informática',
        'sala2': 'Sala de Reuniões'
    };
    return locais[codigo] || codigo;
}

// Função chamada pelo botão "Filtrar" no HTML
window.filtrarEventos = function() {
    renderizarDashboard();
}