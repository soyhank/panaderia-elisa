export const site = {
  name: 'Elisa Sabor & Arte',
  short: 'Elisa',
  tagline: 'El arte de endulzar tu vida',
  claim: 'Un sabor para todos',
  description:
    'Panadería y pastelería artesanal. Panes, postres, bocaditos dulces y salados y tortas personalizadas al gusto de nuestros clientes. Pedidos por WhatsApp.',
  phone: '974276358',
  phoneIntl: '51974276358',
  handle: 'elisasaboryarte',
  url: 'https://panaderia-elisa.vercel.app',
  social: {
    instagram: 'https://www.instagram.com/elisasaboryarte',
    tiktok: 'https://www.tiktok.com/@elisasaboryarte',
    facebook: 'https://www.facebook.com/elisasaboryarte',
  },
};

export function wa(text = 'Hola Elisa 👋, quisiera hacer un pedido.') {
  return `https://wa.me/${site.phoneIntl}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#carta', label: 'Carta' },
  { href: '#tortas', label: 'Tortas personalizadas' },
  { href: '#porque', label: 'Por qué elegirnos' },
  { href: '#contacto', label: 'Contacto' },
];
