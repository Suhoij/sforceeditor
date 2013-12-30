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
//---------------Model Fields&Objects--------------
var FieldsObjectsCollection = Backbone.Collection.extend({       
});

MyApp.addInitializer(function(options){
  this.state='init';
  this.sf_app_params={};
  this.options=options;
  this.initHeadMenu=function() {
      $("#head-menu-video").click(function() {MyApp.Video.showContent();}   );
      $("#head-menu-slider").click(function() {MyApp.Slider.showContent();}   );
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
  };
  this.FillScreenFieldsObjects=function(widget_name){    
    if ( $('select#sobjects_'+widget_name+' option').length == 0) {
        var objects_options_str="";
        var fields_options_str="";
        var fields_str="";
        var selected_str="";
        jQuery.each(this.fields_objects.models,function(i,item) {
                if (i==0) {
                      selected_str=" selected ";
                      related_fields=item.attributes.fields_name;
                      var selected_field_str="";
                      jQuery.each(related_fields,function(i,item){
                              if (i==0) {selected_field_str=" selected ";} else {selected_field_str="";}
                              fields_options_str=fields_options_str+"<option val='"+item.val+"' "+selected_field_str+" >"+item.name+"</options>";
                      });
                      
                } else {
                  selected_str="";
                }
                objects_options_str=objects_options_str+"<option val='"+item.attributes.object_val+"' "+selected_str+">"+item.attributes.object_name+"</option>";
        });
        $("#sobjects_"+widget_name).html(objects_options_str);
        $("#sfields_"+widget_name).html(fields_options_str);
    }
  };
  this.sobjectsChange=function(el,widget_name){
        var obj_cur=jQuery(el).val();            
        var related_fields=MyApp.fields_objects.findWhere({object_name:obj_cur});                
        selected_str=" selected ";
        fields_options_str="";
        jQuery.each(related_fields.attributes.fields_name,function(i,item) {
                if (i==0) {selected_field_str=" selected ";} else {selected_field_str="";}
                fields_options_str=fields_options_str+"<option val='"+item.val+"' "+selected_field_str+" >"+item.name+"</options>";
        });
        $("#sfields_"+widget_name).html(fields_options_str);
    };
  this.initFieldsObjectsCollection=function() {
    this.fields_objects=new  FieldsObjectsCollection();
    this.fields_objects.add([
      {object_name:"Организация",object_val:"Account",fields_name:[
                                  {name:"Широта отправки",val:"ShippingLatitude"},
                                  {name:"Долгота для счета",val:"BillingLongitude"},
                                  {name:"Широта для счета",val:"BillingLatitude"},
                                  {name:"Годовой доход",val:"AnnualRevenue"},
                                  {name:"Сотрудники",val:"NumberOfEmployees"},
                                  {name:"Geolocation (Longitude)",val:"Geolocation__Longitude__s"},
                                  {name:"Geolocation (Latitude)",val:"Geolocation__Latitude__s"},
                                  {name:"Number of Locations",val:"NumberofLocations__c"},
                                  {name:"Долгота отправки",val:"ShippingLongitude"},
                                  ]},
      {object_name:"Контакт",object_val:"Contact",fields_name:[
                                  {name:"Широта в почтовом адресе",val:"MailingLatitude"},
                                  {name:"Другая долгота",val:"OtherLongitude"},
                                  {name:"Долгота в почтовом адресе",val:"MailingLongitude"},
                                  {name:"Другая широта",val:"OtherLatitude"}
                                  ]},
      {object_name:"Pharma Activity",object_val:"CTPHARMA__Activity__c",fields_name:[
                                  {name:"Location (Longitude)",val:"OpenAtLocation__Longitude__s"},
                                  {name:"Location (Latitude)",val:"OpenAtLocation__Latitude__s"},
                                  {name:"Visit duration",val:"Duration__c"}
                                  ]},
      {object_name:"Pharma Activity Data",object_val:"CTPHARMA__ActivityData__c",fields_name:[
                                  {name:"Price",val:"CTPHARMA__Price__c"},
                                  {name:"Answer",val:"CTPHARMA__CurrencyAnswer__c"},
                                  {name:"Answer Number",val:"CTPHARMA__NumberAnswer__c"},
                                  {name:"Quantity",val:"CTPHARMA__Quantity__c"}
      ]}
    ]);
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
  if (modal[0].id=="sliderControlModal") {
      MyApp.Slider.FillScreenSliderProp();
  }
  if (modal[0].id=="sortableControlModal") {
      MyApp.Sortable.FillScreenProp();
  }
  if (modal[0].id=="sortableDataModal") {
      MyApp.Sortable.FillScreenData();
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
  if (modal[0].id=="sliderControlModal") {
        MyApp.Slider.FillModelSliderProp();
        MyApp.Slider.drawSlider();
  }
  if (modal[0].id=="sortableControlModal") {
        MyApp.Sortable.FillModelProp();
        MyApp.Sortable.drawSortable();
  }
  if (modal[0].id=="sortableDataModal") {
        MyApp.Sortable.FillCollectionData();
        MyApp.Sortable.drawSortable();
  }
  
});
//--------e:-- modal events----------------------------
MyApp.vent.on("getSfparams", function(){
  //console.table(MyApp.options);
});
MyApp.on("initialize:after", function(options){
  if (Backbone.history){
      Backbone.history.start();
      console.log("sf_app_params.org_id="+options.sf_app_params.org_id);
      MyApp.initHeadMenu();
      MyApp.initChartMenu();
      MyApp.initFieldsObjectsCollection();
      //----------Modules start----
      //var chart_module = MyApp.module("Chart");
      //var slider_module = MyApp.module("Slider");
      MyApp.module("Chart").start();
      MyApp.module("Slider").start();
      MyApp.module("Sortable").start();
      MyApp.Chart.drawChart(); 
      //chart_module.start();
      //slider_module.start();
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
      this.controller      = new Controller();
      this.model           = new SortableModel();
      this.data_collection = new DataCollection({data_name:"Name..",data_value:0,data_i:0});
      this.sortable_view   = new SortableView();
      $("#data-add-sortable-btn").click(function(){MyApp.Sortable.controller.addData()});
      $("#data-del-btn").click(function(){MyApp.Sortable.controller.delData()});
    });
    // ------------------------- Controllers ----------------
    var Controller = Marionette.Controller.extend({
        addData: function(){
          var dt_tpl= MyApp.Sortable.data_item_view.render().el.innerHTML;
          $("#sortableDataModal table tbody").append(dt_tpl);
          //---for delete row-------------
          $(".data-del").click(function(){
              $(this).parent().parent().remove();
          });
        },
        addData: function(){
          //var dt_tpl= MyApp.Sortable.data_item_view.render().el.innerHTML;
          var dt_tpl= $("#data-item-template").html();
          $("#sortableDataModal table tbody").append(dt_tpl);
        }
    });
    //-------------------------Methods---------------------------
    this.showContent=function() {
          //this.sortable_view.model=this.model;
          MyApp.sortableRegion.show(this.sortable_view);
          $("#sortable-control-btn").click(function(){ $("#sortableControlModal").foundation('reveal', 'open');});
          $("#sortable-data-btn").click(function(){ $("#sortableDataModal").foundation('reveal', 'open');});
    };
    this.FillScreenProp=function() {
          MyApp.FillScreenFieldsObjects("sortable");//--select fill--
    };
    this.FillScreenData=function() {
         //MyApp.Sortable.controller.addCollectionData();
    };
    this.FillModelProp=function(){
          var screen_items=$("#sortableControlModal  :input");
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
              MyApp.Sortable.model.set(prop.id,prop.value);          
          });
    };
    this.FillCollectionData=function() {
          console.log("FillCollectionData");
          MyApp.Sortable.data_collection.reset();
          $("#sortableDataModal  table tbody tr").each(function(i) {
              var fields = $(this).find("input");
              var name = fields.eq(0).val();
              var value = fields.eq(1).val();
              //console.log(name,value);
              MyApp.Sortable.data_collection.add({data_name:name,data_value:value,data_i:i});              
          });
    };
    this.drawSortable=function() {
          this.setTheme();
          this.setCode();
    };
    this.setTheme=function(){
          var themeList=this.model.get("themeList");
          var theme_str="<link rel='stylesheet' type='text/css' href='JSLibrary/css/themes/" + themeList.replace("-","") +".css'  />";
          $("#sortablewidget-theme").html(theme_str);
    };
    this.setCode=function() {
          //---fill li lists from collection----------------
          var li_str="";
          jQuery.each(this.data_collection.models,function(i,f) {
              data_value = f.attributes.data_value;
              data_name  = f.attributes.data_name;
              //console.log("setCode...",data_value,data_name);
              li_str=li_str+"<li val='"+data_value+"' class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>"+data_name+"</li>";
          });
          jQuery("#sortablewidget").html(li_str);
          jQuery("#sortablewidget").sortable();
          jQuery("#sortablewidget").disableSelection();
    };
    this.getSortablePosition=function(){//---Sasha code fro SF 
           var getValString = "";
           var getPosString = "";
           var counter = 0;
           jQuery("#sortablewidget li").each(function(){
               counter++;
               getValString += jQuery(this).attr("val")+";";
               getPosString += counter+";";
           });
          getValString = getValString.substring(0, getValString.length-1);
          getPosString = getPosString.substring(0, getPosString.length-1);
          return {
              'values': getValString,
              'positions': getPosString
          };  
    };
    //-------------------------Models----------------------------
    var SortableModel = Backbone.Model.extend({
        defaults: {
            sobjects_sortable:"sforceObject",
            sfields_sortable:"sobjectField",
            titleText:"Sortable title",
            themeName: "ClearGreen",
            themeList: "ClearGreen",
            customStyleInput:""
        }
    });
    var DataCollection = Backbone.Collection.extend({});
    //-------------------------Views-----------------------------
    var SortableView = Backbone.Marionette.ItemView.extend({
       template: "#main-sortable-template",
       model:this.model
    });
});
//------------------------end Module Sortable-------------------------




