export type Category = 'tortas' | 'pies' | 'postres' | 'piononos' | 'brownies' | 'bocaditos';

export const categories: { id: Category | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todo' },
  { id: 'tortas', label: 'Tortas' },
  { id: 'pies', label: 'Pies y tartas' },
  { id: 'postres', label: 'Postres' },
  { id: 'piononos', label: 'Piononos' },
  { id: 'brownies', label: 'Brownies y kekes' },
  { id: 'bocaditos', label: 'Bocaditos y panes' },
];

export interface Product {
  name: string;
  price?: number; // soles
  cat: Category;
  img?: string; // /img/*.webp (cuadrada 1:1)
  note?: string;
  featured?: boolean;
}

export const products: Product[] = [
  // Tortas
  { name: 'Torta de chocolate con crema de avellanas', cat: 'tortas', img: '/img/torta-chocolate-avellanas.webp', note: 'A pedido', featured: true },
  { name: 'Torta personalizada', cat: 'tortas', img: '/img/torta-clasica.webp', note: 'Diseño a tu gusto', featured: true },
  { name: 'Torta de cumpleaños con rosas', cat: 'tortas', img: '/img/torta-cumple-rosas.webp', note: 'A pedido', featured: true },
  { name: 'Torta 3 leches', cat: 'tortas', note: 'Entera, a pedido' },
  { name: 'Torta helada', cat: 'tortas', note: 'A pedido' },
  { name: 'Selva negra rectangular', price: 12, cat: 'tortas' },

  // Pies y tartas
  { name: 'Pie de limón', price: 12, cat: 'pies', img: '/img/pie-limon.webp', featured: true },
  { name: 'Tartaleta de fresas', price: 12, cat: 'pies', img: '/img/tartaleta-fresas.webp', featured: true },
  { name: 'Pie de manzana', price: 12, cat: 'pies' },
  { name: 'Pie de arándano', price: 12, cat: 'pies' },
  { name: 'Corbatta de manzana', price: 10.5, cat: 'pies' },
  { name: 'Apfelstrudel con pasas', price: 12, cat: 'pies' },
  { name: 'Apfelstrudel con castañas', price: 12, cat: 'pies' },
  { name: 'Apfelstrudel con helado', price: 15, cat: 'pies' },

  // Postres
  { name: 'Cheesecake de maracuyá', price: 12, cat: 'postres', img: '/img/cheesecake-maracuya.webp', featured: true },
  { name: 'Mousse de maracuyá', price: 12, cat: 'postres', img: '/img/mousse-maracuya.webp', featured: true },
  { name: 'Mousse de fresa', price: 12, cat: 'postres', img: '/img/mousse-fresa.webp', featured: true },
  { name: 'Relámpago', price: 12, cat: 'postres', img: '/img/relampago.webp', featured: true },
  { name: 'Porción tres leches', price: 12, cat: 'postres' },
  { name: 'Crema volteada', price: 12, cat: 'postres' },
  { name: 'Budín', cat: 'postres', note: 'Consultar' },

  // Piononos
  { name: 'Pionono con manjar', price: 10.5, cat: 'piononos' },
  { name: 'Pionono con durazno y chantilly', price: 12, cat: 'piononos' },
  { name: 'Pionono de chocolate y crema de avellanas', cat: 'piononos', note: 'Consultar' },

  // Brownies y kekes
  { name: 'Brownie', price: 10.5, cat: 'brownies' },
  { name: 'Blondie', price: 10.5, cat: 'brownies' },
  { name: 'Chocobrownie con fudge', price: 14.5, cat: 'brownies' },
  { name: 'Carrot cake con frosting', price: 14.5, cat: 'brownies' },

  // Bocaditos y panes
  { name: 'Bocaditos dulces personalizados', cat: 'bocaditos', img: '/img/bocaditos.webp', note: 'Por docena, a pedido', featured: true },
  { name: 'Panes dulces de la casa', cat: 'bocaditos', img: '/img/pan-dulce-pistacho.webp', note: 'Consultar variedades', featured: true },
  { name: 'Rollos de canela', cat: 'bocaditos', img: '/img/rollos-canela.webp', note: 'Consultar', featured: true },
  { name: 'Bocaditos salados', cat: 'bocaditos', note: 'Por docena, a pedido' },
];

export const fmt = (n: number) => `S/ ${n.toFixed(2)}`;
