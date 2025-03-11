// Wix APIを使用してECサイトの機能を統合するためのスクリプト

// Wix APIの初期化
document.addEventListener('DOMContentLoaded', function() {
    // Wix APIのロード
    loadWixAPI();

    // カートの初期化
    initializeCart();

    // 商品データの取得と表示
    fetchAndDisplayProducts();

    // 購入ボタンのイベントリスナーを設定
    setupPurchaseButtons();
});

// Wix APIをロードする関数
function loadWixAPI() {
    console.log('Wix APIをロード中...');
    // Wix APIのスクリプトを動的に読み込み
    const wixScript = document.createElement('script');
    wixScript.src = 'https://static.parastorage.com/services/js-sdk/1.425.0/js/wix-sdk.min.js';
    wixScript.async = true;
    wixScript.onload = function() {
        console.log('Wix APIのロードが完了しました');
        // Wix APIの初期化
        if (window.Wix) {
            window.Wix.init();
            console.log('Wix APIが初期化されました');
        }
    };
    document.head.appendChild(wixScript);
}

// カートを初期化する関数
function initializeCart() {
    // ローカルストレージからカート情報を取得
    let cart = JSON.parse(localStorage.getItem('wixCart')) || { items: [], total: 0 };
    
    // カート情報をグローバル変数として保存
    window.wixCart = cart;
    
    // カートの表示を更新
    updateCartDisplay();
}

// 商品データを取得して表示する関数
async function fetchAndDisplayProducts() {
    try {
        // 商品データの例（実際の実装ではWix APIからデータを取得）
        const products = [
            {
                id: 'product1',
                name: 'ミックスパック',
                price: 2000,
                image: 'images/product1.jpg',
                description: '天然藻シリカの力を活かした基本のミックスパック',
                weight: '1,000mg',
                stock: 10
            },
            {
                id: 'product2',
                name: '薬用スライドケース',
                price: 3300,
                image: 'images/product2.jpg',
                description: '持ち運びに便利なスライド式ケース入り',
                weight: '1,500mg',
                stock: 15
            },
            {
                id: 'product3',
                name: '10本セット',
                price: 12000,
                image: 'images/product3.jpg',
                description: 'お得な10本セット。長期使用におすすめ',
                weight: '10,000mg',
                stock: 5
            }
        ];
        
        // 商品データをグローバル変数として保存
        window.wixProducts = products;
        
        // 商品詳細ページへのリンクを設定
        updateProductLinks();
        
    } catch (error) {
        console.error('商品データの取得に失敗しました:', error);
    }
}

// 購入ボタンのイベントリスナーを設定する関数
function setupPurchaseButtons() {
    // 全ての購入ボタンを取得
    const purchaseButtons = document.querySelectorAll('.shop-button.wix');
    
    // 各ボタンにイベントリスナーを追加
    purchaseButtons.forEach((button, index) => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // 対応する商品を取得
            const product = window.wixProducts[index];
            
            if (product) {
                // カートに商品を追加
                addToCart(product);
                
                // カートモーダルを表示
                showCartModal();
            }
        });
    });
}

// カートに商品を追加する関数
function addToCart(product) {
    // カートが初期化されていない場合は初期化
    if (!window.wixCart) {
        window.wixCart = { items: [], total: 0 };
    }
    
    // 既にカートに同じ商品があるか確認
    const existingItem = window.wixCart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        // 既存の商品の数量を増やす
        existingItem.quantity += 1;
    } else {
        // 新しい商品をカートに追加
        window.wixCart.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // カートの合計金額を更新
    updateCartTotal();
    
    // カートの表示を更新
    updateCartDisplay();
    
    // カート情報をローカルストレージに保存
    localStorage.setItem('wixCart', JSON.stringify(window.wixCart));
    
    console.log(`「${product.name}」がカートに追加されました`);
}

