var map;

$(document).ready(function () {
	
	var lastOpened;
	
	//get truck list asynchronously
	//populate map after truck location data returned:
	$.getJSON( "http://localhost:5000/trucks", function(data) {
		
		// initialize the map
		function initialize() {
			// center in SF
			var options = {
				center: {lat: 37.7833, lng: -122.4167},
				zoom: 13,
				streetViewControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			// create new map
			map = new google.maps.Map(document.getElementById('map-canvas'), options);
			
			// populate sidebar
			populate_list(map.getCenter());
			
			// add markers for each truck
			for (truck in data.trucks) {
				var loc = data.trucks[truck].location;
				var title = data.trucks[truck].applicant;
				console.log(data.trucks[truck].applicant);
				console.log(data.trucks[truck].location);
				var latLng = new google.maps.LatLng(loc.latitude,loc.longitude);
				createMarker();
				
				// create in function to avoid duplication
				function createMarker() {
					var marker = new google.maps.Marker({
						position: latLng,
						map: map,
						title: title,
					});
				
					var infowindow = new google.maps.InfoWindow({
						content: title,
					});
					
					google.maps.event.addListener(marker, 'click', function() {
						if (lastOpened != undefined) {
							lastOpened.close();
						}
						infowindow.open(map, marker);
						map.panTo(marker.position);
						lastOpened = infowindow;
					});
					marker.setMap(map);
				}
			}
			
			// add marker for current location if able
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
					var myloc = new google.maps.Marker({
						position: initialLocation,
						clickable: true,
						icon: {
							path: google.maps.SymbolPath.CIRCLE,
							scale: 5,
							strokeColor: '#FF0000',
							strokeOpacity: 0.8,
							strokeWeight: 2,
							fillColor: '#FF0000',
							fillOpacity: 0.35,
						},
						shadow: null,
						zIndex: 999,
					});
					google.maps.event.addListener(myloc, 'click', function() {
						map.panTo(myloc.position);
					});
					myloc.setMap(map);
					
				}, function() {
					console.log("Geolocation unavailable");
				});
			}
			
			// add listener to repopulate the sidebar when the center changes
			google.maps.event.addListener(map, 'center_changed', function() {
				populate_list(map.getCenter());
			});
		}
		// initialize the map at end of JSON callback
		initialize();
	});
	
	// populate the sidebar with the closest 20 trucks to the map center
	function populate_list(center) {
	
		// get from server 
		$.getJSON("http://localhost:5000/closest/" + center.k + "/" + center.D, function(data) { 
		
			// empty the sidebar
			$("#list-container").empty();
		
			// for each closest truck, append it to the sidebar
			for (truck in data.min) {
				var loc = data.min[truck].location;
				var title = data.min[truck].applicant;
				var addr = data.min[truck].address;
				var food = data.min[truck].food;
				$("#list-container").append('<div class="listing" lat="' + loc.latitude +'" long="' + loc.longitude + '">' + title + '<br /><span class="sub">' + addr + '</span><div class="more">' + food + '</div></div>');
			}

			$(".listing").click(function () {
				var latLng = new google.maps.LatLng(this.attributes.lat.value,this.attributes.long.value);
				if (lastOpened != undefined) {
					lastOpened.close();
				}
				map.panTo(latLng);
				console.log();
				if (map.getZoom() < 17) {
					map.setZoom(map.getZoom() + 2);
				}
			});
		});
	}
	
});


