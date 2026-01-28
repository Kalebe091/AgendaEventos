# 📅 Sistema de Agendamento de Eventos (SPA)

Um sistema web leve e funcional para gerenciamento de solicitações de eventos e reservas de salas. Desenvolvido como uma Single Page Application (SPA) utilizando JavaScript puro (Vanilla JS), com foco em lógica de validação, experiência do usuário e **Produtividade via IA**.

## 🚀 Funcionalidades

### 👤 Área Pública
* **Dashboard Visual:** Visualização dos eventos confirmados em formato de cards interativos.
* **Filtros Dinâmicos:** Capacidade de filtrar eventos por data específica.
* **Solicitação Inteligente:** Formulário para usuários solicitarem reservas de salas.
* **Assistente de Redação (Simulado):** Funcionalidade que "escreve" a descrição do evento automaticamente baseada no título (Feature simulando IA Generativa).

### 🛡️ Lógica de Negócios (Core)
* **Verificação de Conflitos:** O sistema impede automaticamente que dois eventos sejam agendados para a mesma sala no mesmo horário.
* **Validação de Horários:** Garante consistência temporal (início vs. fim).

### 🔐 Área Administrativa
* **Autenticação:** Sistema de login simulado (com proteção de rotas via SessionStorage).
* **Gestão Total:** O administrador pode Aprovar, Rejeitar ou Excluir eventos.
* **Feedback Visual:** Badges de status coloridos para facilitar a leitura.

---

## 🛠️ Tecnologias Utilizadas

### Stack Principal
* **HTML5:** Estrutura semântica.
* **CSS3:** Design moderno com CSS Grid, Flexbox, Variáveis (Custom Properties) e Animações.
* **JavaScript (ES6+):** Manipulação do DOM, Async/Await e LocalStorage.

### 🤖 Ferramentas de Desenvolvimento & IA
Este projeto utilizou inteligência artificial para acelerar o ciclo de desenvolvimento:

* **Google Gemini:** Utilizado para:
    * Brainstorming de arquitetura e funcionalidades.
    * Refatoração e otimização de código (Clean Code).
    * Geração de documentação técnica.
    * Criação da paleta de cores e conceitos de UI/UX.
* **GitHub Copilot:** Utilizado para:
    * Autocomplete inteligente de código (boilerplate).
    * Sugestões de lógica para funções de validação.
    * Aceleração da escrita de HTML e CSS repetitivo.

---

## 📂 Estrutura do Projeto

```text
/agenda-eventos
│
├── index.html        # Estrutura principal e navegação
├── style.css         # Estilização completa (Tema Moderno)
├── app.js            # Lógica de controle, Mock de IA e persistência
└── README.md         # Documentação do projeto

```

---

## ⚙️ Como Executar

Este é um projeto estático (Client-side only), não requer instalação de servidores.

1. Clone este repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em qualquer navegador moderno.

### 🔑 Acesso ao Painel Administrativo

Para testar as funcionalidades de gerenciamento, utilize as credenciais simuladas:

* **E-mail:** `admin@escola.com`
* **Senha:** `123456`

---


Desenvolvido para fins de estudo sobre Lógica de Programação, Front-end Moderno e **AI-Powered Coding**.

```

```