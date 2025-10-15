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
  var addToCartButtons = document.querySelectorAll(".products__item-btn");

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

    // Cerrar el menu despues de filtrar
    closeSidebar();
  }

  // Event listeners
  menuToggle.addEventListener("click", openSidebar);
  sidebarClose.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  // Cerrar menu con tecla Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeSidebar();
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
    // Limpiar contenido del carrito
    cartContent.innerHTML = "";

    if (cartItems.length === 0) {
      cartEmpty.style.display = "block";
      cartContent.style.display = "none";
    } else {
      cartEmpty.style.display = "none";
      cartContent.style.display = "block";

      // Agregar cada item al carrito
      var i;
      for (i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        var cartItemElement = document.createElement("div");
        cartItemElement.className = "cart__item";
        cartItemElement.setAttribute("data-id", item.id);

        cartItemElement.innerHTML =
          '<img src="' +
          item.image +
          '" alt="' +
          item.name +
          '" class="cart__item-image" />' +
          '<div class="cart__item-info">' +
          '<p class="cart__item-name">' +
          item.name +
          "</p>" +
          '<p class="cart__item-price">$' +
          item.price +
          "</p>" +
          '<p class="cart__item-quantity">Cantidad: ' +
          item.quantity +
          "</p>" +
          "</div>" +
          '<button class="cart__item-remove" data-id="' +
          item.id +
          '">' +
          '<img src="./img/close.svg" alt="Quitar producto" class="cart__delete-icon" />' +
          "</button>";

        cartContent.appendChild(cartItemElement);
      }

      // Agregar event listeners a botones de remover
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
  }

  function removeFromCart(itemId) {
    // Buscar el item y removerlo
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

  // Event listeners del carrito
  cartToggle.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);

  // Event listeners para botones agregar al carrito
  var i;
  for (i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", function () {
      var product = this.getAttribute("data-product");
      var price = this.getAttribute("data-price");
      var image = this.getAttribute("data-image");
      addToCart(product, price, image);
    });
  }

  // Inicializar contador del carrito
  updateCartCount();
  updateCartDisplay();
});
