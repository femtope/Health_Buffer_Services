var stateScope = '', lgaScope = '', coldchain = '', antenatal = '', malaria = '', family_planning = '', hiv = '', tb = '', ri = '', phcn = '', htr = '',
    sectors = [],
    geoData = null, geoDataSettlement = null,
    dataLayer = null, buffer2KM = null, buffer5KM = null, settlementLayer = null, buffer8KM = null,
    markerGroup = null, settlementGroup = null,
    stateData = null, lgaData, wardData,
    stateLayer = null, lgaLayer = null, wardLayer = null,
    wardLabels = [],
    showWard = false,
    typeList = [], serviceList = [], amenityList = [],
    countSettlementPointWithin, within, within_fc

var map = L.map('map', {
    center: [10, 8],
    zoom: 7,
    zoomControl: false,
    minZoom: 6

});


map.fitBounds([
    [2.668432, 4.277144], [14.680073, 13.892007]

])

map.on('zoomend', function () {
    //adjustLayerbyZoom(map.getZoom())
})

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

new L.Control.Zoom({
    position: 'topright'
}).addTo(map);

L.control.scale({
    position: 'bottomright',
    maxWidth: 150,
    metric: true,
    updateWhenIdle: true
}).addTo(map);


function triggerUiUpdate() {
    coldChainChk()

    stateScope1 = $('#stateScope').val()
    lgaScope1 = $('#lgaScope').val()

    var query = buildQuery(stateScope1, lgaScope1, typeList, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn, htr)
    getData(query)
}

function checkSelected() {
		if(document.getElementById("twoKmBuffer").checked) {
			coldChainChk();
			triggerUiUpdate();
			displayBuffer2KM()
		}
		/*else
			map.removeLayer(buffer2KM)*/

		if(document.getElementById("fiveKmBuffer").checked) {
			coldChainChk();
			triggerUiUpdate();
			displayBuffer5KM()
		}
		/*else
			map.removeLayer(buffer5KM)*/

		if(document.getElementById("eightKmBuffer").checked) {
			coldChainChk();
			triggerUiUpdate();
			displayBuffer8KM()
		}
		/*else
			map.removeLayer(buffer8KM)*/
}


function lgaShow() {
    stateSelect1 = $('#stateScope').val();
    show = document.getElementById("lgaScope");
    if(stateSelect1 == "Kano") {
    show.style.visibility="visible"
  }
  else{
    show.style.visibility="hidden"
  }
}


function displayBuffer2KM() {
      coldChainChk()
      stateScope2 = $('#stateScope').val()
      lgaScope2 = $('#lgaScope').val()
      var queryBuffer = buildQueryBuffer2KM(stateScope2, lgaScope2, typeList, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn, htr)
      console.log("Buffer Query: ", queryBuffer)
      getBuffer2KM(queryBuffer)

}

function getBuffer2KM(queryUrl) {
    showLoader()
    $.post(queryUrl, function (bufferData) {
        hideLoader()
        addBuffer2KMToMap(bufferData)
    }).fail(function () {
        console.log("error!")
    });
}



function displayBuffer5KM() {
      coldChainChk()
      stateScope3 = $('#stateScope').val()
      lgaScope3 = $('#lgaScope').val()
      var queryBuffer5KM = buildQueryBuffer5KM(stateScope3, lgaScope3, typeList, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn, htr)
      console.log("Buffer Query: ", queryBuffer5KM)
      getBuffer5KM(queryBuffer5KM)

}

function getBuffer5KM(queryUrl) {
    showLoader()
    $.post(queryUrl, function (bufferData) {
        hideLoader()
        addBuffer5KMToMap(bufferData)
    }).fail(function () {
        console.log("error!")
    });
}


function displayBuffer8KM() {
      coldChainChk()
      stateScope4 = $('#stateScope').val()
      lgaScope4 = $('#lgaScope').val()
      var queryBuffer8KM = buildQueryBuffer8KM(stateScope4, lgaScope4, typeList, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn, htr)
      console.log("Buffer Query: ", queryBuffer8KM)
      getBuffer8KM(queryBuffer8KM)

}
function getBuffer8KM(queryUrl) {
    showLoader()
    $.post(queryUrl, function (bufferData) {
        hideLoader()
        addBuffer8KMToMap(bufferData)
    }).fail(function () {
        console.log("error!")
    });
}