//--------------------------- Module Slide ---------------------------
MyApp.module("Slider", function(Slider){
   //------------------------Init ------------------------------
    Slider.addInitializer(function(){
          this.control_scripts=false;
          this.model      = new SliderModel();
          this.slider_view = new SliderView({model:this.model});
          this.slider_code_view = new SliderCodeView({model:this.model});
    });
    //-------------------------Methods---------------------------
    this.showContent=function() {
          console.log("showContent");
          this.slider_view.model=this.model;
          MyApp.sliderRegion.show(this.slider_view);
          $("#slider-control-btn").click(function(){ $("#sliderControlModal").foundation('reveal', 'open');});
    };
    this.FillScreenSliderProp=function(){
          var fields = _.keys(MyApp.Slider.model.attributes);
          jQuery.each(fields,function(i,f) {
              var f_val=MyApp.Slider.model.get(f);
              //---tags select
              if (f=="themeList") {

              }
              //---tags checkbox
              //---tags input
              $("#"+f).val(f_val);
              //console.log("FillScreenSliderProp field="+f,MyApp.Slider.model.get(f));
          });
          MyApp.FillScreenFieldsObjects("slider");
    };
    this.FillModelSliderProp=function(){
          var screen_items=$("#sliderControlModal  :input");
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
              MyApp.Slider.model.set(prop.id,prop.value);          
          });
    };
    this.drawSlider=function() {
          this.setSliderTheme();
          this.setSliderCode();
    };
    this.setSliderTheme=function() {
          var themeList=this.model.get("themeList");
          console.log("setSliderTheme...themeList=",themeList);
          var css_str="<link rel='stylesheet' type='text/css' href='JSLibrary/css/themes/" + themeList.replace("-","") +".css'  />";
          console.log("css_str=",css_str);
          $("#sliderwidget-theme").html(css_str);
        
            // <script type="text/javascript" src="JSLibrary/js/jquery-ui-1.9.1.min.js"></script>
            //<script type="text/javascript" src="/JSLibrary/js/jquery.ui.touch-punch.min.js"></script>
            //<link rel="stylesheet" type="text/css" href="{!URLFOR($Resource.JSLibrary, '/JSLibrary/css/themes/' + themeName + '.css')}"/>
    };
    this.setSliderCode=function() {
        if (this.control_scripts ==false) {           
            //$('head').append('<script type="text/javascript" src="JSLibrary/js/jquery-ui-1.9.1.min.js"></script>');
            //$('head').append('<link rel="stylesheet" type="text/css" href="JSLibrary/css/jquery-ui-1.9.1.min.css"></link>');
            
            //$('head').append('<link rel="stylesheet" href="http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css">');
            // <style>#slider { margin: 10px; }  </style>
            //$('head').append('<script src="http://code.jquery.com/jquery-1.8.3.js"></script>');
            //$('head').append('<script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>');

            //$('head').append('<script type="text/javascript" src="JSLibrary/js/jquery.ui.touch-punch.min.js"></script>');
            this.control_scripts=true;
            //console.log("setSliderCode...")
        }
        this.slider_code_view.model=this.model;
        var sliderwidget_code   = this.slider_code_view.render().el.innerHTML;      
        $("#sliderwidget-code").empty().html("<script>"+sliderwidget_code+"</script>");
    };
    //-------------------------Models----------------------------
    var SliderModel = Backbone.Model.extend({
      defaults: {
        defVal:90,
        minVal:1,
        maxVal:99,
        sobjects_slider:"sforceObject",
        sfields_slider:"sobjectField",
        titleText:"slider title",
        step:1,
        themeName: "ClearGreen",
        themeList: "ClearGreen",
        customStyleInput:""
      }
    });
    //-------------------------Views-----------------------------

    var SliderView = Backbone.Marionette.ItemView.extend({
       template: "#main-slider-template",
       model:this.model
    });
    var SliderCodeView = Backbone.Marionette.ItemView.extend({
       template: "#slider-code-template",
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
              $("#video-control-btn").click(function(){ $("#videoControlModal").foundation('reveal', 'open');});
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
            type_prop:{"pie":{click_cnt:0},"line":{click_cnt:0},"spline":{click_cnt:0},"area":{click_cnt:0}},
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
    // ------------------------ Collection -----------------
    // -------------------------  Pie ----------------------
    this.fist_collection_corrected=false;
    this.data_collection_1=[
          {data_name:"Product One",data_value:18.9,data_i:0},
          {data_name:"Product Two",data_value:32.4,data_i:1},
          {data_name:"Product Three",data_value:27.0,data_i:2},
          {data_name:"Another Product",data_value:21.6,data_i:3}
    ];
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
    this.clickLinkShow=function() {
      var cur_type=this.model.get("type");
      var cur_type_prop=this.model.get("type_prop");
      return this.model.get("type_prop")[cur_type].click_cnt++;
    },
    //------------ correct data collection for first draw-----
    this.setFirstCollection=function() {
      var cur_type=this.model.get("type");
      //console.log("CLICK DRAW ",this.model.get("type"),this.model.get("type_prop")[cur_type].click_cnt);
      //if (_.indexOf(["line","spline","area"],cur_type) != -1) {//---yes in array---
      if (MyApp.Chart.fist_collection_corrected ==false) {//---yes in array---
             var coll_length=MyApp.Chart.data_chart_collection.length;
             for (var i=0;i<coll_length;i++) {   
                  var cur_value=MyApp.Chart.data_chart_collection.at(i).attributes.data_value;
                  MyApp.Chart.data_chart_collection.at(i).set("data_value",(cur_value*0.01).toFixed(3)) ;                  
                  MyApp.Chart.fist_collection_corrected=true;
             }
      }
    },
    this.drawChart=function(){
        this.showContent();
        this.show_chart();
        if (this.clickLinkShow() == 0 ) {
            //---correct collection for some chart type---
            this.setFirstCollection();
        } 
        this.setChartData();
    },
    this.setChartTheme=function() {
        //---select params
        //---write css link
        var themeList=this.model.get("themeList");
        //console.log("Module Chart ->setChartTheme themeList=",themeList);
        this.model.set("themeName",themeList.split("-")[1]);
        this.model.set("styleName",themeList.split("-")[0]);
        var theme_css_file="<link rel='stylesheet' type='text/css' href='JSLibrary/css/themes/" + themeList.replace("-","") +".css'  />";
        jQuery("#chartwidget-theme").html(theme_css_file);
        //console.log(theme_css_file);
    },
    this.showContent=function() {
        $("#chartwidget-content").show();
        $("#videowidget-content").hide();
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
          });
    },
    //------------------------Init ------------------------------
    Chart.addInitializer(function(){
          this.model=new ChartModel();
          this.data_chart_collection = new DataChartCollection(this.data_collection_1);//--{data_name:"Name..",data_value:0,data_i:0}
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
