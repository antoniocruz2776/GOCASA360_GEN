# 📋 Definition of Ready (DoR) - Análise de Diagramas Faltantes

**Análise Completa dos Fluxos que Precisam ser Documentados**

---

## 📊 Status Atual da Documentação

### ✅ Diagramas Existentes (4 totais)

| Arquivo | Diagramas | Tipo |
|---------|-----------|------|
| **ARQUITETURA_MICROSERVICOS.md** | 2 | Arquitetura geral + Sequence diagram |
| **CI_CD_PIPELINE.md** | 1 | Fluxo CI/CD |
| **STACK_TECNOLOGICO.md** | 1 | Migração gradual |
| **Total** | **4 diagramas** | Mermaid |

### ❌ Diagramas Faltantes (18 identificados)

---

## 🚨 CRÍTICOS - Definition of Ready (DoR)

### 1. **Fluxos de Usuário (User Flows)** - 8 diagramas

#### 1.1 Fluxo de Registro/Cadastro (Inquilino)
```mermaid
graph TD
    A[Página Inicial] --> B[Clicar em Cadastrar]
    B --> C{Escolher Tipo}
    C -->|Inquilino| D[Formulário Registro]
    C -->|Proprietário| E[Formulário Proprietário]
    C -->|Corretor| F[Formulário Corretor]
    
    D --> G[Preencher Dados]
    G --> H[Nome Completo]
    G --> I[Email]
    G --> J[Telefone]
    G --> K[Codice Fiscale]
    G --> L[Senha]
    
    L --> M[Aceitar GDPR]
    M --> N{Validar Dados}
    N -->|Erro| O[Exibir Erros]
    O --> G
    N -->|Sucesso| P[POST /api/auth/register]
    
    P --> Q{Resposta API}
    Q -->|Erro| R[Exibir Mensagem Erro]
    R --> G
    Q -->|Sucesso| S[Salvar Token]
    S --> T[Enviar Email Verificação]
    T --> U[Redirecionar /imoveis]
    
    U --> V[Página Busca Imóveis]
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **CRÍTICA**  
**Motivo**: Fluxo core do produto, essencial para DoR

---

#### 1.2 Fluxo de Login
```mermaid
graph TD
    A[Página Inicial] --> B[Clicar em Entrar]
    B --> C[Formulário Login]
    C --> D[Email]
    C --> E[Senha]
    
    E --> F{Validar Campos}
    F -->|Vazio| G[Erro: Campos obrigatórios]
    F -->|OK| H[POST /api/auth/login]
    
    H --> I{Resposta API}
    I -->|401| J[Email/senha incorretos]
    I -->|200| K[Salvar Token]
    
    K --> L{Tipo Usuário}
    L -->|Admin| M[Redirecionar /admin]
    L -->|Proprietário| N[Redirecionar /dashboard]
    L -->|Inquilino| O[Redirecionar /imoveis]
    L -->|Corretor| P[Redirecionar /meus-imoveis]
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **CRÍTICA**

---

