document.addEventListener('DOMContentLoaded', () => {
    // --- 1. REFERENCIAS A ELEMENTOS DEL DOM ---
    // `products` ahora viene de data.js

    const productListContainer = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const cartCountElement = document.getElementById('cart-count');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    // --- 2. ESTADO DE LA APLICACIÓN ---
    // Cargar carrito desde localStorage o inicializarlo como un array vacío
    let cart = JSON.parse(localStorage.getItem('ecoMarketCart')) || [];

    // --- 3. FUNCIONES PRINCIPALES ---

    /**
     * Renderiza los productos en el DOM usando tarjetas de Bootstrap.
     * @param {Array} productsToDisplay - El array de productos a mostrar.
     */
    function displayProducts(productsToDisplay) {
        productListContainer.innerHTML = ''; // Limpiar la lista antes de renderizar

        if (productsToDisplay.length === 0) {
            productListContainer.innerHTML = '<p class="col-12 text-center text-muted">No se encontraron productos.</p>';
            return;
        }

        productsToDisplay.forEach(product => {
            const productCard = `
                <div class="col-lg-3 col-md-4 col-sm-6 product-card-wrapper">
                    <div class="card h-100 shadow-sm">
                        <a href="producto.html?id=${product.id}" class="text-decoration-none text-dark">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        </a>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted small">${product.category}</p>
                            <p class="card-text fs-4 fw-bold mt-auto">$${product.price.toFixed(2)}</p>
                            <button class="btn btn-success add-to-cart-btn" data-product-id="${product.id}">
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productListContainer.innerHTML += productCard;
        });
    }

    /**
     * Actualiza el contador del carrito en la interfaz.
     */
    function updateCart() {
        displayCartItems();
        updateCartCount();
        saveCart();
    }

    /**
     * Guarda el carrito en localStorage.
     */
    function saveCart() {
        localStorage.setItem('ecoMarketCart', JSON.stringify(cart));
    }

    /**
     * Muestra los items en el panel del carrito.
     */
    function displayCartItems() {
        cartItemsContainer.innerHTML = ''; // Limpiar
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío.</p>';
            checkoutButton.classList.add('disabled'); // Deshabilitar botón de pagar
        } else {
            checkoutButton.classList.remove('disabled'); // Habilitar botón de pagar
            cart.forEach((item, index) => {
                const cartItemHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                        <div class="mx-2 flex-grow-1">
                            <div class="small">${item.name}</div>
                            <div class="fw-bold small">$${item.price.toFixed(2)}</div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-index="${index}">
                            &times;
                        </button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
        }

        // Calcular y mostrar total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    }

    /**
     * Actualiza solo el número en el ícono del carrito.
     */
    function updateCartCount() {
        cartCountElement.textContent = cart.length;
    }

    /**
     * Añade un producto al carrito.
     * @param {number} productId - El ID del producto a añadir.
     */
    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId); // `products` viene de data.js
        if (productToAdd) {
            cart.push(productToAdd);
            updateCart();
        }
    }

    /**
     * Remueve un producto del carrito por su índice.
     * @param {number} index - El índice del item a remover.
     */
    function removeFromCart(index) {
        if (index > -1 && index < cart.length) {
            cart.splice(index, 1);
            updateCart();
        }
    }

    /**
     * Filtra los productos basándose en el término de búsqueda.
     */
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    }

    /**
     * Filtra los productos por categoría.
     * @param {string} category - La categoría por la que filtrar.
     */
    function filterByCategory(category) {
        searchInput.value = ''; // Limpiar búsqueda
        if (category === 'all') {
            displayProducts(products);
        } else if (category === 'featured') {
            displayProducts(products.filter(p => p.featured));
        } else {
            displayProducts(products.filter(p => p.category === category));
        }
    }

    // --- 4. EVENT LISTENERS ---

    // Búsqueda al hacer clic en el botón
    searchButton.addEventListener('click', handleSearch);

    // Búsqueda en tiempo real mientras se escribe
    searchInput.addEventListener('keyup', handleSearch);

    // Delegación de eventos para los botones "Añadir al carrito"
    productListContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.dataset.productId, 10);
            addToCart(productId);
        }
    });

    // Delegación de eventos para los botones "Eliminar" del carrito
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart-btn')) {
            const index = parseInt(event.target.dataset.index, 10);
            removeFromCart(index);
        }
    });

    // Filtro por categorías
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', (event) => {
            event.preventDefault();
            const category = event.target.dataset.category;
            filterByCategory(category);
        });
    });

    // --- 5. INICIALIZACIÓN ---
    updateCart(); // Actualiza la vista del carrito y el contador al cargar la página
    filterByCategory('featured'); // Mostrar solo productos destacados al cargar la página
});
