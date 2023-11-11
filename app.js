const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
const { fetchGPTResponse } = require("./gptBuilderClient");
const {
  buscarProductos,
  listarCategoriasPlatzi,
  listarProductosEscuelaJs,
} = require("./platziApi");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MongoAdapter = require("@bot-whatsapp/database/mongo");

const MONGO_DB_URI = "mongodb://0.0.0.0:27017";
const MONGO_DB_NAME = "db_bot";

// Ejemplo de un flujo modificando para usar fetchGPTResponse
const flowPersonalizado = addKeyword(["keywordEjemplo"]).addAnswer(
  async (message, chat) => {
    // Obtener contexto del chat o datos del usuario si están disponibles
    const contextoChat = chat.ultimoMensaje || "Inicio de la conversación";
    const datosUsuario = chat.datosUsuario || {};

    // Crear un prompt que incluya el contexto
    const prompt = `Basándote en el último mensaje del chat: '${contextoChat}', y los datos del usuario: ${JSON.stringify(
      datosUsuario
    )}, crea una respuesta para el mensaje actual: '${message}'`;

    const gptResponse = await fetchGPTResponse(prompt);
    return ["Respuesta personalizada de GPT-Builder:", gptResponse];
  }
);

// Flujo para buscar productos utilizando la API de Platzi
const flowBusquedaProducto = addKeyword(["buscar", "producto"]).addAnswer(
  async message => {
    try {
      const productos = await buscarProductos(message);
      return [
        "Productos encontrados:",
        productos
          .map(producto => `${producto.name} - ${producto.price}`)
          .join("\n"),
      ];
    } catch (error) {
      console.error("Error al buscar productos:", error);
      return ["Lo siento, ocurrió un error al buscar productos."];
    }
  }
);

// Agrega nuevos flujos para listar categorías y productos
const flowListarCategorias = addKeyword(["categorias"]).addAnswer(async () => {
  try {
    const categorias = await listarCategoriasPlatzi();
    return [
      "Categorías disponibles:",
      categorias.map(categoria => categoria.name).join(", "),
    ];
  } catch (error) {
    console.error("Error al listar categorías:", error);
    return ["Error al listar categorías."];
  }
});

const flowListarProductosEscuelaJs = addKeyword([
  "productos EscuelaJS",
]).addAnswer(async () => {
  try {
    const productos = await listarProductosEscuelaJs();
    return [
      "Productos de EscuelaJS:",
      productos
        .map(producto => `${producto.title} - ${producto.price}`)
        .join("\n"),
    ];
  } catch (error) {
    console.error("Error al listar productos EscuelaJS:", error);
    return ["Error al listar productos de EscuelaJS."];
  }
});

// Flujo principal o menú principal
const flowPrincipal = addKeyword(["inicio", "menu", "ayuda"]).addAnswer(
  "Bienvenido al bot de WhatsApp. Aquí están algunas cosas que puedes hacer:\n" +
    "- Escribe 'productos' para ver nuestro catálogo.\n" +
    "- Escribe 'buscar producto' seguido de lo que buscas.\n" +
    "- Escribe 'categorias' para ver las categorías disponibles.\n" +
    "- Para soporte, escribe 'ayuda'."
);

// Flujos para eCommerce

// Flujos para eCommerce
const flowProductos = addKeyword(["productos", "catalogo"]).addAnswer(
  "🛍️ Aquí puedes ver nuestro catálogo de productos: [Enlace al catálogo]"
);

const flowPedidos = addKeyword(["pedido", "estado", "orden"]).addAnswer(
  "📦 Para revisar el estado de tu pedido, ingresa tu número de orden aquí: [Enlace a seguimiento de pedidos]"
);

const flowEnvios = addKeyword(["envio", "entrega"]).addAnswer(
  "🚚 Información sobre envíos y entregas: [Enlace a información de envíos]"
);

const flowSoporte = addKeyword(["ayuda", "soporte", "contacto"]).addAnswer(
  "🆘 ¿Necesitas ayuda? Contáctanos aquí: [Enlace a soporte al cliente]"
);

// Añadir los flujos al flujo principal
const adapterFlow = createFlow([
  flowPrincipal,
  flowPersonalizado,
  flowListarCategorias,
  flowListarProductosEscuelaJs,
  flowBusquedaProducto,
  flowProductos,
  flowPedidos,
  flowEnvios,
  flowSoporte,
]);

const main = async () => {
  const adapterDB = new MongoAdapter({
    dbUri: MONGO_DB_URI,
    dbName: MONGO_DB_NAME,
  });
  const adapterProvider = createProvider(BaileysProvider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  QRPortalWeb();
};

main();