function addBuffer2KMToMap(geoData) {
    if (buffer2KM != null)
        map.removeLayer(buffer2KM)

    var bufferStyle = {
			"clickable": true,
			"color": '#CCCCFF',
            "stroke": false,
			"fillColor": '#F8F8FF',
			"weight": 0.0,
			"opacity": 0.2,
			"fillOpacity": 0.6
		}


    buffer2KM = L.geoJson(geoData, {
		filter: function(feature) {
				return feature.properties.sum_male
				return feature.properties.sum_female
				return feature.properties.sum_male_e
				return feature.properties.sum_fema_1
				return feature.properties.sum_total
                return feature.properties.sum_count
				return feature.properties.sum_total_
				return feature.properties.lga_name === lgaSelect
			},
			style: bufferStyle,
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.cartodb_id) {
                var totalEligible = parseInt(feature.properties.sum_total_)
                var totalPop = parseInt(feature.properties.sum_total)
                var totalNonEligible = totalPop - totalEligible
                layer.bindPopup('<font size="4"> <strong>No. of Settlement:   </strong>'+feature.properties.count+'<br>'+'<strong>MALE:   </strong>'+feature.properties.sum_male+'<br>'+'<strong>FEMALE:   </strong>'+feature.properties.sum_female+'<br>'+'<strong>TOTAL:   </strong>'+feature.properties.sum_total+'<br>'+'<strong>Under 5 Years:   </strong>'+feature.properties.sum_total_+'<br>'+'<strong> > 5 Years:   </strong>'+totalNonEligible+'<br></font>');

            }

        }

    })

    map.addLayer(buffer2KM);
}


function addBuffer5KMToMap(geoData) {
    if (buffer5KM != null)
        map.removeLayer(buffer5KM)

    var bufferStyle = {
			"clickable": true,
			"color": '#CCCCFF',
            "stroke": false,
			"fillColor": '#ffffcc',
			"weight": 0.0,
			"opacity": 0.2,
			"fillOpacity": 0.6
		}


    buffer5KM = L.geoJson(geoData, {
		filter: function(feature) {
				return feature.properties.sum_male
				return feature.properties.sum_female
				return feature.properties.sum_male_e
				return feature.properties.sum_fema_1
				return feature.properties.sum_total
                return feature.properties.sum_count
				return feature.properties.sum_total_
				return feature.properties.lga_name === lgaSelect
			},
			style: bufferStyle,
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.cartodb_id) {
                var totalEligible = parseInt(feature.properties.sum_total_)
                var totalPop = parseInt(feature.properties.sum_total)
                var totalNonEligible = totalPop - totalEligible
                layer.bindPopup('<font size="4"> <strong>No. of Settlement:   </strong>'+feature.properties.count+'<br>'+'<strong>MALE:   </strong>'+feature.properties.sum_male+'<br>'+'<strong>FEMALE:   </strong>'+feature.properties.sum_female+'<br>'+'<strong>TOTAL:   </strong>'+feature.properties.sum_total+'<br>'+'<strong>Under 5 Years:   </strong>'+feature.properties.sum_total_+'<br>'+'<strong> > 5 Years:   </strong>'+totalNonEligible+'<br></font>');

            }

        }

    })

    map.addLayer(buffer5KM);
}


