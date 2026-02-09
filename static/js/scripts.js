// ==========================================
// GLOBAL CSRF TOKEN
// ==========================================
const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]")?.value || "";
// ==========================================
// PRODUCT LIST PAGE (OLD CODE - UNCHANGED)
// ==========================================
const products_container = document.getElementById('products-container');
const cart_count = document.getElementById("cart-count");

if (products_container) {

  const addUrl = products_container.dataset.addUrl;

  products_container.addEventListener('click', async function (event) {

    if (!event.target.classList.contains('add-to-cart')) return;

    const btn = event.target;
    const product_card = btn.closest(".product-card");
    if (!product_card) return;

    const productId = product_card.dataset.productId;

    btn.disabled = true;
    btn.innerText = "Loading...";

    try {
      const response = await fetch(addUrl, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `product_id=${productId}`
      });

      const data = await response.json();

      if (response.status === 401 && data.redirect_url) {
        window.location.href = data.redirect_url;
        return;
      }

      if (cart_count && data.cart_count !== undefined) {
        cart_count.innerText = data.cart_count;
      }

    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      btn.disabled = false;
      btn.innerText = "Add to Cart";
    }
  });
}


// ==========================================
// PRODUCT DETAIL PAGE (NEW – SAFE ADDITION)
// ==========================================
const detailSection = document.getElementById("product-detail-section");

if (detailSection) {

  const addBtn = detailSection.querySelector(".add-to-cart");
  const addUrl = detailSection.dataset.addUrl;
  const productId = detailSection.dataset.productId;

  if (addBtn && addUrl && productId) {

    addBtn.addEventListener("click", async function () {

      addBtn.disabled = true;
      addBtn.innerText = "Adding...";

      try {
        const response = await fetch(addUrl, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: `product_id=${productId}`
        });

        const data = await response.json();

        if (response.status === 401 && data.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }

        if (cart_count && data.cart_count !== undefined) {
          cart_count.innerText = data.cart_count;
        }

      } catch (error) {
        console.error("Add to cart (detail) error:", error);
      } finally {
        addBtn.disabled = false;
        addBtn.innerText = "Add to Cart";
      }
    });
  }
}


// ==========================================
// CART PAGE HANDLING (PLUS / MINUS / REMOVE)
// ==========================================
const cartPage = document.getElementById("cart-page");

if (cartPage) {

  const plusUrl = cartPage.dataset.plusUrl;
  const minusUrl = cartPage.dataset.minusUrl;
  const removeUrl = cartPage.dataset.removeUrl;

  cartPage.addEventListener("click", async function (event) {

    const cartItem = event.target.closest(".cart-item");
    if (!cartItem) return;

    const productId = cartItem.dataset.productId;
    const qtyEl = cartItem.querySelector(".qty");
    const subtotalEl = cartItem.querySelector(".subtotal");

    let url = null;

    if (event.target.classList.contains("qty-plus")) {
      url = plusUrl;
    }
    else if (event.target.classList.contains("qty-minus")) {
      url = minusUrl;
    }
    else if (event.target.classList.contains("remove-item")) {
      url = removeUrl;
    }

    if (!url) return;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `product_id=${productId}`
      });

      const data = await response.json();

      if (data.qty === 0) {
        cartItem.remove();
      } else {
        qtyEl.innerText = data.qty;
        subtotalEl.innerText = `₹${data.subtotal}`;
      }

      if (cart_count) {
        cart_count.innerText = data.cart_count;
      }

      document.querySelector(
        ".summary-row span:last-child"
      ).innerText = data.total_qty;

      document.querySelector(
        ".summary-row.total span:last-child"
      ).innerText = `₹${data.total_price}`;

    } catch (error) {
      console.error("Cart update error:", error);
    }
  });
}

