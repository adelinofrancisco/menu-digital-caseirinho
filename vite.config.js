import os from 'node:os';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, list] of Object.entries(interfaces)) {
    if (!list) continue;
    // Ignorar interfaces virtuais/Docker (br-*, docker*, veth*, virbr*)
    if (/^(docker|br-|veth|virbr|lo)/i.test(name)) continue;

    for (const net of list) {
      if (net.family === 'IPv4' && !net.internal) {
        const isWifiOrLan =
          net.address.startsWith('192.168.') ||
          net.address.startsWith('10.') ||
          /^(wl|en|eth)/i.test(name);
        candidates.push({ address: net.address, priority: isWifiOrLan ? 0 : 1 });
      }
    }
  }

  candidates.sort((a, b) => a.priority - b.priority);
  return candidates[0]?.address || '';
}

export default defineConfig(({ command }) => {
  // Injeta o IP Wi-Fi local apenas em desenvolvimento; em produção (Vercel) usa o domínio real
  const lanIp = command === 'serve' ? getLocalNetworkIp() : '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __LAN_IP__: JSON.stringify(lanIp),
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: false,
    },
  };
});
