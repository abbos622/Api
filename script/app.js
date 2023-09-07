const productContainer = document.querySelector(".product-container");
const loader = document.querySelector(".lds-spinner");
const searchForm = document.querySelector("#search-form");
const searchInput = searchForm.querySelector("input");
const searchSelect = searchForm.querySelector("#search-select");
const minPrice = document.querySelector(".min-price")
const maxPrice = document.querySelector(".max-price")

const allLikedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];


checkDataIsLoading(true);
fetch("https://api.escuelajs.co/api/v1/products")
    .then(response => response.json())
    .then(data => renderProducts(data))

fetch("https://api.escuelajs.co/api/v1/categories")
    .then(response => response.json())
    .then(data => {
        const optionsFragment = document.createDocumentFragment();
        data.forEach(categoryItem => {
            const option = document.createElement("option");
            option.value = categoryItem.id;
            option.innerHTML = categoryItem.name;
            optionsFragment.appendChild(option);
        })
        searchSelect.appendChild(optionsFragment);
    })

function renderProducts(productData) {
    checkDataIsLoading(false)
    productContainer.innerHTML = ""
    const productsFragment = document.createDocumentFragment();
    productData.forEach(product => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
      <i data-product-id="${product.id}" class="fas fa-heart" style="${allLikedProducts.findIndex(item => item.id === product.id) !== -1 ? 'color: red;' : 'color: black;'}"></i>
      <a href="../pages/products.html?productId=${product.id}">
        <img src="${product.images[0]}" />
      </a>
      <h3 title="${product.title}">${product.title.split("").length > 15 ? product.title.slice(0, 15) + "..." : product.title}</h3>
      <strong>&dollar;${product.price}</strong>
    `
        productsFragment.appendChild(div)
    })
    productContainer.appendChild(productsFragment);
}


function checkDataIsLoading(loadingState) {
    if (loadingState) {
        loader.style.display = " inline-block"
        loader.setAttribute("loading", true)
    } else {
        loader.style.display = " none"
        loader.removeAttribute("loading")
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    checkDataIsLoading(true);

    console.log(minPrice.value)
    console.log(maxPrice.value)
    priseSort();
})

searchInput.addEventListener('input', (e) => {
    fetch(`https://api.escuelajs.co/api/v1/products/?title=${searchInput.value}`)
        .then(response => response.json())
        .then(data => renderProducts(data))

})

searchSelect.addEventListener("change", () => {
    checkDataIsLoading(true);
    fetch(`https://api.escuelajs.co/api/v1/products/?categoryId=${searchSelect.value}`)
        .then(response => response.json())
        .then(data => renderProducts(data))
    searchSelect.firstElementChild.value = ""
    searchSelect.firstElementChild.innerHTML = "All"
    searchSelect.firstElementChild.removeAttribute("disabled");
})

productContainer.addEventListener("click", (e) => {
    if (e.target.closest(".fa-heart")) {
        const likedProductId = +e.target.closest(".fa-heart").dataset.productId;
        fetch(`https://api.escuelajs.co/api/v1/products/${likedProductId}`)
            .then(response => response.json())
            .then(data => {
                allLikedProducts.unshift(data)
                localStorage.setItem("likedProducts", JSON.stringify(allLikedProducts));
            })
    }

    fetch("https://api.escuelajs.co/api/v1/products")
        .then(response => response.json())
        .then(data => renderProducts(data))

})

function priseSort() {
    fetch(`https://api.escuelajs.co/api/v1/products/?price_min=${minPrice.value}&price_max=${maxPrice.value}`)
        .then(response => response.json())
        .then(data => renderProducts(data))
}