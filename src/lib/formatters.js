/**
 * Utilitários de formatação e contacto do Restaurante Caseirinho
 */

export const RESTAURANT_INFO = {
  name: 'Restaurante Caseirinho',
  shortName: 'Caseirinho',
  location: 'Lubango - Centro-Comercial Millennium',
  hours: 'Aberto das 08h - 22h',
  phoneDisplay: '+244 940 901 354',
  whatsappNumber: '244940901354',
  socialHandle: '@RestauranteCaseirinho',
};

export const MENU_CATEGORIES = [
  'Pratos Principais',
  'Pequeno Almoço',
  'Café & Chás',
  'Sumos Naturais',
  'Aperitivos',
  'Sobremesas',
  'Bebidas',
];

/**
 * Formata um valor numérico em Kwanzas (Angola)
 * Ex: 1500 -> "1.500,00 KZ"
 */
export function formatKwanza(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '0,00 KZ';

  const fixed = num.toFixed(2);
  const [integerPart, decimalPart] = fixed.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formattedInteger},${decimalPart} KZ`;
}

/**
 * Gera um link de WhatsApp pré-preenchido para encomendas
 */
export function getWhatsAppUrl(itemName = null, itemPrice = null) {
  const base = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}`;
  const message = itemName
    ? `Olá Restaurante Caseirinho! Gostaria de encomendar: ${itemName} (${formatKwanza(itemPrice)}).`
    : 'Olá Restaurante Caseirinho! Gostaria de fazer uma encomenda a partir do Menu Digital.';

  return `${base}?text=${encodeURIComponent(message)}`;
}