#### 1.3 Fluxo de Busca de Imóveis
```mermaid
graph TD
    A[Página Inicial] --> B[Barra de Busca]
    B --> C[Digite Localização]
    
    C --> D{Google Places Autocomplete}
    D --> E[Sugestões de Endereços]
    E --> F[Selecionar Endereço]
    
    F --> G[Aplicar Filtros]
    G --> H[Tipo: Apartamento/Casa]
    G --> I[Finalidade: Aluguel/Venda]
    G --> J[Preço: Min/Max]
    G --> K[Quartos: 1,2,3,4+]
    G --> L[Área m²: Range]
    
    L --> M[GET /api/imoveis?filters]
    M --> N{Resultados}
    
    N -->|Vazio| O[Nenhum imóvel encontrado]
    N -->|Lista| P[Grid 3 Colunas]
    
    P --> Q[Card Imóvel]
    Q --> R[Foto Capa]
    Q --> S[Título]
    Q --> T[Preço]
    Q --> U[Localização]
    Q --> V[Características]
    
    V --> W[Clicar no Card]
    W --> X[/imoveis/:id]
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **CRÍTICA**

---

#### 1.4 Fluxo de Cadastro de Imóvel (Wizard 5 Etapas)
```mermaid
graph TD
    A[Dashboard Proprietário] --> B[Botão: Anunciar Imóvel]
    B --> C[Wizard Etapa 1/5]
    
    C --> D[Tipo de Imóvel]
    D --> E[Apartamento/Casa/Kitnet/etc]
    E --> F[Endereço Completo]
    F --> G[Google Places Autocomplete]
    G --> H[Validar CEP/Lat/Lng]
    H --> I[Botão: Próximo]
    
    I --> J[Wizard Etapa 2/5]
    J --> K[Características]
    K --> L[Quartos: Select 0-5+]
    K --> M[Banheiros: Select 0-5+]
    K --> N[Garagem: Select 0-5+]
    K --> O[Área Útil m²]
    K --> P[Área Total m²]
    K --> Q[Mobiliado? Sim/Não]
    K --> R[Aceita Pet? Sim/Não]
    Q --> S[Botão: Próximo]
    
    S --> T[Wizard Etapa 3/5]
    T --> U[Upload de Fotos]
    U --> V[Drag & Drop Zone]
    V --> W[Múltiplos Arquivos]
    W --> X[Preview Thumbnails]
    X --> Y[Upload para R2]
    Y --> Z[Progresso Upload]
    Z --> AA[Selecionar Foto Capa]
    AA --> AB[Botão: Próximo]
    
    AB --> AC[Wizard Etapa 4/5]
    AC --> AD[Certificações Itália]
    AD --> AE[APE - Classe Energética]
    AE --> AF[Opcional: Upload Certificado]
    AF --> AG[Spese Condominiali]
    AG --> AH[Botão: Próximo]
    
    AH --> AI[Wizard Etapa 5/5]
    AI --> AJ[Valores]
    AJ --> AK{Finalidade}
    AK -->|Aluguel| AL[Preço Aluguel/mês]
    AK -->|Venda| AM[Preço Venda]
    AK -->|Ambos| AN[Ambos Preços]
    
    AN --> AO[Descrição Detalhada]
    AO --> AP[Preview Final]
    AP --> AQ{Ação}
    AQ -->|Salvar Rascunho| AR[POST /api/imoveis draft=true]
    AQ -->|Publicar| AS[POST /api/imoveis]
    
    AS --> AT{Resposta}
    AT -->|Erro| AU[Exibir Erros]
    AT -->|Sucesso| AV[Redirecionar Dashboard]
    AV --> AW[Imóvel Publicado!]
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **CRÍTICA** (SEM ISSO, NÃO HÁ PLATAFORMA)

---

#### 1.5 Fluxo de Agendamento de Visita
```mermaid
graph TD
    A[Detalhes Imóvel] --> B[Botão: Prenota Visita]
    B --> C{Usuário Autenticado?}
    C -->|Não| D[Redirecionar /login]
    D --> E[Login]
    E --> B
    
    C -->|Sim| F[Modal Agendamento]
    F --> G[Calendário Interativo]
    G --> H[Selecionar Data]
    H --> I[Horários Disponíveis]
    I --> J[Selecionar Horário]
    
    J --> K[Formulário]
    K --> L[Nome: Preenchido]
    K --> M[Email: Preenchido]
    K --> N[Telefone]
    K --> O[Mensagem Opcional]
    
    O --> P[Botão: Confirmar]
    P --> Q[POST /api/visitas]
    
    Q --> R{Resposta}
    R -->|Conflito| S[Horário já reservado]
    S --> I
    R -->|Sucesso| T[Visita Agendada!]
    
    T --> U[Enviar Email Inquilino]
    T --> V[Enviar Email Proprietário]
    T --> W[Criar Lembrete 24h]
    T --> X[Criar Lembrete 1h]
    
    X --> Y[Fechar Modal]
    Y --> Z[Exibir Confirmação]
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **ALTA**

---

#### 1.6 Fluxo de Chat/Mensagens
```mermaid
graph TD
    A[Detalhes Imóvel] --> B[Botão: Contatta Proprietario]
    B --> C{Autenticado?}
    C -->|Não| D[Redirecionar /login]
    C -->|Sim| E[POST /api/conversations]
    
    E --> F{Conversa Existe?}
    F -->|Sim| G[Abrir Conversa Existente]
    F -->|Não| H[Criar Nova Conversa]
    
    H --> I[Redirecionar /mensagens/:id]
    
    I --> J[Interface Chat]
    J --> K[Lista Conversas Sidebar]
    J --> L[Área Mensagens Centro]
    J --> M[Input Mensagem]
    
    M --> N[Digite Mensagem]
    N --> O[Botão Enviar]
    O --> P[POST /api/conversations/:id/messages]
    
    P --> Q[Salvar Firestore]
    Q --> R[WebSocket Update]
    R --> S[Atualizar UI Remetente]
    R --> T[Push Notification Destinatário]
    
    T --> U{Destinatário Online?}
    U -->|Sim| V[Atualizar UI Tempo Real]
    U -->|Não| W[Incrementar Unread Count]
    
    V --> X[Indicador: Digitando...]
    X --> Y[Mensagem Enviada]
    Y --> Z[Timestamp]
    Z --> AA[Status: Lida/Não Lida]
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **ALTA**

