import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Check, Copy, Download, QrCode, Wifi, X } from 'lucide-react';
import { RESTAURANT_INFO } from '../lib/formatters';

/* global __LAN_IP__ */

function isDockerOrLocalHostname(hostname) {
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
  // Bridges internas do Docker (172.16.0.0 - 172.31.255.255) não são acessíveis pelo telemóvel
  return /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
}

function getDefaultMenuUrl() {
  const envUrl = import.meta.env.VITE_PUBLIC_MENU_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/$/, '');

  const { protocol, hostname, port, origin } = window.location;
  const detectedLanIp = typeof __LAN_IP__ !== 'undefined' ? __LAN_IP__ : '';

  // Se estiver aberto via localhost ou bridge Docker no PC, gera automaticamente o QR Code
  // com o IP Wi-Fi real da rede local para que qualquer telemóvel no mesmo Wi-Fi abra o menu.
  if (isDockerOrLocalHostname(hostname) && detectedLanIp) {
    return `${protocol}//${detectedLanIp}${port ? `:${port}` : ''}`;
  }

  return origin;
}

export default function QRCodeModal({ isOpen, onClose }) {
  const qrContainerRef = useRef(null);
  const [menuUrl, setMenuUrl] = useState(getDefaultMenuUrl);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMenuUrl(getDefaultMenuUrl());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const detectedLanIp = typeof __LAN_IP__ !== 'undefined' ? __LAN_IP__ : '';
  const isLocalNetworkUrl =
    menuUrl.includes('192.168.') ||
    menuUrl.includes('10.') ||
    (detectedLanIp && menuUrl.includes(detectedLanIp));

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencioso caso o navegador bloqueie clipboard
    }
  };

  /**
   * Gera um cartão PNG de alta qualidade pronto para impressão nas mesas
   * combinando o QR Code com o nome e informações do Restaurante Caseirinho.
   */
  const handleDownloadPng = () => {
    const qrCanvas = qrContainerRef.current?.querySelector('canvas');
    if (!qrCanvas) return;

    const width = 900;
    const height = 1150;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d');

    // Fundo escuro elegante
    ctx.fillStyle = '#141816';
    ctx.fillRect(0, 0, width, height);

    // Moldura dourada
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 8;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    // Selo superior vermelho
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 170, 78, 340, 52, 26);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MENU DIGITAL • QR CODE', width / 2, 112);

    // Título do restaurante
    ctx.fillStyle = '#F5F5F4';
    ctx.font = 'bold 58px Georgia, serif';
    ctx.fillText(RESTAURANT_INFO.name, width / 2, 200);

    ctx.fillStyle = '#F59E0B';
    ctx.font = '600 24px sans-serif';
    ctx.fillText('Aponte a câmara para ver o Prato do Dia e o Cardápio', width / 2, 248);

    // Caixa branca de alto contraste para o QR Code
    const boxSize = 540;
    const boxX = (width - boxSize) / 2;
    const boxY = 290;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxSize, boxSize, 28);
    ctx.fill();

    // Desenhar o QR Code no centro da caixa branca
    const padding = 42;
    ctx.drawImage(
      qrCanvas,
      boxX + padding,
      boxY + padding,
      boxSize - padding * 2,
      boxSize - padding * 2
    );

    // Rodapé informativo
    ctx.fillStyle = '#E7E5E4';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(RESTAURANT_INFO.location, width / 2, 910);

    ctx.fillStyle = '#A8A29E';
    ctx.font = '500 22px sans-serif';
    ctx.fillText(
      `${RESTAURANT_INFO.hours}  •  WhatsApp: ${RESTAURANT_INFO.phoneDisplay}`,
      width / 2,
      955
    );

    ctx.fillStyle = '#D97706';
    ctx.font = '600 20px monospace';
    ctx.fillText(menuUrl, width / 2, 1020);

    // Download do ficheiro PNG
    const link = document.createElement('a');
    link.download = 'qrcode-menu-restaurante-caseirinho.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-stone-800 bg-[#191f1b] shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h2 id="qr-modal-title" className="text-base font-bold text-stone-50">
                QR Code das Mesas
              </h2>
              <p className="text-xs text-stone-400">
                Pronto para imprimir e testar no telemóvel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 transition hover:bg-stone-800 hover:text-stone-100"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cartão de pré-visualização */}
        <div className="p-6 text-center">
          <div className="mx-auto rounded-2xl border border-amber-500/30 bg-[#141816] p-5">
            <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              Menu Digital
            </span>
            <p className="mt-2 font-script text-3xl font-bold text-stone-100">
              {RESTAURANT_INFO.shortName}
            </p>
            <p className="mb-4 text-xs text-amber-400/90">
              Aponte a câmara para ver o cardápio
            </p>

            <div
              ref={qrContainerRef}
              className="mx-auto inline-block rounded-2xl bg-white p-4 shadow-lg"
            >
              <QRCodeCanvas
                value={menuUrl || window.location.origin}
                size={210}
                bgColor="#ffffff"
                fgColor="#141816"
                level="H"
              />
            </div>

            {isLocalNetworkUrl && (
              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-200">
                <Wifi className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span>
                  Endereço da rede local Wi-Fi — ligue o telemóvel à mesma rede para abrir.
                </span>
              </div>
            )}

            {/* Campo editável do endereço do QR Code */}
            <div className="mt-3 text-left">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Endereço apontado pelo QR Code
              </label>
              <div className="flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900/80 px-3 py-1.5">
                <input
                  type="url"
                  value={menuUrl}
                  onChange={(e) => setMenuUrl(e.target.value)}
                  className="w-full bg-transparent font-mono text-xs text-stone-200 outline-none"
                  placeholder="http://192.168.0.119:5173"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="shrink-0 rounded-lg p-1.5 text-amber-400 transition hover:bg-stone-800"
                  title="Copiar link"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPng}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-900/20 transition hover:bg-amber-400 active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            <span>Descarregar PNG para Impressão</span>
          </button>
        </div>
      </div>
    </div>
  );
}
