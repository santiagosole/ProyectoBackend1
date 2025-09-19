(function() {
  function getCartIdFromLink() {
    const a = document.querySelector('a[href^="/carts/"]');
    if (!a) return null;
    const href = a.getAttribute('href');
    return href.split("/carts/")[1] || null;
  }
  const cartId = getCartIdFromLink();
  if (!cartId) return;

  // Toast de Bootstrap
  const toastEl = document.getElementById("cartToast");
  const toast = toastEl ? new bootstrap.Toast(toastEl) : null;

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

  function bindAddButtons() {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", async () => {
        const pid = btn.dataset.id;
        try {
const res = await fetch(`/api/carts/${cartId}/product/${pid}`, { 
  method: "POST" 
});
          if (!res.ok) throw new Error("No se pudo agregar");
          if (toast) toast.show(); // mostramos el toast en vez del alert
          updateCartCount();
        } catch (err) {
          console.error("addToCart error", err);
          alert("Error al agregar producto");
        }
      });
    });
  }

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
    window.location.reload();
  }

 async function clearCart() {
  try {
    const res = await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo vaciar");
    window.location.reload();
  } catch (err) {
    console.error("clearCart error", err);
    alert("Error al vaciar carrito");
  }
}

  const updateBtn = document.getElementById("updateCartBtn");
  if (updateBtn) updateBtn.addEventListener("click", sendCartUpdate);

  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) clearBtn.addEventListener("click", clearCart);

  bindAddButtons();
  updateCartCount();
})();