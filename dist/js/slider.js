var lowerlimit, upperlimit;
$(function() {
$( "#slider-range" ).slider({
range: "min",
min: 0,
max: 8,
values: 0,
stop: function( event, ui ) {
  $( "#amount" ).val( ui.value + "  Km");
  triggerUiUpdate()
}
});
$( "#amount" ).val($( "#slider-range" ).slider( "values" ) + "  Km" );
});
