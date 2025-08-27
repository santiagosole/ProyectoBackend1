const socket = io();

// Selección de elementos
const productList = document.getElementById("productList");

// Función para renderizar productos
function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${p.thumbnail ? p.thumbnail : 'https://via.placeholder.com/300x200.png?text=Sin+Imagen'}" 
             class="card-img-top" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.title}</h5>
          <p class="fw-bold text-primary mb-1">Precio: $${p.price}</p>
          <div class="mt-auto">
            <button class="btn btn-sm btn-danger delete-btn" data-id="${p.id}">Eliminar</button>
          </div>
        </div>
      </div>
    `;
    // Botón eliminar
    col.querySelector(".delete-btn").addEventListener("click", () => {
      socket.emit("deleteProduct", p.id);
    });
    productList.appendChild(col);
  });
}

// Recibir productos y actualizaciones
socket.on("updateProducts", (products) => {
  renderProducts(products);
});
