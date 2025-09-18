const cartId = "{{cartId}}"; // Debe venir del backend en render

async function updateCart() {
  const res = await fetch(`/api/carts/${cartId}`);
  const cart = await res.json();
  const tbody = document.getElementById("cartBody");
  tbody.innerHTML = "";

  let total = 0;

  cart.products.forEach(item => {
    const tr = document.createElement("tr");
    tr.dataset.id = item.product._id;

    const subtotal = item.product.price * item.quantity;
    total += subtotal;

    tr.innerHTML = `
      <td>${item.product.title}</td>
      <td>$${item.product.price}</td>
      <td>
        <input type="number" class="form-control quantity-input" value="${item.quantity}" min="0">
      </td>
      <td class="subtotal">$${subtotal}</td>
      <td>
        <button class="btn btn-sm btn-primary update">Actualizar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("cartTotal").textContent = total;

  // Eventos de actualización
  document.querySelectorAll(".update").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const tr = e.target.closest("tr");
      const pid = tr.dataset.id;
      const quantity = parseInt(tr.querySelector(".quantity-input").value);

      await fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      });

      updateCart();
    });
  });
}

// Ejecuta al cargar la página
updateCart();
