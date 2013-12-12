MyApp = new Backbone.Marionette.Application();
//------------------APP INIT----------------------
MyApp.addInitializer(function(options){
  this.state='init';
  this.sf_app_params={};
  this.options=options;
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
  }
});
//----------------------MAIN------------------------
$(document).ready(function(){
  $(document).foundation();
  MyApp.start({'sf_app_params':{org_id:1,app_id:11,slide_id:111,session_id:1111}});
  MyApp.vent.trigger("getSfparams"); 
});

