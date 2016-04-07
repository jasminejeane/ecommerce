
// CP needed to go nk for explaination 45. 46.


// instance search

$(function() {
// Stripe publishing Key 
// format taken from (https://stripe.com/docs/custom-form)
// key below is actually my Test PublishableKey
// this is for the client ??
  Stripe.setPublishableKey('pk_test_1dgi3umhSBiRQxHkBsjuJemD');


// spin appearance 

var opts = {
    lines: 13 // The number of lines to draw
  , length: 28 // The length of each line
  , width: 14 // The line thickness
  , radius: 42 // The radius of the inner circle
  , scale: 1 // Scales overall size of the spinner
  , corners: 1 // Corner roundness (0..1)
  , color: '#000' // #rgb or #rrggbb or array of colors
  , opacity: 0.25 // Opacity of the lines
  , rotate: 0 // The rotation offset
  , direction: 1 // 1: clockwise, -1: counterclockwise
  , speed: 1 // Rounds per second
  , trail: 60 // Afterglow percentage
  , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
  , zIndex: 2e9 // The z-index (defaults to 2000000000)
  , className: 'spinner' // The CSS class to assign to the spinner
  , top: '50%' // Top position relative to parent
  , left: '50%' // Left position relative to parent
  , shadow: false // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'absolute' // Element positioning
}


  $('#search').keyup(function(){

    var search_term = $(this).val();

    $.ajax({
      method: 'POST',
      url: 'api/search',
      data: {
        search_term
      },
      dataType: 'json',
      success: function(json) {
        var data = json.hits.hits.map(function(hit){
          return hit;
        });


        $('#searchResults').empty();
        for (var i= 0; i < data.length; i++){
          var html = "";
          html += '<div class="col-md-4">';
          html += '<a href="/product/' + data[i]._source._id  + '">';
          html += '<div class="thumbnail">';
          html += '<img src=" ' +  data[i]._source.image +'">';
          html += '<div class="caption">';
          html += '<h3>' +  data[i]._source.name + '</h3>';
          html += '<p>' +  data[i]._source.category.name  + '</p>';
          html += '<p>$' +  data[i]._source.price  + '</p>';
          html += ' </div></div></a></div>';

          $('#searchResults').append(html);
         
        }

      },

      error: function(error) {
        console.log(err);
      }
    });
  });
});


// 53 
$(document).on('click', '#plus', function(e){
  e.preventDefault();
  var priceValue = parseFloat($('#priceValue').val());
  // since quantity has no decimal we parse it into Int form
  var quantity = parseInt($('#quantity').val());

  priceValue += parseFloat($('#priceHidden').val());
  quantity += 1;

// this is the hidden input on (product.ejs page)
  $('#quantity').val(quantity);
  // this limits the decimal to two
  $('#priceValue').val(priceValue.toFixed(2));
  // this is the quantity shown to the user
  $('#total').html(quantity);



// code to handle stripe take from (https://stripe.com/docs/custom-form)
// 59
function stripeResponseHandler(status, response) {
 // to take all the data from the input
  var $form = $('#payment-form');

  if (response.error) {
    // Show the errors on the form
    $form.find('.payment-errors').text(response.error.message);
    $form.find('button').prop('disabled', false);
  } else {
    // response contains id and card, which contains additional card details
    // this id may be last 4 digits of cc & card type
    // we set that id to token
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    // this refers to the stripeToken described on main.js
    // then it sets the value to token 
    $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
    // and submit

    var spinner = new Spinner(opts).spin();
    $('#loading').append(spinner.el);
    // then resubmit the form here
    $form.get(0).submit();
  }
}

// this is how we inoke the stripeResponseHandler function
// this is an event handler on the form itself
$('#payment-form').submit(function(event) {
  // this would be #payment-form and we set that to the variable $form
    var $form = $(this);

    // Disable the submit button to prevent repeated clicks
    $form.find('button').prop('disabled', true);

    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from submitting with the default action
    // a default action would be like an empty string, empy cart #
    return false;
  });

//  if the quantity is one we want to keep the quanity to 
// only one
// this is intersting wondering why we did not do a less than
// one function for it to work
if (quantity == 1){
  priceValue = $('#priceHidden').val();
  quantity = 1;
} else {

  priceValue -= parseFloat($('#priceHidden').val());
  quantity -= 1;
}

});

$(document).on('click', '#minus', function(e){
  e.preventDefault();
  var priceValue = parseFloat($('#priceValue').val());
  var quantity = parseInt($('#quantity').val());

  

  $('#quantity').val(quantity);
  $('#priceValue').val(priceValue.toFixed(2));
  $('#total').html(quantity);
});







