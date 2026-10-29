export const WA_NUMBER = '56931342699';
export const wa = (msg = 'Hola Ariel!') => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

// Contacto vigente, alineado con la rama cursor/update-contact-email-instagram
// (correo e Instagram nuevos; aún no estaban en main).
export const contact = {
  email: 'arielcampos.dev@gmail.com',
  github: 'https://github.com/ArielCamposs',
  linkedin: 'https://www.linkedin.com/in/ariel-campos-a1688a324/',
  instagram: 'https://instagram.com/arielcampos.dev',
};

export const seo = {
  title: 'Ariel Campos — Escribo software para tu negocio | camposdev',
  description:
    'Desarrollador web en Chile. Soy Ariel Campos y hago sitios, tiendas con pedidos a WhatsApp, sistemas a medida y apps para pymes y startups desde La Ligua, Valparaíso.',
  keywords:
    'desarrollador web Chile, sistemas a medida La Ligua, Ariel Campos, desarrollador full stack, sitios web pymes, apps a medida, Valparaíso',
};

/** Citas de ejemplo. En false la sección no se renderiza. */
export const showTestimonials = false;

/** Nota «cifras: por definir» de cada caso. No se muestra en producción. */
export const showCaseFigures = false;

// Servicios y proyectos: texto real de camposdev.cl
export const services = [
  { n: '01', title: 'Páginas web profesionales', tone: 'papel', sig: '<web />', file: 'web.tsx', text: 'Sitios web rápidos y modernos que ayudan a tu negocio a verse profesional en internet y captar nuevos clientes.', msg: 'Hola Ariel! Quiero una página web para mi negocio. Quisiera conversar contigo.' },
  { n: '02', title: 'Tiendas online con pedidos a WhatsApp', tone: 'amarillo', sig: 'import tienda', file: 'tienda.ts', text: 'Tiendas virtuales fáciles de usar para vender tus productos, con carrito de compras y pedidos directo a tu WhatsApp.', msg: 'Hola Ariel! Quiero una tienda online con pedidos por WhatsApp. Quisiera conversar contigo.' },
  { n: '03', title: 'Sistemas a la medida', tone: 'papel', sig: 'fn sistema()', file: 'sistema.rs', text: 'Programas personalizados para ordenar los datos de tu negocio, gestionar stock o automatizar tareas cotidianas.', msg: 'Hola Ariel! Necesito un sistema a la medida para mi negocio. Quisiera conversar contigo.' },
  { n: '04', title: 'Apps móviles', tone: 'naranja', sig: '<app />', file: 'app.tsx', text: 'Aplicaciones para celular pensadas para uso en terreno: registro de jornadas, inventarios, reportes y gestión operativa desde cualquier lugar.', msg: 'Hola Ariel! Me interesa una app móvil para mi trabajo en terreno. Quisiera conversar contigo.' },
  { n: '05', title: 'Mejora de sitios web', tone: 'papel', sig: 'refactor()', file: 'mejora.diff', text: 'Mejoro la velocidad y el diseño de tu página web actual para que funcione rápido en celulares y no pierdas visitas.', msg: 'Hola Ariel! Ya tengo un sitio web y quiero mejorarlo. Quisiera conversar contigo.' },
];

// Tipos de negocio (filtro de la sección Proyectos)
export const filters = [
  { id: 'todo', label: 'Ver todo' },
  { id: 'restaurante', label: 'Tengo un restaurante' },
  { id: 'tienda', label: 'Tengo una tienda' },
  { id: 'institucion', label: 'Soy una institución o salud' },
  { id: 'startup', label: 'Tengo una startup o SaaS' },
  { id: 'profesional', label: 'Ofrezco servicios profesionales' },
];

