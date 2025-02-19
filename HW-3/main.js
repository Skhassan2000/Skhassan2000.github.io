document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const dishDescriptionBox = document.createElement('div');
    dishDescriptionBox.classList.add('dish-description');
    document.querySelector('.menu-list').appendChild(dishDescriptionBox);
    dishDescriptionBox.style.display = 'none';

    // Dish selection logic
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Reset all items
            menuItems.forEach(dish => dish.classList.remove('highlighted'));
            dishDescriptionBox.style.display = 'none';

            // Highlight selected item
            item.classList.add('highlighted');

            // Show the description of the selected dish
            dishDescriptionBox.style.display = 'block';
            dishDescriptionBox.innerHTML = `
                <h4>${item.textContent}</h4>
                <p>${item.dataset.description}</p>
                <strong>Price: $${parseFloat(item.dataset.price).toFixed(2)}</strong>
                <button class="add-to-plan" data-dish="${item.textContent}" data-price="${item.dataset.price}">Add to Meal Plan</button>
            `;
        });
    });

    // Meal Plan Logic
    const mealList = document.querySelector('.meal-list');
    const totalAmount = document.querySelector('.total-amount');
    let mealPlan = {};

    function updateMealPlan() {
        mealList.innerHTML = '';
        let total = 0;

        for (const dish in mealPlan) {
            const { name, price, quantity } = mealPlan[dish];

            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.dataset.dish = dish;
            mealItem.innerHTML = `
                <span>${name} - $${price.toFixed(2)} x ${quantity}</span>
                <button class="increase" data-dish="${dish}">+</button>
                <button class="decrease" data-dish="${dish}">-</button>
                <button class="remove" data-dish="${dish}">Remove</button>
            `;

            mealList.appendChild(mealItem);
            total += price * quantity;
        }

        totalAmount.textContent = total.toFixed(2);
    }

    // Add item to meal plan when "Add to Meal Plan" is clicked
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-plan')) {
            const dishName = event.target.dataset.dish;
            const dishPrice = parseFloat(event.target.dataset.price);

            if (mealPlan[dishName]) {
                mealPlan[dishName].quantity++;
            } else {
                mealPlan[dishName] = { name: dishName, price: dishPrice, quantity: 1 };
            }

            updateMealPlan();
        }
    });

    // Handle increase, decrease, and remove buttons
    mealList.addEventListener('click', (event) => {
        const dishName = event.target.dataset.dish;
        if (!dishName) return;

        if (event.target.classList.contains('increase')) {
            mealPlan[dishName].quantity++;
        } else if (event.target.classList.contains('decrease')) {
            mealPlan[dishName].quantity--;
            if (mealPlan[dishName].quantity === 0) {
                delete mealPlan[dishName];
            }
        } else if (event.target.classList.contains('remove')) {
            delete mealPlan[dishName];
        }

        updateMealPlan();
    });

    updateMealPlan();
});
