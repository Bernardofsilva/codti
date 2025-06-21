// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Carrega o conteúdo MEI do arquivo JSON
    carregarConteudoMEI();
    
    // Configura o verificador de URLs
    configurarVerificadorURL();
    
    // Configura navegação suave
    configurarNavegacaoSuave();
});

// Função para carregar conteúdo MEI do arquivo JSON
async function carregarConteudoMEI() {
    try {
        const response = await fetch('mei-content.json');
        const data = await response.json();
        
        const container = document.getElementById('mei-content');
        
        data.conteudoMEI.forEach(item => {
            const card = criarCardConteudo(item);
            container.appendChild(card);
        });
        
        console.log('Conteúdo MEI carregado com sucesso!');
    } catch (error) {
        console.error('Erro ao carregar conteúdo MEI:', error);
        mostrarErroCarregamento();
    }
}

// Função para criar card de conteúdo
function criarCardConteudo(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.id = item.id;
    
    const titulo = document.createElement('h3');
    titulo.textContent = item.titulo;
    
    const descricao = document.createElement('p');
    descricao.textContent = item.descricao;
    
    const lista = document.createElement('ul');
    item.topicos.forEach(topico => {
        const listItem = document.createElement('li');
        listItem.textContent = topico;
        lista.appendChild(listItem);
    });
    
    card.appendChild(titulo);
    card.appendChild(descricao);
    card.appendChild(lista);
    
    return card;
}

// Função para mostrar erro de carregamento
function mostrarErroCarregamento() {
    const container = document.getElementById('mei-content');
    container.innerHTML = `
        <div class="content-card" style="text-align: center; color: #e74c3c;">
            <h3>Erro ao carregar conteúdo</h3>
            <p>Não foi possível carregar as informações sobre MEI. Verifique se o arquivo mei-content.json está disponível.</p>
        </div>
    `;
}

// Função para configurar o verificador de URLs
function configurarVerificadorURL() {
    const form = document.getElementById('url-form');
    const input = document.getElementById('url-input');
    const resultado = document.getElementById('resultado');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const url = input.value.trim();
        
        if (!url) {
            mostrarResultado('Por favor, digite uma URL válida.', 'info');
            return;
        }
        
        verificarURLGoverno(url);
    });
    
    // Limpa resultado quando usuário digita
    input.addEventListener('input', function() {
        resultado.innerHTML = '';
        resultado.className = 'resultado';
    });
}

// Função para verificar se a URL é do governo
function verificarURLGoverno(url) {
    const resultado = document.getElementById('resultado');
    
    try {
        // Remove protocolo se presente para análise
        let urlLimpa = url.toLowerCase();
        if (urlLimpa.startsWith('http://') || urlLimpa.startsWith('https://')) {
            urlLimpa = urlLimpa.replace(/^https?:\/\//, '');
        }
        
        // Remove www. se presente
        if (urlLimpa.startsWith('www.')) {
            urlLimpa = urlLimpa.replace(/^www\./, '');
        }
        
        // Remove path, query e fragment
        urlLimpa = urlLimpa.split('/')[0];
        urlLimpa = urlLimpa.split('?')[0];
        urlLimpa = urlLimpa.split('#')[0];
        
        // Verifica se termina com .gov.br
        if (urlLimpa.endsWith('.gov.br') || urlLimpa === 'gov.br') {
            mostrarResultado(
                `✅ Este é um site oficial do governo brasileiro!<br><strong>Domínio:</strong> ${urlLimpa}`,
                'sucesso'
            );
        } else {
            mostrarResultado(
                `❌ Este não é um site oficial do governo brasileiro.<br><strong>Domínio:</strong> ${urlLimpa}<br><em>Sites oficiais do governo terminam com .gov.br</em>`,
                'erro'
            );
        }
        
    } catch (error) {
        mostrarResultado('Erro ao processar a URL. Verifique se está no formato correto.', 'erro');
    }
}

// Função para mostrar resultado da verificação
function mostrarResultado(mensagem, tipo) {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = mensagem;
    resultado.className = `resultado ${tipo}`;
    
    // Scroll suave para o resultado
    resultado.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// Função para configurar navegação suave
function configurarNavegacaoSuave() {
    const links = document.querySelectorAll('nav a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Adiciona classe ativa temporariamente
                this.classList.add('active');
                setTimeout(() => {
                    this.classList.remove('active');
                }, 1000);
            }
        });
    });
}

// Função para validar URL (auxiliar)
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        // Tenta adicionar protocolo se não tiver
        try {
            new URL('http://' + string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// Função para adicionar animação aos cards quando entram na viewport
function observarCards() {
    const cards = document.querySelectorAll('.link-card, .content-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Executa animações após carregamento do conteúdo
setTimeout(observarCards, 500);

// Adiciona funcionalidade de busca rápida (bonus)
function adicionarBuscaRapida() {
    // Cria campo de busca
    const nav = document.querySelector('nav .container ul');
    const searchLi = document.createElement('li');
    searchLi.innerHTML = `
        <input type="text" id="busca-rapida" placeholder="Buscar..." 
               style="padding: 0.5rem; border-radius: 5px; border: 1px solid #ccc; background: white;">
    `;
    nav.appendChild(searchLi);
    
    const searchInput = document.getElementById('busca-rapida');
    
    searchInput.addEventListener('input', function() {
        const termo = this.value.toLowerCase();
        const cards = document.querySelectorAll('.link-card, .content-card');
        
        cards.forEach(card => {
            const texto = card.textContent.toLowerCase();
            if (texto.includes(termo) || termo === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Adiciona busca após carregamento
setTimeout(adicionarBuscaRapida, 1000);

console.log('Portal MEI carregado com sucesso!');

