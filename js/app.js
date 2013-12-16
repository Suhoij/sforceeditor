//----------------------MAIN------------------------
$(document).ready(function(){
  $(document).foundation();
  MyApp.start({'sf_app_params':{org_id:1,app_id:11,slide_id:111,session_id:1111}});
  MyApp.vent.trigger("getSfparams"); 
  //chartView=new ChartView()
  //ch_r=chartView.render()
  //console.log("chartView.render()= "+ch_r);
});
//----------------------MAIN------------------------

//------------------APP INIT----------------------
MyApp    = new Backbone.Marionette.Application();
RichText = Marionette.Region.extend({el:".rich-text"});
Chart    = Marionette.Region.extend({el:".chart"});

MyApp.addInitializer(function(options){
  this.state='init';
  this.sf_app_params={};
  this.options=options;
  this.initChartMenu=function() {  
     $(".dropdown >li >a").click(function(){$("#chart-menu >a").text($(this).text())})
  }
  // do useful stuff here
 //myView = new MyView({
 //   model: options.someModel
 // });
 // MyApp.mainRegion.show(myView);
  
});
MyApp.vent.on("getSfparams", function(){
  console.table(MyApp.options);
});
MyApp.on("initialize:after", function(options){
  if (Backbone.history){
      Backbone.history.start();
      console.log("sf_app_params.org_id="+options.sf_app_params.org_id);
      MyApp.initChartMenu();
      //----------Modules start----
      var chart_module = MyApp.module("Chart");
      chart_module.start();
  }
});
MyApp.addRegions({
  sidebarRegion: {
    selector: "#left-sidebar",
    regionType: RichText
  },
 
  titlechartRegion: {
    selector: "#title-chart",
    regionType: RichText
  },
  
  bodychartRegion: {
    selector: "#body-chart",
    regionType: Chart
  }
 
});

//--------------------------------------------------------------------------

   // Chart model
//     var ChartModel = Backbone.Model.extend({
//         defaults: {
//             title: "Chart title",
// 	    legend: 'true',
// 	    showlegend: 'true',
// 	    legendlocation:"left",
// 	    bordercolor:"black",
// 	    min:0,
// 	    max:1,
// 	    themeName: "Blue",
// 	    styleName:"ClearBlue",
// 	    type:"pie",
// 	    chart_data:[0,1]
//         }
//     });
//   model_c=new ChartModel();
//   var ChartView = Backbone.Marionette.ItemView.extend({
// 	template: "#chart-template",
// 	model:model_c
//     });
// 







//-----------------------------Modules------------------------------------
MyApp.module("Chart", function(Chart){
// код модуля
    // Chart model
    var ChartModel = Backbone.Model.extend({
        defaults: {
            title: "Chart title",
	    legend: 'true',
	    showlegend: 'true',
	    legendlocation:"left",
	    bordercolor:"black",
	    min:0,
	    max:1,
	    themeName: "Blue",
	    styleName:"ClearBlue",
	    type:"pie",
	    chart_data:[['New Name' , '0'], ['New Name1' , '10'], ['New Name2' , '20']]
        }
    });
    // View
    var ChartView = Backbone.Marionette.ItemView.extend({
	//template: "#chart-template",
	//model:new ChartModel()
    });
    this.get_model=function(){
      return this.model;
    },
    this.show_chart=function() {
	  console.log("Module Chart ->show_chart");
	 // new ChartView().render();
	  //this.view.model=this.model;
	  //this.view.render();
	  var chartwidget_code=this.chart_view.render().el.innerHTML;
	  $("#chartwidget-code").html("<script>"+chartwidget_code+"</script>");
	  
    },
    Chart.addInitializer(function(){
      this.model=new ChartModel();
      this.chart_view=new ChartView({template: "#chart-template",model:new ChartModel()});
      
      //var MyModel =  Backbone.Model.extend();
      //var myModel = new MyModel({foo: "bar"});

      //MyItemView = Backbone.Marionette.View.extend();
      //myItemView=new MyItemView({
	//template: "#myItemTemplate",
	//model: myModel
      //});

     // myItemView.render();
    });
  
});

    

   

