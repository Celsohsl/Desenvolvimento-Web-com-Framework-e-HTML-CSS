        let cartItems = [];
        const deliveryFee = 5.00;

        window.addEventListener('load', function() {
            loadCart();
            displayCartItems();
            updateSummary();
        });

        function loadCart() {
            const savedCart = sessionStorage.getItem('cartItems');
            if (savedCart) {
                cartItems = JSON.parse(savedCart);
            }
        }

        function saveCart() {
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        }

        function displayCartItems() {
            const cartContainer = document.getElementById('cartItems');
            const emptyCart = document.getElementById('emptyCart');
            const deliveryForm = document.getElementById('deliveryForm');
            const orderSummary = document.getElementById('orderSummary');

            if (cartItems.length === 0) {
                cartContainer.innerHTML = '';
                emptyCart.style.display = 'block';
                deliveryForm.style.display = 'none';
                orderSummary.style.display = 'none';
                return;
            }

            emptyCart.style.display = 'none';
            deliveryForm.style.display = 'block';
            orderSummary.style.display = 'block';

            // Agrupa itens por nome para exibição de quantidade
            const groupedItems = {};
            cartItems.forEach(item => {
                if (groupedItems[item.name]) {
                    groupedItems[item.name].quantity++;
                } else {
                    groupedItems[item.name] = {
                        ...item,
                        quantity: 1,
                        originalIds: [item.id]
                    };
                }
            });

            cartContainer.innerHTML = Object.values(groupedItems).map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">R$ ${item.price.toFixed(2)}</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decreaseQuantity('${item.name}')">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span style="min-width: 30px; text-align: center; font-weight: bold;">
                            ${item.quantity}
                        </span>
                        <button class="quantity-btn" onclick="increaseQuantity('${item.name}', ${item.price})">
                            <i class="bi bi-plus"></i>
                        </button>
                        <button class="remove-btn" onclick="removeItem('${item.name}')">
                            <i class="bi bi-trash"></i> Remover
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function increaseQuantity(itemName, price) {
            cartItems.push({
                name: itemName,
                price: price,
                id: Date.now()
            });
            saveCart();
            displayCartItems();
            updateSummary();
        }

        function decreaseQuantity(itemName) {
            const itemIndex = cartItems.findIndex(item => item.name === itemName);
            if (itemIndex > -1) {
                cartItems.splice(itemIndex, 1);
                saveCart();
                displayCartItems();
                updateSummary();
            }
        }

        function removeItem(itemName) {
            cartItems = cartItems.filter(item => item.name !== itemName);
            saveCart();
            displayCartItems();
            updateSummary();
        }

        function updateSummary() {
            const summaryContainer = document.getElementById('summaryItems');
            const subtotalEl = document.getElementById('subtotal');
            const totalEl = document.getElementById('total');

            if (cartItems.length === 0) return;

            // Agrupar itens para resumo
            const groupedItems = {};
            cartItems.forEach(item => {
                if (groupedItems[item.name]) {
                    groupedItems[item.name].quantity++;
                    groupedItems[item.name].total += item.price;
                } else {
                    groupedItems[item.name] = {
                        ...item,
                        quantity: 1,
                        total: item.price
                    };
                }
            });

            summaryContainer.innerHTML = Object.values(groupedItems).map(item => `
                <div class="d-flex justify-content-between mb-2">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>R$ ${item.total.toFixed(2)}</span>
                </div>
            `).join('');

            const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
            const total = subtotal + deliveryFee;

            subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
            totalEl.textContent = `R$ ${total.toFixed(2)}`;
        }

        function finalizeOrder() {
            if (cartItems.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            const form = document.getElementById('orderForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Simula o processo dos pedidos
            const orderNumber = Math.floor(Math.random() * 10000) + 1000;
            
            alert(`Pedido #${orderNumber} realizado com sucesso!\n\nResumo:\n- ${cartItems.length} itens\n- Total: R$ ${(cartItems.reduce((sum, item) => sum + item.price, 0) + deliveryFee).toFixed(2)}\n- Tempo estimado: 30-45 minutos\n\nObrigado por escolher a Orla do Café!`);
            
            // Limpa o carrinho
            cartItems = [];
            saveCart();
            displayCartItems();
            updateSummary();

            // Scroll para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }