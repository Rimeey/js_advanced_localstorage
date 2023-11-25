'use strict'

const shopsArr = [
    {
        id: 1,
        pic: '1003614-1.jpg',
        title: 'Чорний чай Hello Tea Ялівець Евкаліпт фільтр-пак 20 шт',
        price: 69.00
    },
    {
        id: 2,
        pic: '1003615-1.jpg',
        title: 'Чорний чай Hello Tea Ерл Грей фільтр-пак 20 шт',
        price: 69.00
    },
    {
        id: 3,
        pic: '1003613.jpg',
        title: 'Чорний чай Hello Tea Чебрець Лаванда фільтр-пак 20 шт',
        price: 69.70
    },
    {
        id: 4,
        pic: '1003616-1.jpg',
        title: 'Чорний чай Hello Tea Дарджилінг фільтр-пак 20 шт',
        price: 69.40
    },
    {
        id: 5,
        pic: '1003612-1.jpg',
        title: 'Чорний чай Hello Tea Масала фільтр-пак 20 шт',
        price: 69.50
    },
    {
        id: 6,
        pic: '4820198874209.jpg',
        title: 'Чорний чай Мономах Earl Grey у пакетиках 40+5 шт',
        price: 55.00
    }
]

class Shop {
    constructor(shop, basket) {
        this.shop = document.querySelector(shop);
        this.basket = document.querySelector(basket);
        this.bt_table = this.basket.querySelector('.bt .bt_table');
        this.shop_items = this.shop.querySelectorAll('.shop_item');
        this.sum = this.basket.querySelector('.bt .sum');
        this.basket_btn = this.basket.querySelector('.bt button');
        this.btn = this.shop.querySelectorAll('button');
        this.basket_hr = this.bt_table.querySelectorAll('.hr');
        this.basket_span = this.bt_table.querySelector('span');
        this.counter = this.counter.bind(this);
    }

    default() {
        this.basket_hr.forEach(elem => { elem.style.display = null});
        this.basket_span.textContent = 'Наразi ваш кошик порожнiй';

        this.sum.style.display = 'none';
        this.basket_btn.style.display = 'none';
    }
    undefault() {
        this.basket_hr.forEach(elem => { elem.style.display = 'none'});
        this.basket_span.textContent = '';

        this.sum.style.display = null;
        this.basket_btn.style.display = null;
    }

    arranger_items() {
        this.shop_items.forEach(elem => {
            elem.querySelector('.image').style.background = `lightgray 50% / cover no-repeat url(./images/${shopsArr[elem.id].pic})`;
            elem.querySelector('#title').textContent = `${shopsArr[elem.id].title}`;
            elem.querySelector('#price').textContent = `${shopsArr[elem.id].price.toFixed(2)} грн`;
        });
    }

    basket_item() {
        this.btn.forEach((elem) => {
            elem.addEventListener('click', (e) => {

                this.undefault();

                let str = `
                    <div class="bt_item" id="${e.target.parentElement.parentElement.id}">
                    <div class="ellipse del">x</div>
                        <div class="image" style="background:lightgray 50% / cover no-repeat url(./images/${shopsArr[e.target.parentElement.parentElement.id].pic});"></div>
                        <div class="description">
                            <p>${shopsArr[e.target.parentElement.parentElement.id].title}</p>
                            <p>${e.target.previousElementSibling.innerText}</p>
                        </div>
                        <div class="counter">
                            <div class="ellipse" id="minus">-</div>
                            <div class="count">1</div>
                            <div class="ellipse" id="plus">+</div>
                        </div>
                        <p class="price">${shopsArr[e.target.parentElement.parentElement.id].price.toFixed(2)}</p><p>грн</p>
                    </div>`

                this.bt_table.insertAdjacentHTML('afterbegin', str);
                this.sum_items();
                this.delete_items();
                this.updateLocalStorage();
            })
        });
    }

    delete_items() {
        let iks = this.bt_table.querySelectorAll('.bt_item .del');

        iks.forEach(elem => {
            elem.addEventListener('click', (e) => {
                e.target.parentElement.remove();
                this.sum_items();
                this.updateLocalStorage();
            });
        });
    }

    sum_items() {
        this.count();
        let sum = 0;
        this.bt_table.querySelectorAll('.bt_item').forEach(elem => {
            let count = elem.querySelector('.counter .count').textContent;
            sum += +elem.querySelector('.price').textContent * +count;
        });
        this.sum.textContent = `${sum.toFixed(2)} грн`;

        if (this.bt_table.children.length < 6) {
            this.default();
        }
        this.updateLocalStorage();
    }

    counter(e) {
        const item = e.target.closest('.bt_item');
    
        if (e.target.matches('#minus')) {
            const countElement = item.querySelector('.count');
            const currentCount = +countElement.textContent;
            
            if (currentCount > 1) {
                countElement.textContent = currentCount - 1;
                this.sum_items();
            }
        }
    
        if (e.target.matches('#plus')) {
            const countElement = item.querySelector('.count');
            const currentCount = +countElement.textContent;
            countElement.textContent = currentCount + 1;
            this.sum_items();
        }
    }

    count() {
        this.bt_table.querySelectorAll('.bt_item').forEach(elem => {
            elem.addEventListener('click', this.counter);
        });
    }

    updateLocalStorage() {
        localStorage.setItem('basketItems', JSON.stringify(Array.from(this.bt_table.querySelectorAll('.bt_item')).map(item => ({
            id: item.id,
            count: item.children[3].children[1].textContent
        }))));
    }

    loadBasketFromStorage() {
        const storedItems = JSON.parse(localStorage.getItem('basketItems')) || [];
        storedItems.forEach(item => {
            let str = `
            <div class="bt_item" id="${item.id}">
            <div class="ellipse del">x</div>
                <div class="image" style="background:lightgray 50% / cover no-repeat url(./images/${shopsArr[item.id].pic});"></div>
                <div class="description">
                    <p>${shopsArr[item.id].title}</p>
                    <p>${shopsArr[item.id].price.toFixed(2)} грн</p>
                </div>
                <div class="counter">
                    <div class="ellipse" id="minus">-</div>
                    <div class="count">${item.count}</div>
                    <div class="ellipse" id="plus">+</div>
                </div>
                <p class="price">${shopsArr[item.id].price.toFixed(2)}</p><p>грн</p>
            </div>
            `
            this.bt_table.insertAdjacentHTML('afterbegin', str);
        });
        this.sum_items();
        this.delete_items();
        if(storedItems.length > 0) {
            this.undefault();
        }
    }

    init() {
        this.default();
        this.arranger_items();
        this.basket_item();
        this.loadBasketFromStorage();
    }
}