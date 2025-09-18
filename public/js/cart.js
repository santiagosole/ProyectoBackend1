(function() {
  function getCartIdFromLink() {
    const a = document.querySelector('a[href^="/carts/"]');
    if (!a) return null;
    const href = a.getAttribute('href');
    return href.split("/carts/")[1] || null;
  }
  const cartId = getCartIdFromLink();

  if (!cartId) {
    // no hay cartId; no hacemos nada
    return;
  }

  async function updateCartCount() {
    try {
      const res = await fetch(`/api/carts/${cartId}`);
      if (!res.ok) return;
      const cart = await res.json();
      const count = cart.products.reduce((acc, p) => acc + p.quantity, 0);
      const el = document.getElementById("cartCount");
      if (el) el.textContent = count;
    } catch (err) {
      console.error("updateCartCount error", err);
    }
  }

  // add-to-cart buttons
  function bindAddButtons() {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const pid = btn.dataset.id;
        try {
          const res = await fetch(`/api/carts/${cartId}/product/${pid}`, { method: "POST" });
          if (!res.ok) throw new Error("No se pudo agregar");
          // opcional: mostrar alert como antes
          alert("Producto agregado al carrito");
          updateCartCount();
        } catch (err) {
          console.error("addToCart error", err);
          alert("Error al agregar producto");
        }
      });
    });
  }

  // actualizar todo el carrito desde la vista de carrito
  async function sendCartUpdate() {
    const rows = document.querySelectorAll("#cartBody tr");
    const products = [];
    rows.forEach(row => {
      const pid = row.dataset.id;
      const qtyInput = row.querySelector(".quantity-input");
      const qty = qtyInput ? parseInt(qtyInput.value) : 0;
      products.push({ productId: pid, quantity: qty });
    });
    await fetch(`/api/carts/${cartId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products })
    });
    // recargar para ver subtotales recalculados
    window.location.reload();
  }

  // bind update button in cart view
  const updateBtn = document.getElementById("updateCartBtn");
  if (updateBtn) updateBtn.addEventListener("click", sendCartUpdate);

  // initial setup
  bindAddButtons();
  updateCartCount();

  // If cart page loaded, also refresh table after page load (so dynamic buttons are bound)
  // (no-op if not on cart view)
})();
