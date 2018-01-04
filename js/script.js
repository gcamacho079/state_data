var permits = {

  onReady: function() {
    permits.getAllStateData();
  },

  /*createMapFunctionality: function() {
    $("path, circle").click(function(e) {
      $(".info-container").empty();
      permits.getStateInfo($(this).attr("id"));
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
  },*/

  getAllStateData: function() {
    $.ajax("js/stateinfo.json", {
      dataType: "json",
      type: "GET",
      success: function(data) {
        $("#loadingDiv").hide();
        permits.buildMobileView(data);
      }
    });
  },

  buildMobileView: function(data) {
    let stateArrayIndex = 0; //For building out element IDs
    let countyArrayIndex = 0;

    data.states.forEach(function(state) {
      	$('.info-container').append("<div class='panel-group' id='panel-group" + stateArrayIndex + "'><div class='panel panel-default state-panel'><a data-toggle='collapse' class='collapsed' aria-expanded='false' href='#state" + stateArrayIndex+ "'>" + state.name + "</a></div></div>");
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
  }
}

$(document).ready(permits.onReady);
