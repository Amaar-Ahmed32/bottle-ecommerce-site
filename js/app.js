/**
 * HydroVibe Global Application Core Engine
 * Manages UI view operations, state sync synchronization, and Client Storage Pipelines
 */

// Global Immutable Mock Catalog Matrix Array (Synchronized globally for UI construction logic)
const PRODUCT_CATALOG = {
    1: { name: "Vibe-Flask Neon Neon", price: 39.99, img: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=200&q=80" },
    2: { name: "Quantum Shaker Pro", price: 29.99, img: "https://images.unsplash.com/photo-1618506469810-282bef2b30b3?auto=format&fit=crop&w=200&q=80" },
    3: { name: "Titanium Stealth Core", price: 59.99, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=200&q=80" },
    4: { name: "HyperFlo Glitch Glass", price: 24.99, img: "https://images.unsplash.com/photo-1597687210367-94943962dc25?auto=format&fit=crop&w=200&q=80" },
    5: { name: "Magma Thermal Vessel", price: 49.99, img: "https://images.unsplash.com/photo-1575844264771-8920810cd9af?auto=format&fit=crop&w=200&q=80" },
    6: { name: "Chrono Pulse Bottle", price: 34.99, img: "https://images.unsplash.com/photo-1589362400099-2a439da122c2?auto=format&fit=crop&w=200&q=80" }
};

// Application State Domain Object
let appState = {
    cart: JSON.parse(localStorage.getItem('hydrovibe_cart_manifest')) || []
};

document.addEventListener("DOMContentLoaded", () => {
    initGlobalNavigation();
    syncCartIndicatorGlobal();
    
    // Dynamic Application Runtime Verification Router Execution
    if (document.getElementById('cartTableBody')) {
        renderCartManifestUI();
    }
    if (document.getElementById('standaloneProductWrapper')) {
        initProductDetailsEngine();
    }
    if (document.querySelector('.products-grid')) {
        initCatalogActionInterceptors();
    }
});

/* ==========================================================================
   GLOBAL COMPONENT FUNCTIONALITY
   ========================================================================== */
function initGlobalNavigation() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.textContent = menu.classList.contains('active') ? '✕' : '☰';
        });
    }
}

function syncCartIndicatorGlobal() {
    const totalUnitsCount = appState.cart.reduce((accum, obj) => accum + obj.quantity, 0);
    const badgeElement = document.getElementById('cartBadge');
    if (badgeElement) {
        badgeElement.textContent = totalUnitsCount;
    }
}

function persistStateToStorage() {
    localStorage.setItem('hydrovibe_cart_manifest', JSON.stringify(appState.cart));
    syncCartIndicatorGlobal();
}

/* ==========================================================================
   CATALOG INTERACTION HANDLING (Home / Shop Cards)
   ========================================================================== */
function initCatalogActionInterceptors() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            const targetId = parseInt(card.getAttribute('data-id'), 10);
            pushItemToCartState(targetId, 1);
            
            // Neon Ripple Button Feedback Animation Effect
            const parentBtn = event.target;
            const baselineText = parentBtn.textContent;
            parentBtn.textContent = "CORE INJECTED ✓";
            parentBtn.style.background = "#fff";
            setTimeout(() => {
                parentBtn.textContent = baselineText;
                parentBtn.style.background = "var(--accent-neon)";
            }, 1000);
        });
    });
}

function pushItemToCartState(productId, qty) {
    const matchingNodeIndex = appState.cart.findIndex(entry => entry.id === productId);
    
    if (matchingNodeIndex > -1) {
        appState.cart[matchingNodeIndex].quantity += qty;
    } else {
        appState.cart.push({ id: productId, quantity: qty });
    }
    persistStateToStorage();
}

/* ==========================================================================
   PRODUCT DETAILS COMPONENT LAYER SPECIFIC ENGINE
   ========================================================================== */
