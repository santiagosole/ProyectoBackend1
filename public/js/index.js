document.addEventListener("DOMContentLoaded", async () => {
  const productsList = document.getElementById("products");

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    products.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = `${p.name} - $${p.price}`;
      productsList.appendChild(li);
    });
  } catch (err) {
    console.error("Error cargando productos:", err);
  }
});