// Casos: textos reales de camposdev.cl. "before" es una recreación ilustrativa del problema (sin datos reales).
// Los resultados son cualitativos, tomados de la descripción real; las cifras no existen aún (EJEMPLO).
export const projects = [
  { id: 'postas-desam', title: 'Postas DESAM', category: 'Gestión de inventario', tags: ['institucion'], kind: 'browser',
    shot: '/img/postas-desam.webp', sw: 1024, sh: 489, host: 'privado · acceso con login',
    problem: 'Las postas rurales llevaban el inventario de medicamentos e insumos en registros dispersos. Hacía falta un sistema único para ver existencias, registrar movimientos y evitar quiebres de stock.',
    solution: 'Un sistema único para ver existencias, registrar movimientos y evitar quiebres de stock en cada posta.',
    result: 'Existencias y movimientos a la vista en un solo lugar.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    before: { skin: 'sheet', file: 'inventario_postas_FINAL_v7(1).xlsx', lines: [
      ['m', 'medicamento      stock     posta     obs'],
      ['m', 'paracetamol      ???       rural     revisar'],
      ['x', 'amoxicilina      #REF!     -         '],
      ['m', 'suero fisiol.    ¿quedan?  posta 2   llamar'],
      ['m', 'ibuprofeno       ver hoja3 rural     (otro excel)'],
      ['m', 'insumos          ??        -         preguntar en la posta'],
      ['x', 'cuaderno_posta1.jpg · correo: "¿stock actualizado?"'],
      ['w', 'WARN  registros en varios lugares a la vez'],
      ['e', 'ERR   el quiebre de stock se descubre tarde'] ] } },
  { id: 'conductores-desam', title: 'Conductores DESAM', category: 'Aplicación móvil', tags: ['institucion'], kind: 'phone',
    shot: '/img/conductores-desam.webp', sw: 592, sh: 980, host: 'app móvil · Expo',
    problem: 'Los conductores en terreno reportaban jornadas y novedades a destiempo o de forma incompleta. La app permite registrar el trabajo desde el celular, sin depender de planillas al final del día.',
    solution: 'Una app móvil para registrar la jornada y los reportes desde el celular, directo en terreno.',
    result: 'Jornadas y novedades registradas al momento, sin esperar al cierre del día.',
    tech: ['Expo', 'React Native', 'TypeScript'],
    before: { skin: 'note', file: 'hoja_jornada_papel.jpg', lines: [
      ['m', 'lun   salida __:__   llegada __:__'],
      ['x', '      km ??   novedad: (ilegible)'],
      ['m', 'mar   "después lo anoto"'],
      ['m', 'mié   falta firma'],
      ['x', 'jue   ¿hice la ruta 2 o la 3?'],
      ['m', 'vie   planilla en la mochila…'],
      ['w', 'WARN  el reporte llega a destiempo'],
      ['e', 'ERR   planilla incompleta al final del día'] ] } },
  { id: 'estudio-alvear', title: 'Estudio Alvear', category: 'Landing para abogados', tags: ['profesional'], kind: 'browser',
    shot: '/img/full/estudio-alvear.webp', sw: 1000, sh: 7130, host: 'landing-page-abogados-nu.vercel.app', href: 'https://landing-page-abogados-nu.vercel.app/',
    problem: 'Un despacho pequeño necesitaba una web clara para explicar áreas de práctica y recibir consultas directas, sin una estructura de marketing pesada.',
    solution: 'Una landing clara con las áreas de práctica y un contacto directo, sin estructura de marketing pesada.',
    result: 'Quien llega a la web entiende las áreas de práctica y puede escribir directo.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    before: { skin: 'chat', file: 'consultas_whatsapp.txt', lines: [
      ['m', '[10:02] cliente: hola, ¿en qué áreas trabajan?'],
      ['m', '[10:15] cliente: ¿cuánto sale una consulta?'],
      ['x', '[10:16] cliente: ¿dónde están?'],
      ['m', '[11:40] cliente: ¿atienden hoy?'],
      ['x', '[11:41] cliente: ¿hola?'],
      ['w', 'WARN  no hay una página que explique las áreas'],
      ['e', 'ERR   las mismas preguntas, una y otra vez'] ] } },
  { id: 'nitiv-app', title: 'Nitiv App', category: 'Plataforma SaaS', tags: ['startup', 'institucion'], kind: 'browser',
    shot: '/img/full/nitiv-app.webp', sw: 1000, sh: 653, host: 'nitiv-app-three.vercel.app', href: 'https://nitiv-app-three.vercel.app/login',
    problem: 'Los equipos de convivencia escolar gestionaban casos en Excel y formularios sueltos. Nitiv centraliza registros, protocolos y seguimiento en un panel compartido.',
    solution: 'Un panel compartido que centraliza registros, protocolos y seguimiento de casos.',
    result: 'El equipo ve los casos y su estado de seguimiento en el mismo lugar.',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    before: { skin: 'sheet', file: 'casos_convivencia.xlsx', lines: [
      ['m', 'fecha     caso        estado        resp.'],
      ['m', '??/03     (ver pdf)   en proceso?   —'],
      ['x', '??/04     formulario_(copia 3).pdf'],
      ['m', '??/04     protocolo_final_FINAL.docx'],
      ['m', 'seguimiento: ¿quién lo vio? ¿en qué quedó?'],
      ['w', 'WARN  casos repartidos en Excel y formularios sueltos'],
      ['e', 'ERR   nadie ve el cuadro completo'] ] } },
  { id: 'nitiv-cl', title: 'Nitiv.cl', category: 'Landing corporativa', tags: ['startup'], kind: 'browser',
    shot: '/img/full/nitiv-cl.webp', sw: 1000, sh: 7282, host: 'nitiv.cl', href: 'https://nitiv.cl',
    problem: 'Había que explicar a colegios chilenos qué resuelve Nitiv, cómo funciona y cómo pedir una demo, en un sitio rápido y fácil de compartir.',
    solution: 'Un sitio rápido que explica qué resuelve Nitiv, cómo funciona y cómo pedir una demo.',
    result: 'Un enlace fácil de compartir con los colegios para conocer Nitiv y pedir una demo.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    before: { skin: 'term', file: 'preguntas_colegios.log', lines: [
      ['m', '> ¿qué es Nitiv?'],
      ['m', '> ¿cómo funciona?'],
      ['x', '> ¿cuánto cuesta?'],
      ['m', '> ¿cómo pido una demo?'],
      ['x', '> ¿tienen algo que pueda mandar al director?'],
      ['w', 'WARN  no hay un lugar donde explicarlo'],
      ['e', 'ERR   cada colegio pregunta por su cuenta'] ] } },
  { id: 'bitecraft', title: 'Bitecraft', category: 'E-commerce delivery', tags: ['restaurante', 'tienda'], kind: 'browser',
    shot: '/img/full/bitecraft.webp', sw: 1000, sh: 6577, host: 'tienda-comida-six.vercel.app', href: 'https://tienda-comida-six.vercel.app/',
    problem: 'Un local de comida necesitaba un canal propio para mostrar el menú, armar el carrito y tomar pedidos, en lugar de depender solo de mensajes sueltos.',
    solution: 'Una tienda propia con menú, carrito y gestión de pedidos.',
    result: 'Los pedidos entran por un canal ordenado, no por mensajes sueltos.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    before: { skin: 'chat', file: 'pedidos_chat.txt', lines: [
      ['m', '[20:41] cliente: ¿tienen menú?'],
      ['m', '[20:41] cliente: precio de la hamburguesa?'],
      ['x', '[20:43] cliente: ya, 2… no, mejor 3'],
      ['m', '[20:47] local: ¿qué pedías?'],
      ['x', '[20:52] cliente: ¿y mi pedido?'],
      ['w', 'WARN  pedidos repartidos en mensajes sueltos'],
      ['e', 'ERR   un pedido se pierde entre los chats'] ] } },
  { id: 'tienda-textil', title: 'Tienda textil', category: 'E-commerce artesanal', tags: ['tienda'], kind: 'browser',
    shot: '/img/full/tienda-textil.webp', sw: 1000, sh: 6589, host: 'landingpage-puralana.vercel.app', href: 'https://landingpage-puralana.vercel.app/',
    problem: 'Una tienda artesanal de La Ligua necesitaba mostrar su catálogo, vender con carrito y coordinar pedidos y despacho a Chile por WhatsApp.',
    solution: 'Un catálogo con carrito, con pedidos y despacho a todo Chile coordinados por WhatsApp.',
    result: 'El catálogo está en línea y los pedidos llegan armados a WhatsApp.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    before: { skin: 'chat', file: 'catalogo_fotos_sueltas', lines: [
      ['m', '[foto.jpg] [foto(2).jpg] [foto_final.jpg]'],
      ['m', 'cliente: ¿lo tienes en otro color?'],
      ['x', 'cliente: ¿cuál era el precio?'],
      ['m', 'cliente: ¿envían a Santiago?'],
      ['x', 'yo: espera, reviso el stock…'],
      ['w', 'WARN  el catálogo vive en fotos sueltas'],
      ['e', 'ERR   pedidos y despacho coordinados a mano'] ] } },
  { id: 'tienda-sushi', title: 'Tienda sushi', category: 'Restaurante delivery', tags: ['restaurante', 'tienda'], kind: 'browser',
    shot: '/img/full/tienda-sushi.webp', sw: 1000, sh: 5684, host: 'tienda-sushi.vercel.app', href: 'https://tienda-sushi.vercel.app/',
    problem: 'El restaurante necesitaba un menú online con favoritos y compra directa por WhatsApp, más un aviso claro cuando el local está cerrado.',
    solution: 'Un menú online con favoritos, compra directa por WhatsApp y aviso cuando el local está cerrado.',
    result: 'El cliente elige, guarda favoritos y pide directo; si el local está cerrado, lo sabe antes de pedir.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    before: { skin: 'chat', file: 'chat_local_cerrado.txt', lines: [
      ['m', '[22:58] cliente: ¿están abiertos?'],
      ['m', '[23:02] cliente: ¿hola?'],
      ['x', '[23:05] cliente: ¿tienen el menú?'],
      ['m', '[23:09] cliente: ya, olvídalo'],
      ['w', 'WARN  no hay menú online ni aviso de local cerrado'],
      ['e', 'ERR   el cliente se va sin pedir'] ] } },
];

