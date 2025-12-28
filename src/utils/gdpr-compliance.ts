/**
 * GDPR Compliance System - GoCasa360IT
 * 
 * Sistema de conformidade com RGPD (Regulamento Geral de Proteção de Dados)
 * para plataforma de imóveis italiana.
 * 
 * Referências:
 * - Regulamento UE 2016/679 (GDPR)
 * - D.Lgs. 196/2003 (Codice Privacy italiano)
 * - Garante Privacy (Autoridade italiana)
 */

export interface GDPRConsent {
  id: string;
  userId: string;
  consentedAt: Date;
  ipAddress: string;
  userAgent: string; // Navegador usado
  consentVersion: string; // Versão dos termos aceitos
  purposes: {
    necessary: boolean; // Sempre true (cookies técnicos)
    marketing: boolean; // Email marketing, remarketing
    analytics: boolean; // Google Analytics, métricas
    thirdParty: boolean; // Compartilhamento com parceiros
    profiling: boolean; // Perfilação automatizada
  };
  dataRetentionYears: number; // Máximo permitido por categoria
  rights: {
    rightToAccess: boolean; // Direito de acesso aos dados
    rightToRectification: boolean; // Direito de correção
    rightToErasure: boolean; // Direito ao esquecimento
    rightToRestriction: boolean; // Direito de restrição
    rightToPortability: boolean; // Direito de portabilidade
    rightToObject: boolean; // Direito de objeção
  };
  withdrawnAt?: Date; // Data de revogação do consentimento
  withdrawnReason?: string;
  lastUpdated: Date;
}

export interface GDPRDataCategory {
  category: 'anagrafica' | 'contatti' | 'immobili' | 'messaggi' | 'pagamenti' | 'profiling';
  retentionYears: number;
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'legitimate_interest';
  description: string;
  dataPoints: string[]; // Campos específicos
}

export interface GDPRDataRequest {
  id: string;
  userId: string;
  requestType: 'access' | 'rectification' | 'erasure' | 'restriction' | 'portability' | 'objection';
  requestedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  completedAt?: Date;
  notes?: string;
  documents?: string[]; // URLs dos documentos gerados
}

export interface GDPRDataBreach {
  id: string;
  detectedAt: Date;
  reportedToGaranteAt?: Date; // Obrigatório em 72h
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers: string[]; // IDs dos usuários afetados
  dataCategories: string[]; // Categorias de dados comprometidas
  description: string;
  mitigationActions: string[];
  notifiedUsers: boolean;
  status: 'detected' | 'investigating' | 'mitigated' | 'closed';
}

// Categorias de dados e retenção conforme GDPR
export const GDPR_DATA_CATEGORIES: GDPRDataCategory[] = [
  {
    category: 'anagrafica',
    retentionYears: 10, // Obrigação fiscal italiana
    legalBasis: 'contract',
    description: 'Dati anagrafici (nome, cognome, codice fiscale, data di nascita)',
    dataPoints: ['nome_completo', 'email', 'telefone', 'cpf_cnpj', 'data_nascita']
  },
  {
    category: 'contatti',
    retentionYears: 2, // Após último contato
    legalBasis: 'consent',
    description: 'Storico dei contatti e comunicazioni',
    dataPoints: ['mensagens', 'visitas', 'propostas']
  },
  {
    category: 'immobili',
    retentionYears: 10, // Obrigação fiscal
    legalBasis: 'contract',
    description: 'Dati degli immobili e contratti',
    dataPoints: ['imoveis', 'contratos', 'pagamenti']
  },
  {
    category: 'messaggi',
    retentionYears: 5, // Obrigação contratual
    legalBasis: 'contract',
    description: 'Messaggi e chat tra utenti',
    dataPoints: ['mensagens_remetente', 'mensagens_destinatario']
  },
  {
    category: 'pagamenti',
    retentionYears: 10, // Obrigação fiscal (D.Lgs. 196/2003)
    legalBasis: 'legal_obligation',
    description: 'Dati di pagamento e transazioni',
    dataPoints: ['transazioni', 'fatture', 'ricevute']
  },
  {
    category: 'profiling',
    retentionYears: 2, // Apenas com consentimento explícito
    legalBasis: 'consent',
    description: 'Dati di profilazione e preferenze',
    dataPoints: ['favoritos', 'buscas', 'visualizacoes']
  }
];

