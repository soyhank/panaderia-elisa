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
  desc: string;
  price?: number; // soles
  cat: Category;
  img?: string; // /img/*.webp (cuadrada 1:1)
  note?: string;
  featured?: boolean;
}

export const products: Product[] = [
  // Tortas
  { name: 'Torta de chocolate con crema de avellanas', desc: 'Bizcocho húmedo de chocolate relleno y cubierto con crema de avellanas, coronado con fresas frescas.', cat: 'tortas', img: '/img/torta-chocolate-avellanas.webp', note: 'A pedido', featured: true },
  { name: 'Torta personalizada', desc: 'Diseñada a tu medida: elige sabor, relleno, tamaño y decoración para tu ocasión especial.', cat: 'tortas', img: '/img/torta-clasica.webp', note: 'Diseño a tu gusto', featured: true },
  { name: 'Torta de cumpleaños con rosas', desc: 'Cobertura de chocolate con rosas de crema y dedicatoria escrita a mano.', cat: 'tortas', img: '/img/torta-cumple-rosas.webp', note: 'A pedido', featured: true },
  { name: 'Torta 3 leches', desc: 'Bizcocho esponjoso bañado en tres leches y cubierto con merengue suave.', cat: 'tortas', note: 'Entera, a pedido' },
  { name: 'Torta helada', desc: 'Capas de gelatina, crema y bizcocho: fresca, ligera y perfecta para el calor.', cat: 'tortas', note: 'A pedido' },
  { name: 'Selva negra rectangular', desc: 'Chocolate, chantilly y cerezas en la clásica combinación alemana.', price: 12, cat: 'tortas' },

  // Pies y tartas
  { name: 'Pie de limón', desc: 'Base crocante, crema de limón bien fresca y merengue dorado a soplete.', price: 12, cat: 'pies', img: '/img/pie-limon.webp', featured: true },
  { name: 'Tartaleta de fresas', desc: 'Masa quebrada con crema pastelera y fresas frescas glaseadas.', price: 12, cat: 'pies', img: '/img/tartaleta-fresas.webp', featured: true },
  { name: 'Pie de manzana', desc: 'Relleno de manzana con canela sobre masa quebrada hecha en casa.', price: 12, cat: 'pies' },
  { name: 'Pie de arándano', desc: 'Arándanos jugosos y ligeramente ácidos en una base crocante y mantecosa.', price: 12, cat: 'pies' },
  { name: 'Corbatta de manzana', desc: 'Hojaldre relleno de manzana especiada, crocante por fuera y suave por dentro.', price: 10.5, cat: 'pies' },
  { name: 'Apfelstrudel con pasas', desc: 'El clásico strudel austríaco: manzana, canela y pasas en masa filo crujiente.', price: 12, cat: 'pies' },
  { name: 'Apfelstrudel con castañas', desc: 'Strudel de manzana con castañas tostadas para un toque más rústico.', price: 12, cat: 'pies' },
  { name: 'Apfelstrudel con helado', desc: 'Strudel tibio de manzana acompañado con una bola de helado.', price: 15, cat: 'pies' },

  // Postres
  { name: 'Cheesecake de maracuyá', desc: 'Cremoso cheesecake sobre base de galleta con cobertura de maracuyá natural.', price: 12, cat: 'postres', img: '/img/cheesecake-maracuya.webp', featured: true },
  { name: 'Mousse de maracuyá', desc: 'Ligero, aireado y con el punto ácido exacto del maracuyá.', price: 12, cat: 'postres', img: '/img/mousse-maracuya.webp', featured: true },
  { name: 'Mousse de fresa', desc: 'Mousse suave de fresas naturales con glaseado brillante.', price: 12, cat: 'postres', img: '/img/mousse-fresa.webp', featured: true },
  { name: 'Relámpago', desc: 'Masa choux rellena de crema pastelera y bañada en chocolate.', price: 12, cat: 'postres', img: '/img/relampago.webp', featured: true },
  { name: 'Porción tres leches', desc: 'Una generosa porción de nuestra torta tres leches con merengue.', price: 12, cat: 'postres' },
  { name: 'Crema volteada', desc: 'Flan casero de textura sedosa con caramelo dorado.', price: 12, cat: 'postres' },
  { name: 'Budín', desc: 'Budín de pan tradicional, húmedo y aromatizado con canela y pasas.', cat: 'postres', note: 'Consultar' },

  // Piononos
  { name: 'Pionono con manjar', desc: 'Pionono enrollado y relleno de manjar blanco, espolvoreado con azúcar.', price: 10.5, cat: 'piononos' },
  { name: 'Pionono con durazno y chantilly', desc: 'Bizcocho suave con chantilly y trozos de durazno en almíbar.', price: 12, cat: 'piononos' },
  { name: 'Pionono de chocolate y crema de avellanas', desc: 'Pionono de chocolate relleno con crema de avellanas.', cat: 'piononos', note: 'Consultar' },

  // Brownies y kekes
  { name: 'Brownie', desc: 'Denso, húmedo y con intenso sabor a chocolate.', price: 10.5, cat: 'brownies' },
  { name: 'Blondie', desc: 'La versión rubia del brownie: mantequilla, vainilla y chispas de chocolate.', price: 10.5, cat: 'brownies' },
  { name: 'Chocobrownie con fudge', desc: 'Brownie doble chocolate cubierto con fudge cremoso.', price: 14.5, cat: 'brownies' },
  { name: 'Carrot cake con frosting', desc: 'Keke de zanahoria con nueces y frosting de queso crema.', price: 14.5, cat: 'brownies' },

  // Bocaditos y panes
  { name: 'Bocaditos dulces personalizados', desc: 'Mini bocaditos glaseados y decorados con los colores y motivos de tu evento.', cat: 'bocaditos', img: '/img/bocaditos.webp', note: 'Por docena, a pedido', featured: true },
  { name: 'Panes dulces de la casa', desc: 'Brioches y panes dulces recién horneados, con crema de pistacho y más variedades.', cat: 'bocaditos', img: '/img/pan-dulce-pistacho.webp', note: 'Consultar variedades', featured: true },
  { name: 'Rollos de canela', desc: 'Rollos esponjosos de canela con plátano caramelizado.', cat: 'bocaditos', img: '/img/rollos-canela.webp', note: 'Consultar', featured: true },
  { name: 'Bocaditos salados', desc: 'Empanaditas, enrolladitos y bocaditos salados por docena para tus reuniones.', cat: 'bocaditos', note: 'Por docena, a pedido' },
];

export const fmt = (n: number) => `S/ ${n.toFixed(2)}`;
