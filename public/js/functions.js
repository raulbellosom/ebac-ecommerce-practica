// Esperamos a que el DOM este cargado
document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  var menuToggle = document.getElementById("menu-toggle");
  var sidebar = document.getElementById("sidebar");
  var sidebarClose = document.getElementById("sidebar-close");
  var overlay = document.getElementById("overlay");
  var filterButtons = document.querySelectorAll(".sidebar__filter-btn");
  var products = document.querySelectorAll(".products__item");

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
});
