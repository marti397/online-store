var stripe = Stripe('pk_test_DTvOZdSi3QNcDSPufkAxdt4t');
var elements = stripe.elements();

// Create an instance of the card UI component
var card = elements.create('card', {
  'style': {
    'base': {
      'fontSize': '12px',
      'color': '#696969',
      'fontSmoothing': 'antialiased',
      'fontWeight':'200',
      'iconColor':'#696969',
      'letterSpacing':'0.5px',
      '::placeholder': {
        'color': '#696969'
      }
    },
    'invalid': {
      'color': 'red',
    },
  },
  'hidePostalCode':true,
  'placeholder': 'Custom card number placeholder',
});

// Mount the UI card component into the `card-element` <div>
card.mount('#card-element');

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}

function createToken() {
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server
      stripeTokenHandler(result.token);
    }
  });
};

// Create a token when the form is submitted.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  createToken();
});

card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});
