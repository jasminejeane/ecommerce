
// CP needed to go nk for explaination 45. 46.


// instance search

$(function() {

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

$(document).on('click', '#minus', function(e){
  e.preventDefault();
  var priceValue = parseFloat($('#priceValue').val());
  var quantity = parseInt($('#quantity').val());

  

  $('#quantity').val(quantity);
  $('#priceValue').val(priceValue.toFixed(2));
  $('#total').html(quantity);
});