function addBuffer8KMToMap(geoData) {
    if (buffer8KM != null)
       map.removeLayer(buffer8KM)

    var bufferStyle = {
			"clickable": true,
			"color": '#CCCCFF',
            "stroke": false,
			"fillColor": '#ffe1f0',
			"weight": 0.0,
			"opacity": 0.2,
			"fillOpacity": 0.6
		}


    buffer8KM = L.geoJson(geoData, {
		filter: function(feature) {
				return feature.properties.sum_male
				return feature.properties.sum_female
				return feature.properties.sum_male_e
				return feature.properties.sum_fema_1
				return feature.properties.sum_total
                return feature.properties.sum_count
				return feature.properties.sum_total_
				return feature.properties.lga_name === lgaSelect
			},
			style: bufferStyle,
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.cartodb_id) {
                var totalEligible = parseInt(feature.properties.sum_total_)
                var totalPop = parseInt(feature.properties.sum_total)
                var totalNonEligible = totalPop - totalEligible
                layer.bindPopup('<font size="4"> <strong>No. of Settlement:   </strong>'+feature.properties.count+'<br>'+'<strong>MALE:   </strong>'+feature.properties.sum_male+'<br>'+'<strong>FEMALE:   </strong>'+feature.properties.sum_female+'<br>'+'<strong>TOTAL:   </strong>'+feature.properties.sum_total+'<br>'+'<strong>Under 5 Years:   </strong>'+feature.properties.sum_total_+'<br>'+'<strong> > 5 Years:   </strong>'+totalNonEligible+'<br></font>');

            }

        }

    })

    map.addLayer(buffer8KM);
}



function buildQuery(stateScope, lgaScope, type, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn, htr) {
  var needsAnd = false;
  query = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM health_facility_demo';
  if (stateScope != null || lgaScope != null || typeList.length > 0 || coldchain != null || malaria != null || antenatal != null || hiv != null || tb != null || ri != null || family_planning != null || phcn != null || htr != null){
    console.log("State Selecte:  ", stateScope)
    query = query.concat(' WHERE')
    if (stateScope.length > 0){
      query = query.concat(" state_name = '".concat(stateScope.concat("'")))
      needsAnd = true
    }

    if (lgaScope.length > 0){
      query = needsAnd  ? query.concat(" AND lga_name = '".concat(lgaScope.concat("'"))) :  query.concat(" lga_name = '".concat(lgaScope.concat("'")))
      needsAnd = true
    }

    if(coldchain.length > 0) {
      query = needsAnd  ? query.concat(" AND coldchain = '".concat(coldchain.concat("'"))) :  query.concat(" coldchain = '".concat(coldchain.concat("'")))
      needsAnd = true
    }

    if(malaria.length > 0) {
      query = needsAnd  ? query.concat(" AND malaria = '".concat(malaria.concat("'"))) :  query.concat(" malaria = '".concat(malaria.concat("'")))
      needsAnd = true
    }

    if(antenatal.length > 0) {
      query = needsAnd  ? query.concat(" AND antenatal = '".concat(antenatal.concat("'"))) :  query.concat(" antenatal = '".concat(antenatal.concat("'")))
      needsAnd = true
    }

    if(hiv.length > 0) {
      query = needsAnd  ? query.concat(" AND hiv = '".concat(hiv.concat("'"))) :  query.concat(" hiv = '".concat(hiv.concat("'")))
      needsAnd = true


    }

    if(tb.length > 0) {
      query = needsAnd  ? query.concat(" AND sphcda_tb = '".concat(tb.concat("'"))) :  query.concat(" sphcda_tb = '".concat(tb.concat("'")))
      needsAnd = true


    }

    if(ri.length > 0) {
      query = needsAnd  ? query.concat(" AND sphcda_ri_ = '".concat(ri.concat("'"))) :  query.concat(" sphcda_ri_ = '".concat(ri.concat("'")))
      needsAnd = true


    }

    if(family_planning.length > 0) {
      query = needsAnd  ? query.concat(" AND family_planning = '".concat(family_planning.concat("'"))) :  query.concat(" family_planning = '".concat(family_planning.concat("'")))
      needsAnd = true


    }

    if(phcn.length > 0) {
      query = needsAnd  ? query.concat(" AND phcn = '".concat(phcn.concat("'"))) :  query.concat(" phcn = '".concat(phcn.concat("'")))
      needsAnd = true


    }

    if(htr.length > 0) {
      query = needsAnd  ? query.concat(" AND htr = '".concat(htr.concat("'"))) :  query.concat(" htr = '".concat(htr.concat("'")))
      needsAnd = true

      console.log("HTR Query: ", query)
    }

    if (typeList.length > 0){
      for(var i = 0; i < typeList.length; i++) {
        if (i == 0) {
            query = needsAnd ? query.concat(" AND type IN ( '" + typeList[i] + "')") : query.concat(" type IN ( '".concat(typeList[i].concat("')")));
        //console.log("Type Query Include:  ", query)
          }

        else
          query = query.concat(" ,'" + typeList[i] + "')").replace(")", "")
       // console.log("Type Query Include2:  ", query)
      }
    }

  }
  return query

}



