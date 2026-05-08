export default async function handler(req, res) {
  // 1. 設置跨域請求頭 (CORS) - 允許前端任意調用
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. 獲取要代理的目標 URL
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const targetUrl = new URL(url);

    // 3. 動態複製並過濾請求頭 (防止瀏覽器安全請求頭干擾目標伺服器)
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      const lowerKey = key.toLowerCase();
      if (![
        'host', 'connection', 'sec-ch-ua', 'sec-ch-ua-mobile', 
        'sec-ch-ua-platform', 'sec-fetch-dest', 'sec-fetch-mode', 
        'sec-fetch-site', 'referer'
      ].includes(lowerKey)) {
        headers[key] = value;
      }
    }

    // 4. 針對豆瓣相關域名的防盜鏈與偽裝處理
    if (targetUrl.hostname.includes('douban')) {
      headers['Referer'] = 'https://www.douban.com';
      headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    }

    // 5. 發送請求到目標網址
    const response = await fetch(url, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    // 6. 設定回應的 Content-Type 與 Cache-Control
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      res.setHeader('Cache-Control', cacheControl);
    } else {
      // 預設緩存 1 天，省流量且加快速度
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=600');
    }

    // 7. 根據檔案類型進行分流傳回：JSON/Text 直接傳回，二進位圖片轉 Buffer
    if (
      contentType.includes('json') || 
      contentType.includes('text') || 
      contentType.includes('javascript') ||
      contentType.includes('xml')
    ) {
      const text = await response.text();
      return res.status(response.status).send(text);
    } else {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return res.status(response.status).send(buffer);
    }

  } catch (error) {
    console.error('Proxy Error:', error);
    // 💡 關鍵：出錯時必須回傳 JSON 物件，防止前端 JSON.parse 崩潰導致網頁卡死
    return res.status(500).json({ 
      error: 'Proxy failed to fetch target', 
      message: error.message 
    });
  }
}
