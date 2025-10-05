document.addEventListener('DOMContentLoaded', () => {
    // --- 1. REFERENCIAS A ELEMENTOS DEL DOM ---
    const orderIdEl = document.getElementById('order-id');
    const orderDateEl = document.getElementById('order-date');
    const customerNameEl = document.getElementById('customer-name');
    const customerEmailEl = document.getElementById('customer-email');
    const customerAddressEl = document.getElementById('customer-address');
    const orderItemsListEl = document.getElementById('order-items-list');
    const orderTotalEl = document.getElementById('order-total');
    const orderConfirmationEl = document.getElementById('order-confirmation');

    // --- 2. OBTENER DATOS DE LA ORDEN ---
    const order = JSON.parse(sessionStorage.getItem('lastOrder'));

    // --- 3. RENDERIZAR LA BOLETA ---
    if (order) {
        // Rellenar detalles del pedido y cliente
        orderIdEl.textContent = order.orderId;
        orderDateEl.textContent = order.date;
        customerNameEl.textContent = order.customer.name;
        customerEmailEl.textContent = `Email: ${order.customer.email}`;
        customerAddressEl.textContent = `Dirección: ${order.customer.address}`;

        // Limpiar la lista por si acaso
        orderItemsListEl.innerHTML = '';

        // Rellenar lista de productos
        order.items.forEach(item => {
            const listItem = `
                <li class="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                        <h6 class="my-0">${item.name}</h6>
                        <small class="text-muted">1 unidad</small>
                    </div>
                    <span class="text-muted">$${item.price.toFixed(2)}</span>
                </li>
            `;
            orderItemsListEl.innerHTML += listItem;
        });

        // Rellenar total
        orderTotalEl.textContent = `$${order.total.toFixed(2)}`;

        // Opcional: Limpiar sessionStorage para que la boleta no se pueda ver de nuevo si se recarga la página o se navega hacia atrás.
        // sessionStorage.removeItem('lastOrder');

    } else {
        // Si no hay orden, mostrar un mensaje de error
        orderConfirmationEl.innerHTML = '<div class="card-body text-center"><h4 class="card-title">No se encontró información del pedido.</h4><p>Por favor, realiza una compra para ver tu boleta.</p><a href="index.html" class="btn btn-primary">Volver a la tienda</a></div>';
    }
});