# ⬡ Rede Solidária — Frontend

> Sistema de gerenciamento de doações para situações de crise. Desenvolvido como projeto final de curso.

---

## 🔗 Links

| Ambiente | URL |
|---|---|
| 🌐 Frontend (deploy) | **[Rede Solidaria](https://rede-solidaria-three.vercel.app/)** |
| ⚙️ Backend / API (deploy) | **[Api Rede Solidaria](https://api-rede-solidaria.onrender.com/)** |
| 🖥️ Repositório da API | **[Repositório API](https://github.com/Nataly-Costaa/api_rede_solidaria)** |

---

## 📋 Sobre o projeto

A **Rede Solidária** é uma plataforma fullstack de controle de doações desenvolvida para ajudar na organização de campanhas solidárias em situações de crise (como enchentes). O sistema conecta pontos de coleta, coordenadores, voluntários e doadores em um fluxo claro e transparente.

**Como funciona na prática:**

1. O **admin** cadastra os pontos de coleta e os usuários do sistema
2. O **coordenador** define quais itens e quantidades seu ponto precisa
3. O **doador** acessa a página pública, escolhe o ponto com mais necessidade e leva a doação presencialmente
4. O **voluntário** ou **coordenador** registra a doação no sistema no momento da entrega

---

## 🖥️ Telas do sistema

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Vitrine dos pontos de coleta com status de necessidade em tempo real |
| `/login` | Público | Autenticação de usuários internos |
| `/admin/usuarios` | Admin | Cadastro e gestão de usuários |
| `/admin/pontos` | Admin | Cadastro de pontos de coleta |
| `/admin/doacoes` | Admin | Visão geral de todas as doações |
| `/coordenador/necessidades` | Coordenador | Gestão de itens necessários no seu ponto |
| `/coordenador/doacoes` | Coordenador | Registro de doações recebidas |
| `/voluntario/doacoes` | Voluntário | Registro de doações recebidas |

---

## 🧪 Credenciais de teste

Use as credenciais abaixo para explorar o sistema completo:

### 🔴 Admin
```
email: admin@teste.com
senha: 123456
```
Acesso total: gerencia usuários, pontos de coleta e visualiza todas as doações.

---

### 🟢 Coordenador
```
email: coordenador@teste.com
senha: 123456
```
Gerencia as necessidades do seu ponto e registra doações recebidas.

---

### 🔵 Voluntário
```
email: voluntario@teste.com
senha: 123456
```
Registra doações recebidas em qualquer ponto de coleta.

> **Observação:** As contas acima precisam ser criadas pelo admin antes de usar. O admin padrão (`admin@teste.com`) já está inserido diretamente no banco via seed.

---

## 🛠️ Tecnologias utilizadas

### Frontend
- **[React 18](https://react.dev/)** — biblioteca de interface
- **[Vite](https://vitejs.dev/)** — bundler e servidor de desenvolvimento
- **[React Router DOM v6](https://reactrouter.com/)** — roteamento client-side
- **[Axios](https://axios-http.com/)** — cliente HTTP para consumo da API

### Estilização
- CSS puro com variáveis customizadas (design system próprio)
- Fontes: **[Syne](https://fonts.google.com/specimen/Syne)** (títulos) + **[DM Sans](https://fonts.google.com/specimen/DM+Sans)** (corpo)
- Layout responsivo com CSS Grid e Flexbox

### Backend (repositório separado)
- **Node.js** + **Express**
- **PostgreSQL** com queries SQL nativas (pg)
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Zod** para validação de dados

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Backend da Rede Solidária rodando (veja repositório da API)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/rede-solidaria-frontend.git
cd rede-solidaria-frontend

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env
```

### Variáveis de ambiente

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

> Ajuste a URL caso o backend esteja em outra porta ou em produção.

### Rodando

```bash
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

---

## 📁 Estrutura de pastas

```
src/
├── components/         # Componentes reutilizáveis
│   ├── Layout.jsx      # Navbar + estrutura de página
│   ├── DoacaoCard.jsx  # Card de item com progresso
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx # Contexto de autenticação (JWT)
├── pages/
│   ├── PublicPage.jsx  # Página pública para doadores
│   ├── LoginPage.jsx
│   ├── admin/          # Telas do administrador
│   └── coordenador/    # Telas do coordenador e voluntário
├── services/
│   └── api.js          # Configuração do Axios + chamadas à API
├── App.jsx             # Rotas da aplicação
└── main.jsx
```

---

## 🔐 Fluxo de autenticação

1. O login retorna um **JWT** que é armazenado no `localStorage`
2. O Axios injeta o token automaticamente via interceptor em todas as requisições
3. Se o token expirar (401), o usuário é redirecionado para `/login` automaticamente
4. Cada rota verifica o `tipo` do usuário (admin / coordenador / voluntário) via `ProtectedRoute`

---

## 📊 Status das necessidades

O sistema classifica cada item com base no percentual atendido:

| Status | Critério |
|---|---|
| ⚡ **Urgente** | Menos de 40% do necessário recebido |
| ◑ **Moderado** | Entre 40% e 80% |
| ✓ **Suficiente** | Acima de 80% |

---

## 👩‍💻 Autora

Desenvolvido por **Nataly Costa** como projeto final do curso de desenvolvimento backend.
