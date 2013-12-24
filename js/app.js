//----------------------MAIN------------------------
$(document).ready(function(){
  $(document).foundation();
  MyApp.start({'sf_app_params':{org_id:1,app_id:11,slide_id:111,session_id:1111}});
  MyApp.vent.trigger("getSfparams"); 
});
//----------------------MAIN------------------------

//------------------APP INIT----------------------
MyApp    = new Backbone.Marionette.Application();
MyApp.addRegions({
    chartRegion:"#chartwidget-content",
    videoRegion:"#chartwidget-content",
    sliderRegion:"#sliderwidget-content",
    sortableRegion:"#sortablewidget-content"
  }
);


MyApp.addInitializer(function(options){
  this.state='init';
  this.sf_app_params={};
  this.options=options;
  this.initHeadMenu=function() {
      $("#head-menu-video").click(function() {MyApp.Video.showContent();}   );
      $("#head-menu-slide").click(function() {MyApp.Slide.showContent();}   );
      $("#head-menu-sortable").click(function() {MyApp.Sortable.showContent();}   );
  };
  this.fieldValidate=function(el,cond){
      if (el.value !=="") {
         return true;
      } else { el.focus();$('#customStyleInputError').show();}
  };
  this.customStyleChange=function() {
    if ( $('#custom-style').prop("checked")){
          $('#customStyleInput').show().focus();
    } else {
          $('#customStyleInput').hide();
          $('#customStyleInputError').hide();
    }
  };
  this.initChartMenu=function() {  
     $(".dropdown >li >a").click(function(){
            var chart_type=$(this).attr("jq-type");
            console.log(chart_type);

            $("#chart-menu >a").text($(this).text());           
            MyApp.Chart.model.set("type",chart_type);
            MyApp.Chart.drawChart();  
          }
      )
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
  if (modal[0].id=="videoDataModal") {
  }
});
$(document).on('close', '[data-reveal]', function () {
  var modal = $(this);
  console.log("modal close ",modal[0].id);
  if (modal[0].id=="chartControlModal") {
        
        MyApp.Chart.FillModelChartProp();
        MyApp.Chart.drawChart(); 
  }
  if (modal[0].id=="chartDataModal") {
        MyApp.Chart.FillCollectionChartData();
        MyApp.Chart.drawChart(); 
  }
  if (modal[0].id=="videoControlModal") {
        MyApp.Video.FillModelVideoProp();
        MyApp.Video.showVideoPlayer();
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
      MyApp.initHeadMenu();
      MyApp.initChartMenu();
      //----------Modules start----
      var chart_module = MyApp.module("Chart");
      var slide_module = MyApp.module("Slide");
      MyApp.module("Sortable").start();
      chart_module.start();
      slide_module.start();
  }
});
// MyApp.addRegions({
//   sidebarRegion: {
//     selector: "#left-sidebar",
//     regionType: RichText
//   },
 
//   titlechartRegion: {
//     selector: "#title-chart",
//     regionType: RichText
//   },
  
//   bodychartRegion: {
//     selector: "#body-chart",
//     regionType: Chart
//   }
 
// });

//============================ MODULES ===============================

//--------------------------- Module Sortable-------------------------
MyApp.module("Sortable", function(Sortable){
   //------------------------Init ------------------------------
    Sortable.addInitializer(function(){
      this.model         = new SortableModel();
      this.sortable_view = new SortableView();
    });
    //-------------------------Methods---------------------------
    this.showContent=function() {
      //this.sortable_view.model=this.model;
      MyApp.sortableRegion.show(this.sortable_view);
      $("#sortable-control-btn").click(function(){ $("#sortableControlModal").foundation('reveal', 'open');})
    };
    //-------------------------Models----------------------------
    var SortableModel = Backbone.Model.extend({
       defaults: {
       }
    });
    //-------------------------Views-----------------------------
    var SortableView = Backbone.Marionette.ItemView.extend({
       template: "#main-sortable-template",
       model:this.model
    });
});
//------------------------end Module Sortable-------------------------




//--------------------------- Module Slide ---------------------------
MyApp.module("Slide", function(Slide){
   //------------------------Init ------------------------------
    Slide.addInitializer(function(){
      this.model      = new SlideModel();
      this.slide_view = new SlideView();
    });
    //-------------------------Methods---------------------------
    this.showContent=function() {
      this.slide_view.model=this.model;
      MyApp.sliderRegion.show(this.slide_view);
      $("#slider-control-btn").click(function(){ $("#sliderControlModal").foundation('reveal', 'open');})
    };
    //-------------------------Models----------------------------
    var SlideModel = Backbone.Model.extend({
      defaults: {
        defVal:1,
        minVal:1,
        maxVal:100,
        sobjectName:"sforceObject",
        sobjectField:"sobjectField",
        titleText:"slider title",
        step:1,
        themeName: "Green",
        customStyleInput:"",
      }
    });
    //-------------------------Views-----------------------------

    var SlideView = Backbone.Marionette.ItemView.extend({
       template: "#main-slide-template",
       model:this.model
    });
});
//------------------------end Module Slide -------------------------





//----Video--Video--Video--Video - MODULE Video - Video--Video--Video-
MyApp.module("Video", function(Video){
   //------------------------Init ------------------------------
    Video.addInitializer(function(){
          this.ext_player=false;//--true if added in head control files
          this.model      = new VideoModel();
          this.video_view = new VideoView();
          this.video_player_view = new VideoPlayerView();
    });
    //-------------------------Methods---------------------------
    this.showVideoPlayer=function(){
          this.video_player_view.model=this.model;
          if (this.video_player_view.model.get("video_source")=="Youtube"){
              this.video_player_view.template="#player-youtube-video-template";
              $("#video-logo").html("<img src='img/youtube.png' />");
          } else {
              if (this.ext_player == false) {
                  $('head').append('<link href="http://vjs.zencdn.net/4.1/video-js.css" rel="stylesheet"/>');
                  $('head').append('<script src="http://vjs.zencdn.net/4.1/video.js"></script>');
                  this.ext_player=true;
                  this.video_player_view.model.set("video_id","http://video-js.zencoder.com/oceans-clip.mp4");
              }
              this.video_player_view.template="#player-other-video-template";
              $("#video-logo").html("<img src='img/video.jpeg'  />");
          }
          var vp_html=this.video_player_view.render().el.innerHTML;
          // console.log("-------------------------vp html-------------------");
          // console.log(vp_html);
          $("#video-player").html(vp_html);
    };
    this.showContent=function() {
          $("#chartwidget-content").hide();
          $("#videowidget-content").show();
          if ($("#videowidget-content").length==0) {
              this.video_view.model=this.model;         
              $("#allwidget-content").append(this.video_view.render().el.innerHTML);
              $("#video-control-btn").click(function(){ $("#videoControlModal").foundation('reveal', 'open');})
          }
    };
    this.FillModelVideoProp=function() {
          var screen_items=$("#videoControlModal  :input");
          var prop_arr=[];
          //--select id,name from screen_items
          jQuery.each(screen_items,function(i,item){
                                    var id_v=item.id,value_v=item.value;
                                    if (item.type =="checkbox") {                                       
                                        if (item.checked == true) {
                                                value_v=1;
                                        } else { value_v=0;}
                                    }
                                    prop_arr.push({id:id_v,value:value_v});
                                    }
          );
          
          jQuery.each(prop_arr,function(i,prop){
              MyApp.Video.model.set(prop.id,prop.value);
              //console.log("FillModelVideoProp prop.id=",prop.id,prop.value);
          });
    };
    //-------------------------Models----------------------------
    var VideoModel = Backbone.Model.extend({
       defaults: {
         video_active:1,
         video_source:"Youtube",
         video_id:"nJQW-rbHMS0",//--salesforce--
         video_width:"100%",
         video_height:"100%",
         autoplay:0
       }
    });
    //-------------------------Views-----------------------------
    var VideoView = Backbone.Marionette.ItemView.extend({
       template: "#main-video-template",
       model:this.model
    });
    var VideoPlayerView = Backbone.Marionette.ItemView.extend({
       template: "#player-video-template",
       model:this.model
    });
});
//------------------------end Module Video -------------------------

//----CHART--CHART--CHART--CHART Module Chart --CHART--CHART--CHART--CHART--
MyApp.module("Chart", function(Chart){
    // ---------------------- Chart models --------------------------
    var ChartModel = Backbone.Model.extend({
        
        defaults: {
            activechart:1,
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
      	    themeName: "Green",
            styleName:"ClearBlue",
      	    themeList:"ClearOrange",
            customStyleInput:"",
      	    type:"pie",
      	    chart_data:[['New Name0' , '0'], ['New Name1' , '10'], ['New Name2' , '20']]
        }
    });
    var DataChartModel = Backbone.Model.extend({
        defaults: {
          data_name:"New name ",
          data_value:0,
          data_i:0
        }
    });
    var DataChartCollection = Backbone.Collection.extend({});
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
        'click #data-del-btn': 'delItem'    
        },
        addItem:function() {alert("Add from dataView")},
        delItem:function() {alert("Del from dataView")}
    });
 
    // ------------------------- Controllers ----------------
    var Controller = Marionette.Controller.extend({
 
        initialize: function(options){
          //this.stuff = options.stuff;
        },
        addCollectionData:function() {
            if ( MyApp.Chart.data_chart_collection.length <=1) {return;}
            $("#chartDataModal table tbody").empty();
            var coll_length=MyApp.Chart.data_chart_collection.length;
            for (var i=0;i<coll_length;i++) {            
                var chart_data_cur=MyApp.Chart.data_chart_collection.at(i);
                MyApp.Chart.data_item_chart_view.model=chart_data_cur;
                var row_tpl= MyApp.Chart.data_item_chart_view.render().el.innerHTML;
                $("#chartDataModal table tbody").append(row_tpl);
            };
            //---for delete row-------------
            $(".data-del").click(function(){
              $(this).parent().parent().remove();
            });
           
        },
        addData: function(){
          //this.trigger("data:done", this.stuff);
          //alert("addData from chart controller");
          var dt_tpl= MyApp.Chart.data_item_chart_view.render().el.innerHTML;
          $("#chartDataModal table tbody").append(dt_tpl);
          //---for delete row-------------
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
    this.drawChart=function(){
        this.showContent();
        this.show_chart();
        this.setChartData();
    },
    this.setChartTheme=function() {
      //---select params
      //---write css link
      var themeList=this.model.get("themeList");
      console.log("Module Chart ->setChartTheme themeList=",themeList);
      this.model.set("themeName",themeList.split("-")[1]);
      this.model.set("styleName",themeList.split("-")[0]);
      var theme_css_file="<link rel='stylesheet' type='text/css' href='JSLibrary/css/themes/" + themeList.replace("-","") +".css'  />";
      jQuery("#chartwidget-theme").html(theme_css_file);
      //console.log(theme_css_file);
    },
    this.showContent=function() {
      $("#chartwidget-content").show();
      $("#videowidget-content").hide();
      // if ($("#chartwidget-content").length==0) {
      //       this.chart_view.model=this.model;
      //       this.chart_view.template="#main-chart-template";
      //       $("#allwidget-content").html(this.chart_view.render().el.innerHTML);
      //       this.chart_view.template="#chart-template";
      // }
    },
    this.show_chart=function() {
      	  console.log("Module Chart ->show_chart");
      	 // new ChartView().render();
      	  //this.view.model=this.model;
      	  //this.view.render();
          this.setChartTheme();
          this.chart_view.model=this.model;
          var chartwidget_code=this.chart_view.render().el.innerHTML;
      	  MyApp.chartwidget_code=this.chart_view.render().el.innerHTML;
      	  $("#chartwidget-code").empty().html("<script>"+chartwidget_code+"</script>");
      	  
    },
    this.setChartData=function(){
           var collection_data=[];
           var coll_length=MyApp.Chart.data_chart_collection.length;
           for (var i=0;i<coll_length;i++) {   
              var m=MyApp.Chart.data_chart_collection.at(i);
              collection_data.push([m.get("data_name"),m.get("data_value")]);
           };
           $('#chartwidget').jqChart('option', 'series')[0].data=collection_data;
           $('#chartwidget').jqChart('update');
    },
    this.FillScreenChartProp=function() {
      console.log("FillScreenChartProp");
      var fields = _.keys(MyApp.Chart.model.attributes);
      jQuery.each(fields,function(f) {
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
          MyApp.Chart.controller.addCollectionData();
    },
    this.FillModelChartProp=function() {
          console.log("FillModelChartProp");
          var screen_items=$("form[name='chart-prop'] select,input");//---check on ??
          var prop_arr=[];
          //--select id,name from screen_items
          jQuery.each(screen_items,function(i,item){
                                      //prop_arr.push({id:item.id,value:item.value});
                                        var id_v=item.id,value_v=item.value;
                                        if (item.type =="checkbox") {                                       
                                            if (item.checked == true) {
                                                    value_v=1;
                                            } else { value_v=0;}
                                        }
                                        prop_arr.push({id:id_v,value:value_v});
                                        }
                                    
          );
          //console.log("chart_prop:",chart_prop);
         
          jQuery.each(prop_arr,function(i,prop){
              MyApp.Chart.model.set(prop.id,prop.value);
          });

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
          this.data_chart_collection = new DataChartCollection({data_name:"Name..",data_value:0,data_i:0});
          //this.data_chart_collection.add({data_name:"Name..",data_value:0,data_i:0});//--first init
          this.chart_view=new ChartView({template: "#chart-template",model:this.model});//--new ChartModel()
          this.data_chart_model=new DataChartModel();
          this.data_item_chart_view=new DataItemChartView({template: "#data-chart-item-template",model:this.data_chart_model});
          this.prop_chart_view=new PropChartView({template: "#chartControlModal",model:this.model});
         
          this.controller = new Controller();
          //this.controller.initEvents();
           $("#data-add-btn").click(function(){MyApp.Chart.controller.addData()});
           $("#data-del-btn").click(function(){MyApp.Chart.controller.delData()});
    });
  
});

    

   