function addAdminLayersToMap(layers) {

    var layerStyles = {
            'state': {
                "clickable": true,
                "color": '#B81609',
                "fillColor": '#FFFFFF',
                "weight": 2.0,
                "opacity": 0.7,
                "fillOpacity": 0.1
            },
            'lga': {
                "clickable": true,
                "color": '#e2095c',
                "fillColor": '#FFFFFF',
                "weight": 2.5,
                "opacity": 0.7,
                "fillOpacity": 0.1
            },
            'ward': {
                "clickable": true,
                "color": '#ff0000',
                "fillColor": '#FFFFFF',
                "weight": 2.5,
                "opacity": 0.7,
                "fillOpacity": 0.1
            }
        }
    stateSelect = $('#stateScope').val()
    lgaSelect = $('#lgaScope').val()
    if(stateLayer != null)
      map.removeLayer(stateLayer)

    stateLayer = L.geoJson(layers['state'], {
        filter: function(feature) {
          return feature.properties.StateName === stateSelect
        },
        style: layerStyles['state'],
    }).addTo(map)
    map.fitBounds(stateLayer.getBounds())

    // Adding LGA to Map
    if(lgaLayer != null)
      map.removeLayer(lgaLayer)

    lgaLayer = L.geoJson(layers['lga'], {
        filter: function(feature) {
          return feature.properties.LGAName === lgaSelect
      },
      style: layerStyles['lga'],
      }).addTo(map)
    map.fitBounds(lgaLayer.getBounds())

    if(wardLayer != null)
      map.removeLayer(wardLayer)

        wardLayer = L.geoJson(layers['ward'], {
          filter: function(feature) {
            return feature.properties.ward
            return feature.properties.lga === lgaSelect

            console.log("Ward Name:", feature.properties.ward)
          },
        style: layerStyles['ward'],
        onEachFeature: function (feature, layer) {
            var labelIcon = L.divIcon({
                className: 'label-icon',
                html: feature.properties.ward
            })
            wardLabels.push(L.marker(layer.getBounds().getCenter(), {
                    icon: labelIcon
                }))
                //layer.bindPopup(feature.properties.LGAName)
        }
    })
}




function displayInfo(feature) {
    //console.log('displaying info..')
    var infoContent = buildPopupContent(feature)
        //console.log("info", infoContent)
    $('#infoContent').html(infoContent)
}

function normalizeName(source) {
    source = source.replace("_", " ").replace('of_', ' of ')
    source = source.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return source
}



function showLoader() {
    $('.fa-spinner').addClass('fa-spin')
    $('.fa-spinner').show()
}

function hideLoader() {
    $('.fa-spinner').removeClass('fa-spin')
    $('.fa-spinner').hide()
}


function getData(queryUrl) {
    showLoader()
    $.post(queryUrl, function (data) {
        hideLoader()
        addDataToMap(data)
    }).fail(function () {
        console.log("error!")
    });
}

function getAdminLayers() {
    showLoader()
    var adminLayers = {}
    $.get('resources/state_boundary.geojson', function (stateData) {
        //add admin layers to map
        adminLayers['state'] = JSON.parse(stateData)
       addAdminLayersToMap(adminLayers)
    }).fail(function () {
        logError(null) //TODO: Fix this terrible code
    });

  $.get('resources/lga_boundary.geojson', function (lgaData) {
            adminLayers['lga'] = JSON.parse(lgaData)

            $.get('resources/ward_boundary.geojson', function (wardData) {
            adminLayers['ward'] = JSON.parse(wardData)
                //return the layers
             addAdminLayersToMap(adminLayers)
        }).fail(function () {
            logError(null)
            })
        }).fail(function () {
            logError(null)
        })

}

function logError(error) {
    console.log("error!")
}

function typeCheckBox(type) {
  var idType = typeList.indexOf(type)
  if (idType > -1)
    typeList.splice(idType, 1)
  else if(idType == -1){
    if (idType != null)
      typeList.push(type)
  }
  console.log(type)
  for(i = 0; i <typeList.length; i++){
    console.log("Array List:  ", typeList[i])
  }

}




