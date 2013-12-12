function loadSlideJS(valueString){

	if (jQuery("#chartwidget").length){
		initChart();
	}

	if (jQuery("#sliderwidget").length){
		initSlider();
		if (valueString != null){
			var valueDivider = valueString.lastIndexOf("|");
				if (valueDivider != -1){
					var val = parseInt(valueString.substring(valueDivider+1));
					jQuery("#sliderwidget").slider("value", val);
				}
		}
	}

	if (jQuery("#sortablewidget").length){
		initSortable();
	}
	
	if (typeof startSlideAnimation == 'function'){
		startSlideAnimation(); 
	}
}

function getJSValues(){
	var result;
		if (jQuery("#sliderwidget").length){
			result = "slider|"+jQuery("#sliderwidget").attr("sobject")+"|"+jQuery("#sliderwidget").attr("sfield")+"|"+jQuery("#sliderwidget").slider("value");
		}
	return result;
}
