# 🌐 TureteCall - Site Oficial

Site oficial e landing page moderna da **TureteCall**, desenvolvido com foco em estética visual de alto nível, glassmorphism espacial, efeitos 3D responsivos e compatibilidade instantânea com **Vercel** e **GitHub Pages**.

---

## 🚀 Como testar localmente

Você pode abrir o site de duas formas:

1. **Via Servidor Local:**
   Basta rodar no seu terminal dentro desta pasta:
   ```bash
   npx serve .
   ```
   Ou simplesmente usar o link local iniciado pelo assistente: `http://localhost:3000` (ou a porta informada).

2. **Direto no Navegador:**
   Dê um duplo clique no arquivo `index.html`.

---

## ⚙️ Como Personalizar Links e Vídeo (`config.js`)

Abra o arquivo `config.js` e configure:

### 1. Link de Download do GitHub Releases:
```javascript
githubDownloadUrl: "https://github.com/SEU-USUARIO/turetecall/releases/latest/download/TureteCall.exe"
```
> Substitua `SEU-USUARIO` pelo seu usuário do GitHub onde você publica os releases. O GitHub sempre redirecionará automaticamente para o arquivo `TureteCall.exe` da versão mais recente publicada!

### 2. Vídeo Tutorial do YouTube:
```javascript
youtubeVideoId: "COLE_O_ID_OU_A_URL_DO_SEU_VIDEO_AQUI"
```
> Exemplo: `"dQw4w9WgXcQ"` ou `"https://www.youtube.com/watch?v=dQw4w9WgXcQ"`.
> Quando você preencher, tanto o player quanto o modal "Ver Tutorial" reproduzirão o vídeo oficial!

---

## ☁️ Como hospedar na Vercel (Passo a Passo)

1. Suba esta pasta `site-oficial` para um repositório no seu GitHub (pode ser um repositório próprio como `turetecall-site`).
2. Acesse [vercel.com](https://vercel.com) e faça login com seu GitHub.
3. Clique em **"Add New Project"** e selecione o repositório.
4. Clique em **"Deploy"**.
5. **Pronto!** O Vercel gerará automaticamente um link permanente gratuito (ex: `turetecall.vercel.app`) com HTTPS e CDN ultra-rápida.
