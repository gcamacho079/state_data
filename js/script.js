var permits = {

  onReady: function() {
    $("path, circle").click(function(e) {
      $(".county-list").empty();
      $(".city-list").empty();
      permits.getStateInfo($(this).attr("id"));
    });

    // All the hover functionality
    $("path, circle").hover(function(e) {
      $('#info-box').css('display','block');
      $('#info-box').html($(this).data('info'));
    });

    $("path, circle").mouseleave(function(e) {
      $('#info-box').css('display','none');
    });

    $(document).mousemove(function(e) {
      var offset = $("#map-box").offset();
      $('#info-box').css('top',e.pageY-$('#info-box').height()-offset.top);
      $('#info-box').css('left',e.pageX-offset.left+($('#info-box').width()/2)-50);
    }).mouseover();
    // End hover functionality
  },

  getStateInfo: function(state) {
    let statePrefix = state.toLowerCase();
    $.ajax("js/stateinfonew.json", { //CHANGED
      dataType: "json",
      type: "GET",
      success: function(data) {
        permits.buildOut(statePrefix, data[statePrefix].state, data[statePrefix]); //UPDATED FIELDS
      }
    }); //End state info call
  },

  buildOut: function(prefix, stateName, data) {
    let countyListItem = "";

    data.counties.forEach(function(county) {
      let countyLink = prefix + "_" + county.name.toLowerCase();
      countyLink = countyLink.split(' ').join('');
      countyLink = countyLink.split("'").join(''); //ADDED
      countyLink = countyLink.split(".").join(''); //ADDED

      // Create Stacked
      let stackedInfo = "";
      countyListItem = '<li><a data-toggle="tab" href="#' + countyLink + '">' + county.name + ' County</a></li>';

      // Create Full-Width
      $(".county-list").append(countyListItem);
      $(".city-list").append("<div class='tab-pane fade in' id='" + countyLink + "'><ul></ul></div>");
      county.cities.forEach(function(city) {
        $("#" + countyLink + " ul").append("<li><a target='_blank' href='" + city.url + "'>" + city.name + "</a></li>");
      });
      $(".county-list li:first-child").addClass("active");
      $(".city-list div:first-child").addClass("active");
    });


  }
}

$(document).ready(permits.onReady);
