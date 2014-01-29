//----------------------MAIN------------------------
$(document).ready(function(){
  $(document).foundation();
  MyApp.start({'sf_app_params':{org_id:1,app_id:11,slide_id:111,session_id:1111}});
  MyApp.vent.trigger("getSfparams"); 
  MyApp.CManager.showBlockType();
});
//----------------------MAIN------------------------

//------------------APP INIT----------------------
MyApp    = new Backbone.Marionette.Application();
MyApp.rm = new Marionette.RegionManager();
MyApp.rm.on("show", function(name, region){
  console.log("REGION SHOW ",name,region);
});

//---------------Model Fields&Objects--------------
var FieldsObjectsCollection = Backbone.Collection.extend({       
});

MyApp.addInitializer(function(options){
  this.base_url="http://ppthtml2.cloudapp.net/";
  this.state='init';
  this.sf_app_params={};
  this.widget_regions={};
  this.zero_regions={
        homeRegion:"#homewidget-content",
        slideEditorRegion:"#slideeditor-content",
        videoRegion:"#videowidget-content",
        sliderRegion:"#sliderwidget-content",
        sortableRegion:"#sortablewidget-content",
        chartRegion:"#chartwidget-content"
  };
  this.options=options;
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  String.prototype.del_spaces=function(){
    var out = this.replace(/\s/g, ''); 
    return out;   
  };
  //this.rm = new Marionette.RegionManager();
  this.clearScreen=function(cur_region){ //return;
       var cur_id_region=MyApp.rm.get(cur_region).el;
       //console.log("clearScreen cur_id_region=",cur_id_region);
       MyApp.rm.each(function(region){
          
          if (region.el != cur_id_region) {
              //$(region.el).html("");
              region.close();
              //console.log("clearScreen for ",region.el);
          }           
        });        
  };
  this.getUrlParams=function(){
    //---use like this MyApp.getUrlParams()['org_id']
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  
  };
  this.initHeadMenu=function() {
      $("#head-menu-home").click(function()     {MyApp.clearScreen("homeRegion");MyApp.CManager.showHomePage();}   );
      $("#head-menu-video").click(function()    {MyApp.clearScreen("videoRegion");MyApp.Video.showContent();MyApp.Video.draw();}   );
      $("#head-menu-slider").click(function()   {MyApp.clearScreen("sliderRegion");MyApp.Slider.showContent();MyApp.Slider.draw();}   );
      $("#head-menu-sortable").click(function() {MyApp.clearScreen("sortableRegion");MyApp.Sortable.showContent();MyApp.Sortable.draw();}   );
     
  };
  this.fieldValidate=function(el,cond){
      var widget_type=el.getAttribute("widgettype");
      if (el.value !=="") {
          return true;
      } else { el.focus();$('#customStyleInputError[widgettype="'+widget_type+'"]').show();}
  };
  this.customStyleChange=function(el) {
    var widget_type=el.getAttribute("widgettype");
    console.log("customStyleChange ",$(el),widget_type);
    if ( $(el).prop("checked")==true){
          $('#customStyleInput[widgettype="'+widget_type+'"]').show().focus();
          $('#themeList[widgettype="'+widget_type+'"]').attr('disabled', 'disabled');
    } else {
          $('#themeList[widgettype="'+widget_type+'"]').removeAttr('disabled');
          $('#customStyleInput[widgettype="'+widget_type+'"]').hide();
          $('#customStyleInputError[widgettype="'+widget_type+'"]').hide();
    }
  };
  this.initChartMenu=function() {  
     $(".dropdown >li >a").click(function(){
            var chart_type=$(this).attr("jq-type");
            console.log(chart_type);

            $("#chart-menu >a").text($(this).text());           
            MyApp.Chart.model.set("type",chart_type);
            MyApp.clearScreen("chartRegion");
            MyApp.Chart.draw();  
          }
      )
  };
this.SaveScreenProp=function(id) {
try {
  if (id=="chartControlModal") {        
        //console.log("!!!!!!!!!!!!!!SAVE!!!!!!!!!!!!!!!!!!!!!!!!!!") ;//MyApp.SaveScreenProp('chartControlModal');
        MyApp.Chart.FillModelProp();
        MyApp.Chart.draw();
       
  }
  if (id=="chartDataModal") {
        MyApp.Chart.FillCollectionData();
        MyApp.Chart.draw(); 
  }
  if (id=="videoControlModal") {
        MyApp.Video.FillModelProp();
        MyApp.Video.draw();
  }
  if (id=="sliderControlModal") {
        MyApp.Slider.FillModelProp();
        MyApp.Slider.draw();
  }
  if (id=="sortableControlModal") {
        MyApp.Sortable.FillModelProp();
        MyApp.Sortable.draw();       
  }
  if (id=="sortableDataModal"){
        MyApp.Sortable.FillCollectionData();
        MyApp.Sortable.draw();
  }
  $('#'+id).foundation('reveal', 'close');
  } catch (e) {
      console.info("Error close ",e.lineNumber,e.name);
      $(".reveal-modal-bg").hide();//--bug fix--
  }
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
      MyApp.Chart.FillScreenProp();
  }
  if (modal[0].id=="chartDataModal") {
      MyApp.Chart.FillScreenData();
  }
  if (modal[0].id=="videoDataModal") {
    MyApp.Video.FillScreenProp();
  }
  if (modal[0].id=="sliderControlModal") {
      MyApp.Slider.FillScreenProp();
  }
  if (modal[0].id=="sortableControlModal") {
      MyApp.Sortable.FillScreenProp();
  }
  if (modal[0].id=="sortableDataModal") {
      MyApp.Sortable.FillScreenData();
  }
});
$(document).on('close', '[data-reveal]', function (params) {
  var modal = $(this);
  console.log("modal close ",modal[0].id);

});
//--------e:-- modal events----------------------------
MyApp.vent.on("getSfparams", function(){
  //console.table(MyApp.options);
  MyApp.org_id=MyApp.getUrlParams()['org_id'];
  MyApp.app_id=MyApp.getUrlParams()['app_id'];
  MyApp.slide_id=MyApp.getUrlParams()['slide_id'];
  MyApp.session_id=MyApp.getUrlParams()['session_id'];
});
MyApp.on("initialize:after", function(options){
  MyApp.rm.addRegions(MyApp.zero_regions);
  if (Backbone.history){
      Backbone.history.start();
      console.log("sf_app_params.org_id="+options.sf_app_params.org_id);
      MyApp.initHeadMenu();
      MyApp.initChartMenu();
      MyApp.initFieldsObjectsCollection();
      //----------Modules start----
 
      MyApp.module("RichText").start();
      MyApp.module("Chart").start();
      MyApp.module("Slider").start();
      MyApp.module("Sortable").start();
      MyApp.module("CManager").start();
      //MyApp.Chart.draw();
      MyApp.CManager.showHomePage(); 
      //MyApp.CManager.buildPage(); 

  }
});


