// Cart handling

// Add to cart

const products_container = document.getElementById('products-container');

const cart_count = document.getElementById("cart-count");

const csrfToken = document.querySelector("[name = csrfmiddlewaretoken]").value


// adding event listener onto product cards through their parent container

if(products_container){
    // add to cart url 
const addUrl = products_container.dataset.addUrl;


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
}



// ===============================
// CART PAGE HANDLING
// ===============================

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

            // If item removed
            if (data.qty === 0) {
                cartItem.remove();
            } else {
                qtyEl.innerText = data.qty;
                subtotalEl.innerText = `₹${data.subtotal}`;
            }

            // Update cart badge
            if (cart_count) {
                cart_count.innerText = data.cart_count;
            }

            // Update order summary
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



