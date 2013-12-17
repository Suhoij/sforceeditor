//----------------------MAIN------------------------
$(document).ready(function(){
  $(document).foundation();
  MyApp.start({'sf_app_params':{org_id:1,app_id:11,slide_id:111,session_id:1111}});
  MyApp.vent.trigger("getSfparams"); 
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
 
});
//--------b:-- modal events----------------------------
$(document).on('open', '[data-reveal]', function () {
  var modal = $(this);
  console.log("modal open ",modal[0].id);
});
$(document).on('close', '[data-reveal]', function () {
  var modal = $(this);
  console.log("modal close ",modal[0].id);
});
//--------e:-- modal events----------------------------
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

//-----------------------------MODULES--------------------------------
MyApp.module("Chart", function(Chart){
    // ----------------------- Chart models --------------------------
    var ChartModel = Backbone.Model.extend({
        defaults: {
            title: "Chart title",
            legendLine:1,
      	    legend:  ['15px sans-serif', '#331e11', '#af9960', '#5f3b21'],
      	    showlegend: 'true',
      	    legendlocation:"left",
      	    bordercolor:"black",
            legendbackground:"#eeeeee",
      	    min:0,
      	    max:1,
      	    themeName: "Blue",
      	    styleName:"ClearBlue",
      	    type:"pie",
      	    chart_data:[['New Name' , '0'], ['New Name1' , '10'], ['New Name2' , '20']]
        }
    });
    var DataChartModel = Backbone.Model.extend({
        defaults: {
          data_name:"New name ",
          data_value:0,
          data_i:0
        }
    });
    // ------------------------  Views ---------------------
    var ChartView = Backbone.Marionette.ItemView.extend({
	     //template: "#chart-template",
	     //model:new ChartModel()
    });
    var DataItemChartView = Backbone.Marionette.ItemView.extend({
       events: {
        'click #data-add-btn': 'addItem',
        'click .#data-del-btn': 'delItem'    
        },
        addItem:function() {alert("Add from dataView")},
        delItem:function() {alert("Del from dataView")}
    });
 
    // ------------------------- Controllers ----------------
    var Controller = Marionette.Controller.extend({
 
        initialize: function(options){
          //this.stuff = options.stuff;
        },
       
        addData: function(){
          //this.trigger("data:done", this.stuff);
          //alert("addData from chart controller");
          var dt_tpl= MyApp.Chart.data_item_chart_view.render().el.innerHTML;
          $("#chartDataModal table tbody").append(dt_tpl);
          $(".data-del").click(function(){
              $(this).parent().parent().remove();
          });
        },
        delData: function(row_ptr){
          //this.trigger("data:done", this.stuff);
          //alert("delData from chart controller");
          console.log(row_ptr);
          //$(row_ptr).closest('tr').remove();
          
        }
 
    });
    // this.initEvents = function(master){
    //     $("#data-add-btn").click(function(){this.addData()})
    //     $("#data-del-btn").click(function(){this.delData()})
    // };
    // ------------------------- Methods --------------------
    this.show_chart=function() {
	  console.log("Module Chart ->show_chart");
	 // new ChartView().render();
	  //this.view.model=this.model;
	  //this.view.render();
    var chartwidget_code=this.chart_view.render().el.innerHTML;
	  MyApp.chartwidget_code=this.chart_view.render().el.innerHTML;
	  $("#chartwidget-code").empty().html("<script>"+chartwidget_code+"</script>");
	  
    },
    this.get_model=function(){
      return this.model;
    },

    Chart.addInitializer(function(){
      this.model=new ChartModel();
      this.chart_view=new ChartView({template: "#chart-template",model:new ChartModel()});
      this.data_chart_model=new DataChartModel();
      this.data_item_chart_view=new DataItemChartView({template: "#data-chart-item-template",model:this.data_chart_model});
      this.controller = new Controller();
      //this.controller.initEvents();
       $("#data-add-btn").click(function(){MyApp.Chart.controller.addData()})
       $("#data-del-btn").click(function(){MyApp.Chart.controller.delData()})
    });
  
});

    

   

