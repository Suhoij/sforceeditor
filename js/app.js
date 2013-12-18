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
  if (modal[0].id=="chartControlModal") {
      MyApp.Chart.FillScreenChartProp();
  }
  if (modal[0].id=="chartDataModal") {
      MyApp.Chart.FillScreenChartData();
  }
});
$(document).on('close', '[data-reveal]', function () {
  var modal = $(this);
  console.log("modal close ",modal[0].id);
  if (modal[0].id=="chartControlModal") {
      MyApp.Chart.FillModelChartProp();
  }
  if (modal[0].id=="chartDataModal") {
      MyApp.Chart.FillCollectionChartData();
  }
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
            width:120,
            height:120,
            legendLine:1,
      	    legend:  ['15px sans-serif', '#331e11', '#af9960', '#5f3b21'],
      	    showlegend: 'true',
      	    legendlocation:"right",
      	    bordercolor:"black",
            legendbackground:"#eeeeee",
      	    min:0,
      	    max:1,
      	    themeName: "Blue",
            styleName:"ClearBlue",
      	    themeList:"ClearOrange",
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
    var DataChartCollection = Backbone.Collection.extend({})
    // ------------------------  Views ---------------------
    var ChartView = Backbone.Marionette.ItemView.extend({
	     //template: "#chart-template",
	     //model:new ChartModel()
    });
    var PropChartView = Backbone.Marionette.ItemView.extend({
      ui: {
        title:    {id:"#title",type:"text"},
        themeList:{id:"#themeList",type:"select"},
        themeList:{id:"#custom-style",type:"checkbox"},
        width:    {id:"#width",type:"text"},
        height:   {id:"#height",type:"text"},
        showlegend:   {id:"#height",type:"text"},
        legendlocation: {id:"#legendlocation",type:"select"}
      }
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
    this.FillScreenChartProp=function() {
      console.log("FillScreenChartProp");
      var fields = _.keys(MyApp.Chart.model.attributes);
      _.each (fields,function(f) {
          var f_val=MyApp.Chart.model.get(f);
          //---tags select
          if (f=="themeList") {

          }
          //---tags checkbox
          //---tags input
          $("#"+f).val(f_val);
          //console.log("field="+f,MyApp.Chart.model.get(f));
      });
    },
    this.FillScreenChartData=function() {
      console.log("FillScreenChartData");
    },
    this.FillModelChartProp=function() {
      console.log("FillModelChartProp");
      var screen_items=$("form[name='chart-prop'] select,input");//---check on ??
      var chart_prop=[];
      //--select id,name from screen_items
      jQuery.each(screen_items,function(i,item){
                                  chart_prop.push({id:item.id,value:item.value})
                                }
      );
      console.log("chart_prop:",chart_prop);
     
      jQuery.each(chart_prop,function(i,prop){
        MyApp.Chart.model.set(prop.id,prop.value);
      })
    },
    this.FillCollectionChartData=function() {
      console.log("FillCollectionChartData");
      MyApp.Chart.data_chart_collection.reset();
      $("#chartDataModal  table tbody tr").each(function(i) {
          var fields = $(this).find("input");
          var name = fields.eq(0).val();
          var value = fields.eq(1).val();
          console.log(name,value);
          MyApp.Chart.data_chart_collection.add({data_name:name,data_value:value,data_i:i});
          //--get prop: MyApp.Chart.data_chart_collection.at(0).attributes.data_name
      });
    },
    //------------------------Init ------------------------------
    Chart.addInitializer(function(){
      this.model=new ChartModel();
      this.data_chart_collection = new DataChartCollection({model:this.model})
      this.chart_view=new ChartView({template: "#chart-template",model:this.model});//--new ChartModel()
      this.data_chart_model=new DataChartModel();
      this.data_item_chart_view=new DataItemChartView({template: "#data-chart-item-template",model:this.data_chart_model});
      this.prop_chart_view=new PropChartView({template: "#chartControlModal",model:this.model});
     
      this.controller = new Controller();
      //this.controller.initEvents();
       $("#data-add-btn").click(function(){MyApp.Chart.controller.addData()})
       $("#data-del-btn").click(function(){MyApp.Chart.controller.delData()})
    });
  
});

    

   

