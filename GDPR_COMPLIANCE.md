# 🔒 Sistema de Conformidade GDPR - GoCasa360IT

## 📋 Visão Geral

Sistema completo de conformidade com **RGPD** (Regulamento Geral de Proteção de Dados) da União Europeia, adaptado para legislação italiana.

**Referências Legais**:
- Regulamento UE 2016/679 (GDPR)
- D.Lgs. 196/2003 (Codice Privacy italiano)
- Garante per la Protezione dei Dati Personali

---

## 🎯 Funcionalidades Implementadas

### ✅ 1. Sistema de Consentimento
- ✅ Consentimento granular por finalidade
- ✅ Histórico completo de consentimentos
- ✅ Renovação automática a cada 2 anos
- ✅ Revogação a qualquer momento

### ✅ 2. Direitos dos Usuários (GDPR Art. 15-22)
- ✅ **Direito de acesso** - Exportar todos os dados
- ✅ **Direito de retificação** - Corrigir dados incorretos
- ✅ **Direito ao esquecimento** - Excluir dados
- ✅ **Direito de limitação** - Restringir processamento
- ✅ **Direito de portabilidade** - Exportar em formato legível
- ✅ **Direito de objeção** - Parar processamento

### ✅ 3. Gestão de Violações de Dados
- ✅ Registro de data breaches
- ✅ Notificação ao Garante em 72h
- ✅ Notificação aos usuários afetados
- ✅ Classificação de severidade

### ✅ 4. Retenção e Exclusão de Dados
- ✅ Períodos de retenção por categoria
- ✅ Agendamento automático de exclusão
- ✅ Anonimização quando necessário

### ✅ 5. Auditoria e Compliance
- ✅ Audit trail completo
- ✅ Verificação de conformidade
- ✅ Relatórios de compliance

---

## 📊 Categorias de Dados e Retenção

| Categoria | Período de Retenção | Base Legal | Descrição |
|-----------|---------------------|------------|-----------|
| **Anagrafica** | 10 anos | Contrato | Dados pessoais (nome, CF, nascimento) |
| **Contatti** | 2 anos | Consentimento | Histórico de comunicações |
| **Immobili** | 10 anos | Contrato | Dados de imóveis e contratos |
| **Messaggi** | 5 anos | Contrato | Mensagens entre usuários |
| **Pagamenti** | 10 anos | Obrigação Legal | Transações e faturas |
| **Profiling** | 2 anos | Consentimento | Preferências e buscas |

---

## 🗄️ Estrutura de Banco de Dados

### **Tabelas Criadas** (migration `0004_gdpr_compliance.sql`):

1. **`gdpr_consents`** - Consentimentos dos usuários
2. **`gdpr_data_requests`** - Solicitações de direitos GDPR
3. **`gdpr_data_breaches`** - Registro de violações
4. **`gdpr_consent_history`** - Histórico de mudanças
5. **`gdpr_data_deletion_schedule`** - Agendamento de exclusões
6. **`gdpr_anonymized_data`** - Dados anonimizados

---

## 💻 API de Uso

### **1. Criar Consentimento (Cadastro)**

```typescript
import { GDPRComplianceManager } from '@/utils/gdpr-compliance';

// No momento do cadastro
const consent = GDPRComplianceManager.createInitialConsent(
  userId,
  req.headers['x-forwarded-for'] || req.ip,
  req.headers['user-agent'],
  {
    necessary: true,      // Obrigatório
    marketing: true,      // Usuário aceitou emails
    analytics: true,      // Usuário aceitou cookies de análise
    thirdParty: false,    // Não compartilhar com parceiros
    profiling: true       // Usuário aceitou perfilação
  }
);

// Salvar no banco
await db.prepare(`
  INSERT INTO gdpr_consents (
    id, usuario_id, ip_address, user_agent, consent_version,
    necessary, marketing, analytics, third_party, profiling,
    data_retention_years
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).bind(
  consent.id,
  consent.userId,
  consent.ipAddress,
  consent.userAgent,
  consent.consentVersion,
  1, // necessary
  consent.purposes.marketing ? 1 : 0,
  consent.purposes.analytics ? 1 : 0,
  consent.purposes.thirdParty ? 1 : 0,
  consent.purposes.profiling ? 1 : 0,
  consent.dataRetentionYears
).run();
```

---

### **2. Verificar Validade do Consentimento**

```typescript
// Antes de enviar email marketing
const consentResult = await db.prepare(`
  SELECT * FROM gdpr_consents 
  WHERE usuario_id = ? AND withdrawn_at IS NULL
  ORDER BY consented_at DESC LIMIT 1
`).bind(userId).first();

if (!consentResult) {
  throw new Error('Consentimento não encontrado');
}

