// array variable containing all meals
const dishes = Array.from(document.querySelectorAll('.dish'));

// called when the user clicks a meal
function meal_clicked(meal) {
    const dish_option = meal.classList[1];
    const meal_is_clicked = meal.classList.contains('dish_box_check');
    const option_dishes = Array.from(document.querySelectorAll(`.${dish_option}`));

    if (!meal_is_clicked) {
        search_and_unselect_selected_meals(option_dishes);
    }

    add_remove_check(meal);

    const quantity_selector = meal.querySelector('.quantity');
    const sub_menu = meal.querySelector('.sub_menu');
    if (meal_is_clicked) {
        quantity_selector.classList.add('display_none');
        sub_menu.classList.add('display_none');
    } else {
        quantity_selector.classList.remove('display_none');
        sub_menu.classList.remove('display_none');
    }

    if (check_if_order_is_over()) {
        release_order_button();
    } else {
        hold_order_button();
    }
}

function search_and_unselect_selected_meals(option_dishes) {
    for (let dish_index in option_dishes) {
        if (option_dishes[dish_index].classList.contains('dish_box_check')) {
            add_remove_check(option_dishes[dish_index]);
            option_dishes[dish_index].querySelector('.quantity').classList.add('display_none');
            option_dishes[dish_index].querySelector('.sub_menu').classList.add('display_none');
            break;
        }
    }
}

function add_remove_check(meal) {
    meal.classList.toggle('dish_box_check'); 
    meal.querySelector('.dish_check').classList.toggle('display_none');
}

function update_quantity(select) {
    const meal = select.parentElement;
    const quantity = select.value;
    meal.setAttribute('data-quantity', quantity);
}

function select_submenu_item(button, item) {
    const sub_menu = button.parentElement;
    const meal = sub_menu.parentElement;
    const selected_item = sub_menu.querySelector('.selected_sub_item');

    if (selected_item) {
        selected_item.classList.remove('selected_sub_item');
    }

    button.classList.add('selected_sub_item');
    meal.setAttribute('data-submenu-item', item);
}

function check_if_order_is_over() {
    let meals_selected = 0;
    for (let dish_index in dishes) {
        if (dishes[dish_index].classList.contains('dish_box_check')) {
            meals_selected++;
        }
    }
    return (meals_selected === 3);
}

function release_order_button() {
    const order_button = document.querySelector('.order_button');
    order_button.classList.add('order_button_ready');
    order_button.innerHTML = 'Tutup pesanan';
}

function hold_order_button() {
    const order_button = document.querySelector('.order_button');
    if (order_button.classList.contains('order_button_ready')) {
        order_button.classList.remove('order_button_ready');
        order_button.innerHTML = 'Pilih 3 item \n untuk menutup pesanan';
    }
}

function release_confirm_section(){
    const meals_selected = check_for_meals_selected();
    const meals_names_selected = meals_selected[0];
    const meals_prices_selected = meals_selected[1];

    const meals_names = Array.from(document.querySelectorAll('.final_order_meal_name'));
    const meals_prices = Array.from(document.querySelectorAll('.final_order_meal_price')); 
    const meal_total_price = document.querySelector('.final_order_meal_total_price');
    const order_button = document.querySelector('.order_button');
    const confirm_section = document.querySelector('#order-confirmation');
    const menu_selection = document.querySelector('#menu-selection');

    change_confirm_section_param(meals_names_selected, meals_names, meals_prices_selected, meals_prices);

    meal_total_price.innerHTML = calculate_final_order_total_price(meals_prices_selected);

    if (order_button.classList.contains('order_button_ready')){
        menu_selection.classList.add('display_none');
        confirm_section.classList.remove('display_none');
    }
}

function change_confirm_section_param(meals_names_selected, meals_names, meals_prices_selected, meals_prices){
    change_meals_names(meals_names_selected, meals_names);
    change_meals_prices(meals_prices_selected, meals_prices);
}

function change_meals_names(meals_names_selected, meals_names){
    for (let meal_name_index in meals_names_selected) {
        meals_names[meal_name_index].innerHTML = meals_names_selected[meal_name_index];
    }
}

function change_meals_prices(meals_prices_selected, meals_prices){
    for (let meal_price_index in meals_prices_selected) {
        meals_prices[meal_price_index].innerHTML = meals_prices_selected[meal_price_index];
    }
}

function calculate_final_order_total_price(meals_prices_selected){
    let total_price = 0;

    for (let meal_price_index in meals_prices_selected) {
        total_price += Number(meals_prices_selected[meal_price_index]);
    }
    total_price = total_price.toFixed(2); 
    
    return total_price;        
}

function cancel_order(){
    const confirm_section = document.querySelector('#order-confirmation');
    const menu_selection = document.querySelector('#menu-selection');

    confirm_section.classList.add('display_none');
    menu_selection.classList.remove('display_none');
}

function ask_name_and_address(){
    const meals_selected = check_for_meals_selected();
    const meals_names_selected = meals_selected[0];
    const meals_prices_selected = meals_selected[1];
    
    const name = prompt("Silakan ketikkan nama Anda: ");    
    const address = prompt("Silakan ketikkan alamat Anda: ");
    const payment_method = document.getElementById('payment_method').value;

    send_whatsapp_message(meals_names_selected, meals_prices_selected, name, address, payment_method);
}

function send_whatsapp_message(meals_names_selected, meals_prices_selected, name, address, payment_method){
    let text_to_send = `Halo, saya ingin memesan:
    - Hidangan: ${meals_names_selected[0]}
    - Minuman: ${meals_names_selected[1]}
    - Makanan Penutup: ${meals_names_selected[2]}
    Total: Rp ${calculate_final_order_total_price(meals_prices_selected)}
    
    Nama: ${name}
    Alamat: ${address}
    Metode Pembayaran: ${payment_method}`;

    text_to_send = encodeURIComponent(text_to_send);

    window.open(`https://wa.me/089530653382?text=${text_to_send}`);
}

function check_for_meals_selected() {
    let meals_selected_names = [];
    let meals_selected_prices = [];

    for (let dish_index in dishes) {
        if (dishes[dish_index].classList.contains('dish_box_check')) {
            const submenu_item = dishes[dish_index].getAttribute('data-submenu-item') || '';
            meals_selected_names.push(dishes[dish_index].querySelector('h4').innerHTML + (submenu_item ? ` dengan ${submenu_item}` : ''));             
            let price = dishes[dish_index].querySelector('.price').innerHTML.slice(3).replace(",",".");
            let quantity = dishes[dish_index].getAttribute('data-quantity') || 1;
            meals_selected_prices.push((price * quantity).toFixed(2));
        }
    }     
    return [meals_selected_names, meals_selected_prices];
}
