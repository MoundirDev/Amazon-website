import {products , getProduct , loadProducts} from "../data/products.js";
import {getOrder , deliveryDateInfos} from "./orders.js";
import { updateCartQuantity , performSearch} from "./amazon.js";

const url = new URL(window.location.href);
let orderId = url.searchParams.get("orderId");
let productId = url.searchParams.get("productId");

loadProducts(() => {
    renderTrackingHTML(orderId,productId);
    performSearch();
});
updateCartQuantity(".cart-quantity");

function formatOrderDate(date){
   return dayjs(date).format("dddd, MMMM D");
}

function progressBarPercentage(orderTime, deliveryTime) {
    const now = Date.now(); 
    const start = new Date(orderTime).getTime();
    const end = new Date(deliveryTime).getTime();

    const total = end - start;
    const elapsed = now - start;

    const result = ((elapsed / total) * 100).toFixed(2);
    if (result <5) return 5;
    else if (result >= 98) return 100;
    else return result;
}


function renderTrackingHTML(orderId , productId){
    const ordreDetails = getOrder(orderId)
    const productDetails = getProduct(productId);

    let matchingProduct;
    ordreDetails.products.forEach((product) => {
        if (product.productId === productId) {
            matchingProduct = product;
        }
    });
    let progressBarNum = progressBarPercentage(ordreDetails.orderTime , matchingProduct.estimatedDeliveryTime);

    let trackingSummary = `
        <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          ${deliveryDateInfos(matchingProduct.estimatedDeliveryTime)}
        </div>

        <div class="product-info">
          ${productDetails.name}
        </div>

        <div class="product-info">
          Quantity: ${matchingProduct.quantity}
        </div>

        <img class="product-image" src=${productDetails.image}>

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label">
            Shipped
          </div>
          <div class="progress-label">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar js-progress-bar" style="width:0%;"></div>
        </div>
      </div>
    `;  
    document.querySelector(".tracking-content").innerHTML += trackingSummary;

    setTimeout(() => {
      document.querySelector('.js-progress-bar')
        .style.width = `${progressBarNum}%`;
    }, 300);

    if(progressBarNum < 50) {        
        document.querySelectorAll(".progress-label")[0].classList.add("current-status");
    } else if (progressBarNum >= 50 && progressBarNum < 100) {
        document.querySelectorAll(".progress-label")[1].classList.add("current-status");
    } else {
        document.querySelectorAll(".progress-label")[2].classList.add("current-status");
    }
}
