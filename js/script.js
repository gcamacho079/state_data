var permits = {

  onReady: function() {
    $("path, circle").click(function(e) {
      $(".info-container").empty();
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
    let mapStructure = "<h2 style='text-align: center;' class='map-info-container'></h2><div class='col-sm-3'><h3>Counties</h3><ul class='nav nav-pills nav-stacked county-list'></ul></div><div class='col-sm-9 tab-content city-list'></div>";
    $(".info-container").append(mapStructure);

    data.counties.forEach(function(county) {
      let countyLink = prefix + "_" + county.name.toLowerCase();
      countyLink = countyLink.split(' ').join('');
      countyLink = countyLink.split("'").join(''); //ADDED
      countyLink = countyLink.split(".").join(''); //ADDED

      // Create Stacked
      let stackedInfo = "";

      // Create Full-Width
      $(".map-info-container").text(stateName);
      $(".county-list").append('<li><a data-toggle="tab" href="#' + countyLink + '">' + county.name + ' County</a></li>');
      $(".city-list").append("<div class='tab-pane fade in' id='" + countyLink + "'><h3>Cities</h3><ul></ul></div>");
      county.cities.forEach(function(city) {
        $("#" + countyLink + " ul").append("<li><a target='_blank' href='" + city.url + "'>" + city.name + "</a></li>");
      });
      $(".county-list li:first-child").addClass("active");
      $(".city-list div:first-child").addClass("active");
    });


  }
}

$(document).ready(permits.onReady);
