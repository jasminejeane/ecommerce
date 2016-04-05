
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