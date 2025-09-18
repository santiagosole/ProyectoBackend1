const cartId = "{{cartId}}"; // Esto viene del backend al renderizar la vista

// Función para agregar un producto al carrito
async function addToCart(productId) {
  // Obtener el carrito actual
  const res = await fetch(`/api/carts/${cartId}`);
  const cart = await res.json();

  // Copiar productos y aumentar cantidad si ya existe
  const products = cart.products.map(p => ({
    productId: p.product._id,
    quantity: p.quantity
  }));

  const existing = products.find(p => p.productId === productId);
  if (existing) existing.quantity += 1;
  else products.push({ productId, quantity: 1 });

  // Enviar carrito actualizado al backend
  await fetch(`/api/carts/${cartId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products })
  });

  // Actualizar el contador en el navbar
  updateCartCount();
}

// Evento para todos los botones “Agregar al carrito”
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const productId = btn.dataset.id;
    addToCart(productId);
  });
});

// Función para actualizar el contador del carrito
async function updateCartCount() {
  const res = await fetch(`/api/carts/${cartId}`);
  const cart = await res.json();
  const count = cart.products.reduce((acc, p) => acc + p.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

// Inicializar contador al cargar la página
updateCartCount();