function coldChainChk() {
  if(document.getElementById("ColdChain").checked)
    coldchain = 'Yes';
  else
    coldchain = ''

  if(document.getElementById("Malaria").checked)
    malaria = 'Yes';
  else
    malaria = ''

  if(document.getElementById("Family Planning").checked)
    family_planning = 'Yes';
  else
    family_planning = ''

  if(document.getElementById("Antenatal").checked)
     antenatal = 'Yes';
  else
    antenatal = ''

  if(document.getElementById("HIV").checked)
     hiv = 'Yes';
  else
    hiv = ''

  if(document.getElementById("TB").checked)
     tb = 'Yes';
  else
    tb = ''

  if(document.getElementById("RI").checked)
     ri = 'Yes';
  else
    ri = ''

   if(document.getElementById("PHCN").checked)
     phcn = 'Yes';
  else
    phcn = ''

    if(document.getElementById("HTR").checked)
     htr = 'Yes';
  else
    htr = ''

  }


function addDataToMap(geoData) {
    // adjustLayerbyZoom(map.getZoom())
    //remove all layers first

    if (dataLayer != null)
        map.removeLayer(dataLayer)

    if (markerGroup != null)
        map.removeLayer(markerGroup)

    var _radius = 8
    var _outColor = "#fff"
    var _weight = 2
    var _opacity = 2
    var _fillOpacity = 2.0

    var markerHealth = L.icon({
        iconUrl: "resources/H1.png",
        iconSize: [20, 20],
        iconAnchor: [25, 25]
    });



    $('#projectCount').text(geoData.features.length)

    markerGroup = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            removeOutsideVisibleBounds: true
        })
        //console.log("geoData", geoData)
    dataLayer = L.geoJson(geoData, {
        pointToLayer: function (feature, latlng) {
            var marker = L.marker(latlng, {icon: markerHealth})
                //markerGroup.addLayer(marker);
            return marker
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.cartodb_id) {
                //layer.bindPopup(buildPopupContent(feature));
                layer.on('click', function () {
                    displayInfo(feature)
                })
            }

        }

    })

    markerGroup.addLayer(dataLayer);
    map.addLayer(markerGroup);
}

hideLoader()

function buildPopupContent(feature) {
    var subcontent = ''
    var propertyNames = ['primary_name','lga_name', 'ward_name', 'phone_number', 'type', 'htr']
    for (var i = 0; i < propertyNames.length; i++) {
        subcontent = subcontent.concat('<p><strong>' + normalizeName(propertyNames[i]) + ': </strong>' + feature.properties[propertyNames[i]] + '</p>')

    }
    return subcontent;
}


function getSettlementData(queryUrl) {
    showLoader()
    $.post(queryUrl, function(data) {
      hideLoader()
      addSettlementToMap(data)
    }).fail(function () {
        console.log("error!!!")
    });
}

function addSettlementToMap(geoDataSettlement) {

	var _radius = 4
    var _outColor = "#CD0000"
    var _weight = 2
    var _opacity = 2
    var _fillOpacity = 2.0

	var settlementPointMarker = {
            radius: _radius,
            fillColor: "#000000",
            color: _outColor,
            weight: _weight,
            opacity: _opacity,
            fillOpacity: _fillOpacity
        };

    if(settlementLayer != null)
      map.removeLayer(settlementLayer)

    if(settlementGroup != null)
      map.removeLayer(settlementGroup)

      settlementGroup = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            removeOutsideVisibleBounds: true
      })

      settlementLayer = L.geoJson(geoDataSettlement, {
          pointToLayer: function (feature, layer) {
            var settlementMarker = L.circleMarker(layer, settlementPointMarker)
            return settlementMarker
          },
        onEachFeature: function (feature, layer) {
          if(feature.properties && feature.properties.cartodb_id) {
            layer.on('mouseover', function(e) {
              displaySettlement(feature)

              //this.openPopup();
            })
          }
        }
      })

      map.addLayer(settlementLayer);
}

