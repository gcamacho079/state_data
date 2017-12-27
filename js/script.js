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
    $.ajax("js/stateinfonew.json", {
      dataType: "json",
      type: "GET",
      success: function(data) {
        permits.buildOut(statePrefix, data[statePrefix].state, data[statePrefix]);
      }
    });
  },

  buildOut: function(prefix, stateName, data) {
    let stackedStructure = "<h4 class='state-heading'>" + stateName + "</h4>"; //+ "<a href='" + state.URL + "' target='_blank'>" + state.Name + "</a>" + "<p>" + state.Description + "</p>";
    let mapStructure = "<h2 style='text-align: center;' id='map__state-heading'></h2><div class='row'><div class='col-sm-3'><h3>Counties</h3><ul class='nav nav-pills nav-stacked map__county-list'></ul></div><div class='col-sm-9 tab-content map__city-list'></div></div>";
    $(".info-container").append(mapStructure);
    $(".info-container").append(stackedStructure);

    data.counties.forEach(function(county) {
      let countyLink = prefix + "_" + county.name.toLowerCase();
      countyLink = countyLink.split(' ').join('');
      countyLink = countyLink.split("'").join('');
      countyLink = countyLink.split(".").join('');

      // Create Stacked
      let stackedInfo = "";

      // Create Full-Width
      $("#map__state-heading").text(stateName);
      $(".map__county-list").append('<li><a data-toggle="tab" href="#' + countyLink + '">' + county.name + ' County</a></li>');
      $(".map__city-list").append("<div class='tab-pane fade in' id='" + countyLink + "'><h3>Cities</h3><ul></ul></div>");
      county.cities.forEach(function(city) {
        $("#" + countyLink + " ul").append("<li><a target='_blank' href='" + city.url + "'>" + city.name + "</a></li>");
      });
      $(".map__county-list li:first-child").addClass("active");
      $(".map__city-list div:first-child").addClass("active");
    });


  }
}

$(document).ready(permits.onReady);
