/**
 * =========================================================================
 *  TureteCall - Lógica do Site Oficial, Download Automático e 3D Parallax
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.TURETE_CONFIG || {};

  // -----------------------------------------------------------------------
  // 1. DOWNLOAD AUTOMÁTICO DA ÚLTIMA VERSÃO COM 1 CLIQUE
  // -----------------------------------------------------------------------
  const btnDownload = document.getElementById('btn-download');
  let resolvedDownloadUrl = '';
  let latestTagName = '';
  let isFetchingRelease = false;

  const repoUser = config.githubUser || 'deployador';
  const repoName = config.githubRepo || 'turetecall';
  const releasesApiUrl = `https://api.github.com/repos/${repoUser}/${repoName}/releases/latest`;
  const fallbackReleasesUrl = `https://github.com/${repoUser}/${repoName}/releases`;

  let latestFileName = 'TureteCall-v230.exe';

  // Função para buscar o executável mais recente na API do GitHub
  async function fetchLatestRelease() {
    if (isFetchingRelease) return;
    isFetchingRelease = true;

    try {
      const response = await fetch(releasesApiUrl, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (!response.ok) throw new Error('Falha ao consultar releases do GitHub');

      const data = await response.json();
      latestTagName = data.tag_name || '';

      // Procura o asset que termina em .exe
      if (Array.isArray(data.assets)) {
        const exeAsset = data.assets.find(asset => 
          asset.name && asset.name.toLowerCase().endsWith('.exe')
        );

        if (exeAsset && exeAsset.browser_download_url) {
          resolvedDownloadUrl = exeAsset.browser_download_url;
          latestFileName = exeAsset.name;
          console.log(`[TureteCall] Último release detectado: ${latestTagName} (${exeAsset.name})`);
          
          if (btnDownload) {
            btnDownload.setAttribute('href', resolvedDownloadUrl);
            btnDownload.setAttribute('download', latestFileName);
            btnDownload.setAttribute('title', `Baixar TureteCall ${latestTagName} (${latestFileName})`);
          }
        }
      }
    } catch (err) {
      console.warn('[TureteCall] Erro ao buscar release automática, usando fallback:', err);
      resolvedDownloadUrl = fallbackReleasesUrl;
    } finally {
      isFetchingRelease = false;
    }
  }

  // Inicia a busca silenciosa em segundo plano no carregamento da página
  fetchLatestRelease();

  // Clique no botão de download
  if (btnDownload) {
    btnDownload.addEventListener('click', async (e) => {
      // Se a URL do executável já está pronta e com nome correto, deixa o download nativo acontecer
      if (resolvedDownloadUrl && resolvedDownloadUrl.includes('.exe')) {
        return; // O navegador baixa direto com o nome do arquivo preservado
      }

      // Se ainda estava carregando na fração de segundo do clique:
      e.preventDefault();
      const textElem = btnDownload.querySelector('.btn-text');
      const originalText = textElem ? textElem.textContent : 'Baixar Gratuitamente';
      if (textElem) textElem.textContent = 'Iniciando download...';

      if (!resolvedDownloadUrl) {
        await fetchLatestRelease();
      }

      if (textElem) textElem.textContent = originalText;

      if (resolvedDownloadUrl && resolvedDownloadUrl.includes('.exe')) {
        const tempLink = document.createElement('a');
        tempLink.href = resolvedDownloadUrl;
        tempLink.setAttribute('download', latestFileName);
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      } else {
        window.open(fallbackReleasesUrl, '_blank');
      }
    });
  }

  // -----------------------------------------------------------------------
  // 2. EXTRAÇÃO E GERENCIAMENTO DO VÍDEO DO YOUTUBE
  // -----------------------------------------------------------------------
  function extractYouTubeId(urlOrId) {
    if (!urlOrId || typeof urlOrId !== 'string') return '';
    const trimmed = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : '';
  }

  const currentVideoId = extractYouTubeId(config.youtubeVideoId);

  // -----------------------------------------------------------------------
  // 3. PLAYER INLINE NO CARD DA DIREITA (thumbnail ou iframe embutido)
  // -----------------------------------------------------------------------
  const inlineEmbed = document.getElementById('inline-video-embed');
  const centerPlayBtnEl = document.getElementById('center-play-btn');
  const thumbImg = document.querySelector('.video-thumb-img');

  if (currentVideoId && inlineEmbed) {
    // Troca a thumbnail estática pela miniatura real do YouTube
    if (thumbImg) {
      thumbImg.src = `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`;
      thumbImg.alt = 'Miniatura do vídeo tutorial TureteCall';
    }
  }

  // -----------------------------------------------------------------------
  // 3. MODAL / LIGHTBOX DE VÍDEO TUTORIAL EM TELA CHEIA
  // -----------------------------------------------------------------------
  const videoModal = document.getElementById('video-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContainer = document.getElementById('modal-player-container');
  const btnTutorial = document.getElementById('btn-tutorial');
  const centerPlayBtn = document.getElementById('center-play-btn');
  const ctrlFullscreen = document.getElementById('ctrl-fullscreen');
  const videoScreen = document.getElementById('video-screen');

  function openVideoModal() {
    if (!videoModal) return;

    if (currentVideoId) {
      modalContainer.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1" 
          title="TureteCall Tutorial" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    } else {
      modalContainer.innerHTML = `
        <div class="placeholder-state">
          <span class="placeholder-badge">Espaço Reservado</span>
          <h2 class="placeholder-title">Seu Vídeo Tutorial Aqui</h2>
          <p class="placeholder-desc">
            Quando você gravar o vídeo e subir no YouTube, basta me enviar o link aqui no chat que eu adiciono no <code>config.js</code> para você!
          </p>
        </div>
      `;
    }

    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    if (modalContainer) modalContainer.innerHTML = '';
    
    if (window.innerWidth > 980 && window.innerHeight > 760) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  if (btnTutorial) btnTutorial.addEventListener('click', openVideoModal);
  if (centerPlayBtn) centerPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openVideoModal();
  });
  if (ctrlFullscreen) ctrlFullscreen.addEventListener('click', openVideoModal);
  if (videoScreen) videoScreen.addEventListener('click', openVideoModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  // -----------------------------------------------------------------------
  // 4. EFEITO PARALLAX 3D TILT COM O MOVIMENTO DO MOUSE
  // -----------------------------------------------------------------------
  const tiltWrapper = document.getElementById('tilt-wrapper');
  
  if (tiltWrapper && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth) * 2 - 1;
      const yNorm = (e.clientY / innerHeight) * 2 - 1;

      targetX = -yNorm * 5.5;
      targetY = xNorm * 6.5;
    });

    function animateTilt() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      tiltWrapper.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
      requestAnimationFrame(animateTilt);
    }

    animateTilt();
  }

  // -----------------------------------------------------------------------
  // 5. CANVAS DE PARTÍCULAS AMBIENTAIS E VAGALUMES SUAVES
  // -----------------------------------------------------------------------
  const canvas = document.getElementById('ambient-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = 38;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        color: Math.random() > 0.4 ? 'rgba(0, 210, 255,' : 'rgba(255, 180, 100,',
        alpha: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.4 - 0.1,
        alphaSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.alphaSpeed;

        if (p.alpha > 0.75 || p.alpha < 0.15) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${Math.max(0, p.alpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color.includes('255, 180') ? 'rgba(255, 180, 100, 0.6)' : 'rgba(0, 210, 255, 0.8)';
        ctx.fill();
      }

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

  // -----------------------------------------------------------------------
  // 6. CONTROLES SIMULADOS DO PLAYER INLINE
  // -----------------------------------------------------------------------
  const ctrlPlayPause = document.getElementById('ctrl-play-pause');
  if (ctrlPlayPause) {
    ctrlPlayPause.addEventListener('click', (e) => {
      e.stopPropagation();
      openVideoModal();
    });
  }

  console.log(`%c TureteCall %c Conectado ao repositório deployador/turetecall `, 'background: #0284c7; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;', 'background: #080c14; color: #00d2ff; padding: 4px 8px; border-radius: 0 4px 4px 0;');
});