---

#### 1.7 Fluxo de Favoritos
```mermaid
graph TD
    A[Listagem/Detalhes Imóvel] --> B[Ícone Coração]
    B --> C{Autenticado?}
    C -->|Não| D[Redirecionar /login]
    
    C -->|Sim| E{Já Favoritado?}
    E -->|Não| F[POST /api/imoveis/:id/favorite]
    F --> G[Adicionar BD]
    G --> H[Atualizar UI: Coração Cheio]
    H --> I[Toast: Adicionado aos favoritos]
    
    E -->|Sim| J[DELETE /api/imoveis/:id/favorite]
    J --> K[Remover BD]
    K --> L[Atualizar UI: Coração Vazio]
    L --> M[Toast: Removido dos favoritos]
    
    I --> N[Incrementar Contador]
    M --> O[Decrementar Contador]
    
    N --> P[Atualizar Dashboard Proprietário]
    O --> P
    
    P --> Q[Ver Favoritos]
    Q --> R[GET /api/favoritos]
    R --> S[Listar Imóveis Favoritados]
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🟡 **MÉDIA**

---

#### 1.8 Fluxo de Dashboard Proprietário
```mermaid
graph TD
    A[Login Proprietário] --> B[Redirecionar /dashboard]
    B --> C[GET /api/imoveis?proprietario_id]
    
    C --> D[Dashboard Layout]
    D --> E[Cards Métricas]
    E --> F[Total Imóveis]
    E --> G[Visualizações 30d]
    E --> H[Favoritos]
    E --> I[Visitas Agendadas]
    E --> J[Mensagens Não Lidas]
    
    J --> K[Lista de Imóveis]
    K --> L[Tabela/Cards]
    L --> M[Foto Capa]
    L --> N[Título]
    L --> O[Status: Ativo/Pausado]
    L --> P[Visualizações]
    L --> Q[Favoritos]
    L --> R[Ações]
    
    R --> S[Botão: Ver]
    R --> T[Botão: Editar]
    R --> U[Botão: Pausar/Reativar]
    R --> V[Botão: Excluir]
    
    S --> W[/imoveis/:id]
    T --> X[Wizard Edição]
    U --> Y[PUT /api/imoveis/:id status]
    V --> Z{Confirmar Exclusão?}
    Z -->|Sim| AA[DELETE /api/imoveis/:id]
    Z -->|Não| K
    
    AA --> AB[Atualizar Lista]
    Y --> AB
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **ALTA**

---

## 🔄 Fluxos de Sistema (Backend) - 5 diagramas

### 2. **Fluxos de Integração**