function querySettlement(lgaScope) {
    querySet = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM kanopopnedited';
    //querySet = (lgaScope.length > 0) ? querySet.concat(' WHERE ') : querySet;
    if(lgaScope.length > 0) {
        querySet = querySet.concat(' WHERE ');
        querySet = querySet.concat(" lga = '".concat(lgaScope.concat("'")));
    }
  return querySet

}

function callSettlement() {
    lgaScope2 = $('#lgaScope').val()
    var querySet = querySettlement(lgaScope2);
  console.log("Settlement Query:  ", querySet)
    getSettlementData(querySet);
}

function displaySettlement(feature) {
    //console.log('displaying info..')
    var infoSettlement = buildPopupSettlement(feature)
        //console.log("info", infoContent)
    $('#infoSettlement').html(infoSettlement)
}

function buildPopupSettlement(feature) {
    var subcontent = ''
    var propertyNames = ['settleme_1', 'total']
    for (var i = 0; i < propertyNames.length; i++) {
        subcontent = subcontent.concat('<p><strong>' + normalizeName(propertyNames[i]) + ': </strong>' + feature.properties[propertyNames[i]] + '</p>')

    }
    return subcontent;
}



function adjustLayerbyZoom(zoomLevel) {
    if (zoomLevel > 11) {
        if (!showWard) {
            map.addLayer(wardLayer)
                //Add labels to the LGAs
            for (var i = 0; i < wardLabels.length; i++) {
                wardLabels[i].addTo(map)
            }
            showWard = true
        }
    }
  else {
       // map.removeLayer(wardLayer)
        for (var i = 0; i < wardLabels.length; i++) {
            map.removeLayer(wardLabels[i])
        }

        showWard = false
    }
}


function buildQueryBuffer2KM(stateScope, lgaScope, type, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn, htr) {
  var needsAnd = false;
  queryBuffer = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM table_2km_buffer';
  if (stateScope != null || lgaScope != null || typeList.length > 0 || coldchain != null || malaria != null || antenatal != null || hiv != null || tb != null || ri != null || family_planning != null || phcn != null || htr != null){
    queryBuffer = queryBuffer.concat(' WHERE')
    if (stateScope.length > 0){
      queryBuffer = queryBuffer.concat(" state_name = '".concat(stateScope.concat("'")))
      needsAnd = true
    }

    if (lgaScope.length > 0){
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND lga_name = '".concat(lgaScope.concat("'"))) :  queryBuffer.concat(" lga_name = '".concat(lgaScope.concat("'")))
      needsAnd = true
    }

    if(coldchain.length > 0) {
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND coldchain = '".concat(coldchain.concat("'"))) :  queryBuffer.concat(" coldchain = '".concat(coldchain.concat("'")))
      needsAnd = true
    }

    if(malaria.length > 0) {
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND malaria = '".concat(malaria.concat("'"))) :  queryBuffer.concat(" malaria = '".concat(malaria.concat("'")))
      needsAnd = true
    }

    if(antenatal.length > 0) {
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND antenatal = '".concat(antenatal.concat("'"))) :  queryBuffer.concat(" antenatal = '".concat(antenatal.concat("'")))
      needsAnd = true
    }

    if(hiv.length > 0) {
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND hiv = '".concat(hiv.concat("'"))) :  queryBuffer.concat(" hiv = '".concat(hiv.concat("'")))
      needsAnd = true


    }

    if(tb.length > 0) {
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND sphcda_tb = '".concat(tb.concat("'"))) :  queryBuffer.concat(" sphcda_tb = '".concat(tb.concat("'")))
      needsAnd = true


    }

    if(ri.length > 0) {
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND sphcda_ri_ = '".concat(ri.concat("'"))) :  queryBuffer.concat(" sphcda_ri_ = '".concat(ri.concat("'")))
      needsAnd = true


    }

    if(family_planning.length > 0) {
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND family_planning = '".concat(family_planning.concat("'"))) :  queryBuffer.concat(" family_planning = '".concat(family_planning.concat("'")))
      needsAnd = true


    }

    if(phcn.length > 0) {
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND phcn = '".concat(phcn.concat("'"))) :  queryBuffer.concat(" phcn = '".concat(phcn.concat("'")))
      needsAnd = true


    }

    if(htr.length > 0) {
      queryBuffer = needsAnd  ? queryBuffer.concat(" AND htr = '".concat(htr.concat("'"))) :  queryBuffer.concat(" htr = '".concat(htr.concat("'")))
      needsAnd = true

      console.log("HTR queryBuffer: ", queryBuffer)
    }

    if (typeList.length > 0){
      for(var i = 0; i < typeList.length; i++) {
        if (i == 0) {
            queryBuffer = needsAnd ? queryBuffer.concat(" AND type IN ( '" + typeList[i] + "')") : queryBuffer.concat(" type IN ( '".concat(typeList[i].concat("')")));
        //console.log("Type queryBuffer Include:  ", queryBuffer)
          }

        else
          queryBuffer = queryBuffer.concat(" ,'" + typeList[i] + "')").replace(")", "")
       // console.log("Type queryBuffer Include2:  ", queryBuffer)
      }
    }

  }
  return queryBuffer

}


