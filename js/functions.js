// Esperamos a que el DOM este cargado
document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  var menuToggle = document.getElementById("menu-toggle");
  var sidebar = document.getElementById("sidebar");
  var sidebarClose = document.getElementById("sidebar-close");
  var overlay = document.getElementById("overlay");
  var filterButtons = document.querySelectorAll(".sidebar__filter-btn");
  var products = document.querySelectorAll(".products__item");

  // Variables del carrito
  var cartToggle = document.getElementById("cart-toggle");
  var cart = document.getElementById("cart");
  var cartClose = document.getElementById("cart-close");
  var cartCount = document.getElementById("cart-count");
  var cartContent = document.getElementById("cart-content");
  var cartEmpty = document.getElementById("cart-empty");
  var cartActions = document.getElementById("cart-actions");
  var cartClear = document.getElementById("cart-clear");
  var productActions = document.querySelectorAll(".products__item-actions");

  // Array para almacenar items del carrito
  var cartItems = [];

  // Funcion para abrir el menu
  function openSidebar() {
    sidebar.classList.add("sidebar--active");
    overlay.classList.add("overlay--active");
    document.body.style.overflow = "hidden";
  }

  // Funcion para cerrar el menu
  function closeSidebar() {
    sidebar.classList.remove("sidebar--active");
    overlay.classList.remove("overlay--active");
    document.body.style.overflow = "";
  }

  // Funcion para filtrar productos
  function filterProducts(category) {
    var i;

    // Quitar clase activa de todos los botones
    for (i = 0; i < filterButtons.length; i++) {
      filterButtons[i].classList.remove("sidebar__filter-btn--active");
    }

    // Agregar clase activa al boton clickeado
    event.target.classList.add("sidebar__filter-btn--active");

    // Mostrar u ocultar productos segun categoria
    for (i = 0; i < products.length; i++) {
      var product = products[i];
      var productCategory = product.getAttribute("data-category");

      if (category === "all" || productCategory === category) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    }

    closeSidebar();
  }

  // Event listeners
  menuToggle.addEventListener("click", openSidebar);
  sidebarClose.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", function () {
    // Cerrar carrito si está abierto
    if (cart.classList.contains("cart--active")) {
      closeCart();
    }
    // Cerrar sidebar si está abierto
    if (sidebar.classList.contains("sidebar--active")) {
      closeSidebar();
    }
  });

  // Cerrar menu y carrito con tecla Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (cart.classList.contains("cart--active")) {
        closeCart();
      } else if (sidebar.classList.contains("sidebar--active")) {
        closeSidebar();
      }
    }
  });

  // Event listeners para botones de filtro
  var i;
  for (i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener("click", function () {
      var category = this.getAttribute("data-filter");
      filterProducts(category);
    });
  }

  // Marcar "Ver todos" como activo por defecto
  document
    .querySelector('[data-filter="all"]')
    .classList.add("sidebar__filter-btn--active");

  // Funciones del carrito
  function openCart() {
    cart.classList.add("cart--active");
    overlay.classList.add("overlay--active");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cart.classList.remove("cart--active");
    overlay.classList.remove("overlay--active");
    document.body.style.overflow = "";
  }

  function updateCartCount() {
    var totalItems = 0;
    var i;
    for (i = 0; i < cartItems.length; i++) {
      totalItems = totalItems + cartItems[i].quantity;
    }
    cartCount.textContent = totalItems;

    if (totalItems > 0) {
      cartCount.style.display = "block";
    } else {
      cartCount.style.display = "none";
    }
  }

  function updateCartDisplay() {
    cartContent.innerHTML = "";

    if (cartItems.length === 0) {
      cartEmpty.style.display = "block";
      cartContent.style.display = "none";
      cartActions.style.display = "none";
    } else {
      cartEmpty.style.display = "none";
      cartContent.style.display = "block";
      cartActions.style.display = "block";

      var i;
      for (i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        var cartItemElement = document.createElement("div");
        cartItemElement.className = "cart__item";
        cartItemElement.setAttribute("data-id", item.id);

        cartItemElement.innerHTML =
          '<div class="cart__item-header">' +
          '<img src="' +
          item.image +
          '" alt="' +
          item.name +
          '" class="cart__item-image" />' +
          "</div>" +
          '<div class="cart__item-info">' +
          '<p class="cart__item-name">' +
          item.name +
          "</p>" +
          '<p class="cart__item-price">$' +
          item.price +
          "</p>" +
          '<div class="cart__item-controls">' +
          '<div class="cart__item-quantity">' +
          '<button class="cart__item-quantity-btn" data-action="decrease" data-id="' +
          item.id +
          '">' +
          '<img src="./img/icon_minus.svg" alt="Reducir cantidad" />' +
          "</button>" +
          '<span class="cart__item-quantity-number">' +
          item.quantity +
          "</span>" +
          '<button class="cart__item-quantity-btn" data-action="increase" data-id="' +
          item.id +
          '">' +
          '<img src="./img/icon_plus.svg" alt="Aumentar cantidad" />' +
          "</button>" +
          "</div>" +
          '<button class="cart__item-remove" data-id="' +
          item.id +
          '">' +
          '<img src="./img/close.svg" alt="Quitar producto" />' +
          "</button>" +
          "</div>" +
          "</div>";

        cartContent.appendChild(cartItemElement);
      }

      // Event listeners para botones de cantidad
      var quantityButtons = document.querySelectorAll(
        ".cart__item-quantity-btn"
      );
      for (i = 0; i < quantityButtons.length; i++) {
        quantityButtons[i].addEventListener("click", function () {
          var itemId = this.getAttribute("data-id");
          var action = this.getAttribute("data-action");
          updateQuantity(itemId, action);
        });
      }

      // Event listeners para botones de remover
      var removeButtons = document.querySelectorAll(".cart__item-remove");
      for (i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener("click", function () {
          var itemId = this.getAttribute("data-id");
          removeFromCart(itemId);
        });
      }
    }
  }

  function addToCart(product, price, image) {
    // Buscar si el producto ya existe en el carrito
    var existingItem = null;
    var i;
    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].name === product) {
        existingItem = cartItems[i];
        break;
      }
    }

    if (existingItem) {
      // Si existe, aumentar cantidad
      existingItem.quantity = existingItem.quantity + 1;
    } else {
      // Si no existe, agregar nuevo item
      var newItem = {
        id: "item_" + Date.now(),
        name: product,
        price: price,
        image: image,
        quantity: 1,
      };
      cartItems.push(newItem);
    }

    updateCartCount();
    updateCartDisplay();
    updateProductDisplay(product);
  }

  function updateQuantity(itemId, action) {
    var i;
    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id === itemId) {
        if (action === "increase") {
          cartItems[i].quantity = cartItems[i].quantity + 1;
        } else if (action === "decrease") {
          cartItems[i].quantity = cartItems[i].quantity - 1;
          if (cartItems[i].quantity <= 0) {
            cartItems.splice(i, 1);
          }
        }
        break;
      }
    }

    updateCartCount();
    updateCartDisplay();
  }

  function removeFromCart(itemId) {
    var i;
    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id === itemId) {
        cartItems.splice(i, 1);
        break;
      }
    }

    updateCartCount();
    updateCartDisplay();
  }

  function clearCart() {
    cartItems = [];
    updateCartCount();
    updateCartDisplay();
    updateAllProductsDisplay();
  }

  function updateProductDisplay(productName) {
    var i;
    var productQuantity = 0;

    // Buscar cantidad del producto en el carrito
    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].name === productName) {
        productQuantity = cartItems[i].quantity;
        break;
      }
    }

    // Actualizar la visualizacion del producto
    for (i = 0; i < productActions.length; i++) {
      var action = productActions[i];
      var actionProductName = action.getAttribute("data-product");

      if (actionProductName === productName) {
        var addButton = action.querySelector(".products__item-btn--add");
        var quantityDiv = action.querySelector(".products__item-quantity");
        var quantityNumber = action.querySelector(
          ".products__item-quantity-number"
        );
        var decreaseBtn = action.querySelector("[data-action='decrease']");

        if (productQuantity > 0) {
          addButton.style.display = "none";
          quantityDiv.style.display = "flex";
          quantityNumber.textContent = productQuantity;
          decreaseBtn.disabled = false;
        } else {
          addButton.style.display = "block";
          quantityDiv.style.display = "none";
        }
      }
    }
  }

  function updateAllProductsDisplay() {
    var processedProducts = [];
    var i;

    for (i = 0; i < productActions.length; i++) {
      var productName = productActions[i].getAttribute("data-product");
      if (processedProducts.indexOf(productName) === -1) {
        updateProductDisplay(productName);
        processedProducts.push(productName);
      }
    }
  }

  function handleProductQuantity(productName, price, image, action) {
    if (action === "add") {
      addToCart(productName, price, image);
    } else {
      updateQuantityFromProduct(productName, action);
    }
  }

  function updateQuantityFromProduct(productName, action) {
    var i;
    for (i = 0; i < cartItems.length; i++) {
      if (cartItems[i].name === productName) {
        if (action === "increase") {
          cartItems[i].quantity = cartItems[i].quantity + 1;
        } else if (action === "decrease") {
          cartItems[i].quantity = cartItems[i].quantity - 1;
          if (cartItems[i].quantity <= 0) {
            cartItems.splice(i, 1);
          }
        }
        break;
      }
    }

    updateCartCount();
    updateCartDisplay();
    updateProductDisplay(productName);
  }

  // Event listeners del carrito
  cartToggle.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  cartClear.addEventListener("click", clearCart);

  // Event listeners para controles de productos
  var i;
  for (i = 0; i < productActions.length; i++) {
    var action = productActions[i];
    var product = action.getAttribute("data-product");
    var price = action.getAttribute("data-price");
    var image = action.getAttribute("data-image");

    // Event listener para boton agregar
    var addButton = action.querySelector(".products__item-btn--add");
    if (addButton) {
      addButton.addEventListener("click", function () {
        var parentAction = this.closest(".products__item-actions");
        var productName = parentAction.getAttribute("data-product");
        var productPrice = parentAction.getAttribute("data-price");
        var productImage = parentAction.getAttribute("data-image");
        handleProductQuantity(productName, productPrice, productImage, "add");
      });
    }

    // Event listeners para botones de cantidad
    var quantityButtons = action.querySelectorAll(
      ".products__item-quantity-btn"
    );
    var j;
    for (j = 0; j < quantityButtons.length; j++) {
      quantityButtons[j].addEventListener("click", function () {
        var parentAction = this.closest(".products__item-actions");
        var productName = parentAction.getAttribute("data-product");
        var productPrice = parentAction.getAttribute("data-price");
        var productImage = parentAction.getAttribute("data-image");
        var actionType = this.getAttribute("data-action");
        handleProductQuantity(
          productName,
          productPrice,
          productImage,
          actionType
        );
      });
    }
  }

  // Inicializar contador del carrito y productos
  updateCartCount();
  updateCartDisplay();
  updateAllProductsDisplay();
});
