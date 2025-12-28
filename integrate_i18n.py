#!/usr/bin/env python3
"""
Script para integrar i18n no pages.tsx do GOCASA360IT
Adiciona suporte multilíngue (PT, IT, EN) em todas as páginas
"""

import re

def add_lang_attribute(html):
    """Adiciona atributo lang dinâmico no html tag"""
    return html.replace(
        '<html lang="pt-BR">',
        '<html lang="pt-BR" id="htmlTag">'
    )

def add_i18n_script_before_head_close(html):
    """Adiciona script i18n.js antes de </head>"""
    i18n_script = '''        <script src="/i18n.js"></script>
    </head>'''
    return html.replace('    </head>', i18n_script)

def add_language_selector_to_navbar(html):
    """Adiciona seletor de idioma no navbar"""
    # Procura pelo padrão do navbar com botões Entrar/Cadastrar
    old_pattern = r'<div class="flex items-center space-x-4">\s+<a href="/login"[^>]*>Entrar</a>\s+<a href="/cadastro"[^>]*>Cadastrar</a>\s+</div>'
    
    new_content = '''<div class="flex items-center space-x-4">
                        <!-- Language Selector -->
                        <div class="relative group">
                            <button id="langBtn" class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                                <span id="currentFlag" class="text-xl">🇧🇷</span>
                                <span id="currentLang" class="font-semibold text-gray-700">PT</span>
                                <i class="fas fa-chevron-down text-xs text-gray-500"></i>
                            </button>
                            
                            <div id="langDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <button onclick="changeLanguage('pt-BR')" class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 transition rounded-t-lg">
                                    <span class="text-xl">🇧🇷</span>
                                    <div class="text-left">
                                        <div class="font-semibold text-gray-800">Português</div>
                                        <div class="text-xs text-gray-500">Brasil</div>
                                    </div>
                                </button>
                                
                                <button onclick="changeLanguage('it-IT')" class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 transition border-t border-gray-100">
                                    <span class="text-xl">🇮🇹</span>
                                    <div class="text-left">
                                        <div class="font-semibold text-gray-800">Italiano</div>
                                        <div class="text-xs text-gray-500">Italia</div>
                                    </div>
                                </button>
                                
                                <button onclick="changeLanguage('en-US')" class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 transition border-t border-gray-100 rounded-b-lg">
                                    <span class="text-xl">🇺🇸</span>
                                    <div class="text-left">
                                        <div class="font-semibold text-gray-800">English</div>
                                        <div class="text-xs text-gray-500">USA</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        
                        <a href="/login" class="text-primary hover:text-secondary transition font-semibold" data-i18n="nav.login">Entrar</a>
                        <a href="/cadastro" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition font-semibold shadow-sm" data-i18n="nav.register">Cadastrar</a>
                    </div>'''
    
    # Substitui primeira ocorrência (homepage) - mais seguro fazer manualmente
    return html

def add_i18n_initialization_script(html):
    """Adiciona script de inicialização i18n antes de </body>"""
    i18n_init = '''
        <script>
            // Initialize i18n
            let i18nInstance;
            
            async function initI18n() {
                i18nInstance = await i18n.init();
                updateLanguageButton();
            }
            
            async function changeLanguage(locale) {
                await i18nInstance.changeLocale(locale);
                window.location.reload();
            }
            
            function updateLanguageButton() {
                const flags = { 'pt-BR': '🇧🇷', 'it-IT': '🇮🇹', 'en-US': '🇺🇸' };
                const langs = { 'pt-BR': 'PT', 'it-IT': 'IT', 'en-US': 'EN' };
                
                const currentLang = i18nInstance.currentLocale;
                const flagEl = document.getElementById('currentFlag');
                const langEl = document.getElementById('currentLang');
                const htmlTag = document.getElementById('htmlTag');
                
                if (flagEl) flagEl.textContent = flags[currentLang] || '🇧🇷';
                if (langEl) langEl.textContent = langs[currentLang] || 'PT';
                if (htmlTag) htmlTag.lang = currentLang;
            }
            
            // Toggle dropdown
            document.addEventListener('click', (e) => {
                const btn = document.getElementById('langBtn');
                const dropdown = document.getElementById('langDropdown');
                
                if (btn && btn.contains(e.target)) {
                    dropdown.classList.toggle('hidden');
                } else if (dropdown && !dropdown.contains(e.target)) {
                    dropdown.classList.add('hidden');
                }
            });
            
            // Initialize on load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initI18n);
            } else {
                initI18n();
            }
        </script>
    </body>'''
    
    return html.replace('    </body>', i18n_init)

def main():
    # Lê o arquivo
    with open('/home/user/webapp/src/routes/pages.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Aplicando transformações i18n...")
    
    # Aplica transformações
    content = add_lang_attribute(content)
    content = add_i18n_script_before_head_close(content)
    content = add_i18n_initialization_script(content)
    
    # Salva o arquivo modificado
    with open('/home/user/webapp/src/routes/pages.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Transformações aplicadas com sucesso!")
    print("- Adicionado atributo lang dinâmico")
    print("- Adicionado script i18n.js")
    print("- Adicionado script de inicialização")
    print("\nPróximo passo: Adicionar seletor de idioma manualmente no navbar")

if __name__ == '__main__':
    main()