#### 2.1 Fluxo de Upload de Fotos (Cloudflare R2)
```mermaid
sequenceDiagram
    participant User as Usuário
    participant Frontend as Frontend
    participant API as Hono API
    participant R2 as Cloudflare R2
    participant DB as D1 Database
    
    User->>Frontend: Selecionar fotos (drag-and-drop)
    Frontend->>Frontend: Validar (tipo, tamanho)
    Frontend->>API: POST /api/upload/presigned-url
    API->>R2: Gerar Presigned URL
    R2-->>API: URL assinada (expira 1h)
    API-->>Frontend: Presigned URL
    
    Frontend->>R2: PUT diretamente (bypass API)
    R2-->>Frontend: Upload concluído
    
    Frontend->>API: POST /api/imoveis/:id/photos
    Note over Frontend,API: {url, filename, size}
    API->>DB: INSERT INTO fotos
    DB-->>API: Success
    API-->>Frontend: Foto cadastrada
    
    Frontend->>Frontend: Exibir thumbnail
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **CRÍTICA**

---

#### 2.2 Fluxo de Integração Google Maps
```mermaid
sequenceDiagram
    participant User as Usuário
    participant Frontend as Frontend
    participant API as Hono API
    participant GMaps as Google Maps API
    participant DB as D1 Database
    
    User->>Frontend: Digite endereço
    Frontend->>GMaps: Places Autocomplete API
    GMaps-->>Frontend: Lista de sugestões
    
    User->>Frontend: Selecionar endereço
    Frontend->>GMaps: Geocoding API
    GMaps-->>Frontend: {lat, lng, formatted_address}
    
    Frontend->>API: POST /api/imoveis
    Note over Frontend,API: {endereco, lat, lng}
    API->>DB: INSERT com geolocalização
    DB-->>API: Success
    
    API-->>Frontend: Imóvel criado
    Frontend->>GMaps: Maps JavaScript API
    GMaps-->>Frontend: Exibir mapa com pin
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **CRÍTICA**

---

#### 2.3 Fluxo de Envio de Emails (SendGrid)
```mermaid
sequenceDiagram
    participant System as Sistema
    participant API as Notification Service
    participant SendGrid as SendGrid API
    participant User as Usuário
    
    Note over System: Evento: booking.created
    System->>API: Trigger notificação
    
    API->>API: Buscar template email
    API->>API: Preencher dados dinâmicos
    
    API->>SendGrid: POST /v3/mail/send
    Note over API,SendGrid: {to, from, subject, html}
    
    SendGrid->>SendGrid: Processar fila
    SendGrid->>User: Entregar email
    
    SendGrid-->>API: Webhook: delivered
    API->>API: Log: email_sent
    
    alt Email falhou
        SendGrid-->>API: Webhook: bounced/failed
        API->>API: Log: email_failed
        API->>System: Retry policy (3x)
    end
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **ALTA**

---

#### 2.4 Fluxo de Autenticação Social (Google OAuth)
```mermaid
sequenceDiagram
    participant User as Usuário
    participant Frontend as Frontend
    participant API as Hono API
    participant Google as Google OAuth
    participant DB as D1 Database
    
    User->>Frontend: Clicar "Login com Google"
    Frontend->>Google: Redirecionar OAuth
    Google->>User: Solicitar permissões
    User->>Google: Autorizar
    
    Google-->>Frontend: Callback com code
    Frontend->>API: POST /api/auth/google/callback
    Note over Frontend,API: {code}
    
    API->>Google: Trocar code por access_token
    Google-->>API: {access_token, id_token}
    
    API->>Google: GET user info
    Google-->>API: {email, name, picture}
    
    API->>DB: Buscar usuário por email
    alt Usuário existe
        DB-->>API: User encontrado
    else Novo usuário
        API->>DB: INSERT novo usuário
        DB-->>API: User criado
    end
    
    API->>API: Gerar JWT token
    API-->>Frontend: {token, user}
    Frontend->>Frontend: Salvar token
    Frontend->>Frontend: Redirecionar dashboard
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🟡 **MÉDIA**

---

