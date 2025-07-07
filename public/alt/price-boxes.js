// Get all price boxes
const priceBoxes = document.querySelectorAll('.price-box');

// Loop through each price box
priceBoxes.forEach((priceBox) => {
  // Get the checkbox and button
  const checkbox = priceBox.querySelector('input[type="checkbox"]');
  const button = priceBox.querySelector('button');

  // Add event listener to checkbox
  checkbox.addEventListener('change', () => {
    // If checkbox is checked, enable button
    if (checkbox.checked) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  });

  // Add event listener to button
  button.addEventListener('click', () => {
    // Get the selected plan details
    const planDetails = priceBox.querySelector('.price-details');
    const planTitle = priceBox.querySelector('.price-box-title').textContent;
    const planPrice = priceBox.querySelector('h2').textContent;

    // Create a cart item object
    const cartItem = {
      title: planTitle,
      price: planPrice,
      details: planDetails.innerHTML,
    };

    // Add cart item to cart
    addCartItemToCart(cartItem);
  });
});

// Function to add cart item to cart
function addCartItemToCart(cartItem) {
  // Get the cart container
  const cartContainer = document.querySelector('#cart-container');

  // Create a new cart item element
  const cartItemElement = document.createElement('div');
  cartItemElement.classList.add('cart-item');

  // Add cart item details to element
  cartItemElement.innerHTML = `
    <h3>${cartItem.title}</h3>
    <p>${cartItem.price}</p>
    <p>${cartItem.details}</p>
  `;

  // Add cart item element to cart container
  cartContainer.appendChild(cartItemElement);
}
