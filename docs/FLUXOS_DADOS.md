# 📊 Fluxos de Dados - GoCasa360IT

**Data Processing e Analytics**

---

## 1. Fluxo de Busca com Filtros e Cache

### 📊 Diagrama

```mermaid
graph LR
    A[Frontend: Filtros] --> B[Query String]
    B --> C[API: GET /api/imoveis]
    
    C --> D{Cache Redis/KV?}
    D -->|Hit 5min| E[Retornar Cached]
    D -->|Miss| F[Query D1 Database]
    
    F --> G[WHERE clauses]
    G --> H[tipo IN]
    G --> I[finalidade =]
    G --> J[preco BETWEEN]
    G --> K[quartos >=]
    G --> L[cidade =]
    
    L --> M[ORDER BY created_at DESC]
    M --> N[LIMIT 20 OFFSET]
    N --> O[Resultados]
    
    O --> P[Salvar Cache 5min]
    P --> Q[Retornar JSON]
    E --> Q
    
    Q --> R[Frontend: Renderizar Grid]
```

### ✅ Otimizações
- ✅ Cache de 5 minutos (Cloudflare KV)
- ✅ Índices em colunas filtradas
- ✅ Paginação (20 resultados)
- ✅ Query optimizada (SELECT apenas colunas necessárias)

---

## 2. Fluxo de Geolocalização (Busca por Proximidade)

### 📊 Diagrama

```mermaid
graph TD
    A[Usuário: Buscar próximo] --> B[Navigator.geolocation]
    B --> C[Obter Lat/Lng]
    
    C --> D[Query Params]
    D --> E[lat=41.90&lng=12.49&radius=5km]
    E --> F[API: GET /api/imoveis/nearby]
    
    F --> G[PostGIS/SQLite Query]
    G --> H[Calcular distância]
    
    H --> I{Dentro do raio?}
    I -->|Sim| J[Incluir resultado]
    I -->|Não| K[Excluir]
    
    J --> L[ORDER BY distance ASC]
    L --> M[LIMIT 20]
    M --> N[Retornar + distância]
    
    N --> O[Frontend: Exibir]
    O --> P[Card: 2.3 km de você]
    O --> Q[Mapa: Pins ordenados]
```

### 🗺️ SQL Query (SQLite)

```sql
SELECT *,
  (6371 * acos(cos(radians(?)) * cos(radians(endereco_latitude)) * 
   cos(radians(endereco_longitude) - radians(?)) + 
   sin(radians(?)) * sin(radians(endereco_latitude)))) AS distance
FROM imoveis
WHERE disponivel = 1
HAVING distance < ?
ORDER BY distance ASC
LIMIT 20
```

---

## 3. Fluxo de Análise de Crédito (Fase 2 - Futuro)

### 📊 Diagrama

```mermaid
sequenceDiagram
    participant User as Inquilino
    participant API as API
    participant CRIF as CRIF API IT
    participant DB as Database
    
    User->>API: Solicitar análise
    API->>CRIF: POST /credit-score
    Note over API,CRIF: {codice_fiscale, renda}
    CRIF-->>API: {score, status}
    
    API->>DB: Salvar resultado
    API->>API: Calcular elegibilidade
    
    alt Score >= 700
        API-->>User: ✅ Aprovado
    else Score 500-699
        API-->>User: ⏳ Análise manual
    else Score < 500
        API-->>User: ❌ Não elegível
    end
```

### 📊 Scoring

| Score | Status | Ação |
|-------|--------|------|
| 700-850 | Excelente | Aprovação automática |
| 500-699 | Bom | Análise manual |
| 300-499 | Regular | Reprovado + sugerir fiador |
| < 300 | Ruim | Reprovado |

---

**Última atualização**: 28/12/2025  
**Versão**: 1.0
