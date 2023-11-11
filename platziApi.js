const axios = require("axios");

const platziApiUrl = "https://fakeapi.platzi.com/api/v1/";
const escuelaJsApiUrl = "https://api.escuelajs.co/api/v1/";

// Función para buscar productos en Platzi API
async function buscarProductos(query, categoryId, minPrice, maxPrice) {
  try {
    let url = `${platziApiUrl}products-filter?search=${query}`;
    if (categoryId) url += `&category=${categoryId}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error al realizar la petición a Platzi API:", error);
    throw error;
  }
}

// Función para listar categorías en Platzi API
async function listarCategoriasPlatzi() {
  try {
    const response = await axios.get(`${platziApiUrl}categories`);
    return response.data;
  } catch (error) {
    console.error("Error al listar categorías en Platzi API:", error);
    throw error;
  }
}

// Función para listar productos en Escuela JS API
async function listarProductosEscuelaJs() {
  try {
    const response = await axios.get(`${escuelaJsApiUrl}products`);
    return response.data;
  } catch (error) {
    console.error("Error al listar productos en Escuela JS API:", error);
    throw error;
  }
}

// Función para listar categorías en Escuela JS API
async function listarCategoriasEscuelaJs() {
  try {
    const response = await axios.get(`${escuelaJsApiUrl}categories`);
    return response.data;
  } catch (error) {
    console.error("Error al listar categorías en Escuela JS API:", error);
    throw error;
  }
}

module.exports = {
  buscarProductos,
  listarCategoriasPlatzi,
  listarProductosEscuelaJs,
  listarCategoriasEscuelaJs,
};
