 let cartItems = [];
        let cartCount = 0;

        function addToCart(itemName, price) {
            cartItems.push({
                name: itemName,
                price: price,
                id: Date.now()
            });
            
            cartCount++;
            document.getElementById('cartCount').textContent = cartCount;
            
            // Simula a persistência do carrinho
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Mostra a confirmação
            showAddedToCart(itemName);
        }

        function showAddedToCart(itemName) {
            // Cria a notificação temporária
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 30px;
                background: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 1001;
                font-weight: bold;
            `;
            notification.innerHTML = `<i class="bi bi-check-circle"></i> ${itemName} adicionado ao pedido!`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3000);
        }

        function goToCart() {
            if (cartCount > 0) {
                window.location.href = 'pedidos.html';
            } else {
                alert('Seu carrinho está vazio. Adicione alguns itens primeiro!');
            }
        }

        // Carrega o carrinho na página
        window.addEventListener('load', function() {
            const savedCart = sessionStorage.getItem('cartItems');
            if (savedCart) {
                cartItems = JSON.parse(savedCart);
                cartCount = cartItems.length;
                document.getElementById('cartCount').textContent = cartCount;
            }
        });