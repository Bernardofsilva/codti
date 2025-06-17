// Elementos do DOM
const addVideoBtn = document.getElementById('addVideoBtn');
const addVideoForm = document.getElementById('addVideoForm');
const videoUrlInput = document.getElementById('videoUrl');
const videoTitleInput = document.getElementById('videoTitle');
const videoDescriptionInput = document.getElementById('videoDescription');
const confirmAddBtn = document.getElementById('confirmAdd');
const cancelAddBtn = document.getElementById('cancelAdd');
const videoContainer = document.getElementById('videoContainer');

// Event listeners
addVideoBtn.addEventListener('click', showAddVideoForm);
cancelAddBtn.addEventListener('click', hideAddVideoForm);
confirmAddBtn.addEventListener('click', addNewVideo);
videoUrlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addNewVideo();
    }
});

// Função para mostrar o formulário de adicionar vídeo
function showAddVideoForm() {
    addVideoForm.classList.remove('hidden');
    videoUrlInput.focus();
    addVideoBtn.style.display = 'none';
}

// Função para esconder o formulário de adicionar vídeo
function hideAddVideoForm() {
    addVideoForm.classList.add('hidden');
    videoUrlInput.value = '';
    videoTitleInput.value = '';
    videoDescriptionInput.value = '';
    addVideoBtn.style.display = 'inline-block';
}

// Função para extrair o ID do vídeo do YouTube
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Função para gerar descrição baseada no título do vídeo (focada em MEI)
function generateDescription(title) {
    const descriptions = {
        // Palavras-chave para MEI e impostos
        'mei': 'Conteúdo essencial sobre Microempreendedor Individual. Aprenda as regras, obrigações e benefícios do MEI para manter sua empresa regularizada e aproveitar todas as vantagens.',
        'das': 'Informações importantes sobre o Documento de Arrecadação do Simples Nacional. Entenda como calcular, quando pagar e como manter o DAS-MEI em dia.',
        'imposto': 'Guia completo sobre impostos para MEI. Saiba quais tributos você deve pagar, valores atualizados e como cumprir suas obrigações fiscais corretamente.',
        'declaração': 'Tutorial sobre declarações obrigatórias do MEI. Aprenda a fazer o DASN-SIMEI e outras declarações necessárias para manter sua empresa regular.',
        'receita': 'Orientações sobre relacionamento com a Receita Federal. Entenda procedimentos, prazos e como evitar problemas com o fisco.',
        'cnpj': 'Informações sobre CNPJ para MEI. Desde a abertura até a manutenção, saiba tudo sobre seu registro empresarial.',
        'faturamento': 'Dicas sobre controle de faturamento do MEI. Aprenda a organizar suas vendas e manter o limite anual dentro das regras.',
        'nota fiscal': 'Guia sobre emissão de notas fiscais para MEI. Quando é obrigatório, como emitir e melhores práticas para sua empresa.',
        'contabilidade': 'Orientações contábeis para MEI. Organize suas finanças, controle gastos e mantenha a contabilidade em ordem.',
        'abertura': 'Passo a passo para abrir seu MEI. Documentos necessários, processo online e primeiros passos como microempreendedor.',
        'encerramento': 'Procedimentos para encerrar o MEI. Quando e como fazer, obrigações finais e documentação necessária.',
        'benefícios': 'Conheça os benefícios do MEI. Direitos previdenciários, auxílios e vantagens de ser um microempreendedor individual.'
    };

    const lowerTitle = title.toLowerCase();
    
    // Procura por palavras-chave no título
    for (const [keyword, description] of Object.entries(descriptions)) {
        if (lowerTitle.includes(keyword)) {
            return description;
        }
    }
    
    // Descrição padrão focada em MEI se nenhuma palavra-chave for encontrada
    return 'Conteúdo educativo sobre Microempreendedor Individual. Aprenda sobre obrigações, direitos e melhores práticas para manter seu MEI sempre regularizado e próspero.';
}

