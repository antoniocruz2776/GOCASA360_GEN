# 🇮🇹 Integração com Agenzia delle Entrate - GoCasa360IT

## 📋 Visão Geral

Este documento descreve a integração com a **Agenzia delle Entrate** (Receita Federal italiana) para automatizar processos fiscais relacionados a imóveis.

---

## 🎯 Funcionalidades Disponíveis

### ✅ **Implementadas no Código Compartilhado**

1. **Verificação de Codice Fiscale** (`verificaCodiceFiscale`)
   - Valida se o CF é válido
   - Retorna dados anagráficos (nome, sobrenome, data de nascimento)

2. **Visura Catastale** (`richiestaVisuraCatastale`, `downloadVisuraCatastale`)
   - Solicita visura cadastral de imóvel
   - Download do documento PDF

3. **Registro de Contrato de Aluguel** (`registraContrattoLocazione`)
   - Registra contrato junto à Agenzia
   - Calcula imposto de registro (2% do valor anual)
   - Gera F24 automaticamente

4. **Geração de F24** (`generaF24`)
   - IMU (Imposto Municipal sobre Imóveis)
   - TARI (Taxa de Lixo)
   - Registro de Locação
   - Imposto Hipotecário
   - Imposto Cadastral

5. **Pagamento Online de F24** (`pagaF24Online`)
   - Via Fisconline
   - Via Home Banking (PSD2)

---

## ⚠️ Status de Implementação no GoCasa360IT

### ❌ **Não Implementado** (0%)

Nenhuma das funcionalidades acima está implementada no projeto atual.

### 🚧 **Bloqueadores para Implementação**

1. **API Key da Agenzia delle Entrate**
   - Necessário convênio com a Agenzia
   - Processo burocrático demorado (3-6 meses)
   - Requer SPID empresarial

2. **Certificado Digital**
   - Necessário certificado qualificado
   - Custo: €100-300/ano

3. **Autenticação SPID/CIE**
   - Sistema de identidade digital italiano
   - Integração complexa

4. **Compliance Legal**
   - Necessário advogado especializado em direito imobiliário
   - GDPR para dados fiscais
   - Responsabilidade fiscal

---

## 🎯 Roadmap de Implementação

### **FASE 2** (Meses 4-6): Pós-MVP
Conforme planejado no roadmap original, essa funcionalidade faz parte da **FASE 2**.

#### Pré-requisitos:
1. MVP 100% funcional
2. Base de usuários estabelecida (>1000 usuários)
3. Receita recorrente (para justificar investimento)
4. Equipe legal contratada

#### Passos:
1. **Solicitar convênio** com Agenzia delle Entrate (3-6 meses)
2. **Obter certificado digital** empresarial
3. **Integrar SPID** (autenticação)
4. **Implementar APIs** de verificação de CF e visura
5. **Implementar registro de contratos** automatizado
6. **Implementar geração de F24**
7. **Testes piloto** com 10-20 contratos
8. **Lançamento gradual**

**Tempo estimado**: 6-9 meses  
**Custo estimado**: €20.000 - €50.000 (desenvolvimento + legal + certificados)

---

## 💡 Solução Provisória para MVP

### **Alternativa 1: Validação Manual**
Para o MVP, implementar:
- ✅ Validação **sintática** de Codice Fiscale (algoritmo local)
- ✅ Upload de documentos (CI, Codice Fiscale)
- ✅ Verificação manual por admin

### **Alternativa 2: API de Terceiros**
Usar serviços intermediários:
- **CodiceFiscale.it** (API de validação de CF)
- **Catasto Online** (visuras não oficiais)
- Custo: €50-200/mês

### **Alternativa 3: Processo Híbrido**
- Sistema gera dados do contrato
- Proprietário registra manualmente no site da Agenzia
- Upload de comprovante de registro

---

## 📝 Implementação Imediata: Validação Local de CF

Vou implementar a validação **local** de Codice Fiscale (sem API):

