import {cart , addToCart} from "../data/cart.js";
import {products,loadProducts} from "../data/products.js";

loadProducts(() => {
	renderProductsGrid();
	performSearch();
});

export function performSearch(){
	const url = new URL(window.location.href);
  const searchParam = url.searchParams.get("search");

	const searchInput = document.querySelector(".search-bar")
	const searchBtn = document.querySelector(".search-icon");

	searchBtn.addEventListener("click", () => {
		const value = searchInput.value.trim().toLowerCase();
		if (value !== "") {
			const encoded = encodeURIComponent(value);
			window.location.href = `amazon.html?search=${encoded}`;
		}
	});

	searchInput.addEventListener("keydown", function (e) {
		if (e.key === "Enter") {
			const value = searchInput.value.trim().toLowerCase();
			if (value !== "") {
				const encoded = encodeURIComponent(value);
				window.location.href = `amazon.html?search=${encoded}`;
			}
		}
	});

  if (searchParam) {
    filterProducts(searchParam.toLowerCase());
    searchInput.value = searchParam;
  }
}



export function updateCartQuantity(selector){
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector(selector).innerText = cartQuantity;
}

function renderProductsGrid(){
  let productsHTML = "";

  products.forEach((product)=> {
      productsHTML += 
          `<div class="product-container js-product-container-${product.id}">
            <div class="product-image-container">
              <img class="product-image"
                src=${product.image}>
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <select class="product-quantity-container-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            ${product.extraInfoHTML()}
            <div class="product-spacer"></div>

            <div class="added-to-cart" data-product-id="${product.id}">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>`
  });

  updateCartQuantity(".js-cart-quantity");
  
  document.querySelector(".js-products-grid").innerHTML = productsHTML;

  document.querySelectorAll(".js-add-to-cart")
    .forEach( (button) => {
      button.addEventListener("click" , () => {
        
        const productId = button.dataset.productId;
        const addedMsg = document.querySelector(`.added-to-cart[data-product-id="${productId}"]`);
        addedMsg.style.opacity = "1";

        const quantityOption = document.querySelector(`.product-quantity-container-${productId}`).value

        addToCart(productId , Number(quantityOption));
        updateCartQuantity(".js-cart-quantity");
        
        setTimeout( () => {
          addedMsg.style.opacity = '0';
        },3500);

      });
    });
}

export function filterProducts(searchValue) {
  const productsElements = [];

  products.forEach(product => {
    const productElement = document.querySelector(`.js-product-container-${product.id}`);
    const name = product.name;
    const keywords = product.keywords; 

    const nameMatch = name.includes(searchValue);
    const keywordsMatch = keywords.some(keyword => keyword.includes(searchValue));

    const isVisible = nameMatch || keywordsMatch;
    productElement.classList.toggle("hidden", !isVisible);
    productsElements.push(productElement);
  });

  const hasVisibleProduct = productsElements.some(product => !product.classList.contains("hidden"));
  const noMatchMsg = document.querySelector(".no-matching-products");

  if (noMatchMsg) {
    noMatchMsg.classList.toggle("hidden", hasVisibleProduct);
  }
}
