# 🛡️ Fluxos de Segurança - GoCasa360IT

**GDPR Compliance e Recuperação de Senha**

---

## 1. Fluxo de GDPR Consent

### 🎯 Objetivo
Coletar e gerenciar consentimento GDPR conforme regulamentação europeia.

### 📊 Diagrama

```mermaid
graph TD
    A[Registro Usuário] --> B[Formulário]
    B --> C[Checkboxes GDPR]
    C --> D[Necessário: checked obrigatório]
    C --> E[Marketing: opcional]
    C --> F[Analytics: opcional]
    C --> G[Third-party: opcional]
    
    G --> H{Aceitar Necessário?}
    H -->|Não| I[Bloquear Submit]
    I --> J[Erro: Consentimento obrigatório]
    
    H -->|Sim| K[POST /api/auth/register]
    K --> L[Salvar Usuário]
    L --> M[POST /api/gdpr/consent]
    M --> N[INSERT gdpr_consents]
    N --> O[Gravar IP, timestamp, purposes]
    O --> P[INSERT gdpr_consent_history]
    
    P --> Q[Email Confirmação]
    Q --> R[Link: Gerenciar Preferências]
    R --> S[/settings/privacy]
    S --> T[Toggle Preferências]
    T --> U[PUT /api/gdpr/consent]
    U --> P
```

### ✅ Purposes GDPR

| Purpose | Descrição | Obrigatório |
|---------|-----------|-------------|
| **Necessary** | Funcionamento básico | ✅ Sim |
| **Marketing** | Emails promocionais | ❌ Não |
| **Analytics** | Análise de uso (anônimo) | ❌ Não |
| **Third-party** | Compartilhamento com parceiros | ❌ Não |

---

## 2. Fluxo de Recuperação de Senha

### 🎯 Objetivo
Permitir reset seguro de senha via email com token temporário.

### 📊 Diagrama

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Frontend as Frontend
    participant API as API
    participant Email as SendGrid
    participant DB as Database
    
    User->>Frontend: Clicar "Esqueci senha"
    Frontend->>Frontend: Modal: Digite email
    User->>Frontend: Inserir email
    Frontend->>API: POST /api/auth/forgot-password
    
    API->>DB: SELECT WHERE email = ?
    
    alt Usuário não existe
        DB-->>API: Not found
        API-->>Frontend: Email enviado (segurança)
    else Usuário existe
        DB-->>API: User found
        API->>API: Gerar token UUID
        API->>DB: INSERT password_reset_tokens
        Note over API,DB: Expira em 1 hora
        API->>Email: Enviar email com link
        Email->>User: Email: Reset senha
        API-->>Frontend: Email enviado
    end
    
    User->>Frontend: Clicar link email
    Frontend->>API: GET /api/auth/verify-token?token=...
    
    alt Token inválido/expirado
        API-->>Frontend: 400 Invalid
        Frontend->>User: Link expirado
    else Token válido
        API-->>Frontend: 200 OK
        Frontend->>User: Form: Nova senha
        User->>Frontend: Inserir senha
        Frontend->>API: POST /api/auth/reset-password
        API->>API: Hash senha (bcrypt)
        API->>DB: UPDATE users
        API->>DB: DELETE token
        API-->>Frontend: Senha atualizada
        Frontend->>User: Sucesso! Faça login
    end
```

### 🔐 Segurança

- ✅ Token único (UUID)
- ✅ Expira em 1 hora
- ✅ Uso único (deletado após reset)
- ✅ Resposta genérica (evitar enumeration)
- ✅ Rate limiting (5 tentativas/hora)

---

**Última atualização**: 28/12/2025  
**Versão**: 1.0
