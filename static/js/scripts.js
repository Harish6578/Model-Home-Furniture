// Cart handling

// Add to cart

const products_container = document.getElementById('products-container');

const cart_count = document.getElementById("cart-count");

const csrfToken = document.querySelector("[name = csrfmiddlewaretoken]").value

// add to cart url 
const addUrl = products_container.dataset.addUrl;

// adding event listener onto product cards through their parent container

products_container.addEventListener('click', async function (event) {

    if (!event.target.classList.contains('add-to-cart')) {
        return;
    }

    const btn = event.target;
    const product_card = btn.closest(".product-card");
    const productId = product_card.dataset.productId;

    btn.disabled = true;
    btn.innerText = "Loading...";

    // try to make a POST request
    try {
        const response = await fetch(addUrl, {
            method: "POST",
            headers: {
                'X-CSRFToken': csrfToken,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `product_id=${productId}`
        })
        const data = await response.json();

        // if the backend returns 401 status,
        if (response.status === 401 && data.redirect_url) {
            window.location.href = data.redirect_url;
            return;
        }

        if (data.cart_count !== undefined) {
            cart_count.innerText = data.cart_count;
        }
    }
    catch (error) {
        console.error("Cart error:", error);
    }
    finally {
        btn.disabled = false;
        btn.innerText = "Add to Cart";
    }
});










let cartItems = {};

function addToCart(id, name, price, image) {
  if (cartItems[id]) {
    cartItems[id].qty++;
  } else {
    cartItems[id] = {
      name: name,
      price: price,
      image: image,
      qty: 1
    };
  }
  renderCart();
}

function increaseQty(id) {
  cartItems[id].qty++;
  renderCart();
}

function decreaseQty(id) {
  if (cartItems[id].qty > 1) {
    cartItems[id].qty--;
  }
  renderCart();
}

function deleteItem(id) {
  delete cartItems[id];
  renderCart();
}

function renderCart() {
  let cartDiv = document.getElementById("cart");
  let total = 0;
  cartDiv.innerHTML = "";

  for (let id in cartItems) {
    let item = cartItems[id];
    total += item.price * item.qty;

    cartDiv.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        
        <div class="cart-info">
          <strong>${item.name}</strong><br>
          ₹${item.price * item.qty}
        </div>

        <div class="qty-box">
          <button class="qty-btn" onclick="decreaseQty(${id})">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="increaseQty(${id})">+</button>
        </div>

        <button class="delete-btn" onclick="deleteItem(${id})">Delete</button>
      </div>
    `;
  }

  document.getElementById("total").innerText = total;
}