#### 2.5 Fluxo de Chat Real-time (Firebase Firestore)
```mermaid
sequenceDiagram
    participant UserA as Usuário A
    participant FrontendA as Frontend A
    participant Firestore as Firebase Firestore
    participant FrontendB as Frontend B
    participant UserB as Usuário B
    
    UserA->>FrontendA: Digite mensagem
    FrontendA->>Firestore: ADD /conversations/{id}/messages
    Note over FrontendA,Firestore: {sender, content, timestamp}
    
    Firestore->>Firestore: Trigger onChange
    Firestore-->>FrontendA: onSnapshot (tempo real)
    FrontendA->>FrontendA: Atualizar UI
    
    Firestore-->>FrontendB: onSnapshot (WebSocket)
    FrontendB->>FrontendB: Atualizar UI
    FrontendB->>FrontendB: Mostrar notificação
    FrontendB->>UserB: Som de notificação
    
    alt Usuário B offline
        Firestore->>FCM: Push notification
        FCM->>UserB: Mobile push
    end
    
    UserB->>FrontendB: Visualizar mensagem
    FrontendB->>Firestore: UPDATE message.is_read = true
    Firestore-->>FrontendA: onSnapshot
    FrontendA->>FrontendA: Exibir "✓✓" (lida)
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **ALTA**

---

## 📊 Fluxos de Dados (Data Flow) - 3 diagramas

### 3. **Fluxos de Processamento de Dados**

#### 3.1 Fluxo de Busca com Filtros
```mermaid
graph LR
    A[Frontend: Filtros] --> B[Query String]
    B --> C[API: GET /api/imoveis]
    
    C --> D{Cache Redis?}
    D -->|Hit| E[Retornar Cached]
    D -->|Miss| F[Query Database]
    
    F --> G[WHERE clauses]
    G --> H[tipo = apartamento]
    G --> I[finalidade = aluguel]
    G --> J[preco BETWEEN min AND max]
    G --> K[quartos >= N]
    G --> L[cidade = Roma]
    
    L --> M[ORDER BY created_at DESC]
    M --> N[LIMIT 20 OFFSET 0]
    N --> O[Resultados]
    
    O --> P[Salvar Cache 5min]
    P --> Q[Retornar JSON]
    E --> Q
    
    Q --> R[Frontend: Renderizar Grid]
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🟡 **MÉDIA**

---

#### 3.2 Fluxo de Geolocalização e Busca por Proximidade
```mermaid
graph TD
    A[Usuário: Buscar próximo a mim] --> B[Navigator.geolocation]
    B --> C[Obter Lat/Lng usuário]
    
    C --> D[Frontend: Query Params]
    D --> E[lat=41.9028&lng=12.4964&radius=5km]
    E --> F[API: GET /api/imoveis/nearby]
    
    F --> G[PostGIS Query]
    G --> H[ST_Distance_Sphere]
    H --> I[Calcular distância]
    
    I --> J{Dentro do raio?}
    J -->|Sim| K[Incluir resultado]
    J -->|Não| L[Excluir]
    
    K --> M[ORDER BY distance ASC]
    M --> N[LIMIT 20]
    N --> O[Retornar com distância]
    
    O --> P[Frontend: Exibir]
    P --> Q[Card: 2.3 km de você]
    P --> R[Mapa: Pins ordenados]
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🟡 **MÉDIA**

---

#### 3.3 Fluxo de Análise de Crédito (Futuro - Fase 2)
```mermaid
sequenceDiagram
    participant User as Inquilino
    participant Frontend as Frontend
    participant API as API
    participant CRIF as CRIF API (Itália)
    participant DB as Database
    
    User->>Frontend: Solicitar análise crédito
    Frontend->>API: POST /api/credit-check
    Note over Frontend,API: {codice_fiscale, renda}
    
    API->>CRIF: POST /credit-score
    Note over API,CRIF: {tax_id, income}
    CRIF->>CRIF: Consultar bureaus
    CRIF-->>API: {score, status, details}
    
    API->>DB: Salvar resultado
    API->>API: Calcular elegibilidade
    
    alt Score >= 700
        API-->>Frontend: Aprovado
        Frontend->>User: ✅ Pré-aprovado
    else Score 500-699
        API-->>Frontend: Análise manual
        Frontend->>User: ⏳ Em análise
    else Score < 500
        API-->>Frontend: Reprovado
        Frontend->>User: ❌ Não elegível
    end
```

**Status**: ❌ **Não existe** (Fase 2)  
**Prioridade**: 🟢 **BAIXA** (Pós-MVP)

---

## 🛡️ Fluxos de Segurança (Security) - 2 diagramas

### 4. **Fluxos de Segurança e Conformidade**

#### 4.1 Fluxo de GDPR Consent
```mermaid
graph TD
    A[Registro Usuário] --> B[Formulário]
    B --> C[Checkboxes GDPR]
    C --> D[Marketing: Opcional]
    C --> E[Analytics: Opcional]
    C --> F[Third-party: Opcional]
    C --> G[Necessário: Obrigatório checked]
    
    G --> H{Aceitar Necessário?}
    H -->|Não| I[Bloquear Submit]
    I --> J[Erro: Consentimento obrigatório]
    
    H -->|Sim| K[POST /api/auth/register]
    K --> L[Salvar Usuário]
    L --> M[POST /api/gdpr/consent]
    
    M --> N[Salvar Consent]
    N --> O[gdpr_consents table]
    O --> P[user_id, purposes, ip, timestamp]
    
    P --> Q[gdpr_consent_history]
    Q --> R[Log de alterações]
    
    R --> S[Email Confirmação]
    S --> T[Link: Gerenciar Preferências]
    
    T --> U[/settings/privacy]
    U --> V[Toggle Preferências]
    V --> W[PUT /api/gdpr/consent]
    W --> Q