// カートの合計金額を更新する関数
function updateCartTotal() {
    window.wixCart.total = window.wixCart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// カートの表示を更新する関数
function updateCartDisplay() {
    // カートアイコンの数量表示を更新
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const itemCount = window.wixCart.items.reduce((count, item) => count + item.quantity, 0);
        cartCountElement.textContent = itemCount;
        
        // アイテムがある場合はカウントを表示、ない場合は非表示
        if (itemCount > 0) {
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// カートモーダルを表示する関数
function showCartModal() {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById('cart-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // モーダルを作成
    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'modal';
    
    // モーダルの内容を作成
    let modalContent = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>ショッピングカート</h2>
    `;
    
    // カートが空の場合
    if (window.wixCart.items.length === 0) {
        modalContent += `
            <p class="empty-cart-message">カートは空です</p>
            <button class="continue-shopping">ショッピングを続ける</button>
        `;
    } else {
        // カート内の商品を表示
        modalContent += `
            <div class="cart-items">
        `;
        
        window.wixCart.items.forEach(item => {
            modalContent += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">¥${item.price.toLocaleString()}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">削除</button>
                </div>
            `;
        });
        
        modalContent += `
            </div>
            <div class="cart-summary">
                <div class="cart-total">
                    <span>合計:</span>
                    <span>¥${window.wixCart.total.toLocaleString()}</span>
                </div>
                <button class="checkout-btn">レジに進む</button>
                <button class="continue-shopping">ショッピングを続ける</button>
            </div>
        `;
    }
    
    modalContent += `
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // モーダルを表示
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 10);
    
    // 閉じるボタンのイベントリスナー
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // ショッピングを続けるボタンのイベントリスナー
    const continueButtons = modal.querySelectorAll('.continue-shopping');
    continueButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'none';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    });
    
    // レジに進むボタンのイベントリスナー
    const checkoutButton = modal.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            // チェックアウトページへ遷移
            proceedToCheckout();
        });
    }
    
    // 数量変更ボタンのイベントリスナー
    const quantityButtons = modal.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const isIncrease = button.classList.contains('increase');
            updateItemQuantity(productId, isIncrease);
            
            // モーダルを更新
            showCartModal();
        });
    });
    
    // 削除ボタンのイベントリスナー
    const removeButtons = modal.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            removeFromCart(productId);
            
            // モーダルを更新
            showCartModal();
        });
    });
}

// 商品の数量を更新する関数
function updateItemQuantity(productId, isIncrease) {
    const item = window.wixCart.items.find(item => item.id === productId);
    
    if (item) {
        if (isIncrease) {
            item.quantity += 1;
        } else {
            item.quantity -= 1;
            
            // 数量が0以下になった場合は商品を削除
            if (item.quantity <= 0) {
                removeFromCart(productId);
                return;
            }
        }
        
        // カートの合計金額を更新
        updateCartTotal();
        
        // カートの表示を更新
        updateCartDisplay();
        
        // カート情報をローカルストレージに保存
        localStorage.setItem('wixCart', JSON.stringify(window.wixCart));
    }
}

// カートから商品を削除する関数
function removeFromCart(productId) {
    window.wixCart.items = window.wixCart.items.filter(item => item.id !== productId);
    
    // カートの合計金額を更新
    updateCartTotal();
    
    // カートの表示を更新
    updateCartDisplay();
    
    // カート情報をローカルストレージに保存
    localStorage.setItem('wixCart', JSON.stringify(window.wixCart));
}

// チェックアウトページへ進む関数
function proceedToCheckout() {
    // チェックアウトモーダルを表示
    showCheckoutModal();
}

// チェックアウトモーダルを表示する関数
function showCheckoutModal() {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById('checkout-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // モーダルを作成
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'modal';
    
    // モーダルの内容を作成
    const modalContent = `
        <div class="modal-content checkout">
            <span class="close-modal">&times;</span>
            <h2>お客様情報の入力</h2>
            <form id="checkout-form">
                <div class="form-group">
                    <label for="name">お名前</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">メールアドレス</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">電話番号</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="address">住所</label>
                    <input type="text" id="address" name="address" required>
                </div>
                <div class="form-group">
                    <label for="payment">お支払い方法</label>
                    <select id="payment" name="payment" required>
                        <option value="">選択してください</option>
                        <option value="credit_card">クレジットカード</option>
                        <option value="bank_transfer">銀行振込</option>
                        <option value="convenience_store">コンビニ決済</option>
                    </select>
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <span>合計:</span>
                        <span>¥${window.wixCart.total.toLocaleString()}</span>
                    </div>
                </div>
                <button type="submit" class="order-btn">注文を確定する</button>
                <button type="button" class="back-to-cart">カートに戻る</button>
            </form>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // モーダルを表示
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 10);
    
    // 閉じるボタンのイベントリスナー
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // カートに戻るボタンのイベントリスナー
    const backButton = modal.querySelector('.back-to-cart');
    backButton.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
            showCartModal();
        }, 300);
    });
    
    // フォーム送信のイベントリスナー
    const form = modal.querySelector('#checkout-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // フォームデータを取得
        const formData = new FormData(form);
        const orderData = {};
        
        for (const [key, value] of formData.entries()) {
            orderData[key] = value;
        }
        
        // 注文データを作成
        const order = {
            customer: orderData,
            items: window.wixCart.items,
            total: window.wixCart.total,
            date: new Date().toISOString()
        };
        
        // 注文を処理（実際の実装ではWix APIを使用）
        processOrder(order);
    });
}

