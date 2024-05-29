// array variable containing all meals
const dishes = Array.from(document.querySelectorAll('.dish'));

// called when the user clicks a meal
function meal_clicked(meal) {
    // gets the second class of the meal being clicked, in this case it can be main, drink or dessert
    const dish_option = meal.classList[1];
    const meal_is_clicked = meal.classList.contains('dish_box_check');

    // creates a variable containing all the dishes belonged to the same class  
    const option_dishes = Array.from(document.querySelectorAll(`.${dish_option}`));

    // checks if current meal is already clicked, if not, enters the condition
    if(!meal_is_clicked) {
        // looks for other meals of the same type that are selected
        search_and_unselect_selected_meals(option_dishes);
    }
    
    // adds or removes green check in dish div and green check mark
    add_remove_check(meal);

    // checks if order is over to control final order button
    if(check_if_order_is_over()) {
        // changes button classes so it turns green, also changes it's text  
        release_order_button();
    } else {
        hold_order_button();
    }
}

// looks for meals of the same type that are selected, then unselect them
function search_and_unselect_selected_meals(option_dishes) {
    for(let dish_index in option_dishes) {
        // checks if dish is selected looking for the selected box class
        if(option_dishes[dish_index].classList.contains('dish_box_check')) {
            // adds or removes green check in dish div and green check mark
            add_remove_check(option_dishes[dish_index]);
            // breaks the function since just only one meal can be selected
            break;
        }
    }
}

// adds or removes green check in dish div and green check image
function add_remove_check(meal) {
    meal.classList.toggle('dish_box_check'); 
    meal.childNodes[9].classList.toggle('display_none'); // childNodes[9] to select green check mark
}

// checks if there are 3 meals selected
function check_if_order_is_over() {
    let meals_selected = 0;
    for(let dish_index in dishes) {
        if(dishes[dish_index].classList.contains('dish_box_check')) {
            meals_selected++;
        }
    }
    return (meals_selected === 3);
}

// 'releases' final orden button, turning it green and changing it's text
function release_order_button() {
    const order_button = document.querySelector('.order_button');

    order_button.classList.add('order_button_ready');
    order_button.innerHTML = 'Pesan Sekarang';
}

// 'holds' final order button
function hold_order_button() {
    const order_button = document.querySelector('.order_button');
    
    // if necessary removes the button's ready class if a meal was deselected 
    if(order_button.classList.contains('order_button_ready')) {
        order_button.classList.remove('order_button_ready');
        order_button.innerHTML = 'Pilih 3 menu \n dan pesan sekarang';
    }
}

// displays the last screen from the meals order, entering the confirmation section
function release_confirm_section(){
    // checks the names and prices of the meals that are selected 
    // check_for_meals_selected is a matrix that returns: [0] names, [1] prices
    const meals_names_selected = check_for_meals_selected()[0];
    const meals_prices_selected = check_for_meals_selected()[1];

    // constants containing all html elements necessary for confirmation screen logic
    const meals_names = Array.from(document.querySelectorAll('.final_order_meal_name'));
    const meals_prices = Array.from(document.querySelectorAll('.final_order_meal_price')); 
    const meal_total_price = document.querySelector('.final_order_meal_total_price');
    const order_button = document.querySelector('.order_button');
    const confirm_section = document.querySelector('.confirm_section');
    const transparent_background = document.querySelector('.transparent_background');

    // changes the last screen parameters based on the meals selected
    change_confirm_section_param(meals_names_selected, meals_names, meals_prices_selected, meals_prices);

     // changes the total price value in the HTML
    meal_total_price.innerHTML = calculate_final_order_total_price(meals_prices_selected);

    // removes the display_none class from the confirmation screen, also adds opacity to the background
    if(order_button.classList.contains('order_button_ready')){
        confirm_section.classList.remove('display_none');
        transparent_background.classList.remove('display_none');
    }
}

/*
    Changes the inner text from the html elements from the last confirmation 
    screen, the parameters are taken from the meals that were selected
*/
function change_confirm_section_param(meals_names_selected, meals_names, meals_prices_selected, meals_prices){
    change_meals_names(meals_names_selected, meals_names);
    change_meals_prices(meals_prices_selected, meals_prices);
}

// changes the inner text from the html elements containing the meals names in the last confirmation screen
function change_meals_names(meals_names_selected, meals_names){
    for(let meal_name_index in meals_names_selected) {
        meals_names[meal_name_index].innerHTML = meals_names_selected[meal_name_index];
    }
}

// changes the inner text from the html elements containing the meals prices in the last confirmation screen
function change_meals_prices(meals_prices_selected, meals_prices){
    for(let meal_price_index in meals_prices_selected) {
        meals_prices[meal_price_index].innerHTML = meals_prices_selected[meal_price_index];
    }
}

// calculates the order total price by adding the dishes selected prices
function calculate_final_order_total_price(meals_prices_selected){
    let total_price = 0;

    for(let meal_price_index in meals_prices_selected) {
        // the meals_prices array has string elements, so we must convert it
        total_price += Number(meals_prices_selected[meal_price_index]);
    }
    // controls the quantity of decimal numbers being displayed
    total_price = total_price.toFixed(3); 
    
    return total_price;        
}

// called when user clicks the 'Cancelar' button in the last confirmation screen
function cancel_order(){
    const confirm_section = document.querySelector('.confirm_section');
    const transparent_background = document.querySelector('.transparent_background');

    // adds the display_none class to confirmation screen and transparent background, erasing them
    confirm_section.classList.add('display_none');
    transparent_background.classList.add('display_none');
}

function ask_name_and_adress(){
    // checks the names and prices of the meals that are selected 
    // check_for_meals_selected returns [0] names, [1] prices
    const meals_names_selected = check_for_meals_selected()[0];
    const meals_prices_selected = check_for_meals_selected()[1];
    
    // gets user name and adress
    const name = prompt("Por favor digite o seu nome: ");    
    const address = prompt("Por favor digite o seu endereço: ");

    send_whatsapp_message(meals_names_selected, meals_prices_selected, name, address);
}

function send_whatsapp_message(meals_names_selected, meals_prices_selected, name, address){
    // creates a string containing all order info
    let text_to_send = `Olá, gostaria de fazer o pedido:
    - Prato: ${meals_names_selected[0]}
    - Bebida: ${meals_names_selected[1]}
    - Sobremesa: ${meals_names_selected[2]}
    Total: R$ ${calculate_final_order_total_price(meals_prices_selected)}
    
    Nome: ${name}
    Endereço: ${address}`;

    // converts the string to a text that can be sent through a whastapp link
    text_to_send = encodeURIComponent(text_to_send);

    // opens the whatsapp website with the message containing all order info
    window.open(`https://wa.me/554891427605?text=${text_to_send}`);
}

// checks the names of the meals that are selected
function check_for_meals_selected() {
    let meals_selected_names = [];
    let meals_selected_prices = [];

    // goes through all the meals in the page looking for the selected ones, than grabs it's names and prices
    for(let dish_index in dishes) {
        if(dishes[dish_index].classList.contains('dish_box_check')) {
            // childNodes[3] to select dish_section h4
            meals_selected_names.push(dishes[dish_index].childNodes[3].innerHTML);             
             
            /* -> childNodes[7] to select dish_section div .price 
               -> slice(3) to remove 'R$ '
               -> replace to change ',' to '.', since this number will be used as variable */
            meals_selected_prices.push((dishes[dish_index].childNodes[7].innerHTML.slice(3)).replace(",",".")); 
        }
    }     
    return [meals_selected_names, meals_selected_prices];
}
