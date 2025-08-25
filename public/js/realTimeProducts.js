const socket = io();

// Formulario para agregar productos
const form = document.getElementById("formAddProduct");
const productList = document.getElementById("productList");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);

  if (!name || !price) return;

  socket.emit("newProduct", { name, price });

  form.reset();
});

// Recibir lista actualizada de productos
socket.on("updateProducts", (products) => {
  productList.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.name} - $${p.price}`;
    li.className = "list-group-item";
    productList.appendChild(li);
  });
});