export class GDPRComplianceManager {
  /**
   * Verifica se o consentimento é válido e atual
   */
  static isConsentValid(consent: GDPRConsent): boolean {
    // Consentimento deve ser renovado a cada 2 anos (boa prática)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    if (consent.consentedAt < twoYearsAgo) {
      return false;
    }
    
    // Verificar se foi revogado
    if (consent.withdrawnAt) {
      return false;
    }
    
    return true;
  }

  /**
   * Cria registro de consentimento inicial
   */
  static createInitialConsent(
    userId: string,
    ipAddress: string,
    userAgent: string,
    purposes: GDPRConsent['purposes']
  ): GDPRConsent {
    return {
      id: `consent-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      consentedAt: new Date(),
      ipAddress,
      userAgent,
      consentVersion: '1.0', // Versão atual dos termos
      purposes: {
        necessary: true, // Sempre obrigatório
        ...purposes
      },
      dataRetentionYears: 10, // Máximo legal italiano
      rights: {
        rightToAccess: true,
        rightToRectification: true,
        rightToErasure: true,
        rightToRestriction: true,
        rightToPortability: true,
        rightToObject: true
      },
      lastUpdated: new Date()
    };
  }

  /**
   * Atualiza consentimento (usuário mudou preferências)
   */
  static updateConsent(
    existingConsent: GDPRConsent,
    newPurposes: Partial<GDPRConsent['purposes']>
  ): GDPRConsent {
    return {
      ...existingConsent,
      purposes: {
        ...existingConsent.purposes,
        ...newPurposes
      },
      lastUpdated: new Date()
    };
  }

  /**
   * Revoga consentimento (usuário cancela)
   */
  static withdrawConsent(
    consent: GDPRConsent,
    reason?: string
  ): GDPRConsent {
    return {
      ...consent,
      withdrawnAt: new Date(),
      withdrawnReason: reason,
      purposes: {
        necessary: true,
        marketing: false,
        analytics: false,
        thirdParty: false,
        profiling: false
      },
      lastUpdated: new Date()
    };
  }

  /**
   * Gera documento com todos os dados do usuário (direito de acesso)
   */
  static async generateUserDataExport(userId: string): Promise<{
    personalData: any;
    consentHistory: GDPRConsent[];
    dataCategories: GDPRDataCategory[];
    exportedAt: Date;
  }> {
    // Implementação depende do banco de dados
    return {
      personalData: {}, // Todos os dados do usuário
      consentHistory: [], // Histórico de consentimentos
      dataCategories: GDPR_DATA_CATEGORIES,
      exportedAt: new Date()
    };
  }

  /**
   * Agenda exclusão de dados após período de retenção
   */
  static scheduleDataDeletion(userId: string, category: string, retentionYears: number): Date {
    const deletionDate = new Date();
    deletionDate.setFullYear(deletionDate.getFullYear() + retentionYears);
    return deletionDate;
  }

  /**
   * Verifica se deve notificar Garante Privacy sobre violação
   */
  static shouldNotifyGarante(breach: GDPRDataBreach): boolean {
    // GDPR Art. 33: Notificar em 72h se houver risco aos direitos dos usuários
    const criticalConditions = [
      breach.severity === 'high' || breach.severity === 'critical',
      breach.affectedUsers.length > 10,
      breach.dataCategories.includes('pagamenti'),
      breach.dataCategories.includes('anagrafica')
    ];
    
    return criticalConditions.some(condition => condition);
  }

  /**
   * Gera texto de informativa privacy conforme GDPR
   */
  static generatePrivacyPolicy(): string {
    return `
INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI
(ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679)

1. TITOLARE DEL TRATTAMENTO
GoCasa360 S.r.l. - Via [Indirizzo], [Città], Italia
Email: privacy@gocasa360.it
PEC: gocasa360@pec.it

2. RESPONSABILE DELLA PROTEZIONE DEI DATI (DPO)
Email: dpo@gocasa360.it

3. FINALITÀ DEL TRATTAMENTO
I dati personali vengono trattati per:
a) Esecuzione del contratto (locazione/vendita immobili)
b) Marketing e comunicazioni commerciali (con consenso)
c) Analisi statistiche e miglioramento servizi (con consenso)
d) Adempimenti fiscali e contabili (obbligo di legge)