//============================ MODULES ===============================
MyApp.module("CManager", function(CManager){
  //----Content Manager--------------
  //---get page content from server
  //---buildPage
  //---setBlockType's for blocks in page
  CManager.addInitializer(function(){
        this.block_type_arr   = new Array("RichText","Chart","Sortable","Slider","Video");
        this.clmPlaceholderList ={};
        this.home_page_model  = new HomePageModel();
        this.se_model         = new SEPageModel();
        this.block_model      = new BlockModel();        
        this.block_collection = new BlockCollection();
        this.block_type_view  = new BlockTypeView();
        this.home_page_view   = new HomePageView();
        this.se_page_view     = new SEPageView();
        this.initSeActions();
  });
  //----------------Models-------------------
  var HomePageModel=Backbone.Model.extend({
        defaults: {
          blocks_cnt:3,
          blocks_list:{"b-1":{"top":1,"left":1,"type":"Sortable",model:null,data_collection:null},
                       "b-2":{"top":1,"left":100,"type":"Slider",model:null,data_collection:null},
                       "b-3":{"top":100,"left":100,"type":"Chart",model:null,data_collection:null}}         
        }
  });
  var SEPageModel=Backbone.Model.extend({//--Slide Editor model - from SF-Azure service
        defaults: {
          blocks_cnt:1,
          blocks_list:{}//{"b-1":{"type":"Text",model:null,data_collection:null}}                       
        }
  });
  var BlockModel=Backbone.Model.extend({
        defaults: {
          nomer:0,
          type_name:"Text",
          cur_name:"<b>Type:</b> Text"
        }
  });
  //----------------Collections--------------
  var BlockCollection=Backbone.Collection.extend({
        model:this.block_model
  });
  //-----------------View----------------------
  var HomePageView = Backbone.Marionette.ItemView.extend({
       template: "#home-page-template",
       model:this.home_page_model
  });
  var BlockTypeView = Backbone.Marionette.ItemView.extend({
       template: "#block-type-tpl",
       model:MyApp.rm.block_model
  });
  var SEPageView = Backbone.Marionette.ItemView.extend({
       template: "#se-main-page-template",
       model:this.se_model
  });
  //----------------SE Methods----------------------
  this.initSeActions=function(){
      $("#se-open").click(function() {MyApp.CManager.seOpen();MyApp.CManager.hideSeMenu();}   );
      $("#se-create").click(function() {MyApp.CManager.seCreate();MyApp.CManager.hideSeMenu();}   );
      $("#se-save").click(function() {MyApp.CManager.seSave();MyApp.CManager.hideSeMenu();}   );
  };
  this.hideSeMenu=function(){
      $('#se-actions').css({left:'-99999px'});
  };
  this.seCreate=function(){
      alert("Slide create...");
  };
  this.seOpen=function(){
      this.getPlaceholderVar();
  };
  this.seSave=function(){
      alert("Slide save...");
  };
  //----------------Obmen  Methods------------------
  this.getPlaceholderVar=function(){
      if ((MyApp.org_id == null)||(MyApp.org_id == undefined)) {alert("ERROR: no org_id");return;}
      if ((MyApp.app_id == null)||(MyApp.app_id == undefined)) {alert("ERROR: no app_id");return;}
      if ((MyApp.slide_id == null)||(MyApp.slide_id == undefined)) {alert("ERROR: no slide_id");return;}
      var url=MyApp.base_url+"widgets.php?action=getPlaceVar&org_id="+MyApp.org_id+"&app_id="+MyApp.app_id+"&slide_id="+MyApp.slide_id;
      // var url=MyApp.base_url+"widgets.php";
      //var params = { action: "getPlaceVar", org_id: MyApp.org_id,app_id:MyApp.app_id,slide_id:MyApp.slide_id } ;
      $.getJSON(url).done(function(data){
                                try {
                                    MyApp.CManager.clmPlaceholderList=eval(data);
                                    console.log("clmPlaceholderList data=",MyApp.CManager.clmPlaceholderList);
                                    $('#se-actions').css({left:'-99999px'});
                                    MyApp.CManager.buildSEPage();
                                } catch (e) {
                                    console.info("ERROR: PlaceholderVar");
                                    MyApp.error_data=data;
                                    //delete  MyApp.CManager.clmPlaceholderList;
                                    alert("Convert error...");
                                }
      }).fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                alert( "Can't get data from service: " + err );

      });
  };
  //----------------Build Methods-------------------
  this.buildSEPage=function(){
    //--count blocks_cnt from clmPlaceholderList
    var clm_list=MyApp.CManager.clmPlaceholderList;
    var blocks_cnt = clm_list.length;
    this.se_model.set("blocks_cnt",blocks_cnt);
    for (var i=0;i<blocks_cnt;i++) {
            cur_type=clm_list[i].widgets[0].Type.del_spaces();
            console.log("clm_list["+i+"].widgets[0].type=",cur_type);
            blk_obj=this.se_model.get("blocks_list");
            cur_widget = cur_type.capitalize();
            blk_obj["b-"+(i+1)]={type:cur_widget,model:MyApp[cur_widget].model};
            this.se_model.set("blocks_list",blk_obj);
    }
    //alert("Start build page with widgets");
    console.log("clmPlaceholderList=",MyApp.CManager.clmPlaceholderList);
    this.se_page_view.model=this.se_model;
    //this.se_page_view.render();
    MyApp.rm.get("homeRegion").show(this.se_page_view.render());    
    for (var i=1;i<=blocks_cnt;i++) {      
            this.showWidgetContent(i);
    }
  };
  this.showHomePage=function() {
        //MyApp.rm.get("homeRegion").show($("#home-page-template").html());   
        MyApp.rm.get("homeRegion").show(this.home_page_view);   
        MyApp.CManager.showBlockType();
        //CKEDITOR.inlineAll();//---fire rich text editing
        this.fillModelsCollections();
        var blocks_cnt=this.home_page_model.get("blocks_cnt");
        for (var i=1;i<=blocks_cnt;i++) {      
            this.showWidgetContent(i);
        }
       
  };
  this.getPage=function() { //--from server--
    //--- fill blocks_list
    //---- set cnt: home_model.set('blocks_cnt', keys(MyApp.CManager.home_page_model.attributes.blocks_list).length);
    //--- set block prop (for text set prop contenteditable='true')
    //--- show home page
  };
  this.buildPage=function() {
       MyApp.CManager.showBlockType();
  };
  //----------------Blocks Methods------------------
  this.getBlockModel=function(n){
      return this.home_page_model.get("blocks_list")["b-"+n].model;
  },
  this.getBlockCollection=function(n){
      console.log("getBlockCollection  n=",n);
      console.log("getBlockCollection  home_model=",this.home_page_model);
      console.log("getBlockCollection  [b-"+n+"].data_collection=",this.home_page_model.get("blocks_list")["b-"+n].data_collection);
      return this.home_page_model.get("blocks_list")["b-"+n].data_collection;
  },
  this.setBlockModel=function(n,m){
    try {
      console.log("!!!Try set setBlockModel n="+n);
      console.log("!!!Try set setBlockModel model=",m);
      block_model = this.home_page_model.get("blocks_list");
      block_model["b-"+n].model=m.clone();
      //block_model.model=m;
      
    } catch (e) {
       console.info("ERROR setBlockModel ",e.name,e.lineNumber);
    }
  },
  this.setBlockCollection=function(n,col){
    try {
      console.log("!!!setBlockCollection n="+n);
      console.log("!!!setBlockCollection col=",col);
      block_model = this.home_page_model.get("blocks_list");
      console.log("!!!setBlockCollection block_model=",block_model);
      //delete block_model["b-"+n].data_collection;
      block_model["b-"+n].data_collection=col.clone();
    } catch (e) {
      console.info("ERROR setBlockCollection ",e.name,e.lineNumber);
    }
  },
  this.fillModelsCollections=function(n) {//--fill form widget Classes---
      var blocks = this.home_page_model.get("blocks_list");
      var w_with_data_col=["Chart","Sortable"];
      if (n != undefined) {//---exectly for block-----
             var w_model = blocks["b-"+n].model;
             var w_name = blocks[prop].type;
             var widget_class_name = w_name.capitalize();//w_name.charAt(0).toUpperCase() + w_name.slice(1).toLowerCase();
             this.home_page_model.get("blocks_list")["b-"+n].model=MyApp[widget_class_name].model;
             this.setBlockModel(n,MyApp[widget_class_name].model);
             console.log("N "+n+" fillModelsCollections widget_class_name=",widget_class_name,this.home_page_model.get("blocks_list")["b-"+n].model);
             if (MyApp[widget_class_name].data_collection !=undefined) {
                this.setBlockCollection(n,MyApp[widget_class_name].data_collection);
             }
      } else { //---all blocks-------------------------
          for (prop in blocks){
            //console.log(prop);
            var w_name = blocks[prop].type;
            var widget_class_name=  w_name.charAt(0).toUpperCase() + w_name.slice(1).toLowerCase();
            console.log("fillModelsCollections widget_class_name=",widget_class_name,prop);
            blocks[prop].model = MyApp[widget_class_name].model;
            if ( _.include(w_with_data_col,widget_class_name)) {
                blocks[prop].data_collection = MyApp[widget_class_name].data_collection;
            }
          }
      }
  },
  this.setWidgetCurBlock=function(click_el,widget_name,what) {
        if (this.home_page_model.get("blocks_cnt") >=1) {
               try {
                 var n=click_el.prop("id").match(/\d$/)[0];
                 var cur_block_model = this.home_page_model.get("blocks_list")["b-"+n].model;
                 console.log("setWidgetCurBlock cur_block_model=",cur_block_model.attributes);
                 if (cur_block_model.get("model_name") != widget_name) {
                      console.info("Error setWidgetCurBlock: ",cur_block_model.get("model_name"),widget_name);
                      //---don't write anything !
                      return;
                 }  
                 
                 var n_str='-'+n;
                 var cur_type = this.home_page_model.get("blocks_list")["b-"+n].type;
                
              
                 console.log("!setWidgetCurBlock n="+n+" cur_type="+cur_type);
                 
                 if (what == "model") {
                      //---Тип блока в CManager должен совпадать с типом класса вызова!
                      if (cur_type.toLowerCase() == widget_name.toLowerCase()) {
                         MyApp[widget_name].model=this.getBlockModel(n);                      
                         console.log("!!setWidgetCurBlock model from CManager is ",this.getBlockModel(n));
                      }
                 }
                 if (what == "data_collection") {
                      if (cur_type.toLowerCase() == widget_name.toLowerCase()) {
                          MyApp[widget_name].data_collection=this.getBlockCollection(n);                        
                      }
                 }
                 MyApp[widget_name].model.set("n_str",n_str);  
                } catch (e) {
                   console.error("CManager setWidgetCurblock ERROR ",e.name,e.lineNumber);
                }                                                      
        }
  },

  this.closeBlockType=function(n,name){
        MyApp.CManager.home_page_model.get("blocks_list")["b-"+n].type=name;
        MyApp.CManager.setBlockModel(n,MyApp[name.capitalize()].model);
        console.log("closeBlockType set type "+MyApp.CManager.home_page_model.get("blocks_list")["b-"+n].type);
        //---set first model, collection--
        var cur_widget   = MyApp.CManager.home_page_model.get("blocks_list")["b-"+n];
        cur_widget.model = MyApp[name.capitalize()].model;

        if (cur_widget.data_collection != undefined ) {
            cur_widget.data_collection = MyApp[name.capitalize()].data_collection;
        }
        
        MyApp.CManager.fillModelsCollections(n);
        $("a[data-dropdown=cur_block_type_"+n+"]").html("<b>Type:</b> "+name);  
        $("#cur_block_type_"+n).removeClass("open");
        $('#cur_block_type_'+n).css({left:'-99999px'});
        $("#chart_sub_block_"+n).removeClass("show").addClass("hide");       
  };
  this.selectBlockType=function(n,name,sub_menu="") {
    
     if (name == "Chart") {
        if ($("#chart_sub_block_"+n).hasClass("show")) {
              $("#chart_sub_block_"+n).removeClass("show").addClass("hide");
        } else {
              $("#chart_sub_block_"+n).removeClass("hide").addClass("show");
        }
      } else {            
        
        //$(document).foundation();
        this.closeBlockType(n,name);
        this.showWidgetContent(n);
      }
  };
  this.selectSubBlockType=function(n,name,sub_type="") {
        //MyApp.CManager.home_page_model.get("blocks_list")["b-"+n].type=name;
        this.closeBlockType(n,name);
        if (name =="Chart") {
            MyApp.Chart.model.set("type",sub_type.toLowerCase() );
            this.fillModelsCollections(n);
            this.showWidgetContent(n);
        }
  };
  this.showWidgetContent=function(n) {
        var w_type=MyApp.CManager.home_page_model.get("blocks_list")["b-"+n].type;
        try {
        w_type=w_type.capitalize(); 
         $("a[data-dropdown=cur_block_type_"+n+"]").html("<b>Type:</b> "+w_type); 
        console.log("BEGIN)showWidgetContent w_type="+w_type+" n="+n);
        if (w_type != "Text") {
            //MyApp.Text.clearContent(n);
        }
        if (w_type == "Chart") {
            MyApp.Chart.draw(n);
        } else {
            MyApp[w_type].model.set("n_str","-"+n);
            MyApp[w_type].showContent(n);
            MyApp[w_type].draw();
        }       
        console.log("END)showWidgetContent w_type="+w_type+" n="+n);
        //if (w_type != "Text") {  
      } catch (e) {
         console.error("Can't create widget: "+w_type+"->"+e.name+"line:"+e.lineNumber);
      }
  };
  this.showBlockType=function(block_name) {
        //---get html from render
        var blocks_cnt=MyApp.CManager.home_page_model.get("blocks_cnt");
        var type_before_str="<b>Type:</b>";
        MyApp.CManager.block_type_view.model=this.block_model;
        for (var i=1;i<=blocks_cnt;i++) {            
            MyApp.CManager.block_type_view.model.set("nomer",i);
            MyApp.CManager.block_type_view.model.set("cur_name",type_before_str+MyApp.CManager.home_page_model.get("blocks_list")["b-"+i].type);
            var block_html=MyApp.CManager.block_type_view.render().el.innerHTML;
            $(".block-type.bt-"+i).html(block_html);

        };
        $(document).foundation();
       
  }
});
//-------------------------- Module Text ----------------------------
MyApp.module("RichText", function(RichText){
   //-------------------------Init-----------------------------------
   RichText.addInitializer(function(){
        this.model = new RichTextModel();
   });
   //--------------------------Models---------------------------------
   var RichTextModel = Backbone.Model.extend({
        defaults: {
            Code:"",
            text_default:"<p>You can write and modify any text here...</p>",
            lng:"en",//---lang
            n_str:"",
            model_name:"Text"
        }
    });
   //--------------------------Methods--------------------------------
   this.showContent=function(n) {
      if (n != undefined) {
        
          var n_str="-"+n;
          var rich_text_node="<div id='rich-text"+n_str+"' contenteditable='true'>"+MyApp.RichText.model.get("text_default")+"</div>";
          MyApp.RichText.model.set("n_str",n_str);
          console.log("Text.showContent  n=",rich_text_node);
          $(".widget-block-content"+n_str).html("").append(rich_text_node);
          console.log("Text showContent attr  n_str=",n_str);              
          //CKEDITOR.replace("rich-text"+n_str);          
          try {
              CKEDITOR.inline("rich-text"+n_str);
          //  CKEDITOR.inlineAll();//---fire rich text editing
          } catch (ee) {
              console.log("Error CKEDITOR ee=",ee.name);          
          }
        }
   };
   this.clearContent=function(n) {
        var n_str="-"+n;
        $(".widget-block-content"+n_str).empty();
        CKEDITOR.remove(CKEDITOR.instances['rich-text'+n_str]);
        console.log("hideContent AFTER prop=");
   };
   this.draw=function() {
         //var n_str= MyApp.Text.model.get("n_str");
         //console.log("draw Text n_str="+n_str);  
         //$(".widget-block-content"+n_str+".rich-text").html( MyApp.Text.model.get("text_default"));
        //  CKEDITOR.inlineAll();
   };
}
);
//--------------------------- Module Sortable-------------------------
MyApp.module("Sortable", function(Sortable){
   //------------------------Init ------------------------------
    Sortable.addInitializer(function(){
      this.controller      = new Controller();
      this.model           = new SortableModel();
      this.data_collection = new DataCollection([{data_name:"Item Name...1",data_value:1,data_i:0},{data_name:"Item Name...2",data_value:2,data_i:0}]);
      this.sortable_view   = new SortableView();
      this.data_item_view  = new DataItemView();
      $("#data-add-sortable-btn").click(function(){MyApp.Sortable.controller.addData()});
      //$("#data-del-btn").click(function(){MyApp.Sortable.controller.delData()});
    });
    //-------------------------Models----------------------------
    var SortableModel = Backbone.Model.extend({
        defaults: {
            IsActive:false,
            sobjects_sortable:"sforceObject", //--my
            sfields_sortable:"sobjectField",  //--my
            ObjectName    : 'ActivityData__c',//--sf
            FieldName     : 'SomeField__c',   //--sf
            titleText:"Sortable title",
            Theme: "ClearGreen",              //--sf
            themeList: "Clear-Green",         //--my
            CustomStyle:false,                //--sf
            customStyleInput:"",              //--my
            Labels      : 'First;Second;Third',  //--sf
            Values      : 'Value1;Value2,Value3',//--sf
            Code:"",
            n_str:"",
            model_name:"Sortable"
        }
    });
    var DataCollection = Backbone.Collection.extend({});
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
    this.showContent=function(n) {
          var n_str="";//-- widget number str for tpl --
          this.sortable_view.model=this.model;
          if (n==undefined) {
              this.sortable_view.model.set("n_str",n_str);              
              MyApp.rm.get("sortableRegion").show(this.sortable_view);             
          } else {
              n_str="-"+n;
              this.sortable_view.model.set("n_str",n_str);//-----SET n_str ------ !!!!
              $(".widget-block-content"+n_str).empty().html(MyApp.Sortable.sortable_view.render().el.innerHTML);
          }    
          $("#sortable-control-btn"+n_str).unbind().click(function(){
                                                 
                                                    MyApp.CManager.setWidgetCurBlock($(this),"Sortable","model") ;
                                                    $("#sortableControlModal").foundation('reveal', 'open');

                                                  });
          $("#sortable-data-btn"+n_str).unbind().click(function(){ 
                                                  
                                                    MyApp.CManager.setWidgetCurBlock($(this),"Sortable","data_collection") ;
                                                    $("#sortableDataModal").foundation('reveal', 'open');
                                                  });
    };
    this.FillScreenProp=function() {
          var n_str=this.model.get("n_str");          
          var n = n_str.split("-")[1];
          if (n != undefined) {
              this.model=MyApp.CManager.getBlockModel(n);        
          }
          var fields = _.keys(MyApp.Sortable.model.attributes);
          jQuery.each(fields,function(i,f) {
              var f_val=MyApp.Sortable.model.get(fields[i]);
              //---tags select
              if (f=="themeList") {
                  console.log("sortable themeList",f_val);
              }
              //---tags checkbox
              //---tags input
              $("#"+fields[f]).val(f_val);
              console.log("Sortable fields[i]="+fields[i]+" f_val="+f_val);
  
          });
          MyApp.FillScreenFieldsObjects("sortable");//--select fill--
    };
    this.FillScreenData=function() {
          //MyApp.Sortable.controller.addCollectionData();
          var n_str = this.model.get("n_str");
          var n=n_str.split("-")[1];
          if (n_str !="") {                                                      
                this.data_collection=MyApp.CManager.getBlockCollection(n);
          }
          //var data_coll=MyApp.Sortable.data_collection;
          var data_coll=this.data_collection;
          if ( data_coll.length <=1) {return;}
          $("#sortableDataModal table tbody").empty();
          var coll_length=data_coll.length;
          for (var i=0;i<coll_length;i++) {            
                var data_cur=data_coll.at(i);
                MyApp.Sortable.data_item_view.model=data_cur;
                var row_tpl= MyApp.Sortable.data_item_view.render().el.innerHTML;
                $("#sortableDataModal table tbody").append(row_tpl);
          };
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
          //-----correcting Object,Field fields------------------
          this.model.set("ObjectName",this.model.get("sobjects_sortable"));
          this.model.set("FieldName",this.model.get("sfields_sortable"));
          this.model.set("Theme",this.model.get("themeList"));
          //--------  fill CManager Model ----------
          var n_str=this.model.get("n_str");
          MyApp.CManager.setBlockModel(n_str.split("-")[1],this.model);
          console.log("SORTABLE FillModelProp n_str="+n_str,this.model);
    };
    this.FillCollectionData=function() {
          console.log("FillCollectionData");
          MyApp.Sortable.data_collection.reset();
          $("#sortableDataModal  table tbody tr").each(function(i) {
              var fields = $(this).find("input");
              var name = fields.eq(0).val();
              var value = fields.eq(1).val();
              console.log("Sortable FillCollectionData ",name,value);
              MyApp.Sortable.data_collection.add({data_name:name,data_value:value,data_i:i});              
          });
          //--------  fill CManager Collection ----------
          var n_str=this.model.get("n_str");
          MyApp.CManager.setBlockCollection(n_str.split("-")[1],MyApp.Sortable.data_collection);
    };
    this.draw=function() {
          this.setTheme();
          this.setCode();
    };
    this.setTheme=function(){
          var n_str=this.model.get("n_str");
          var themeList=this.model.get("themeList");
          var theme_str="<link rel='stylesheet' type='text/css' href='JSLibrary/css/themes/" + themeList.replace("-","") +".css'  />";
          $("#sortablewidget-theme"+n_str).html(theme_str);
    };
    this.setCode=function() {
          //---fill li lists from collection----------------
          var li_str="";
          var n_str=this.model.get("n_str");
          jQuery.each(this.data_collection.models,function(i,f) {
              data_value = f.attributes.data_value;
              data_name  = f.attributes.data_name;
             
              li_str=li_str+"<li val='"+data_value+"' class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>"+data_name+"</li>";
          });
          jQuery("#sortablewidget"+n_str).html(li_str);
          jQuery("#sortablewidget"+n_str).sortable();
          jQuery("#sortablewidget"+n_str).disableSelection();
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
  
    //-------------------------Views-----------------------------
    var SortableView = Backbone.Marionette.ItemView.extend({
       template: "#main-sortable-template",
       model:this.model
    });
    var DataItemView = Backbone.Marionette.ItemView.extend({
       template: "#data-item-tpl",
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
    this.showContent=function(n) {
          var n_str="";//-- widget number str for tpl --
          this.slider_view.model=this.model;
          if (n==undefined) {
          this.slider_view.model.set("n_str",n_str);              
              MyApp.rm.get("sliderRegion").show(this.slider_view);             
          } else {
              n_str="-"+n;
              this.slider_view.model.set("n_str",n_str);//-----SET n_str ------ !!!!
              $(".widget-block-content"+n_str).empty().html(this.slider_view.render().el.innerHTML);
          }          
          $("#slider-control-btn"+n_str).unbind().click(function(){
                        MyApp.CManager.setWidgetCurBlock($(this),"Slider","model") ;
                        $("#sliderControlModal").foundation('reveal', 'open');
          });
    };
    this.FillScreenProp=function(){
          var fields = _.keys(MyApp.Slider.model.attributes);
          console.log("SLIDER FillScreenProp fields=",fields);
          jQuery.each(fields,function(i,f) {
              var f_val=MyApp.Slider.model.get(f);
              //---tags select
              if (f=="themeList") {

              }
              //---tags checkbox
              //---tags input
              $("#"+f).val(f_val);
              console.log("FillScreenSliderProp field="+f,MyApp.Slider.model.get(f));
          });
          MyApp.FillScreenFieldsObjects("slider");
    };
    this.FillModelProp=function(){
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
          //-----correcting Object,Field fields------------------
          this.model.set("ObjectName",this.model.get("sobjects_slider"));
          this.model.set("FieldName",this.model.get("sfields_slider"));
          //--------  fill CManager Model ----------
          var n_str=this.model.get("n_str");
          MyApp.CManager.setBlockModel(n_str.split("-")[1],this.model);
    };
    this.draw=function() {
          this.setSliderTheme();
          this.setSliderCode();
    };
    this.setSliderTheme=function() {
          var n_str=this.model.get("n_str");
          var themeList=this.model.get("themeList");
          console.log("setSliderTheme...themeList=",themeList);
          var css_str="<link rel='stylesheet' type='text/css' href='JSLibrary/css/themes/" + themeList.replace("-","") +".css'  />";
          console.log("css_str=",css_str);
          $("#sliderwidget-theme"+n_str).html(css_str);
        
            // <script type="text/javascript" src="JSLibrary/js/jquery-ui-1.9.1.min.js"></script>
            //<script type="text/javascript" src="/JSLibrary/js/jquery.ui.touch-punch.min.js"></script>
            //<link rel="stylesheet" type="text/css" href="{!URLFOR($Resource.JSLibrary, '/JSLibrary/css/themes/' + themeName + '.css')}"/>
    };
    this.setSliderCode=function() {
        var n_str=this.model.get("n_str");
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
        $("#sliderwidget-code"+n_str).empty().html("<script>"+sliderwidget_code+"</script>");
    };
    //-------------------------Models----------------------------
    var SliderModel = Backbone.Model.extend({
      defaults: {
        Default:90,
        Min:0,  //minVal:1,
        Max:100,//maxVal:99,
        Step:5,// step:1,
        IsActive:false,
        sobjects_slider:"sforceObject",
        sfields_slider:"sobjectField",
        ObjectName:'ActivityData__c',
        FieldName :'SomeField__c',
        Title:"slider title",
       
        Theme: "ClearGreen",
        themeList: "Clear-Green",
        customStyle:false,
        customStyleInput:"",
        Code:"",
        n_str:"",
        model_name:"Slider"
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
    this.draw=function(){
          this.showVideoPlayer()
    };
    this.showVideoPlayer=function(){
          var n_str=this.model.get("n_str");
          this.video_player_view.model=this.model;
          if (this.video_player_view.model.get("video_source")=="Youtube"){
              this.video_player_view.template="#player-youtube-video-template";
              $("#video-logo"+n_str).html("<img src='img/youtube.png' />");
          } else {
              if (this.ext_player == false) {
                  $('head').append('<link href="http://vjs.zencdn.net/4.1/video-js.css" rel="stylesheet"/>');
                  $('head').append('<script src="http://vjs.zencdn.net/4.1/video.js"></script>');
                  this.ext_player=true;
                  this.video_player_view.model.set("video_id","http://video-js.zencoder.com/oceans-clip.mp4");
              }
              this.video_player_view.template="#player-other-video-template";
              $("#video-logo"+n_str).html("<img src='img/video.jpeg'  />");
          }
          var vp_html=this.video_player_view.render().el.innerHTML;
          console.log("----------showVideoPlayer--n_str ="+n_str);
          // console.log(vp_html);
          $("#video-player"+n_str).html(vp_html);
    };
    this.showContent=function(n) {
          var n_str="";//-- widget number str for tpl --
          this.video_view.model=this.model;
          if (n==undefined) {
              this.video_view.model.set("n_str",n_str);
              MyApp.rm.get("videoRegion").show(this.video_view);
          } else {             
              n_str="-"+n;
              this.video_view.model.set("n_str",n_str);
              $(".widget-block-content"+n_str).empty().html(this.video_view.render().el.innerHTML);
 
          }
              //this.video_view.model=this.model;         
              ///////$("#videowidget-content").html(this.video_view.render().el.innerHTML);
             
          $("#video-control-btn"+n_str).click(function(){ 
                        MyApp.CManager.setWidgetCurBlock($(this),"Video","model") ;
                        $("#videoControlModal").foundation('reveal', 'open');
          });
          //}
    };
    this.FillScreenProp=function() {
      var n_str=this.model.get("n_str");      
      var n = n_str.split("-")[1];
      if (n != undefined) {
          this.model=MyApp.CManager.getBlockModel(n);        
      }
      var fields = _.keys(this.model.attributes);
      jQuery.each(fields,function(f) {
              var f_val=this.model.get(fields[f]);
              //---tags select
              if (f=="themeList") {

              }           
              $("#"+fields[f]).val(f_val);
              console.log("VIDEO field="+fields[f],this.model.get(fields[f]));
      });
    };
    this.FillModelProp=function() {
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
          //--------  fill CManager Model ----------
          var n_str=this.model.get("n_str");
          MyApp.CManager.setBlockModel(n_str.split("-")[1],this.model);
    };
    //-------------------------Models----------------------------
    var VideoModel = Backbone.Model.extend({
       defaults: {
         IsActive:false,
         VideoSource:"Youtube",
         VideoId:"nJQW-rbHMS0",//--salesforce--
         Width:"200px",
         Height:"200px",
         Autoplay:false,
         Code:'http://www.youtube.com/embed/2423525',
         n_str:"",
         model_name:"Video"
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
            IsActive:true,//activechart:1,
            Title: "Chart title",
            Width:120,
            Height:120,
            legendLine:1,
      	    Legend:  'Legend',//['15px sans-serif', '#331e11', '#af9960', '#5f3b21'],
      	    ShowLegend: true,
      	    LegendLocation:"right",
      	    bordercolor:"black",
            legendbackground:"#eeeeee",
      	    Min:0,
      	    Max:100,
      	    Theme:"Red",//themeName: "Green",
            styleName:"ClearBlue",
      	    themeList:"ClearOrange",
            CustomStyle: false,
            customStyleInput:"",
            ChartType:"pie",
      	    type:"pie",
            type_prop:{"pie":{name:"Pie",click_cnt:0},"line":{name:"Line",click_cnt:0},"spline":{name:"Spline",click_cnt:0},"area":{name:"Area",click_cnt:0}},
      	    chart_data:[['New Name0' , '0'], ['New Name1' , '10'], ['New Name2' , '20']],
            model_name:"Chart",
            n_str:""
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
    var MainChartView = Backbone.Marionette.ItemView.extend({
       //template: "#main-chart-template",
       //model:new ChartModel()
    });
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
        'click #chart-data-add-btn': 'addItem',
        'click #data-chart-del-btn': 'delItem'    
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
            var n_str = MyApp.Chart.model.get("n_str");
            var n=n_str.split("-")[1];
            if (n_str !="") {                                                      
                MyApp.Chart.data_collection=MyApp.CManager.getBlockCollection(n);
            }
            if ( MyApp.Chart.data_collection.length <=1) {return;}
            $("#chartDataModal table tbody").empty();
            var coll_length=MyApp.Chart.data_collection.length;
            for (var i=0;i<coll_length;i++) {            
                var chart_data_cur=MyApp.Chart.data_collection.at(i);
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
      try {
        var click_cnt = 1;
        // var cur_type=this.model.get("type");
        // var cur_type_prop=this.model.get("type_prop");
        // var click_cnt = this.model.get("type_prop")[cur_type].click_cnt++;
      } catch(e) {
          click_cnt =1;
          console.info("Error chart.clickLinkShow..."+e.name+"line:"+e.lineNumber);
      }
      return click_cnt;
    
    },
    //------------ correct data collection for first draw-----
    this.setFirstCollection=function() {
      var cur_type=this.model.get("type");   
      //if (_.indexOf(["line","spline","area"],cur_type) != -1) {//---yes in array---
      if (MyApp.Chart.fist_collection_corrected ==false) {//---yes in array---
             var coll_length=MyApp.Chart.data_collection.length;
             for (var i=0;i<coll_length;i++) {   
                  var cur_value=MyApp.Chart.data_collection.at(i).attributes.data_value;
                  MyApp.Chart.data_collection.at(i).set("data_value",(cur_value*0.01).toFixed(3)) ;                  
                  MyApp.Chart.fist_collection_corrected=true;
             }
      }
    },
    this.draw=function(n){
       //var n=this.model.get("n_str").split("-")[1];
       try {
        if (n != undefined){
            this.model.set("n_str","-"+n);
        }
        this.showContent(n);
        this.show_chart();
        if (this.clickLinkShow() == 0 ) {
            //---correct collection for some chart type---
            this.setFirstCollection();
        } 
        this.setChartData();
        //--fix bug! Hard code!
        if (n != undefined){
            $("#chartwidget-content").empty();
        }
      } catch (e) {
          console.info("Error chart draw ",e.name,e.lineNumber);
          $(".reveal-modal-bg").hide();//--- fix black screen bag--
      }
    },
    this.setChartTheme=function() {
        var n_str=this.model.get("n_str");
        //---select params
        //---write css link
        var themeList=this.model.get("themeList");
        //console.log("Module Chart ->setChartTheme themeList=",themeList);
        this.model.set("themeName",themeList.split("-")[1]);
        this.model.set("styleName",themeList.split("-")[0]);
        var theme_css_file="<link rel='stylesheet' type='text/css' href='JSLibrary/css/themes/" + themeList.replace("-","") +".css'  />";
        jQuery("#chartwidget-theme"+n_str).html(theme_css_file);
        console.log("setChartTheme done");
    },
    this.runChartCode=function() {
         var  n_str      =this.model.get("n_str");
         var  block_n    =n_str.split("-")[1];
         var  block_model=this.model;
         if (block_n != undefined) {
               block_model = MyApp.CManager.getBlockModel(block_n);
         }
       
         var  chartType  = block_model.get("type");
      
          var strFormat = "";
          var valType = "";
          var maxScale = block_model.get("Max");
          var minScale = block_model.get("Min");
          var theme    = block_model.get("Theme");
          var style    = block_model.get("styleName");
         


          var shadowChart = true;
          var axesSet = [{maximum: maxScale, minimum: minScale}];
          if (chartType == 'pie'){
              strFormat = "%.1f%%";
              var valType = "percentage";
              axesSet = [];
          }
          if (chartType == 'bar'){
              axesSet = [];
              axesSet.push({maximum: 100, type: 'category'});
          }
          switch (theme) { 
            case 'Grey': 
              var paletteColors = ['#c9c8c9', '#3d3d3d', '#a3a2a3', '#696769', '#888688']; 
              var strokeSeries = '#ffffff'; 
              var labelFont = (chartType == "pie") ? ['18px sans-serif', '#ffffff'] : ['13px sans-serif', '#333333']; 
              var legend = ['15px sans-serif', '#000000', '#a3a2a3', '#333333']; 
              break; 
            case 'Green': 
              var paletteColors = ['#eae0bf', '#96704f', '#769f3f', '#af9960', '#acd662']; 
              var strokeSeries = '#331e11'; 
              var labelFont = (chartType == "pie") ? ['18px sans-serif', '#331e11'] : ['13px sans-serif', '#331e11']; 
              var legend = ['15px sans-serif', '#331e11', '#af9960', '#5f3b21']; 
              break; 
            case 'Orange': 
              var paletteColors = ['#fbcb93', '#fb8f49', '#a93603', '#d85d03', '#fbad18']; 
              var strokeSeries = '#ffffff'; 
              var labelFont = (chartType == "pie") ? ['18px sans-serif', '#331e11'] : ['13px sans-serif', '#333333']; 
              var legend = ['15px sans-serif', '#262726', '#a93603', '#a93603']; 
              break; 
            case 'Red': 
              var paletteColors = ['#eeb2ac', '#ff5543', '#771211', '#d4d7db', '#d72008']; 
              var strokeSeries = '#ffffff'; 
              var labelFont = (chartType == "pie") ? ['18px sans-serif', '#ffffff'] : ['13px sans-serif', '#333333']; 
              var legend = ['15px sans-serif', '#262726', '#70767e', '#181818']; 
              break; 
            case 'Blue': 
              var paletteColors = ['#59abe4', '#0c476d', '#96d0fc', '#3472a7', '#dae5f4']; 
              var strokeSeries = '#111111'; 
              var labelFont = (chartType == "pie") ? ['18px sans-serif', '#0a0a0a'] : ['13px sans-serif', '#333333']; 
              var legend = ['15px sans-serif', '#0a0a0a', '#7d8088', '#7d8088']; 
              break; 
            case 'Mozaic': 
              var paletteColors = ['#ec4435', '#1f88cc', '#52b344', '#fbc51f', '#303130']; 
              var strokeSeries = '#ffffff'; 
              var labelFont = (chartType == "pie") ? ['18px sans-serif', '#ffffff'] : ['12px sans-serif', '#303130']; 
              var legend = ['15px sans-serif', '#0a0a0a', '#aaaaaa', '#303130']; 
              break; 
            default : //--Green
            var paletteColors = ['#eae0bf', '#96704f', '#769f3f', '#af9960', '#acd662']; 
              var strokeSeries = '#331e11'; 
              var labelFont = (chartType == "pie") ? ['18px sans-serif', '#331e11'] : ['13px sans-serif', '#331e11']; 
              var legend = ['15px sans-serif', '#331e11', '#af9960', '#5f3b21']; 
            break; 
        }; 
        switch (style) { 
            case 'Square': 
                  var lineSeries = 1; 
                  var legendLine = 2, legendCorner = 0; 
                  break; 
            case 'Dotted': 
            case 'Rounded': 
                  var lineSeries = 0; 
                  var legendLine = 2, legendCorner = 6; 
                  break; 
            case 'Clear': 
                  var lineSeries = 1; 
                  var legendLine = 1, legendCorner = 0; 
                  break; 
            default : break; 
        };
        jQuery('#chartstub'+n_str).empty();
        jQuery('#chartwidget'+n_str).jqChart({
                  title: { text: block_model.get("Title") },
                  legend: { 
                  title: { text: block_model.get("Title"), fillStyle: legend[3], font: '17px sans-serif', }, 
                  location : block_model.get("legendlocation"), // legend location 
                  border: { // legend border 
                    padding: 8, 
                    strokeStyle: legend[2], 
                    lineWidth : legendLine, 
                    cornerRadius: legendCorner 
                  }, 
                  font: legend[0], // item text font 
                  textFillStyle: legend[1], // item text color 
                  background: block_model.get("legendbackground"), // legend background 
                  margin: 5, // legend margings 
                  visible : true,//<%= showlegend %> 
                }, 
                border: { strokeStyle: block_model.get("bordercolor"), lineWidth: 0},
                paletteColors: { 
                  type: 'customColors', 
                  customColors: paletteColors // backgroung pie segments 
                }, 
                tooltips: { borderColor: 'auto' }, // tooltip border 
                animation: 3, 
                shadows: { enabled: shadowChart }, 
                    animation: 3,
                    axes: axesSet,
                    series: [
                            {
                                type:  chartType,
                                strokeStyle : strokeSeries, // border pie segments color 
                                lineWidth : lineSeries, // border pie segments 
                                labels: {
                                    stringFormat: strFormat,
                                    valueType: valType,
                                    font: labelFont[0], // pie text 
                                    fillStyle: labelFont[1] // pie text color
                                },
                                data: [['New Name' , 10], ['New Name1' , 15], ['New Name2' , 20]]
                            }
                        ]
            });

            if (chartType == 'pie'){
                jQuery('#chart'+n_str).bind('tooltipFormat', function (e, data) {
                    var percentage = data.series.getPercentage(data.value);
                    percentage = data.chart.stringFormat(percentage, '%.2f%%');
    
                    return '<b>' + data.dataItem[0] + '</b></br>' +
                           data.value + ' (' + percentage + ')';
                });
            }
            console.log("Chart runChartCode done!") ;
    },
    this.showContent=function(n) { 
          var n_str=this.model.get("n_str");//-- widget number str for tpl --
          
          //$("#chartwidget-content").empty();//--yf dczrbq ckexfq
          if (n==undefined) {
              this.chart_view.model=this.model;
              this.chart_view.model.set("n_str",n_str);              
              MyApp.rm.get("chartRegion").show(this.main_chart_view);            
          } else {
              n_str="-"+n;
              //this.model=MyApp.CManager.getBlockModel(n);
              this.chart_view.model=this.model;
              //this.chart_view.model.set("n_str",n_str);//-----SET n_str ------ !!!!            
              $(".widget-block-content"+n_str).empty().html(this.main_chart_view.render().el.innerHTML);
          }  

         $(document).foundation();
         $("#chart-control-btn"+n_str).unbind().click(function(){                                                    
                                                        MyApp.CManager.setWidgetCurBlock($(this),"Chart","model");
                                                        $("#chartControlModal").foundation('reveal', 'open');
                                                     });
         $("#chart-data-btn"+n_str).unbind().click(function(){                                                
                                                        MyApp.CManager.setWidgetCurBlock($(this),"Chart","data_collection");
                                                        $("#chartDataModal").foundation('reveal', 'open');
                                                     });
         //MyApp.CManager.showBlockType("Chart");
         console.log("Chart showContent done! n_str=",n_str) ;
         //$(".reveal-modal-bg").hide();//--bug fix--
    },
    this.show_chart=function() {
          var n_str=this.model.get("n_str");
      	  console.log("Module Chart ->show_chart n_str",n_str);
          this.setChartTheme();
      	  this.runChartCode();
          console.log("Chart show_chart done! n_str="+n_str) ;
    },
    this.setChartData=function(){
           var n_str=this.model.get("n_str");
           var collection_data=[];
           var coll_length=MyApp.Chart.data_collection.length;
           for (var i=0;i<coll_length;i++) {   
              var m=MyApp.Chart.data_collection.at(i);
              collection_data.push([m.get("data_name"),m.get("data_value")]);
           };
           console.log("Chart setChartData  n_str="+n_str) ;
           console.log("Chart setChartData  collection_data=",collection_data) ;
           $('#chartwidget'+n_str).unbind().jqChart('option', 'series')[0].data=collection_data;
           $('#chartwidget'+n_str).unbind().jqChart('update');
           console.log("Chart setChartData done!  n_str="+n_str) ;
    },
    this.FillScreenProp=function() {    
      var n_str=this.model.get("n_str");     
      console.log("CHART FillScreenChartProp n_str="+n_str+" model BEFORE set n=",MyApp.Chart.model.attributes);
      var n = n_str.split("-")[1];
      if (n != undefined) {
          MyApp.Chart.model=MyApp.CManager.getBlockModel(n);        
      }
      console.log("CHART FillScreenChartProp model AFTER set n=",MyApp.Chart.model.attributes);
      var fields = _.keys(MyApp.Chart.model.attributes);
      jQuery.each(fields,function(f) {
              var f_val=MyApp.Chart.model.get(fields[f]);
              //---tags select
              if (f=="themeList") {

              }
              //---tags checkbox
              //---tags input
              $("#"+fields[f]).val(f_val);
              //console.log("field="+fields[f],MyApp.Chart.model.get(fields[f]));
      });
    },
    this.FillScreenData=function() {
          console.log("FillScreenChartData");        
          MyApp.Chart.controller.addCollectionData();
    },
    this.FillModelProp=function() {
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
          //--Theme correct-------------------------
          MyApp.Chart.model.set("Theme",MyApp.Chart.model.get("themeList"));
          //--------  fill CManager Model ----------
          var n_str=this.model.get("n_str");
          MyApp.CManager.setBlockModel(n_str.split("-")[1],MyApp.Chart.model);

    },
    this.FillCollectionData=function() {
          var n_str=this.model.get("n_str");
          console.log("FillCollectionChartData n_str="+n_str);
          MyApp.Chart.data_collection.reset();
          $("#chartDataModal  table tbody tr").each(function(i) {
              var fields = $(this).find("input");
              var name = fields.eq(0).val();
              var value = fields.eq(1).val();
              console.log(name,value);
              MyApp.Chart.data_collection.add({data_name:name,data_value:value,data_i:i});
          });
          //--------  fill CManager Collection ----------
          var n_str=this.model.get("n_str");
          MyApp.CManager.setBlockCollection(n_str.split("-")[1],MyApp.Chart.data_collection);
    },
    //------------------------Init ------------------------------
    Chart.addInitializer(function(){
          this.model=new ChartModel();
          this.data_collection = new DataChartCollection(this.data_collection_1);//--{data_name:"Name..",data_value:0,data_i:0}
          //this.data_collection.add({data_name:"Name..",data_value:0,data_i:0});//--first init
          this.chart_view=new ChartView({template: "#chart-template",model:this.model});//--new ChartModel()
          this.main_chart_view=new MainChartView({template: "#main-chart-template",model:this.model});//--new ChartModel()
          this.data_chart_model=new DataChartModel();
          this.data_item_chart_view=new DataItemChartView({template: "#data-chart-item-template",model:this.data_chart_model});
          this.prop_chart_view=new PropChartView({template: "#chartControlModal",model:this.model});
         
          this.controller = new Controller();
          //this.controller.initEvents();
           $("#chart-data-add-btn").click(function(){MyApp.Chart.controller.addData()});
           $("#data-chart-del-btn").click(function(){MyApp.Chart.controller.delData()});
    });
  
});