// Função para obter informações do vídeo do YouTube
async function getVideoInfo(videoId) {
    try {
        // Como não temos acesso à API do YouTube, vamos simular a obtenção do título
        // Em uma implementação real, você usaria a YouTube Data API
        const simulatedTitles = [
            'Como Calcular o DAS-MEI Corretamente',
            'Declaração Anual do MEI - Passo a Passo',
            'MEI: Tudo Sobre Impostos e Obrigações',
            'Como Abrir um MEI em 2025',
            'Faturamento Limite do MEI - Regras Atualizadas',
            'Nota Fiscal para MEI - Quando é Obrigatória',
            'Benefícios Previdenciários do MEI',
            'Como Encerrar o MEI Corretamente',
            'Contabilidade Simples para MEI',
            'CNPJ MEI - Direitos e Deveres'
        ];
        
        // Seleciona um título aleatório para simular
        const randomTitle = simulatedTitles[Math.floor(Math.random() * simulatedTitles.length)];
        
        return {
            title: randomTitle,
            description: generateDescription(randomTitle)
        };
    } catch (error) {
        console.error('Erro ao obter informações do vídeo:', error);
        return {
            title: 'Vídeo sobre MEI',
            description: 'Conteúdo educativo sobre Microempreendedor Individual. Aprenda sobre obrigações, direitos e melhores práticas para manter seu MEI sempre regularizado.'
        };
    }
}

// Função para criar um novo card de vídeo
function createVideoCard(videoId, title, description) {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card new-video';
    
    videoCard.innerHTML = `
        <div class="video-wrapper">
            <iframe 
                src="https://www.youtube.com/embed/${videoId}" 
                title="${title}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
        <div class="video-description">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
        <button class="delete-btn" onclick="deleteVideo(this)" title="Excluir vídeo">
            🗑️
        </button>
    `;
    
    return videoCard;
}

// Função para excluir um vídeo
function deleteVideo(deleteButton) {
    const videoCard = deleteButton.closest('.video-card');
    const videoTitle = videoCard.querySelector('h3').textContent;
    
    // Confirma a exclusão
    if (confirm(`Tem certeza que deseja excluir o vídeo "${videoTitle}"?`)) {
        // Adiciona animação de saída
        videoCard.style.animation = 'fadeOutScale 0.5s ease-in';
        
        // Remove o elemento após a animação
        setTimeout(() => {
            videoCard.remove();
            showSuccessMessage('Vídeo excluído com sucesso!');
        }, 500);
    }
}

// Função principal para adicionar novo vídeo
async function addNewVideo() {
    const url = videoUrlInput.value.trim();
    const customTitle = videoTitleInput.value.trim();
    const customDescription = videoDescriptionInput.value.trim();
    
    if (!url) {
        alert('Por favor, insira um link do YouTube válido.');
        return;
    }
    
    const videoId = extractVideoId(url);
    
    if (!videoId) {
        alert('Link do YouTube inválido. Por favor, verifique o URL e tente novamente.');
        return;
    }
    
    // Mostra loading no botão
    const originalText = confirmAddBtn.textContent;
    confirmAddBtn.innerHTML = '<span class="loading"></span> Adicionando...';
    confirmAddBtn.disabled = true;
    
    try {
        let title, description;
        
        // Usa título e descrição personalizados se fornecidos, senão gera automaticamente
        if (customTitle && customDescription) {
            title = customTitle;
            description = customDescription;
        } else if (customTitle) {
            title = customTitle;
            description = generateDescription(customTitle);
        } else {
            // Obtém informações simuladas do vídeo
            const videoInfo = await getVideoInfo(videoId);
            title = customTitle || videoInfo.title;
            description = customDescription || videoInfo.description;
        }
        
        // Cria o novo card de vídeo
        const newVideoCard = createVideoCard(videoId, title, description);
        
        // Adiciona o novo vídeo ao container
        videoContainer.appendChild(newVideoCard);
        
        // Esconde o formulário
        hideAddVideoForm();
        
        // Scroll suave para o novo vídeo
        setTimeout(() => {
            newVideoCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
        
        // Mostra mensagem de sucesso
        showSuccessMessage('Vídeo sobre MEI adicionado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao adicionar vídeo:', error);
        alert('Erro ao adicionar o vídeo. Tente novamente.');
    } finally {
        // Restaura o botão
        confirmAddBtn.textContent = originalText;
        confirmAddBtn.disabled = false;
    }
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #00b894, #00a085);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 184, 148, 0.4);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// Adiciona estilos para as animações das mensagens
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Função para validar URLs do YouTube em tempo real
videoUrlInput.addEventListener('input', function() {
    const url = this.value.trim();
    const videoId = extractVideoId(url);
    
    if (url && !videoId) {
        this.style.borderColor = '#ff6b6b';
        this.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
    } else if (url && videoId) {
        this.style.borderColor = '#00b894';
        this.style.boxShadow = '0 0 0 3px rgba(0, 184, 148, 0.1)';
    } else {
        this.style.borderColor = '#e0e0e0';
        this.style.boxShadow = 'none';
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('EASYMEI - Portal de vídeos sobre impostos MEI carregado com sucesso!');
    
    // Adiciona efeito de hover nos vídeos existentes
    const existingVideos = document.querySelectorAll('.video-card');
    existingVideos.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