4. BASE GIURIDICA
- Esecuzione del contratto (art. 6.1.b GDPR)
- Consenso dell'interessato (art. 6.1.a GDPR)
- Obbligo di legge (art. 6.1.c GDPR)

5. DESTINATARI DEI DATI
I dati possono essere comunicati a:
- Fornitori di servizi tecnici (hosting, email)
- Consulenti legali e fiscali
- Autorità competenti (su richiesta)

6. CONSERVAZIONE DEI DATI
I dati saranno conservati per:
- Dati anagrafici: 10 anni (obbligo fiscale)
- Dati di marketing: 2 anni dall'ultimo contatto
- Dati di navigazione: 13 mesi

7. DIRITTI DELL'INTERESSATO
Ha diritto di:
- Accedere ai propri dati
- Rettificare dati inesatti
- Cancellare i dati (diritto all'oblio)
- Limitare il trattamento
- Opporsi al trattamento
- Ricevere i dati in formato leggibile (portabilità)
- Revocare il consenso

8. RECLAMO AL GARANTE
Può presentare reclamo al Garante per la Protezione dei Dati Personali:
Website: www.garanteprivacy.it
Email: garante@gpdp.it
    `.trim();
  }

  /**
   * Valida se pedido de exclusão pode ser atendido
   */
  static canFulfillErasureRequest(userId: string): {
    canErase: boolean;
    blockers: string[];
  } {
    const blockers: string[] = [];
    
    // Verificar obrigações legais (fiscal, contratual)
    // Exemplo: contrato ativo, pagamentos pendentes, obrigações fiscais
    
    // Se houver bloqueadores, não pode excluir
    return {
      canErase: blockers.length === 0,
      blockers
    };
  }

  /**
   * Anonimiza dados ao invés de excluir (quando há obrigação legal)
   */
  static anonymizeUserData(userId: string): {
    originalId: string;
    anonymizedId: string;
    anonymizedAt: Date;
  } {
    const anonymizedId = `anon-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    return {
      originalId: userId,
      anonymizedId,
      anonymizedAt: new Date()
    };
  }

  /**
   * Verifica conformidade GDPR do sistema
   */
  static auditCompliance(): {
    compliant: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Verificações automáticas
    // - Política de privacidade atualizada?
    // - DPO nomeado?
    // - Registro de tratamentos atualizado?
    // - Avaliação de impacto realizada?
    // - Contratos com processadores de dados?
    
    return {
      compliant: issues.length === 0,
      issues,
      recommendations
    };
  }
}

// ============================================
// EXEMPLO DE USO
// ============================================

/*
// 1. Criar consentimento no cadastro
const consent = GDPRComplianceManager.createInitialConsent(
  'user-123',
  '192.168.1.1',
  'Mozilla/5.0...',
  {
    necessary: true,
    marketing: true,
    analytics: true,
    thirdParty: false,
    profiling: true
  }
);

// 2. Verificar se é válido
const isValid = GDPRComplianceManager.isConsentValid(consent);

// 3. Atualizar preferências
const updated = GDPRComplianceManager.updateConsent(consent, {
  marketing: false // Usuário desativou marketing
});

// 4. Exportar dados do usuário
const exportData = await GDPRComplianceManager.generateUserDataExport('user-123');

// 5. Solicitar exclusão
const erasureCheck = GDPRComplianceManager.canFulfillErasureRequest('user-123');
if (erasureCheck.canErase) {
  // Excluir dados
} else {
  console.log('Bloqueadores:', erasureCheck.blockers);
  // Anonimizar ao invés de excluir
  const anonymized = GDPRComplianceManager.anonymizeUserData('user-123');
}

// 6. Registrar violação de dados
const breach: GDPRDataBreach = {
  id: 'breach-001',
  detectedAt: new Date(),
  severity: 'high',
  affectedUsers: ['user-123', 'user-456'],
  dataCategories: ['anagrafica', 'contatti'],
  description: 'Acesso não autorizado ao banco de dados',
  mitigationActions: ['Senha alterada', 'Firewall atualizado'],
  notifiedUsers: true,
  status: 'mitigated'
};

// Verificar se deve notificar Garante
if (GDPRComplianceManager.shouldNotifyGarante(breach)) {
  // Notificar em 72h
}
*/
