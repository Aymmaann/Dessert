const dessertCards = document.querySelector(".dessert-cards");
const emptyCart = document.querySelector(".empty-cart");
const cartAmt = document.querySelector(".cart-amt");
const confirmBtn = document.querySelector(".confirm-btn");
const newOrder = document.querySelector(".new-order");
const overlayBill = document.querySelector(".overlay-bill");
const wrapper = document.querySelector(".wrapper");
const main = document.querySelector("main");
let displayBillCount = 0;


fetch("data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        data.forEach(foodItem => {
            createCard(foodItem);
        });
        updateCartAmt();
    })
    .catch(error => {
        console.error("Error: ", error);
    });


confirmBtn.addEventListener("click", () => {
    if(displayBillCount % 2 === 0) {
        overlayBill.style.display = "block";
        wrapper.style.display = "block";
        document.body.style.overflow = "hidden";
    }
    else {
        overlayBill.style.display = "none";
        wrapper.style.display = "none";
        document.body.style.overflow = "auto";
    }
    displayBillCount++;
});


newOrder.addEventListener("click", () => {
    overlayBill.style.display = "none";
    wrapper.style.display = "none";
    document.body.style.overflow = "auto";

    const dessertCard = document.querySelectorAll(".dessert-card"); 
    dessertCard.forEach(card => {
        card.querySelector(".dessert-img").classList.remove("border");
        card.querySelector(".quantity").textContent = "0";
        card.querySelector(".not-added").style.display = "flex";
        card.querySelector(".added").style.display = "none";
    });

    const orderContainers = document.querySelectorAll(".order-container");
    orderContainers.forEach(orderItem => {
        orderItem.remove();
    });

    const billItemContainer = document.querySelectorAll(".bill-item-container");
    billItemContainer.forEach(container => {
        container.remove();
    });

    const orderTotal = document.querySelector(".order-total");
    const feature = document.querySelector(".feature");
    orderTotal.style.display = "none";
    feature.style.display = "none";
    confirmBtn.style.display = "none";
    cartAmt.textContent = "0";
    emptyCart.style.display = "flex";
    wrapper.style.display = "none";
    displayBillCount = 0;
});


function updateCartAmt() {
    const dessertCard = document.querySelectorAll(".dessert-card");
    const orderTotal = document.querySelector(".order-total");
    const feature = document.querySelector(".feature");
    let amt = 0;

    dessertCard.forEach(card => {
        let itemAmt = parseInt(card.querySelector(".quantity").textContent);
        amt += itemAmt;
        addItemToCart(itemAmt, card);
    });

    cartAmt.textContent = amt;

    if (amt > 0) {
        emptyCart.style.display = "none";
        orderTotal.style.display = "flex";
        feature.style.display = "flex";
        confirmBtn.style.display = "block";
    }
    else {
        emptyCart.style.display = "flex";
        orderTotal.style.display = "none";
        feature.style.display = "none";
        confirmBtn.style.display = "none";
    }
}


function calculateTotal() {
    const orderContainers = document.querySelectorAll(".order-container");
    const orderTotal = document.querySelector(".order-total");
    const overlayBillTotal = document.querySelector(".overlay-final-bill-amt");
    let totalBill = 0;

    orderContainers.forEach(orderItem => {
        totalBill += parseFloat(orderItem.querySelector(".total-cost").textContent);
    });
    orderTotal.querySelector(".final-bill-amt").textContent = totalBill.toFixed(2);
    overlayBillTotal.textContent = totalBill.toFixed(2);
}


function updateOrderPrice(currentQuantity, card) {
    const orderContainers = document.querySelectorAll(".order-container");
    const overlayBillContainers = document.querySelectorAll(".bill-item-container");

    orderContainers.forEach(orderItem => {
        if (orderItem.querySelector(".order-item-name").textContent === card.querySelector(".name").textContent) {
            if(currentQuantity === 0) {
                orderItem.remove();
            }
            else {
                orderItem.querySelector(".item-count").textContent = currentQuantity;
                let price = parseFloat(orderItem.querySelector(".item-cost").textContent);
                orderItem.querySelector(".total-cost").textContent = parseFloat(price * currentQuantity).toFixed(2);
            }
        }
    });

    overlayBillContainers.forEach(billItem => {
        if (billItem.querySelector(".bill-item-name").textContent === card.querySelector(".name").textContent) {
            if(currentQuantity === 0) {
                billItem.remove();
            }
            else {
                billItem.querySelector(".bill-item-count").textContent = currentQuantity;
                let price = parseFloat(billItem.querySelector(".item-cost").textContent);
                billItem.querySelector(".bill-item-total-price").textContent = parseFloat(price * currentQuantity).toFixed(2);
            }
        }
    });
}


