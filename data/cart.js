export let cart;

loadFromStorage();

export function loadFromStorage(){
    cart = JSON.parse(localStorage.getItem('cart'));

    if (!cart) {
        cart = [];
    }
}

function saveToStorage(){
    localStorage.setItem('cart',JSON.stringify(cart));
}
export function addToCart(productId , quantity) {
    let matchingItem;
        
    cart.forEach((item) => {
        if (productId === item.productId){
            matchingItem = item;
        }
    });
    
    if (matchingItem){
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId : productId,
            quantity : quantity,
            deliveryOptionId : "1"
        });
    }
    saveToStorage();
}

export function removeFromCart(productId){
    const newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId){
            newCart.push(cartItem);
        }
    });
    cart = newCart;
    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
        
    cart.forEach((item) => {
        if (productId === item.productId){
            matchingItem = item;
        }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
}

export function loadCart(fun) {
    const xhr = new XMLHttpRequest();
  
    xhr.addEventListener("load" , () => {
      console.log("load cart");
      fun();
    });

    xhr.open("GET" , "https://supersimplebackend.dev/cart");
    xhr.send();
}

export function updateQuantity(productId, newQuantity){
    let matchingItem;
        
    cart.forEach((item) => {
        if (productId === item.productId){
            matchingItem = item;
        }
    });

    matchingItem.quantity = newQuantity;
    saveToStorage();
}

export function resetCart(){
    cart.length = 0;
    saveToStorage();
}