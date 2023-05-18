const products = [
    { name: 'DUCK SHIRT', price: '$25', img: 'images/product1.jpg' },
    { name: 'EVOLUTION SHIRT', price: '$22', img: 'images/product2.jpg' },
    { name: 'CLOUD SHIRT', price: '$22', img: 'images/product3.jpg' },
    { name: 'NOCOMMENT SHIRT', price: '$24', img: 'images/product4.jpg' },
    { name: 'ELPADRINO SHIRT', price: '$25', img: 'images/product5.jpg' },
    { name: 'WHILE SHIRT', price: '$25', img: 'images/product6.jpg' },
    { name: 'NOSLEEP SHIRT', price: '$20', img: 'images/product7.jpg' },
    { name: 'FULLSTACK SHIRT', price: '$23', img: 'images/product8.jpg' },
    { name: 'NOCLOUD SHIRT', price: '$30', img: 'images/product9.jpg' },
    { name: 'IP SHIRT', price: '$25', img: 'images/product10.jpg' },
    { name: 'MOTHERBOARD SHIRT', price: '$20', img: 'images/product11.jpg' },
    { name: 'CONSOLE.LOG SHIRT', price: '$25', img: 'images/product12.jpg' }
  ];

const shopContent = document.querySelector('.shop-content');
const cartIcon = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const closeCart = document.querySelector('#close-cart');

// Guardar carrito en LocalStorage
function saveCartToLocalStorage() {
    let cartItems = Array.from(cart.querySelectorAll(".cart-box"));
    let cartData = cartItems.map(function(cartItem) {
    let title = cartItem.querySelector(".cart-product-title").innerText;
    let price = cartItem.querySelector(".cart-price").innerText;
    let productImg = cartItem.querySelector(".cart-img").src;
    return { title: title, price: price, productImg: productImg };
    });
    localStorage.setItem("cartItems", JSON.stringify(cartData));
  }  

// Cart Working JS
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    // Remover productos del carrito
    let removeCartButtons = document.getElementsByClassName("cart-remove")
    console.log(removeCartButtons)
    for (let i = 0; i < removeCartButtons.length; i++) {
        let button = removeCartButtons[i]
        button.addEventListener("click", removeCartItem)
    }
    // Cambios en la cantidad
    let quantityInputs = document.getElementsByClassName("cart-quantity");
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    // Añadir al carrito
    let addCart = document.getElementsByClassName("add-cart")
    for (let i = 0; i < addCart.length; i++) {
        let button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    // Boton de compra
    document.getElementsByClassName("btn-buy")[0].addEventListener("click", buyButtonClicked)
    // Cargar productos del carrito desde el Local Storage
    let savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      let cartData = JSON.parse(savedCartItems);
      cartData.forEach(function(item) {
        addProductToCart(item.title, item.price, item.productImg);
      });
      updateTotal();
      }
}

// Abrir carrito
cartIcon.addEventListener('click', function(){
    cart.classList.add('active');
})
// Cerrar carrito
closeCart.addEventListener('click', function(){
    cart.classList.remove('active');
})

// Mostrar productos
function renderProducts() {
    for (let i = 0; i < products.length; i++) {
        shopContent.innerHTML += `
            <div class="product-box">
            <img src="${products[i].img}" alt="" class="product-img">
            <h2 class="product-title">${products[i].name}</h2>
            <span class="price">${products[i].price}</span>
            <i class="bx bx-shopping-bag add-cart"></i>
            </div>`
        }
    }
renderProducts();

// Añadir al carrito
let addCart = document.querySelectorAll('.add-cart')
for (let i = 0; i < addCart.length; i++) {
    let button = addCart[i];
    button.addEventListener('click', addCartClicked);
}

// Alerta "Producto añadido"

function addCartClicked(event) {
    let button = event.target;
    let shopProducts = button.parentElement;
    let title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    let price = shopProducts.getElementsByClassName("price")[0].innerText;
    let productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    let productAdded = addProductToCart(title, price, productImg);
    if (productAdded) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-start',
            showConfirmButton: false,
            timer: 3000,
        });
        Toast.fire({
            icon: 'success',
            title: 'Producto añadido al carrito'
        });
    }
    updateTotal();
}

function addProductToCart(title, price, productImg) {
    let cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    let cartItems = document.getElementsByClassName("cart-content")[0];
    let cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (let i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            Swal.fire({
                title: 'Error',
                text: 'Ya añadiste este articulo al carrito',
                icon: 'error',
                confirmButtonText: 'Ok',
                timer: 2000
            });
            return false;
        }
    } 
    let cartBoxContent = `  
                        <img src="${productImg}" alt="" class="cart-img">
                        <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <input type="number" value="1" class="cart-quantity">
                        </div>
                        <!-- Remove Cart -->
                        <i class="bx bxs-trash-alt cart-remove"></i>`;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox)
    cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
    saveCartToLocalStorage();
    return true;
}

// Remover productos del carrito
function removeCartItem(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartToLocalStorage()
}

// Cambios en la cantidad
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartToLocalStorage()
}

// Actualizar el total
function updateTotal() {
    let cartContent = document.getElementsByClassName("cart-content")[0]
    let cartBoxes = cartContent.getElementsByClassName("cart-box");
    let total = 0;
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let priceElement = cartBox.getElementsByClassName("cart-price")[0];
        let quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        let price = parseFloat(priceElement.innerText.replace("$", ""));
        let quantity = quantityElement.value;
        total = total + (price * quantity);
    }
        // Por si el precio contiene centavos
        total = Math.round(total * 100) / 100;

        document.getElementsByClassName("total-price")[0].innerText = "$" + total;
}

// Boton de compra
function buyButtonClicked() {
    Swal.fire({
        title: 'Gracias!',
        text: 'Tu compra se efectuo correctamente',
        icon: 'success',
        confirmButtonText: 'Ok'
      })
    let cartContent = document.getElementsByClassName("cart-content")[0]
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
    saveCartToLocalStorage()
}


