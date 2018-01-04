var permits = {

  onReady: function() {
    permits.getAllStateData();
  },

  getAllStateData: function() {
    $.ajax("js/stateinfo.json", {
      dataType: "json",
      type: "GET",
      success: function(data) {
        $("#loadingDiv").hide();

        if ($(window).width() < 1280) {
          permits.buildMobileView(data);
          $(".info-container-stacked").show();
        }
        else {
          permits.createMapFunctionality(data);
          $("#us-map").show();
        }
      }
    });
  },

  buildMobileView: function(data) {
    let stateArrayIndex = 0; //For building out element IDs
    let countyArrayIndex = 0;

    data.states.forEach(function(state) {
      	$('.info-container-stacked').append("<div class='panel-group' id='panel-group" + stateArrayIndex + "'><div class='panel panel-default state-panel'><a data-toggle='collapse' class='collapsed' aria-expanded='false' href='#state" + stateArrayIndex+ "'>" + state.name + "</a></div></div>");
      	$('#panel-group' + stateArrayIndex).append("<div class='panel-collapse collapse' id='state" + stateArrayIndex + "' aria-expanded='false'><ul class='list-group' id='list-group-state" + stateArrayIndex + "'></ul></div>");
		countyArrayIndex = 0;

		state.counties.forEach(function(county) {
			$("#list-group-state" + stateArrayIndex).append("<li class='list-group-item collapse'><a data-toggle='collapse' class='collapsed' href='#state" + stateArrayIndex + "county" + countyArrayIndex + "'>" + county.name + " County</a><div class='panel-collapse collapse' id='state" + stateArrayIndex + "county" + countyArrayIndex + "' aria-expanded='false'></div></li>");

			county.cities.forEach(function(city) {
				$("#state" + stateArrayIndex + "county" + countyArrayIndex).append("<a class='city-link' href='" + city.url + "' target='_blank'><i class='fa fa-chevron-right' aria-hidden='true'></i> " + city.name + "</a>")

			});
			countyArrayIndex++;
		});

		stateArrayIndex++;
    });
  },

  createMapFunctionality: function(data) {
    $("path, circle").click(function(e) {
      $(".info-container-map").empty();
      let stateIndex = $(this).data('json-index');
      permits.buildDesktopView(data.states[stateIndex]);
    });

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
  },

  buildDesktopView: function(data) {
    console.log(data);
    let countyListItem = "";
    let mapStructure = "<h2 style='text-align: center;' class='map-info-container'></h2><div class='col-sm-3'><h3>Counties</h3><ul class='nav nav-pills nav-stacked county-list'></ul></div><div class='col-sm-9 tab-content city-list'></div>";
    $(".info-container-map").append(mapStructure);

    let statePrefix = data.acronym;
    let stateName = data.name;

    data.counties.forEach(function(county) {
      let countyLink = statePrefix + "_" + county.name.toLowerCase();
      countyLink = countyLink.split(' ').join('');
      countyLink = countyLink.split("'").join('');
      countyLink = countyLink.split(".").join('');
      console.log(countyLink);

      $(".map-info-container").text(stateName);
      $(".county-list").append('<li><a data-toggle="tab" href="#' + countyLink + '">' + county.name + ' County</a></li>');
      $(".city-list").append("<div class='tab-pane fade in' id='" + countyLink + "'><h3>Cities</h3><ul class='fa-ul'></ul></div>");
      county.cities.forEach(function(city) {
        $("#" + countyLink + " ul").append("<li><i class='fa-li fa fa-chevron-right'></i><a class='city-link' target='_blank' href='" + city.url + "'>" + city.name + "</a></li>");
      });
      $(".county-list li:first-child").addClass("active");
      $(".city-list div:first-child").addClass("active");
    });
  }
}

$(document).ready(permits.onReady);