```

**Status**: ⚠️ **Parcial** (backend existe, frontend incompleto)  
**Prioridade**: 🔥 **ALTA**

---

#### 4.2 Fluxo de Recuperação de Senha
```mermaid
sequenceDiagram
    participant User as Usuário
    participant Frontend as Frontend
    participant API as API
    participant Email as SendGrid
    participant DB as Database
    
    User->>Frontend: Esqueci minha senha
    Frontend->>Frontend: Modal: Digite email
    User->>Frontend: Inserir email
    Frontend->>API: POST /api/auth/forgot-password
    
    API->>DB: Buscar usuário por email
    alt Usuário não existe
        DB-->>API: Not found
        API-->>Frontend: Email enviado (mentira - segurança)
    else Usuário existe
        DB-->>API: User found
        API->>API: Gerar token único (6 dígitos ou UUID)
        API->>DB: Salvar reset_token + expiry (1h)
        API->>Email: Enviar email com token/link
        Email->>User: Email: Clique aqui para resetar
        API-->>Frontend: Email enviado
    end
    
    User->>Frontend: Clicar link email
    Frontend->>Frontend: /reset-password?token=abc123
    Frontend->>API: GET /api/auth/verify-token?token=abc123
    
    alt Token inválido/expirado
        API-->>Frontend: 400 Invalid token
        Frontend->>User: Link expirado
    else Token válido
        API-->>Frontend: 200 OK
        Frontend->>User: Formulário: Nova senha
        User->>Frontend: Inserir nova senha
        Frontend->>API: POST /api/auth/reset-password
        Note over Frontend,API: {token, new_password}
        API->>API: Hash senha
        API->>DB: UPDATE users SET password_hash
        API->>DB: DELETE reset_token
        API-->>Frontend: Senha atualizada
        Frontend->>User: Sucesso! Faça login
    end