function addItemToCart(itemAmt, card) {
    if (itemAmt > 0) {
        const orders = document.querySelector(".order-containers");
        const billItemContainersSection = document.querySelector(".bill-item-containers-section");
        let count = 0;

        orders.querySelectorAll(".order-container").forEach(orderContainer => {
            if (orderContainer.querySelector(".order-item-name").textContent === card.querySelector(".name").textContent) {
                count++;
            }
        });

        if (count === 0) {
            const orderContainer = document.createElement("div");
            orderContainer.classList.add("order-container");

            let price = parseFloat(card.querySelector(".price").textContent.replace('$', '')).toFixed(2);

            orderContainer.innerHTML = `
                <div class="order">
                    <div class="order-text">
                        <p class="order-item-name">${card.querySelector(".name").textContent}</p>
                        <div class="order-item-pricing">
                            <p class="item-count-text"><span class="item-count">${itemAmt}</span>x</p>
                            <p class="item-cost-text">@ $<span class="item-cost">${price}</span></p>
                            <p class="total-cost-text">$<span class="total-cost">${(itemAmt * price).toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div class="cancel-icon">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
                <hr>
            `;

            orders.appendChild(orderContainer);
            
            const overlayBillContainer = document.createElement("div");
            overlayBillContainer.classList.add("bill-item-container");
            overlayBillContainer.innerHTML = `
                <div class="bill-item-container">
                    <div class="bill-item-section">
                        <div class="bill-item">
                            <div class="bill-item-details">
                                <img src="${card.querySelector(".dessert-img").src}" alt="">
                                <div class="bill-item-text">
                                    <p class="bill-item-name">${card.querySelector(".name").textContent}</p>
                                    <div class="bill-item-pricing">
                                        <p class="bill-item-count-text"><span class="bill-item-count">${itemAmt}</span>x</p>
                                        <p class="item-cost-text">@ $<span class="item-cost">${price}</span></p>
                                    </div>
                                </div>
                            </div>
                            <p class="bill-total-cost-text">$<span class="bill-item-total-price">${(itemAmt * price).toFixed(2)}</span></p>
                        </div>
                    </div>
                    <hr class="bill-divider">
                </div>`;

            billItemContainersSection.appendChild(overlayBillContainer);

            const cancelIcon = orderContainer.querySelector(".cancel-icon");
            cancelIcon.addEventListener("click", () => {
                card.querySelector(".quantity").textContent = "0";
                card.querySelector(".added").style.display = "none";
                card.querySelector(".not-added").style.display = "flex";
                card.querySelector(".dessert-img").classList.remove("border");
                orderContainer.remove();
                overlayBillContainer.remove();
                updateCartAmt();
                calculateTotal();
            });
        }
    }
}


function createCard(foodItem) {
    let count = 0;
    const dessertCard = document.createElement("div");
    dessertCard.classList.add("dessert-card");

    const dessertImg = document.createElement("img");
    dessertImg.classList.add("dessert-img");
    if(window.innerWidth < 577) {
        dessertImg.src = foodItem.image.mobile;
    }
    else {
        dessertImg.src = foodItem.image.desktop;
    }
    window.addEventListener("resize", () => {
        if(window.innerWidth < 577) {
            dessertImg.src = foodItem.image.mobile;
        }
        else {
            dessertImg.src = foodItem.image.desktop;
        }
    });
    dessertImg.alt = foodItem.name;
    dessertCard.appendChild(dessertImg);

    const notAdded = document.createElement("div");
    notAdded.classList.add("not-added");

    const notAddedImg = document.createElement("img");
    notAddedImg.src = "./images/icon-add-to-cart.svg";
    notAddedImg.alt = "Cart icon";
    notAdded.appendChild(notAddedImg);

    const notAddedText = document.createElement("p");
    notAddedText.classList.add("cart-btn-text");
    notAddedText.textContent = "Add to Cart";
    notAdded.appendChild(notAddedText);

    dessertCard.appendChild(notAdded);

    const added = document.createElement("div");
    added.classList.add("added");

    const minusIcon = document.createElement("div");
    minusIcon.classList.add("minus-icon", "icons");
    const minusIconInner = document.createElement("i");
    minusIconInner.classList.add("fa-solid", "fa-minus");
    minusIcon.appendChild(minusIconInner);
    added.appendChild(minusIcon);

    const quantity = document.createElement("p");
    quantity.classList.add("quantity");
    quantity.textContent = "0";
    added.appendChild(quantity);

    const plusIcon = document.createElement("div");
    plusIcon.classList.add("plus-icon", "icons");
    const plusIconInner = document.createElement("i");
    plusIconInner.classList.add("fa-solid", "fa-plus");
    plusIcon.appendChild(plusIconInner);
    added.appendChild(plusIcon);

    dessertCard.appendChild(added);

    const category = document.createElement("p");
    category.classList.add("category");
    category.textContent = foodItem.category;
    dessertCard.appendChild(category);

    const name = document.createElement("p");
    name.classList.add("name");
    name.textContent = foodItem.name;
    dessertCard.appendChild(name);

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = `$${parseFloat(foodItem.price).toFixed(2)}`;
    dessertCard.appendChild(price);


    notAdded.addEventListener("click", () => {
        let currentQuantity = parseInt(quantity.textContent);
        notAdded.style.display = "none";
        added.style.display = "flex";
        dessertImg.classList.add("border");

        if(notAdded.style.display === "none") {
            count = 0;
        }

        if (count === 0) {
            quantity.textContent = "1";
            currentQuantity = 1;
            count++;
        }
        updateCartAmt();
        updateOrderPrice(currentQuantity, dessertCard);
        calculateTotal();
    });


    plusIcon.addEventListener("click", () => {
        let currentQuantity = parseInt(quantity.textContent);
        quantity.textContent = currentQuantity + 1;
        currentQuantity++;
        updateCartAmt();
        updateOrderPrice(currentQuantity, dessertCard);
        calculateTotal();
    });

    minusIcon.addEventListener("click", () => {
        let currentQuantity = parseInt(quantity.textContent);

        if (currentQuantity > 1) {
            quantity.textContent = currentQuantity - 1;
            currentQuantity--;
        } 
        else if (currentQuantity === 1) {
            quantity.textContent = "0";
            currentQuantity = 0;
            added.style.display = "none";
            notAdded.style.display = "flex";
            dessertImg.classList.remove("border");
            count = 0;
        }
        updateCartAmt();
        updateOrderPrice(currentQuantity, dessertCard);
        calculateTotal();
    });

    dessertCards.appendChild(dessertCard);
}