function initProductDetailsEngine() {
    const masterPreview = document.getElementById('mainProductView');
    const thumbnails = document.querySelectorAll('.thumb-item');
    const increment = document.getElementById('increaseQty');
    const decrement = document.getElementById('decreaseQty');
    const counterField = document.getElementById('quantityField');
    const addActionBtn = document.getElementById('standaloneAddBtn');
    const contextContainer = document.getElementById('standaloneProductWrapper');

    // Swap main view image on thumbnail click
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            masterPreview.src = thumb.src.replace('&w=200', '&w=800');
        });
    });

    increment.addEventListener('click', () => {
        let current = parseInt(counterField.value, 10);
        counterField.value = current + 1;
    });

    decrement.addEventListener('click', () => {
        let current = parseInt(counterField.value, 10);
        if (current > 1) counterField.value = current - 1;
    });

    addActionBtn.addEventListener('click', () => {
        const itemTargetId = parseInt(contextContainer.getAttribute('data-id'), 10);
        const processingQuantity = parseInt(counterField.value, 10);
        pushItemToCartState(itemTargetId, processingQuantity);
        alert(`Dispatched [${processingQuantity}] structural units to cart pipeline successfully.`);
    });
}

/* ==========================================================================
   CART ENGINE MANIFEST RENDER COMPILING & CALCULATION LOGIC
   ========================================================================== */
function renderCartManifestUI() {
    const outputContainer = document.getElementById('cartTableBody');
    const fallbackBox = document.getElementById('emptyCartFeedback');
    
    if (!outputContainer) return;
    
    outputContainer.innerHTML = '';
    
    if (appState.cart.length === 0) {
        fallbackBox.style.display = 'block';
        evaluatePricingLedgerMath(0);
        return;
    }
    
    fallbackBox.style.display = 'none';
    let runningSubtotalAggregate = 0;

    appState.cart.forEach(cartRecord => {
        const productDefinition = PRODUCT_CATALOG[cartRecord.id];
        if (!productDefinition) return; // Prevent break on catalog changes

        const aggregateLineSum = productDefinition.price * cartRecord.quantity;
        runningSubtotalAggregate += aggregateLineSum;

        const tableRowElement = document.createElement('tr');
        tableRowElement.innerHTML = `
            <td>
                <div class="cart-item-meta">
                    <img class="cart-item-img" src="${productDefinition.img}" alt="${productDefinition.name}">
                    <div>
                        <div style="font-weight:700;">${productDefinition.name}</div>
                        <span class="cart-remove-btn" onclick="destroyCartRecordNode(${cartRecord.id})">Purge Unit</span>
                    </div>
                </div>
            </td>
            <td>$${productDefinition.price.toFixed(2)}</td>
            <td>
                <div class="qty-selector" style="width:max-content;">
                    <button class="qty-btn" onclick="modifyCartQuantityInline(${cartRecord.id}, -1)">-</button>
                    <input type="text" class="qty-input" value="${cartRecord.quantity}" readonly style="width:35px;">
                    <button class="qty-btn" onclick="modifyCartQuantityInline(${cartRecord.id}, 1)">+</button>
                </div>
            </td>
            <td style="font-weight:700; color:var(--accent-neon)">$${aggregateLineSum.toFixed(2)}</td>
        `;
        outputContainer.appendChild(tableRowElement);
    });

    evaluatePricingLedgerMath(runningSubtotalAggregate);
}

window.modifyCartQuantityInline = function(id, balanceStepModifier) {
    const targetedRecordIndex = appState.cart.findIndex(obj => obj.id === id);
    if (targetedRecordIndex === -1) return;

    const modifiedQuantity = appState.cart[targetedRecordIndex].quantity + balanceStepModifier;
    
    if (modifiedQuantity <= 0) {
        destroyCartRecordNode(id);
    } else {
        appState.cart[targetedRecordIndex].quantity = modifiedQuantity;
        persistStateToStorage();
        renderCartManifestUI();
    }
};

window.destroyCartRecordNode = function(id) {
    appState.cart = appState.cart.filter(item => item.id !== id);
    persistStateToStorage();
    renderCartManifestUI();
};

function evaluatePricingLedgerMath(subtotal) {
    const shippingThresholdConstant = subtotal > 0 ? 5.00 : 0.00; 
    const finalAggregateTotalResult = subtotal + shippingThresholdConstant;

    document.getElementById('subtotalTarget').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shippingTarget').textContent = `$${shippingThresholdConstant.toFixed(2)}`;
    document.getElementById('totalTarget').textContent = `$${finalAggregateTotalResult.toFixed(2)}`;
}