```

**Status**: ❌ **Não existe**  
**Prioridade**: 🔥 **ALTA**

---

## 📋 Resumo de Diagramas Faltantes

| # | Diagrama | Tipo | Prioridade | Status | Arquivo Destino |
|---|----------|------|------------|--------|-----------------|
| 1 | Fluxo Registro Inquilino | User Flow | 🔥 CRÍTICA | ❌ | FLUXOS_USUARIO.md |
| 2 | Fluxo Login | User Flow | 🔥 CRÍTICA | ❌ | FLUXOS_USUARIO.md |
| 3 | Fluxo Busca Imóveis | User Flow | 🔥 CRÍTICA | ❌ | FLUXOS_USUARIO.md |
| 4 | Fluxo Cadastro Imóvel (Wizard) | User Flow | 🔥 CRÍTICA | ❌ | FLUXOS_USUARIO.md |
| 5 | Fluxo Agendamento Visita | User Flow | 🔥 ALTA | ❌ | FLUXOS_USUARIO.md |
| 6 | Fluxo Chat/Mensagens | User Flow | 🔥 ALTA | ❌ | FLUXOS_USUARIO.md |
| 7 | Fluxo Favoritos | User Flow | 🟡 MÉDIA | ❌ | FLUXOS_USUARIO.md |
| 8 | Fluxo Dashboard Proprietário | User Flow | 🔥 ALTA | ❌ | FLUXOS_USUARIO.md |
| 9 | Integração Upload Fotos (R2) | Integration | 🔥 CRÍTICA | ❌ | FLUXOS_INTEGRACAO.md |
| 10 | Integração Google Maps | Integration | 🔥 CRÍTICA | ❌ | FLUXOS_INTEGRACAO.md |
| 11 | Integração SendGrid | Integration | 🔥 ALTA | ❌ | FLUXOS_INTEGRACAO.md |
| 12 | Integração Google OAuth | Integration | 🟡 MÉDIA | ❌ | FLUXOS_INTEGRACAO.md |
| 13 | Integração Firebase Chat | Integration | 🔥 ALTA | ❌ | FLUXOS_INTEGRACAO.md |
| 14 | Data Flow: Busca Filtros | Data Flow | 🟡 MÉDIA | ❌ | FLUXOS_DADOS.md |
| 15 | Data Flow: Geolocalização | Data Flow | 🟡 MÉDIA | ❌ | FLUXOS_DADOS.md |
| 16 | Data Flow: Análise Crédito | Data Flow | 🟢 BAIXA | ❌ | FLUXOS_DADOS.md |
| 17 | Security: GDPR Consent | Security | 🔥 ALTA | ⚠️ | FLUXOS_SEGURANCA.md |
| 18 | Security: Recuperação Senha | Security | 🔥 ALTA | ❌ | FLUXOS_SEGURANCA.md |

---

## 🎯 Estrutura de Arquivos Recomendada

```
/home/user/webapp/docs/
├── README.md                          ✅ Existe
├── PROPTECH_WORKFLOW.md               ✅ Existe
├── ARQUITETURA_MICROSERVICOS.md       ✅ Existe (2 diagramas)
├── STACK_TECNOLOGICO.md               ✅ Existe (1 diagrama)
├── CI_CD_PIPELINE.md                  ✅ Existe (1 diagrama)
├── COMPARACAO_GOCASA360.md            ✅ Existe
├── DoR_ANALISE.md                     ✅ Este arquivo
├── FLUXOS_USUARIO.md                  ❌ CRIAR (8 diagramas)
├── FLUXOS_INTEGRACAO.md               ❌ CRIAR (5 diagramas)
├── FLUXOS_DADOS.md                    ❌ CRIAR (3 diagramas)
└── FLUXOS_SEGURANCA.md                ❌ CRIAR (2 diagramas)
```

---

## 🔥 Priorização para Definition of Ready (DoR)

### **Sprint 0 (Documentação - 1 semana):**

#### Prioridade CRÍTICA (Fazer AGORA):
1. ✅ **FLUXOS_USUARIO.md** (8 diagramas)
   - Fluxo Registro
   - Fluxo Login
   - Fluxo Busca
   - Fluxo Cadastro Imóvel (Wizard)
   - Fluxo Agendamento
   - Fluxo Chat
   - Fluxo Dashboard

2. ✅ **FLUXOS_INTEGRACAO.md** (5 diagramas)
   - Upload Fotos R2
   - Google Maps
   - SendGrid

#### Prioridade ALTA (Próxima semana):
3. ✅ **FLUXOS_SEGURANCA.md** (2 diagramas)
   - GDPR Consent
   - Recuperação Senha

#### Prioridade MÉDIA (Quando houver tempo):
4. ✅ **FLUXOS_DADOS.md** (3 diagramas)
   - Busca com Filtros
   - Geolocalização

---

## 💡 Benefícios de Ter DoR Completo

### Para Desenvolvedores:
✅ Entendimento claro de cada fluxo  
✅ Redução de dúvidas durante implementação  
✅ Referência rápida para edge cases  
✅ Facilita onboarding de novos devs

### Para Product Managers:
✅ Visualização completa das jornadas  
✅ Identificação de gaps antes de codificar  
✅ Melhor estimativa de esforço  
✅ Comunicação clara com stakeholders

### Para QA:
✅ Base para criação de test cases  
✅ Cobertura de cenários positivos/negativos  
✅ Identificação de pontos de falha  
✅ Documentação de comportamento esperado

### Para Designers:
✅ Entendimento de fluxos completos  
✅ Identificação de pontos de fricção  
✅ Sincronização com desenvolvimento  
✅ Validação de wireframes contra fluxos

---

## 🚀 Próximos Passos

1. **Criar FLUXOS_USUARIO.md** com 8 diagramas de user flows
2. **Criar FLUXOS_INTEGRACAO.md** com 5 diagramas de integrações externas
3. **Criar FLUXOS_SEGURANCA.md** com 2 diagramas de segurança
4. **Criar FLUXOS_DADOS.md** com 3 diagramas de data flows
5. **Atualizar README.md** com links para novos documentos

**Tempo estimado**: 1-2 dias de documentação  
**Benefício**: DoR 100% completo para início de desenvolvimento

---

**Última atualização**: 28/12/2025  
**Versão**: 1.0  
**Próxima ação**: Criar FLUXOS_USUARIO.md