// 注文を処理する関数
function processOrder(order) {
    console.log('注文を処理中...', order);
    
    // 注文完了モーダルを表示
    showOrderCompleteModal();
    
    // カートをクリア
    clearCart();
}

// 注文完了モーダルを表示する関数
function showOrderCompleteModal() {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById('checkout-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // モーダルを作成
    const modal = document.createElement('div');
    modal.id = 'order-complete-modal';
    modal.className = 'modal';
    
    // モーダルの内容を作成
    const modalContent = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="order-complete">
                <i class="fas fa-check-circle"></i>
                <h2>ご注文ありがとうございます</h2>
                <p>ご注文が正常に処理されました。</p>
                <p>ご注文の確認メールをお送りしましたのでご確認ください。</p>
                <button class="continue-shopping">ショッピングを続ける</button>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // モーダルを表示
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 10);
    
    // 閉じるボタンのイベントリスナー
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // ショッピングを続けるボタンのイベントリスナー
    const continueButton = modal.querySelector('.continue-shopping');
    continueButton.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
}

// カートをクリアする関数
function clearCart() {
    window.wixCart = { items: [], total: 0 };
    
    // カートの表示を更新
    updateCartDisplay();
    
    // カート情報をローカルストレージから削除
    localStorage.removeItem('wixCart');
}

// 商品詳細ページへのリンクを更新する関数
function updateProductLinks() {
    const productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach((item, index) => {
        // 商品画像と商品名にクリックイベントを追加
        const productImage = item.querySelector('.product-image');
        const productName = item.querySelector('h3');
        
        if (productImage && window.wixProducts[index]) {
            productImage.style.cursor = 'pointer';
            productImage.addEventListener('click', () => {
                showProductDetails(window.wixProducts[index]);
            });
        }
        
        if (productName && window.wixProducts[index]) {
            productName.style.cursor = 'pointer';
            productName.addEventListener('click', () => {
                showProductDetails(window.wixProducts[index]);
            });
        }
    });
}

// 商品詳細モーダルを表示する関数
function showProductDetails(product) {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById('product-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // モーダルを作成
    const modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.className = 'modal';
    
    // モーダルの内容を作成
    const modalContent = `
        <div class="modal-content product-details">
            <span class="close-modal">&times;</span>
            <div class="product-details-container">
                <div class="product-details-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details-info">
                    <h2>${product.name}</h2>
                    <p class="product-details-price">¥${product.price.toLocaleString()}<span>(税込)</span></p>
                    <p class="product-details-weight">${product.weight}</p>
                    <p class="product-details-description">${product.description}</p>
                    <p class="product-details-stock">在庫: ${product.stock}個</p>
                    <div class="product-details-quantity">
                        <label for="quantity">数量:</label>
                        <div class="quantity-selector">
                            <button class="quantity-btn decrease">-</button>
                            <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                            <button class="quantity-btn increase">+</button>
                        </div>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">カートに追加</button>
                </div>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // モーダルを表示
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 10);
    
    // 閉じるボタンのイベントリスナー
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // 数量変更ボタンのイベントリスナー
    const quantityInput = modal.querySelector('#quantity');
    const decreaseButton = modal.querySelector('.quantity-btn.decrease');
    const increaseButton = modal.querySelector('.quantity-btn.increase');
    
    decreaseButton.addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
        }
    });
    
    increaseButton.addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        if (quantity < product.stock) {
            quantityInput.value = quantity + 1;
        }
    });
    
    // カートに追加ボタンのイベントリスナー
    const addToCartButton = modal.querySelector('.add-to-cart-btn');
    addToCartButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        
        // 指定された数量分、商品をカートに追加
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        
        // モーダルを閉じる
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
            
            // カートモーダルを表示
            showCartModal();
        }, 300);
    });
}