function buildQueryBuffer5KM(stateScope, lgaScope, type, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn, htr) {
  var needsAnd = false;
  queryBuffer5KM = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM table_5km_buffer';
  if (stateScope != null || lgaScope != null || typeList.length > 0 || coldchain != null || malaria != null || antenatal != null || hiv != null || tb != null || ri != null || family_planning != null || phcn != null || htr != null){
    queryBuffer5KM = queryBuffer5KM.concat(' WHERE')
    if (stateScope.length > 0){
      queryBuffer5KM = queryBuffer5KM.concat(" state_name = '".concat(stateScope.concat("'")))
      needsAnd = true
    }

    if (lgaScope.length > 0){
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND lga_name = '".concat(lgaScope.concat("'"))) :  queryBuffer5KM.concat(" lga_name = '".concat(lgaScope.concat("'")))
      needsAnd = true
    }

    if(coldchain.length > 0) {
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND coldchain = '".concat(coldchain.concat("'"))) :  queryBuffer5KM.concat(" coldchain = '".concat(coldchain.concat("'")))
      needsAnd = true
    }

    if(malaria.length > 0) {
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND malaria = '".concat(malaria.concat("'"))) :  queryBuffer5KM.concat(" malaria = '".concat(malaria.concat("'")))
      needsAnd = true
    }

    if(antenatal.length > 0) {
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND antenatal = '".concat(antenatal.concat("'"))) :  queryBuffer5KM.concat(" antenatal = '".concat(antenatal.concat("'")))
      needsAnd = true
    }

    if(hiv.length > 0) {
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND hiv = '".concat(hiv.concat("'"))) :  queryBuffer5KM.concat(" hiv = '".concat(hiv.concat("'")))
      needsAnd = true


    }

    if(tb.length > 0) {
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND sphcda_tb = '".concat(tb.concat("'"))) :  queryBuffer5KM.concat(" sphcda_tb = '".concat(tb.concat("'")))
      needsAnd = true


    }

    if(ri.length > 0) {
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND sphcda_ri_ = '".concat(ri.concat("'"))) :  queryBuffer5KM.concat(" sphcda_ri_ = '".concat(ri.concat("'")))
      needsAnd = true


    }

    if(family_planning.length > 0) {
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND family_planning = '".concat(family_planning.concat("'"))) :  queryBuffer5KM.concat(" family_planning = '".concat(family_planning.concat("'")))
      needsAnd = true


    }

    if(phcn.length > 0) {
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND phcn = '".concat(phcn.concat("'"))) :  queryBuffer5KM.concat(" phcn = '".concat(phcn.concat("'")))
      needsAnd = true


    }

    if(htr.length > 0) {
      queryBuffer5KM = needsAnd  ? queryBuffer5KM.concat(" AND htr = '".concat(htr.concat("'"))) :  queryBuffer5KM.concat(" htr = '".concat(htr.concat("'")))
      needsAnd = true

      console.log("HTR queryBuffer5KM: ", queryBuffer5KM)
    }

    if (typeList.length > 0){
      for(var i = 0; i < typeList.length; i++) {
        if (i == 0) {
            queryBuffer5KM = needsAnd ? queryBuffer5KM.concat(" AND type IN ( '" + typeList[i] + "')") : queryBuffer5KM.concat(" type IN ( '".concat(typeList[i].concat("')")));
        //console.log("Type queryBuffer5KM Include:  ", queryBuffer5KM)
          }

        else
          queryBuffer5KM = queryBuffer5KM.concat(" ,'" + typeList[i] + "')").replace(")", "")
       // console.log("Type queryBuffer5KM Include2:  ", queryBuffer5KM)
      }
    }

  }
  return queryBuffer5KM

}


