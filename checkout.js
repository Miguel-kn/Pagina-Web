document.addEventListener('DOMContentLoaded', () => {
    // --- 1. REFERENCIAS A ELEMENTOS DEL DOM ---
    const cartCountElement = document.getElementById('checkout-cart-count');
    const itemsListElement = document.getElementById('checkout-items-list');
    const totalElement = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');

    // --- 2. ESTADO DE LA APLICACIÓN ---
    // Cargar carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem('ecoMarketCart')) || [];

    // --- 3. FUNCIONES ---

    /**
     * Renderiza los items del carrito en la página de checkout.
     */
    function displayCheckoutSummary() {
        itemsListElement.innerHTML = ''; // Limpiar la lista

        if (cart.length === 0) {
            itemsListElement.innerHTML = '<li class="list-group-item">No hay productos en tu carrito.</li>';
            // Deshabilitar el formulario si no hay nada que comprar
            checkoutForm.querySelector('button[type="submit"]').disabled = true;
        } else {
            cart.forEach(item => {
                const listItem = `
                    <li class="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 class="my-0">${item.name}</h6>
                            <small class="text-muted">1 unidad</small>
                        </div>
                        <span class="text-muted">$${item.price.toFixed(2)}</span>
                    </li>
                `;
                itemsListElement.innerHTML += listItem;
            });
        }

        // Actualizar contador y total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartCountElement.textContent = cart.length;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    /**
     * Maneja el envío del formulario de checkout.
     * @param {Event} event - El evento de envío del formulario.
     */
    function handleCheckoutSubmit(event) {
        event.preventDefault(); // Prevenir el envío real del formulario
        event.stopPropagation();

        // Validar el formulario con Bootstrap
        if (!checkoutForm.checkValidity()) {
            checkoutForm.classList.add('was-validated');
            return;
        }

        // --- SIMULACIÓN DE PAGO EXITOSO ---
        // 1. Mostrar un mensaje de éxito
        alert('¡Gracias por tu compra! Tu pedido ha sido procesado exitosamente.');

        // 2. Limpiar el carrito en localStorage
        localStorage.removeItem('ecoMarketCart');

        // 3. Redirigir al usuario a la página de inicio
        window.location.href = 'index.html';
    }

    // --- 4. EVENT LISTENERS ---
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    // --- 5. INICIALIZACIÓN ---
    displayCheckoutSummary();
});