export const steps = [
  { n: '01', cmd: 'git init', tag: 'main', title: 'Te escucho', text: 'Me cuentas qué vendes, a quién y qué te está costando hoy. Por WhatsApp, sin formularios eternos.' },
  { n: '02', cmd: 'git commit -m "propuesta"', tag: 'plan', title: 'Propuesta clara', text: 'Te envío qué voy a hacer, qué incluye, cuánto cuesta y en qué plazo. Sin letra chica.' },
  { n: '03', cmd: 'npm run build', tag: 'build', title: 'Construyo', text: 'Desarrollo yo mismo, con una versión de prueba en línea para que veas el avance y pidas ajustes mientras lo hago.' },
  { n: '04', cmd: 'git push --tags', tag: 'deploy', title: 'Lanzo y te acompaño', text: 'Publico, reviso que todo funcione en celular y te dejo listo para usarlo. Sigo disponible después.' },
];

// Precios reales (CLP) aprobados por Ariel, siempre "desde"; el valor final depende del alcance.
export const plans = [
  { name: 'Página web', for: 'Para presentarte y recibir consultas', price: '$250.000', msg: 'Hola Ariel! Quiero cotizar una página web.' },
  { name: 'Tienda con pedidos a WhatsApp', for: 'Para vender con carrito y pedidos directos', price: '$350.000', msg: 'Hola Ariel! Quiero cotizar una tienda con pedidos a WhatsApp.' },
  { name: 'Mejora de sitio', for: 'Para que tu web actual sea rápida y se vea bien', note: 'Incluye velocidad, SEO básico y arreglos de diseño.', price: '$80.000', msg: 'Hola Ariel! Quiero cotizar la mejora de mi sitio web.' },
  { name: 'Sistema a medida', for: 'Para ordenar datos, stock o trabajo en terreno', price: '$500.000', msg: 'Hola Ariel! Quiero cotizar un sistema a medida.' },
  { name: 'App móvil', for: 'Para registrar y consultar desde el celular', price: '$600.000', msg: 'Hola Ariel! Quiero cotizar una app móvil.' },
];
export const testimonials = [
  { quote: 'Aquí irá lo que un cliente real cuente sobre el problema que tenía y cómo fue trabajar con Ariel de principio a fin.', who: 'Nombre del cliente', role: 'Rubro · Ciudad' },
  { quote: 'Aquí irá el testimonio de otra persona sobre lo que cambió en su negocio después de lanzar su sitio, tienda o sistema.', who: 'Nombre del cliente', role: 'Rubro · Ciudad' },
];
export const stack = ['HTML5','CSS3','JavaScript','TypeScript','React','Next.js','Astro','Tailwind','PHP','Node.js','Supabase','Firebase','MySQL','GSAP','Expo','Git','GitHub','Vercel'];