function buildQueryBuffer8KM(stateScope, lgaScope, type, coldchain, ri, hiv, tb, family_planning, antenatal, malaria, phcn, htr) {
  var needsAnd = false;
  queryBuffer8KM = 'http://ehealthafrica.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM table_8km_buffer';
  if (stateScope != null || lgaScope != null || typeList.length > 0 || coldchain != null || malaria != null || antenatal != null || hiv != null || tb != null || ri != null || family_planning != null || phcn != null || htr != null){
    queryBuffer8KM = queryBuffer8KM.concat(' WHERE')
    if (stateScope.length > 0){
      queryBuffer8KM = queryBuffer8KM.concat(" state_name = '".concat(stateScope.concat("'")))
      needsAnd = true
    }

    if (lgaScope.length > 0){
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND lga_name = '".concat(lgaScope.concat("'"))) :  queryBuffer8KM.concat(" lga_name = '".concat(lgaScope.concat("'")))
      needsAnd = true
    }

    if(coldchain.length > 0) {
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND coldchain = '".concat(coldchain.concat("'"))) :  queryBuffer8KM.concat(" coldchain = '".concat(coldchain.concat("'")))
      needsAnd = true
    }

    if(malaria.length > 0) {
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND malaria = '".concat(malaria.concat("'"))) :  queryBuffer8KM.concat(" malaria = '".concat(malaria.concat("'")))
      needsAnd = true
    }

    if(antenatal.length > 0) {
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND antenatal = '".concat(antenatal.concat("'"))) :  queryBuffer8KM.concat(" antenatal = '".concat(antenatal.concat("'")))
      needsAnd = true
    }

    if(hiv.length > 0) {
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND hiv = '".concat(hiv.concat("'"))) :  queryBuffer8KM.concat(" hiv = '".concat(hiv.concat("'")))
      needsAnd = true


    }

    if(tb.length > 0) {
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND sphcda_tb = '".concat(tb.concat("'"))) :  queryBuffer8KM.concat(" sphcda_tb = '".concat(tb.concat("'")))
      needsAnd = true


    }

    if(ri.length > 0) {
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND sphcda_ri_ = '".concat(ri.concat("'"))) :  queryBuffer8KM.concat(" sphcda_ri_ = '".concat(ri.concat("'")))
      needsAnd = true


    }

    if(family_planning.length > 0) {
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND family_planning = '".concat(family_planning.concat("'"))) :  queryBuffer8KM.concat(" family_planning = '".concat(family_planning.concat("'")))
      needsAnd = true


    }

    if(phcn.length > 0) {
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND phcn = '".concat(phcn.concat("'"))) :  queryBuffer8KM.concat(" phcn = '".concat(phcn.concat("'")))
      needsAnd = true


    }

    if(htr.length > 0) {
      queryBuffer8KM = needsAnd  ? queryBuffer8KM.concat(" AND htr = '".concat(htr.concat("'"))) :  queryBuffer8KM.concat(" htr = '".concat(htr.concat("'")))
      needsAnd = true

      console.log("HTR queryBuffer8KM: ", queryBuffer8KM)
    }

    if (typeList.length > 0){
      for(var i = 0; i < typeList.length; i++) {
        if (i == 0) {
            queryBuffer8KM = needsAnd ? queryBuffer8KM.concat(" AND type IN ( '" + typeList[i] + "')") : queryBuffer8KM.concat(" type IN ( '".concat(typeList[i].concat("')")));
        //console.log("Type queryBuffer8KM Include:  ", queryBuffer8KM)
          }

        else
          queryBuffer8KM = queryBuffer8KM.concat(" ,'" + typeList[i] + "')").replace(")", "")
       // console.log("Type queryBuffer8KM Include2:  ", queryBuffer8KM)
      }
    }

  }
  return queryBuffer8KM

}
