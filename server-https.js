// Servidor HTTPS para usar la cámara desde el móvil u otro dispositivo (por la IP del PC).
// Usa un certificado propio (self-signed): el navegador avisará una vez y hay que aceptar.
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = 8443;
const ROOT = __dirname;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.png':  'image/png',
};

const options = {
  key:  fs.readFileSync(path.join(ROOT, 'key.pem')),
  cert: fs.readFileSync(path.join(ROOT, 'cert.pem')),
};

https.createServer(options, (req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Prohibido'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('No encontrado'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  // Buscar la IP de la red local para abrir desde el móvil
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) ips.push(net.address);
    }
  }
  console.log('==============================================');
  console.log('  Filtro Dragon (HTTPS) en marcha');
  console.log('----------------------------------------------');
  console.log('  En este PC:   https://localhost:' + PORT);
  ips.forEach(ip => console.log('  En el movil:  https://' + ip + ':' + PORT));
  console.log('==============================================');
  console.log('Nota: al ser un certificado propio, el navegador');
  console.log('avisara de "no seguro". Pulsa Avanzado > Continuar.');
});
