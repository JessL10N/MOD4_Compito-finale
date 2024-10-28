
//GET> FUNZIONE PER RECUPERARE PRODOTTI DAL SERVER E VISUALIZZARLI IN PAGINA

function getProducts() {
    fetch("https://striveschool-api.herokuapp.com/api/product/", {
        headers: {
            "Content-Type":"application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3YjZhODVkNzU4NzAwMTUzNzg2MzciLCJpYXQiOjE3Mjk3NzkwNDQsImV4cCI6MTczMDk4ODY0NH0.Hkv2gHH40EHH0QO6xnyD9JlMDM3zlyNQWZNRlwgFvVY",
        }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta GET");
        }
        return response.json();
      })
      .then((data) => {
        const productCards = document.getElementById("productCards");
        productCards.innerHTML = "";
        console.log(productCards)
  
        data.forEach((product) => {
          const cardDiv = document.createElement("div");
          cardDiv.innerHTML = `
                    <div class="col-3">
                        <div class="card flex-fill p-1" style="width: 18rem; height: 400px">
                            <img src=${product.imageUrl} class="card-img-top img-fluid m-0 p-0" style="width: 50%; height: 50%" alt="${product.name}">
                            <div class="card-body m-0 p-0">
                            <h5 class="card-title m-0 p-0">${product.name}</h5>
                            <p class="card-text m-0 p-0">${product.description}</p>
                            <p class="card-text m-0 p-0">${product.brand}</p>
                            <p class="card-text fw-bold m-0 p-0">${product.price + "€"}</p>
                            <a href="#" class="btn btn-primary m-0 p-0 mb-2">Aggiungi al carrello</a>
                            <a href="./dettagliProdotto.html?q=${product._id}" class="btn btn-secondary m-0 p-0 mb-2" onclick="getProductDetails()">Vedi dettagli</a>
                            </div>
                        </div>
                    </div>
          `;
          productCards.appendChild(cardDiv);
        });
      })
      .catch((error) => console.error("Errore:", error));
  }

  document.addEventListener("DOMContentLoaded", function() {
    getProducts();
});

//POST> FUNZIONE PER AGGIUNGERE UN NUOVO PRODOTTO

function addProduct(name, description, brand, imageUrl, price) {
    if (!name.trim()) {
      console.error("Il nome del prodotto non può essere vuoto");
      return;
    }
  
    const newProduct = {
      name: name.trim(),
      description: description,
      brand: brand,
      imageUrl: imageUrl,
      price: price
    };
  
    fetch("https://striveschool-api.herokuapp.com/api/product/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3YjZhODVkNzU4NzAwMTUzNzg2MzciLCJpYXQiOjE3Mjk3NzkwNDQsImV4cCI6MTczMDk4ODY0NH0.Hkv2gHH40EHH0QO6xnyD9JlMDM3zlyNQWZNRlwgFvVY",
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => {
        if (!response.ok) {
            console.error("Errore HTTP:", response.status, response.statusText);
            return response.json().then(errorData => {
                console.error("Dettagli Errore Server:", errorData);
                throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Successo:", data);
    })
    .catch(error => {
        console.error("Errore:", error);
    });
  }

// GESTIONE ALL'INVIO DEL FORM

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const productName = document.getElementById("name").value;
  const productDescription = document.getElementById("description").value;
  const productBrand = document.getElementById("brand").value;
  const productImageUrl = document.getElementById("imageUrl").value;
  const productPrice = document.getElementById("price").value;

  addProduct(productName, productDescription, productBrand, productImageUrl, productPrice);
  productForm.reset();
});

// CARICAMENTO INIZIALE DEI PRODOTTI QUANDO LA PAGINA VIENE CARICATA

document.addEventListener("DOMContentLoaded", getProducts);

//FUNZIONE MOSTRA PRODOTTI IN LISTA E STAMPALI SOTTO AL FORM

function getAvailableProducts() {
    fetch("https://striveschool-api.herokuapp.com/api/product/", {
        headers: {
            "Content-Type":"application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3YjZhODVkNzU4NzAwMTUzNzg2MzciLCJpYXQiOjE3Mjk3NzkwNDQsImV4cCI6MTczMDk4ODY0NH0.Hkv2gHH40EHH0QO6xnyD9JlMDM3zlyNQWZNRlwgFvVY",
        }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta GET");
        }
        return response.json();
      })
      .then((data) => {
        const productsList = document.getElementById("productsList");
        productsList.innerHTML = "";
        console.log(productsList)
  
        data.forEach((product) => {
          const productsListItem = document.createElement("li");
          productsListItem.innerHTML = `
            <li class="list-group-item d-flex justify-content-between"><p><span class="fw-bold">ID prodotto:</span> ${product._id}  <span class="fw-bold">Nome prodotto:</span> ${product.name}</p> <p><span><button class="deleteProductFromServer btn btn-danger" onclick="deleteProduct('${product._id}')">Elimina</button></span></p></li>
          `;
          productsList.appendChild(productsListItem);
        });
      })
      .catch((error) => console.error("Errore:", error));
  }

  document.addEventListener("DOMContentLoaded", function() {
    getAvailableProducts();
});

//FUNZIONE PER RECUPERARE E VISUALIZZARE I DETTAGLI DI UN PRODOTTO NELLA PAGINA DETTAGLI

const params = new URLSearchParams(window.location.search);
const productId = params.get("q");

function getProductDetails() {
    fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3YjZhODVkNzU4NzAwMTUzNzg2MzciLCJpYXQiOjE3Mjk3NzkwNDQsImV4cCI6MTczMDk4ODY0NH0.Hkv2gHH40EHH0QO6xnyD9JlMDM3zlyNQWZNRlwgFvVY",
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        if (!response.ok) {
            console.error("Errore HTTP:", response.status, response.statusText);
            return response.json().then(errorData => {
                console.error("Dettagli Errore Server:", errorData);
                throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
            });
        }
        return response.json();
    })
    .then(product => {
        const container = document.getElementById("productDetailsContainer");

        container.innerHTML = `
            <p>ID: ${product._id}</p>
            <p>Nome: ${product.name}</p>
            <p>Descrizione: ${product.description}</p>
            <p>Brand: ${product.brand}</p>
            <p>Immagine: <img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%;"></p>
            <p>Prezzo: ${product.price}€</p>
            <p>Utente: ${product.userId}</p>
            <p>Creato il: ${new Date(product.createdAt).toLocaleString()}</p>
            <p>Aggiornato il: ${new Date(product.updatedAt).toLocaleString()}</p>
            <p>Versione: ${product.__v}</p>
        `;

    })
    .catch(error => {
        console.error(error);
        document.getElementById("productDetailsContainer").innerHTML = `<p>${error.message}</p>`;
    });
}


//FUNZIONE PER CANCELLARE UN PRODOTTO

function deleteProduct(id) {
    fetch(`https://striveschool-api.herokuapp.com/api/product/${id}`, {
    method: "DELETE",
    headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzE3YjZhODVkNzU4NzAwMTUzNzg2MzciLCJpYXQiOjE3Mjk3NzkwNDQsImV4cCI6MTczMDk4ODY0NH0.Hkv2gHH40EHH0QO6xnyD9JlMDM3zlyNQWZNRlwgFvVY",
    }

  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nella richiesta DELETE");
      }
      return response.json();
    })
    .then(() => getAvailableProducts())
    .then(() => getProducts())
    .catch((error) => console.error("Errore:", error));
} 
