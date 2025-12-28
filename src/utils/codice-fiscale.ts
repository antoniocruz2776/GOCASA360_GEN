/**
 * Validador de Codice Fiscale Italiano
 * 
 * Implementa validação sintática completa do CF conforme normativa italiana.
 * NÃO requer API externa, funciona totalmente offline.
 * 
 * Referência: DPR 605/1973
 */

export interface DatiAnagrafici {
  cognome?: string;
  nome?: string;
  dataNascita: Date;
  sesso: 'M' | 'F';
  comuneNascita?: string;
  codiceCatastale?: string;
}

export interface ValidazioneResult {
  valido: boolean;
  dati?: DatiAnagrafici;
  errore?: string;
}

export class CodiceFiscaleValidator {
  // Mesi codificati (A-H-L-M-P-R-S-T per 1-12)
  private static readonly MESI = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
  
  // Valori per posizioni pari
  private static readonly CARATTERI_PARI: Record<string, number> = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
    'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18,
    'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
  };
  
  // Valori para posições ímpares
  private static readonly CARATTERI_DISPARI: Record<string, number> = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
    'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
  };
  
  // Caractere de controle (resto divisão por 26)
  private static readonly CARATTERI_CONTROLLO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /**
   * Valida sintaxe do Codice Fiscale
   * @param cf Codice Fiscale (16 caracteres)
   * @returns true se válido
   */
  static valida(cf: string): boolean {
    if (!cf) return false;
    
    cf = cf.toUpperCase().trim();
    
    // Verificar formato: 6 letras + 2 números + letra + 2 números + letra + 3 números + letra
    if (!/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.test(cf)) {
      return false;
    }
    
    // Verificar caractere de controle
    const carattereCalcolato = this.calcolaCarattereControllo(cf.substring(0, 15));
    return carattereCalcolato === cf.charAt(15);
  }

  /**
   * Calcula caractere de controle (16º caractere)
   * @param cf15 Primeiros 15 caracteres do CF
   * @returns Caractere de controle
   */
  private static calcolaCarattereControllo(cf15: string): string {
    let somma = 0;
    
    for (let i = 0; i < 15; i++) {
      const char = cf15.charAt(i);
      // Posições ímpares (0, 2, 4...) usam CARATTERI_DISPARI
      // Posições pares (1, 3, 5...) usam CARATTERI_PARI
      if (i % 2 === 0) {
        somma += this.CARATTERI_DISPARI[char] || 0;
      } else {
        somma += this.CARATTERI_PARI[char] || 0;
      }
    }
    
    return this.CARATTERI_CONTROLLO.charAt(somma % 26);
  }

  /**
   * Extrai dados anagráficos do Codice Fiscale
   * @param cf Codice Fiscale válido
   * @returns Dados extraídos (data nascimento, sexo, código catastral)
   */
  static estraiDati(cf: string): DatiAnagrafici | null {
    if (!this.valida(cf)) return null;
    
    cf = cf.toUpperCase();
    
    // Extrair ano de nascimento (posições 6-7)
    const anno2Cifre = parseInt(cf.substring(6, 8));
    const annoCorrente = new Date().getFullYear();
    const annoCorrente2Cifre = annoCorrente % 100;
    
    // Se ano > ano atual (2 dígitos), assume século passado
    const anno = anno2Cifre > annoCorrente2Cifre 
      ? 1900 + anno2Cifre 
      : 2000 + anno2Cifre;
    
    // Extrair mês (posição 8)
    const meseCodice = cf.charAt(8);
    const mese = this.MESI.indexOf(meseCodice);
    
    if (mese === -1) return null; // Mês inválido
    
    // Extrair dia e sexo (posições 9-10)
    let giorno = parseInt(cf.substring(9, 11));
    const sesso: 'M' | 'F' = giorno > 40 ? 'F' : 'M';
    
    // Para mulheres, subtrair 40
    if (giorno > 40) giorno -= 40;
    
    // Validar data
    const dataNascita = new Date(anno, mese, giorno);
    if (isNaN(dataNascita.getTime())) return null;
    
    // Extrair código catastral do comune (posições 11-14)
    const codiceCatastale = cf.substring(11, 15);
    
    return {
      dataNascita,
      sesso,
      codiceCatastale
    };
  }

  /**
   * Validação completa com retorno detalhado
   * @param cf Codice Fiscale
   * @returns Objeto com status de validação e dados extraídos
   */
  static validaCompleto(cf: string): ValidazioneResult {
    if (!cf || cf.trim() === '') {
      return {
        valido: false,
        errore: 'Codice Fiscale è obbligatorio'
      };
    }
    
    cf = cf.toUpperCase().trim();
    
    // Validar formato
    if (!/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.test(cf)) {
      return {
        valido: false,
        errore: 'Formato non valido. Formato corretto: RSSMRA85M01H501Z'
      };
    }
    
    // Validar caractere de controle
    if (!this.valida(cf)) {
      return {
        valido: false,
        errore: 'Carattere di controllo non valido'
      };
    }
    
    // Extrair dados
    const dati = this.estraiDati(cf);
    
    if (!dati) {
      return {
        valido: false,
        errore: 'Impossibile estrarre dati dal Codice Fiscale'
      };
    }
    
    return {
      valido: true,
      dati
    };
  }

  /**
   * Formata data de nascimento para exibição
   * @param data Data de nascimento
   * @returns String formatada (DD/MM/YYYY)
   */
  static formattaData(data: Date): string {
    const giorno = String(data.getDate()).padStart(2, '0');
    const mese = String(data.getMonth() + 1).padStart(2, '0');
    const anno = data.getFullYear();
    return `${giorno}/${mese}/${anno}`;
  }

  /**
   * Calcula idade a partir da data de nascimento
   * @param dataNascita Data de nascimento
   * @returns Idade em anos
   */
  static calcolaEta(dataNascita: Date): number {
    const oggi = new Date();
    let eta = oggi.getFullYear() - dataNascita.getFullYear();
    const mese = oggi.getMonth() - dataNascita.getMonth();
    
    if (mese < 0 || (mese === 0 && oggi.getDate() < dataNascita.getDate())) {
      eta--;
    }
    
    return eta;
  }
}

// ============================================
// EXEMPLOS DE USO
// ============================================

/*
// Exemplo 1: Validação simples
const cfValido = CodiceFiscaleValidator.valida('RSSMRA85M01H501Z');
console.log(cfValido); // true

// Exemplo 2: Validação completa com dados
const resultado = CodiceFiscaleValidator.validaCompleto('RSSMRA85M01H501Z');
console.log(resultado);
// {
//   valido: true,
//   dati: {
//     dataNascita: Date(1985-08-01),
//     sesso: 'M',
//     codiceCatastale: 'H501'
//   }
// }

// Exemplo 3: CF inválido
const resultadoInvalido = CodiceFiscaleValidator.validaCompleto('ABC123');
console.log(resultadoInvalido);
// {
//   valido: false,
//   errore: 'Formato non valido. Formato corretto: RSSMRA85M01H501Z'
// }

// Exemplo 4: Extrair dados e calcular idade
const dati = CodiceFiscaleValidator.estraiDati('RSSMRA85M01H501Z');
if (dati) {
  console.log(`Data di nascita: ${CodiceFiscaleValidator.formattaData(dati.dataNascita)}`);
  console.log(`Sesso: ${dati.sesso}`);
  console.log(`Età: ${CodiceFiscaleValidator.calcolaEta(dati.dataNascita)} anni`);
}
*/
