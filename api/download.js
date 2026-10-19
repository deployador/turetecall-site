export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.github.com/repos/deployador/turetecall/releases/latest', {
      headers: {
        'User-Agent': 'TureteCall-Website-Vercel',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      return res.redirect(302, 'https://github.com/deployador/turetecall/releases');
    }

    const data = await response.json();
    const exeAsset = Array.isArray(data.assets) 
      ? data.assets.find(a => a.name && a.name.toLowerCase().endsWith('.exe')) 
      : null;

    if (exeAsset && exeAsset.browser_download_url) {
      return res.redirect(302, exeAsset.browser_download_url);
    }

    return res.redirect(302, 'https://github.com/deployador/turetecall/releases');
  } catch (error) {
    return res.redirect(302, 'https://github.com/deployador/turetecall/releases');
  }
}
