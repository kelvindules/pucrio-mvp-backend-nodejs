const API_URL = 'http://localhost:5000/products';

function getProducts() {
    return fetch(API_URL)
        .then(response => response.json())
        .then(data => { return data.products; })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
        });
}

function addProduct(product) {

    console.log(product);

    return fetch(API_URL, {
        method: 'POST',
        body: product
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Erro ao tentar adicionar produto:', error);
        });
}

function deleteProduct(productName) {
    return fetch(`${API_URL}/${productName}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Erro ao tentar deletar produto:', error);
        });
}

function renderProductList(products) {

    console.log(`rendering this: ${products}`);

    const productListElement = document.getElementById('productList');
    productListElement.innerHTML = '';
    products.forEach(product => {
        const trElement = document.createElement('tr');
        trElement.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.count}</td>
      <td>
        <button type="button" class="btn btn-danger btnDeleteProduct" data-product-id="${product.name}">Deletar</button>
      </td>
    `;
        productListElement.appendChild(trElement);
    });
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('count').value = '';
    document.getElementById('errorMessage').textContent = '';
}

function displayErrorMessage(message) {
    document.getElementById('errorMessage').textContent = message;
}

function handleAddProductSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value.trim());
    const count = parseInt(document.getElementById('count').value.trim());
    if (name === '' || isNaN(price) || isNaN(count)) {
        displayErrorMessage('Favor preencher todos os campos!');
        return;
    }

    const productData = new FormData();
    productData.append('name', name);
    productData.append('price', price);
    productData.append('count', count);

    addProduct(productData)
        .then(() => {
            clearForm();
            getProducts()
                .then(products => {
                    renderProductList(products);
                });
        });
}

function handleClearFormClick() {
    clearForm();
}

function handleDeleteProductClick(event) {
    const productId = event.target.getAttribute('data-product-id');
    if (confirm('Tem certeza que deseja deletar esse produto?')) {
        deleteProduct(productId)
            .then(() => {
                getProducts()
                    .then(products => {
                        renderProductList(products);
                    });
            });
    }
}

function handleSearchInput() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    getProducts()
        .then(products => {
            const filteredProducts = products.filter(product => {
                return product.name.toLowerCase().includes(searchTerm);
            });
            renderProductList(filteredProducts);
        });
}

document.getElementById('formAddProduct').addEventListener('submit', handleAddProductSubmit);
document.getElementById('btnClearForm').addEventListener('click', handleClearFormClick);
document.getElementById('productList').addEventListener('click', event => {
    if (event.target.classList.contains('btnDeleteProduct')) {
        handleDeleteProductClick(event);
    }
});
document.getElementById('searchInput').addEventListener('input', handleSearchInput);

getProducts()
    .then(response => {
        renderProductList(response);
    });