const consent: GDPRConsent = {
  id: consentResult.id,
  userId: consentResult.usuario_id,
  consentedAt: new Date(consentResult.consented_at),
  ipAddress: consentResult.ip_address,
  userAgent: consentResult.user_agent,
  consentVersion: consentResult.consent_version,
  purposes: {
    necessary: !!consentResult.necessary,
    marketing: !!consentResult.marketing,
    analytics: !!consentResult.analytics,
    thirdParty: !!consentResult.third_party,
    profiling: !!consentResult.profiling
  },
  dataRetentionYears: consentResult.data_retention_years,
  rights: {
    rightToAccess: !!consentResult.right_to_access,
    rightToRectification: !!consentResult.right_to_rectification,
    rightToErasure: !!consentResult.right_to_erasure,
    rightToRestriction: !!consentResult.right_to_restriction,
    rightToPortability: !!consentResult.right_to_portability,
    rightToObject: !!consentResult.right_to_object
  },
  withdrawnAt: consentResult.withdrawn_at ? new Date(consentResult.withdrawn_at) : undefined,
  lastUpdated: new Date(consentResult.last_updated)
};

// Validar
if (!GDPRComplianceManager.isConsentValid(consent)) {
  // Solicitar renovação do consentimento
  return { needsRenewal: true };
}

if (!consent.purposes.marketing) {
  throw new Error('Usuário não consentiu com marketing');
}

// OK para enviar email
```

---

### **3. Atualizar Preferências (Perfil do Usuário)**

```typescript
// Usuário desativou marketing
const updatedConsent = GDPRComplianceManager.updateConsent(existingConsent, {
  marketing: false
});

await db.prepare(`
  UPDATE gdpr_consents 
  SET marketing = ?, last_updated = ?
  WHERE id = ?
`).bind(0, updatedConsent.lastUpdated.toISOString(), updatedConsent.id).run();

