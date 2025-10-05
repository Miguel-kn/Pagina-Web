document.addEventListener('DOMContentLoaded', () => {
    // `products` ahora viene de data.js

    const productDetailContainer = document.getElementById('product-detail');
    const relatedProductsContainer = document.getElementById('related-products');

    // Obtener el ID del producto de la URL
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'), 10);

    const product = products.find(p => p.id === productId); // `products` viene de data.js

    if (product) {
        // Renderizar el detalle del producto principal
        document.title = `${product.name} - EcoMarket`; // Actualizar título de la página
        const productDetailHTML = `
            <div class="col-md-6">
                <img src="${product.image.replace('w=300', 'w=600').replace('h=200', 'h=400')}" class="img-fluid rounded" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <span class="badge bg-success mb-2">${product.category}</span>
                <h1>${product.name}</h1>
                <p class="lead">${product.description}</p>
                <p class="fs-2 fw-bold">$${product.price.toFixed(2)}</p>
                <button class="btn btn-primary btn-lg">Añadir al carrito</button>
            </div>
        `;
        productDetailContainer.innerHTML = productDetailHTML;

        // Encontrar y renderizar productos relacionados (misma categoría, diferente ID)
        const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4); // Mostrar hasta 4

        if (relatedProducts.length > 0) {
            relatedProducts.forEach(related => {
                const relatedCard = `
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <div class="card h-100 shadow-sm">
                            <a href="producto.html?id=${related.id}">
                                <img src="${related.image}" class="card-img-top" alt="${related.name}">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title">${related.name}</h5>
                                <p class="card-text fw-bold">$${related.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                `;
                relatedProductsContainer.innerHTML += relatedCard;
            });
        } else {
            relatedProductsContainer.innerHTML = '<p class="text-muted">No hay otros productos en esta categoría.</p>';
        }

    } else {
        // Producto no encontrado
        productDetailContainer.innerHTML = '<div class="col-12 text-center"><h2>Producto no encontrado</h2><p>El producto que buscas no existe o fue removido.</p><a href="index.html" class="btn btn-primary">Volver a la tienda</a></div>';
        document.getElementById('related-products').parentElement.style.display = 'none';
    }
});