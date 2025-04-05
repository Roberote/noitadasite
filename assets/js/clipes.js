// Sistema de Clipes - Noitada Insana
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const playerCards = document.querySelectorAll('.player-card');
    const clipesGrid = document.getElementById('clipes-grid');
    const currentPlayerSpan = document.getElementById('current-player');
    const uploadForm = document.getElementById('upload-form');
    const uploadStatus = document.getElementById('upload-status');
    const clipeModal = document.getElementById('clipe-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalVideo = document.getElementById('modal-video');
    const clipeTitle = document.getElementById('clipe-title');
    const clipeDate = document.getElementById('clipe-date');
    const deleteBtn = document.getElementById('delete-clipe');
    
    // Variáveis de estado
    let currentPlayer = 'all';
    let currentClipes = [];
    let isAdmin = false; // Mudar para true quando for você
    
    // Verificar se é admin (simplificado - em produção usar autenticação)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        isAdmin = true;
        document.getElementById('upload-area').style.display = 'block';
    }
    
    // Carregar clipes
    function loadClipes(player = 'all') {
        clipesGrid.innerHTML = '<div class="no-clipes">Carregando clipes...</div>';
        
        // Simulação - na prática você faria uma requisição para o servidor
        setTimeout(() => {
            // Isso seria substituído por uma chamada AJAX/Fetch para seu backend
            const mockClipes = getMockClipes(player);
            currentClipes = mockClipes;
            displayClipes(mockClipes);
        }, 500);
    }
    
    // Exibir clipes na grid
    function displayClipes(clipes) {
        if (clipes.length === 0) {
            clipesGrid.innerHTML = '<div class="no-clipes">Nenhum clipe encontrado para este jogador.</div>';
            return;
        }
        
        clipesGrid.innerHTML = '';
        
        clipes.forEach(clipe => {
            const clipeCard = document.createElement('div');
            clipeCard.className = 'clipe-card';
            clipeCard.innerHTML = `
                <video class="clipe-thumbnail" poster="${clipe.thumbnail}">
                    <source src="${clipe.videoUrl}" type="video/mp4">
                </video>
                <div class="clipe-info">
                    <h3>${clipe.title}</h3>
                    <p>${formatDate(clipe.date)} - ${clipe.playerName}</p>
                </div>
            `;
            
            clipeCard.addEventListener('click', () => openModal(clipe));
            clipesGrid.appendChild(clipeCard);
            
            // Carregar thumbnail (simulação)
            setTimeout(() => {
                const video = clipeCard.querySelector('video');
                video.currentTime = 1; // Pegar um frame para thumbnail
            }, 100);
        });
    }
    
    // Abrir modal com o clipe
    function openModal(clipe) {
        modalVideo.src = clipe.videoUrl;
        clipeTitle.textContent = clipe.title;
        clipeDate.textContent = `${formatDate(clipe.date)} - ${clipe.playerName}`;
        
        // Mostrar botão de deletar apenas para admin
        deleteBtn.style.display = isAdmin ? 'block' : 'none';
        deleteBtn.onclick = () => deleteClipe(clipe.id);
        
        clipeModal.style.display = 'block';
    }
    
    // Fechar modal
    closeModal.addEventListener('click', () => {
        modalVideo.pause();
        modalVideo.src = '';
        clipeModal.style.display = 'none';
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === clipeModal) {
            modalVideo.pause();
            modalVideo.src = '';
            clipeModal.style.display = 'none';
        }
    });
    
    // Deletar clipe (simulação)
    function deleteClipe(clipeId) {
        if (confirm('Tem certeza que deseja deletar este clipe?')) {
            // Aqui você faria uma requisição para o backend deletar o arquivo
            currentClipes = currentClipes.filter(c => c.id !== clipeId);
            displayClipes(currentClipes);
            clipeModal.style.display = 'none';
            
            alert('Clipe deletado com sucesso!');
        }
    }
    
    // Formatar data
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
    
    // Selecionar jogador
    playerCards.forEach(card => {
        card.addEventListener('click', function() {
            const player = this.getAttribute('data-player');
            currentPlayer = player;
            
            // Atualizar visualização
            playerCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Atualizar título
            const playerName = this.querySelector('h3').textContent;
            currentPlayerSpan.textContent = playerName.toUpperCase();
            
            // Carregar clipes
            loadClipes(player);
        });
    });
    
    // Upload de clipes
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const player = formData.get('player');
        const fileInput = document.getElementById('clipe-upload');
        
        if (fileInput.files.length === 0) {
            uploadStatus.textContent = 'Selecione um arquivo de vídeo!';
            uploadStatus.style.color = 'red';
            return;
        }
        
        uploadStatus.textContent = 'Enviando clipe...';
        uploadStatus.style.color = 'var(--neon-cyan)';
        
        // Simulação de upload - na prática você enviaria para o servidor
        setTimeout(() => {
            // Aqui você faria uma requisição AJAX/Fetch para upload.php
            const newClipe = {
                id: Date.now(),
                title: fileInput.files[0].name.replace(/\.[^/.]+$/, ""), // Remove extensão
                player: player,
                playerName: document.querySelector(`option[value="${player}"]`).textContent,
                videoUrl: URL.createObjectURL(fileInput.files[0]),
                thumbnail: 'https://via.placeholder.com/300x180/333/666?text=THUMBNAIL',
                date: new Date().toISOString()
            };
            
            currentClipes.unshift(newClipe);
            displayClipes(currentPlayer === 'all' ? currentClipes : currentClipes.filter(c => c.player === currentPlayer));
            
            uploadStatus.textContent = 'Clipe enviado com sucesso!';
            uploadStatus.style.color = 'var(--neon-green)';
            
            // Resetar formulário
            uploadForm.reset();
            
            // Esconder mensagem após 3 segundos
            setTimeout(() => {
                uploadStatus.textContent = '';
            }, 3000);
        }, 1500);
    });
    
    // Carregar todos os clipes inicialmente
    loadClipes();
    
    // Mock de dados - na prática isso viria do seu backend
    function getMockClipes(player) {
        const allPlayers = [
            { id: 'murilo', name: 'Murilo' },
            { id: 'robert', name: 'Robert' },
            { id: 'lucas', name: 'Lucas (Pólias)' },
            { id: 'pelincer', name: 'Pelincer' },
            { id: 'enzo', name: 'Enzo' }
        ];
        
        const mockClipes = [];
        
        // Gerar alguns clipes de exemplo
        allPlayers.forEach(p => {
            const clipeCount = Math.floor(Math.random() * 3) + 2; // 2-4 clipes por jogador
            
            for (let i = 1; i <= clipeCount; i++) {
                mockClipes.push({
                    id: `${p.id}-${i}`,
                    title: `Clipe Incrível ${i}`,
                    player: p.id,
                    playerName: p.name,
                    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', // Vídeo de exemplo
                    thumbnail: `https://picsum.photos/seed/${p.id}-${i}/300/180`, // Thumbnail aleatória
                    date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
                });
            }
        });
        
        return player === 'all' ? mockClipes : mockClipes.filter(c => c.player === player);
    }
});