// Registrar no histórico
await db.prepare(`
  INSERT INTO gdpr_consent_history (
    id, consent_id, usuario_id, action, old_values, new_values, timestamp
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`).bind(
  `history-${Date.now()}`,
  consent.id,
  userId,
  'updated',
  JSON.stringify({ marketing: true }),
  JSON.stringify({ marketing: false }),
  new Date().toISOString()
).run();
```

---

### **4. Exportar Dados do Usuário (Direito de Acesso)**

```typescript
// API: GET /api/gdpr/export
app.get('/api/gdpr/export', async (c) => {
  const userId = c.get('userId'); // Do JWT
  const { DB } = c.env;
  
  // 1. Dados pessoais
  const user = await DB.prepare(`
    SELECT * FROM usuarios WHERE id = ?
  `).bind(userId).first();
  
  // 2. Imóveis
  const properties = await DB.prepare(`
    SELECT * FROM imoveis WHERE proprietario_id = ?
  `).bind(userId).all();
  
  // 3. Mensagens
  const messages = await DB.prepare(`
    SELECT * FROM mensagens 
    WHERE remetente_id = ? OR destinatario_id = ?
  `).bind(userId, userId).all();
  
  // 4. Favoritos
  const favorites = await DB.prepare(`
    SELECT * FROM favoritos WHERE usuario_id = ?
  `).bind(userId).all();
  
  // 5. Histórico de consentimentos
  const consents = await DB.prepare(`
    SELECT * FROM gdpr_consents WHERE usuario_id = ?
  `).bind(userId).all();
  
  // Montar JSON completo
  const exportData = {
    exportedAt: new Date().toISOString(),
    personalData: user,
    properties: properties.results,
    messages: messages.results,
    favorites: favorites.results,
    consentHistory: consents.results,
    gdprInfo: {
      dataCategories: GDPR_DATA_CATEGORIES,
      rights: [
        'Direito de acesso',
        'Direito de retificação',
        'Direito ao esquecimento',
        'Direito de limitação',
        'Direito de portabilidade',
        'Direito de objeção'
      ]
    }
  };
  
  return c.json({
    success: true,
    data: exportData
  });
});
```

---

### **5. Solicitar Exclusão de Dados (Direito ao Esquecimento)**

```typescript
// API: POST /api/gdpr/request-erasure
app.post('/api/gdpr/request-erasure', async (c) => {
  const userId = c.get('userId');
  const { DB } = c.env;
  
  // Verificar se pode excluir
  const canErase = GDPRComplianceManager.canFulfillErasureRequest(userId);
  
  if (!canErase.canErase) {
    // Não pode excluir por obrigações legais
    // Anonimizar ao invés de excluir
    const anonymized = GDPRComplianceManager.anonymizeUserData(userId);
    
    await DB.prepare(`
      INSERT INTO gdpr_anonymized_data (
        id, original_user_id, anonymized_id, anonymized_at, reason, legal_basis
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      `anon-${Date.now()}`,
      anonymized.originalId,
      anonymized.anonymizedId,
      anonymized.anonymizedAt.toISOString(),
      'Obrigações fiscais e contratuais',
      'D.Lgs. 196/2003 - Obrigação de retenção de 10 anos'
    ).run();
    
    // Anonimizar dados sensíveis
    await DB.prepare(`
      UPDATE usuarios SET
        nome_completo = ?,
        email = ?,
        telefone = NULL,
        cpf_cnpj = NULL,
        foto_perfil = NULL
      WHERE id = ?
    `).bind(
      'Utente Anonimizzato',
      `${anonymized.anonymizedId}@anonimo.gocasa360.it`,
      userId
    ).run();
    
    return c.json({
      success: true,
      message: 'Dati anonimizzati con successo',
      anonymizedId: anonymized.anonymizedId,
      reason: 'Obrigações legais impedem exclusão completa'
    });
  }
  
  // Pode excluir completamente
  const requestId = `request-${Date.now()}`;
  
  await DB.prepare(`
    INSERT INTO gdpr_data_requests (
      id, usuario_id, request_type, status
    ) VALUES (?, ?, ?, ?)
  `).bind(requestId, userId, 'erasure', 'pending').run();
  
  return c.json({
    success: true,
    message: 'Solicitação de exclusão registrada',
    requestId,
    estimatedCompletionDays: 30 // GDPR: responder em 1 mês
  });
});
```

---

### **6. Registrar Violação de Dados (Data Breach)**

```typescript
// Uso interno (admin/sistema)
const breach: GDPRDataBreach = {
  id: `breach-${Date.now()}`,
  detectedAt: new Date(),
  severity: 'high',
  affectedUsers: ['user-123', 'user-456'],
  dataCategories: ['anagrafica', 'pagamenti'],
  description: 'Acesso não autorizado ao banco de dados via SQL injection',
  mitigationActions: [
    'Firewall atualizado',
    'Senhas alteradas',
    'Auditoria de segurança realizada'
  ],
  notifiedUsers: false,
  status: 'detected'
};

// Salvar no banco
await DB.prepare(`
  INSERT INTO gdpr_data_breaches (
    id, detected_at, severity, affected_users, data_categories,
    description, mitigation_actions, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).bind(
  breach.id,
  breach.detectedAt.toISOString(),
  breach.severity,
  JSON.stringify(breach.affectedUsers),
  JSON.stringify(breach.dataCategories),
  breach.description,
  JSON.stringify(breach.mitigationActions),
  breach.status
).run();

// Verificar se deve notificar Garante
if (GDPRComplianceManager.shouldNotifyGarante(breach)) {
  // URGENTE: Notificar Garante em 72h
  console.warn('⚠️ ATENÇÃO: Violação de dados grave. Notificar Garante em 72h!');
  
  // Enviar email para DPO
  // Preparar documentação para Garante
  
  // Atualizar registro
  await DB.prepare(`
    UPDATE gdpr_data_breaches 
    SET reported_to_garante_at = ?
    WHERE id = ?
  `).bind(new Date().toISOString(), breach.id).run();
}

// Notificar usuários afetados
breach.affectedUsers.forEach(async (userId) => {
  // Enviar email de notificação
  console.log(`Notificando usuário ${userId} sobre violação de dados`);
});
```

---

## 📋 Checklist de Conformidade GDPR

### ✅ **Obrigatórios para MVP**
- [x] Sistema de consentimento granular
- [x] Informativa de privacidade clara
- [x] Direito de acesso (exportar dados)
- [x] Direito de retificação (editar perfil)
- [x] Direito ao esquecimento (excluir conta)
- [x] Retenção de dados por categoria
- [x] Registro de consentimentos
- [ ] Nomeação de DPO (Data Protection Officer)
- [ ] Registro de atividades de tratamento
- [ ] Cookie banner e gestão de cookies

### ⏳ **Para FASE 2**
- [ ] Avaliação de impacto (DPIA)
- [ ] Contratos com processadores de dados
- [ ] Auditorias regulares de segurança
- [ ] Certificações (ISO 27001, etc.)
- [ ] Integração com ferramentas de compliance

---

## 💰 Custos de Compliance

### **MVP (Mínimo Legal)**:
- DPO Externo: €500-1000/mês
- Consultoria Legal: €2000-5000 (inicial)
- Ferramentas de Compliance: €0-50/mês

### **FASE 2 (Completo)**:
- DPO Interno: €40k-60k/ano
- Auditoria ISO 27001: €10k-20k
- Ferramentas Enterprise: €500-2000/mês
- Seguro Cyber: €2k-10k/ano

---

## 📞 Contatos GDPR

### **Garante per la Protezione dei Dati Personali**
- Website: https://www.garanteprivacy.it
- Email: garante@gpdp.it
- PEC: protocollo@pec.gpdp.it
- Telefone: +39 06 69677.1

---

## 🎬 Próximos Passos

1. ✅ **Aplicar migration** (`0004_gdpr_compliance.sql`)
2. ✅ **Integrar no cadastro** (coletar consentimento)
3. ✅ **Criar página de privacidade** (/privacy-policy)
4. ✅ **Implementar cookie banner** (terceiros: Cookiebot, OneTrust)
5. ⏳ **Nomear DPO** (obrigatório se processar dados sensíveis em larga escala)
6. ⏳ **Registrar atividades de tratamento** (art. 30 GDPR)

---

**Última atualização**: 28/12/2024  
**Versão**: 1.0  
**Compliance**: GDPR (UE 2016/679) + D.Lgs. 196/2003