```typescript
// src/utils/codice-fiscale.ts

export interface DatiAnagrafici {
  cognome: string;
  nome: string;
  dataNascita: Date;
  sesso: 'M' | 'F';
  comuneNascita: string;
}

export class CodiceFiscaleValidator {
  private static MESI = ['A','B','C','D','E','H','L','M','P','R','S','T'];
  private static CARATTERI_PARI = {
    '0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
    'A':0,'B':1,'C':2,'D':3,'E':4,'F':5,'G':6,'H':7,'I':8,'J':9,
    'K':10,'L':11,'M':12,'N':13,'O':14,'P':15,'Q':16,'R':17,'S':18,
    'T':19,'U':20,'V':21,'W':22,'X':23,'Y':24,'Z':25
  };
  private static CARATTERI_DISPARI = {
    '0':1,'1':0,'2':5,'3':7,'4':9,'5':13,'6':15,'7':17,'8':19,'9':21,
    'A':1,'B':0,'C':5,'D':7,'E':9,'F':13,'G':15,'H':17,'I':19,'J':21,
    'K':2,'L':4,'M':18,'N':20,'O':11,'P':3,'Q':6,'R':8,'S':12,'T':14,
    'U':16,'V':10,'W':22,'X':25,'Y':24,'Z':23
  };
  private static CARATTERI_CONTROLLO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Validar sintaxe do CF
  static valida(cf: string): boolean {
    cf = cf.toUpperCase().trim();
    
    // Verificar formato
    if (!/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.test(cf)) {
      return false;
    }
    
    // Verificar caractere de controle
    return this.calcolaCarattereControllo(cf.substring(0, 15)) === cf.charAt(15);
  }

  // Calcular caractere de controle
  private static calcolaCarattereControllo(cf15: string): string {
    let somma = 0;
    
    for (let i = 0; i < 15; i++) {
      const char = cf15.charAt(i);
      if (i % 2 === 0) {
        somma += this.CARATTERI_DISPARI[char];
      } else {
        somma += this.CARATTERI_PARI[char];
      }
    }
    
    return this.CARATTERI_CONTROLLO.charAt(somma % 26);
  }

  // Extrair dados do CF (básico)
  static estraiDati(cf: string): Partial<DatiAnagrafici> | null {
    if (!this.valida(cf)) return null;
    
    cf = cf.toUpperCase();
    
    // Extrair ano de nascimento
    const anno2Cifre = parseInt(cf.substring(6, 8));
    const annoCorrente = new Date().getFullYear() % 100;
    const anno = anno2Cifre > annoCorrente ? 1900 + anno2Cifre : 2000 + anno2Cifre;
    
    // Extrair mês
    const meseCodice = cf.charAt(8);
    const mese = this.MESI.indexOf(meseCodice);
    
    // Extrair dia e sexo
    let giorno = parseInt(cf.substring(9, 11));
    const sesso: 'M' | 'F' = giorno > 40 ? 'F' : 'M';
    if (giorno > 40) giorno -= 40;
    
    const dataNascita = new Date(anno, mese, giorno);
    
    return {
      dataNascita,
      sesso
    };
  }

  // Validar e retornar dados completos
  static validaCompleto(cf: string): {
    valido: boolean;
    dati?: Partial<DatiAnagrafici>;
    errore?: string;
  } {
    cf = cf.toUpperCase().trim();
    
    if (!this.valida(cf)) {
      return {
        valido: false,
        errore: 'Codice Fiscale non valido'
      };
    }
    
    const dati = this.estraiDati(cf);
    
    return {
      valido: true,
      dati: dati || undefined
    };
  }
}

// Exemplos de uso:
// CodiceFiscaleValidator.valida('RSSMRA85M01H501Z') // true
// CodiceFiscaleValidator.estraiDati('RSSMRA85M01H501Z') 
// { dataNascita: Date(1985-08-01), sesso: 'M' }
```

---

## 🚀 Ação Imediata Recomendada

### **Para o MVP** (implementar AGORA):
1. ✅ Validação local de Codice Fiscale (código acima)
2. ✅ Campo CF no cadastro de usuário
3. ✅ Validação em tempo real no formulário
4. ✅ Mensagem clara se CF inválido

### **Para FASE 2** (4-6 meses após MVP):
1. Solicitar convênio com Agenzia delle Entrate
2. Contratar advogado especializado
3. Implementar integração completa

---

## 📊 Comparação: MVP vs FASE 2

| Funcionalidade | MVP (Agora) | FASE 2 (Futuro) |
|----------------|-------------|-----------------|
| **Validação CF** | ✅ Sintática (local) | ✅ Sintática + Agenzia API |
| **Verificação Identidade** | ❌ Upload manual | ✅ Automática via SPID |
| **Visura Catastale** | ❌ Upload manual | ✅ Automática via API |
| **Registro Contrato** | ❌ Manual pelo usuário | ✅ Automática |
| **Geração F24** | ❌ Manual | ✅ Automática |
| **Pagamento F24** | ❌ Fora da plataforma | ✅ Dentro da plataforma |

---

## 💰 Custos Estimados

### **MVP (Validação Local)**:
- Desenvolvimento: €500-1000 (4-8 horas)
- Custo operacional: €0/mês

### **FASE 2 (Integração Completa)**:
- Convênio Agenzia: €0 (processo gratuito, mas longo)
- Certificado Digital: €100-300/ano
- Desenvolvimento: €15.000-30.000 (3-4 meses)
- Consultoria Legal: €5.000-10.000
- Testes e Homologação: €2.000-5.000

**Total FASE 2**: €22.000-45.000

---

## 🎬 Decisão Recomendada

### ✅ **Para AGORA** (MVP):
Implementar **validação local de Codice Fiscale** (código acima).

### ⏳ **Para DEPOIS** (FASE 2):
Deixar integração completa com Agenzia delle Entrate para quando:
- Tivermos 1000+ usuários ativos
- Tivermos receita recorrente
- MVP estiver 100% estável

---

## 📝 Próximos Passos

Quer que eu:
1. ✅ Implemente a validação local de CF agora?
2. ⏳ Documente o processo para FASE 2?
3. 📋 Crie um ticket no roadmap para integração futura?

**Recomendação**: Opção 1 (implementar validação local AGORA) + Opção 3 (documentar para futuro).
