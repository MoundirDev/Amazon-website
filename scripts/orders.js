import {orders} from "../data/orders.js";
import {formatCurrency} from "../scripts/utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {products , getProduct , loadProducts} from "../data/products.js";

loadProducts(() => {
    
    console.log(products);

    
    renderOrdersHTML();
    console.log(orders);
    
})

function formatOrderDate(date){
    return dayjs(date).format("MMMM D");
}

function deliveryDateInfos(deliveryDate) {
    const today = dayjs();

    if (dayjs(deliveryDate).isAfter(today, 'day')) {
        return `Arriving on : ${formatOrderDate(deliveryDate)}`;
    } else if (dayjs(deliveryDate).isSame(today, 'day')) {
        return `Arriving today`;
    } else {
        return `Delivered on : ${formatOrderDate(deliveryDate)}`;
    }
}

function renderOrderDetails(orderedProducts){
    let orderDetails = "";

    orderedProducts.forEach( product => {
        const productData = getProduct(product.productId);

        orderDetails += `
            <div class="order-details-grid">
                <div class="product-image-container">
                    <img src=${productData.image}>
                </div>

                <div class="product-details">
                <div class="product-name">
                    ${productData.name}
                </div>
                <div class="product-delivery-date">
                    ${deliveryDateInfos(product.estimatedDeliveryTime)}
                </div>
                <div class="product-quantity">
                    Quantity: ${product.quantity}
                </div>
                <button class="buy-again-button button-primary">
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                </button>
                </div>

                <div class="product-actions">
                <a href="tracking.html?orderId=123&productId=345">
                    <button class="track-package-button button-secondary">
                    Track package
                    </button>
                </a>
                </div>
            </div>
        `;
    });

    return orderDetails;
}
function renderOrdersHTML(){
    const ordersGrid = document.querySelector(".orders-grid");
    let ordersHTML = "";

    orders.forEach( order => {
        ordersHTML += `
            <div class="order-container-${order.id}">

            <div class="order-header">
                <div class="order-header-left-section">
                <div class="order-date">
                    <div class="order-header-label">Order Placed:</div>
                    <div>${formatOrderDate(order.orderTime)}</div>
                </div>
                <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${formatCurrency(order.totalCostCents)}</div>
                </div>
                </div>

                <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
                </div>
            </div>

            ${renderOrderDetails(order.products)}

            </div>
        `;
    });

    ordersGrid.innerHTML += ordersHTML;
}
