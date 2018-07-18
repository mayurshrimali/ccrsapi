//https://ccrsapi.herokuapp.com/webhook

/* 
http://103.50.152.102/SMASTH_NewLocal/Webservice/Citizenapp.asmx

GetCategory_AI -- For List of Categories
GetCategorywiseProblem_AI -- For List of Problems by category keyward
GetProblemDetails_AI  -- For Particular Problem by category keyward and problem keyword

*/


//const cool = require('cool-ascii-faces')
//const { WebhookClient } = require('dialogflow-fulfillment');
//const agent = new WebhookClient({request: request, response: response});
//const deasync = require('deasync');
/* 
const firebase = require('firebase'.initializeApp({
	serviceAccount: "./bhavisha-7c0de-3ff0ac46453c.json",
	databaseURL: "https://bhavisha-7c0de.firebaseio.com/"
}))

var firebase = require('firebase', initializeApp{
	serviceAccount: "./bhavisha-7c0de-3ff0ac46453c.json",
	databaseURL: "https://bhavisha-7c0de.firebaseio.com/"
}

var flatcols = {flatno:'A-101', owner: 'Not registered yet', contact: 'none', timestamp: new Date().toString()};
var ref = firebase.database().ref().child('bhavisha-7c0de');
var societyRef = ref().child('Aakash-Residency');

var flatsRef = ref().child('Aakash-Residency').ref().child('Flats');
var supervisiorRef = ref().child('Aakash-Residency').ref().child('Supervisior');
 */

var changeCase = require('change-case')
var admin = require('firebase-admin');
var serviceAccount = require('./bhavisha-7c0de-3ff0ac46453c.json');

var defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bhavisha-7c0de.firebaseio.com'
});
//const await = require('asyncawait/await');
//const admin = require("firebase-admin")
const DialogflowApp = require('actions-on-google').DialogflowApp;
const requestPermission = (app) => {
  app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
};
const db = defaultApp.database();
const ref = db.ref("/Aakash-Residency/Flats")
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

//var resultFlatDetails = "";


express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  //.get('/cool', (req, res) => res.send(cool()))
  //.get('/category1', (req, res) => res.send('hi welcome to category'))
  //.post('/webhook', (req, res) => res.send(JSON.stringify({"fulfillmentText" : "", "fulfillmentMessages" : [{ "text": {"text" : ["Right now its 38.95 degrees with overcast clouds at ahmedabad"]}}], "source" :"" })))
  //.post('/webhooknew', (req, res) => {res.send('req.body:' + req.body.responseId)})
  .post('/webhook', (req, res) => {
      if(!req.body) return res.sendStatus(400);
      res.setHeader('Content-Type', 'application/json');
      console.log("Request:" + req);
      console.log("RequjestBody:" + JSON.stringify(req.body));
      var userName = undefined;
      var userEmail = undefined;
      var userFirstName = undefined;
      var userPhoto = undefined;
      var email_verified = undefined;
      var userLastName = undefined;
      //var userId = req.body.originalDetectIntentRequest.payload.user["userId"];
      
      var intent = req.body.queryResult.intent['displayName'];
      var city = req.body.queryResult.parameters['geo-city'];
      var category = req.body.queryResult.parameters['category'];
      var phonenumber = req.body.queryResult.parameters['phone-number'];
      var checkstatus = req.body.queryResult.parameters['check-status'];
      var flatno = req.body.queryResult.parameters['Entity_FlatNo'];
      var OwnerName = req.body.queryResult.parameters['Owner_Name'] + " " + req.body.queryResult.parameters['last-name'];
      //var OwnerContact = req.body.queryResult.parameters['phone-number'];
      
      /* var token = req.body.originalDetectIntentRequest.payload.user["idToken"];
      var CLIENT_ID = "647141747357-mt9a0djh88u4lch61tt3p3skasdbl983.apps.googleusercontent.com";
      const {OAuth2Client} = require('google-auth-library');
      const client = new OAuth2Client(CLIENT_ID);
      async function verify() {
          
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            email_verified = payload['email_verified'];
            userName = payload['name'];
            userEmail = payload['email'];
            userFirstName = payload['given_name'];
            userPhoto = payload['picture'];
            userLastName = payload['family_name'];

            console.log("userid--:" + userid);
            // If request specified a G Suite domain:
            //const domain = payload['hd'];
      } verify().catch(console.error);

      while(userName === undefined) {
        require('deasync').sleep(100);
      }
      while(userEmail === undefined) {
        require('deasync').sleep(100);
      } */
      console.log("intent: " + intent);
      console.log("intent: " + intent);
      //console.log("userid: " + userId);
      //console.log("userName :" + userName);
      //console.log("userEmail :" + userEmail);
      if (intent=="Default Welcome Intent"){
        //var textMsg = "Hello " + userName + " (" + userEmail + "),\n" + "\nWelcome to CCRS AI! Let's get started.\n\n1) Do you want to make a complaint\n2) Do you want to check status against any mobile number?"
        //var textMsg = "Hello " + userName + " (" + userEmail + "),\n" + "\nWelcome to CCRS AI! Let's get started.\n\n"
        var textMsg = "Hello " + userFirstName + ",\n" + "\n" + "Welcome to CCRS AI! Let's get started.\n\n"

        //var suggestion = [{ title:"Make a complaint" }, { title :"Check Status" }];     
        //var rows = [{ title:"Do you want to make a complaint?" }, {title:"Do you want to check status against any mobile number?"}];
        //var tableCard = getTableCard("List of options", rows);        
        //let responseObj = getResponseObject(textMsg, suggestion, tableCard);          
        //let responseObj = getResponseInputPromptObject(textMsg);
        let responseObj = getTempResponse();
        //console.log(responseObj);
        return res.json(responseObj);  
      } else if (intent=="complaint"){
        if (category != undefined){
          if (category == "complaint"){
            //var textMsg = "For which category you want to add a complaint?\nWater related,\nRoad related,\nLight related,\nGarden related";            
            var textMsg = getCategoryList();
            var suggestion = getCategorySuggestionList();
            let responseObj = getResponseObject(textMsg, suggestion);                    
            //console.log("responseObj: " + responseObj);
            //console.log("responseObj J: " + JSON.stringify(responseObj) );            
              return res.json(responseObj);
          } else if (category != "check status"){          
            if (phonenumber == ""){ phonenumber = "9825819075";}  
            var TokenNo = "";
            var MobileNo = phonenumber;
            var TEXT = getCheckStatus(TokenNo,MobileNo);            
            let responseObj = getResponseObject(TEXT);  
            return res.json(responseObj);   
          }
        } else if (city != undefined){
          //var city = req.body.queryResult.parameters['geo-city'];
          //var W = getWeather(city);
          //var W = "Right now its 38.95 degrees with overcast clouds at Ahmedabad";
          var TEXT = "Right now its 38.95 degrees with overcast clouds at " + city;        
          let responseObj = getResponseObject(TEXT);        
          return res.json(responseObj);
        }  
      } else if (intent=="complaint-problem"){
        var dept = req.body.queryResult.parameters['dept'];
        dept = changeCase.lowerCase(dept);
        dept = dept.replace("related", "");               
        var textMsg = getProblemList(dept);
        var suggestion = undefined;
        if (dept == "water"){
          suggestion = [{ title:"Illegal tapping" }, { title :"Inadequate water" }, { title :"Leakage" }, { title :"No Water" }, { title :"Public Toilets" }, { title :"Connection" }, { title :"Quality" }, { title :"Timing" } ]; 
        } else if (dept == "drainage"){
          suggestion = [{ title:"Overflowing" }, { title :"Blockage" }, { title :"No Drainage" }, { title :"Illegal" }, { title :"Public Toilets" }, { title :"Line Breakage" }, { title :"Lowering" }, { title :"Storm water logging" } ]; 
        } else if (dept == "light"){
          suggestion = [{ title:"Electric Shock" }, { title :"Light Remains Switched On" }, { title :"Light Is Off" }, { title :"High Mast Light" }, { title :"High Mast Pole" }, { title :"Hospitals" }, { title :"Lights of Societies" }, { title :"Streetlight Is Off" } ]; 
        } else if (dept == "health"){
          suggestion = [{ title:"Water Samples" }, { title :"License" }, { title :"Mosquito" }, { title :"Nursing" }, { title :"MT Hospital" }, { title :"Doctors/Staffs" }, { title :"Food-Poisoning" }, { title :"Inferior Quality" } ]; 
        } else if (dept == "cleaning & soild waste"){
          suggestion = [{ title:"Spraying Off" }, { title :"Mud and Water" }, { title :"Dustbin" }, { title :"Building Material" }, { title :"Cow Dung" }, { title :"Dust" }, { title :"Waste Management" }, { title :"Emptying The Dustbins" } ]; 
        } else if (dept == "road"){
          suggestion = [{ title:"Bump related" }, { title :"Deep Pit" }, { title :"Footpath Repairing" }, { title :"Footpath Renovation" }, { title :"Patch work" }, { title :"Pot holes" }, { title :"Removal of waste" } ]; 
        } else if (dept == "wandering & dead animals"){
          suggestion = [{ title:"Big" }, { title :"Dead Animals" }, { title :"Rabid dogs" }, { title :"Vaccination" }, { title :"Cows" }, { title :"Buffaloes" }, { title :"Oxen" }, { title :"Biting dog" } ]; 
        } else if (dept == "garden"){
          suggestion = [{ title:"Lights Are Not Working" }, { title :"Hollow grounds" }, { title :"No Cleaning At All" }, { title :"No Proper Security" }, { title :"Repairing Required" }, { title :"Trimming The Trees" }, { title :"Watering" }, { title :"Gardeners" } ]; 
        } else if (dept == "crematorium"){
          suggestion = [{ title:"Fans" }, { title :"Lights" }, { title :"Furnace" }, { title :"CNG" }, { title :"Electric" }, { title :"In Charge" }, { title :"Cleanliness" }, { title :"Woods" } ]; 
        } else if (dept == "birth-death-marriage"){
          suggestion = [{ title:"Delay" }, { title :"Certificates" }, { title :"Error" }, { title :"Entry" }, { title :"Correction" }, { title :"In Charge" } ]; 
        } else if (dept == "encroachment"){
          suggestion = [{ title:"Digging" }, { title :"Parking" }, { title :"Municipal Buildings" }, { title :"Personal Properties" }, { title :"Illegal Possessions" }, { title :"Permits" }, { title :"Unauthorised Use" }, { title :"Unauthorised Development" } ]; 
        } else if (dept == "slum"){
          suggestion = [{ title:"" }, { title :"" }, { title :"" }, { title :"" }, { title :"" }, { title :"" }, { title :"" }, { title :"" } ]; 
        } else if (dept == "tree cutting"){
          suggestion = [{ title:"Trimming" }, { title :"Tree Branches" }, { title :"Clearing Out" }, { title :"Overgrown Branches" }, { title :"Clearing Off" }, { title :"Cut Out" }, { title :"Complain" }, { title :"Cutting" } ]; 
        } else if (dept == "building"){
          suggestion = [{ title:"Ward Office" }, { title :"Remove Encroachment" }, { title :"Pumps Are Not Working" }, { title :"Public Toilets and Urinals" }, { title :"Municipal Schools" }, { title :"Unsafe Buildings" }, { title :"Doss House" }, { title :"Fans and Lights" } ]; 
        } else if (dept == "klfd"){
          suggestion = [{ title:"Zoo" }, { title :"Rasala Nature Park" }, { title :"One Tree hill Garden" }, { title :"Naginawadi" }, { title :"Library" }, { title :"Balvatika" }, { title :"Butterfly Park" }, { title :"Reading Materials" } ]; 
        } else if (dept == "gym"){
          suggestion = [{ title:"Applied For Entry" }, { title :"Coach Is Irregular" }, { title :"Lights Remain Off" }, { title :"Skating Rink" }, { title :"Sports Centre" }, { title :"Improper Coaching" }, { title :"Tool Maintenance" }, { title :"Parts Change" } ]; 
        } else if (dept == "library"){
          suggestion = [{ title:"Daily Cleaning" }, { title :"Basic Needs" }, { title :"Water" }, { title :"Light" }, { title :"Fan" }, { title :"Mobile Library" }, { title :"Reading Materials" }, { title :"Timings" } ]; 
        } else if (dept == "swimming pool"){
          suggestion = [{ title:"Broken" }, { title :"Other Complaints" }, { title :"Security" }, { title :"No Light" }, { title :"Not Yet Approved" }, { title :"Coach is Irregular" }, { title :"Improper Cleaning" }, { title :"Inferior Quality" } ]; 
        } else if (dept == "traffic circle"){
          suggestion = [{ title:"No Cleaning" }, { title :"Tree-Guards" }, { title :"Trimming" }, { title :"Cutting" }, { title :"Watering is Not Proper" } ]; 
        } else if (dept == "storm water"){
          suggestion = [{ title:"Waterlogged Due To Rain" }, { title :"Waterlogged" }, { title :"Rain" }]; 
        } else if (dept == "plastic collection"){
          //suggestion = [{ title:"" }, { title :"" }, { title :"" }, { title :"" }, { title :"" }, { title :"" }, { title :"" }, { title :"" } ]; 
          suggestion = []; 
        } else if (dept == "other"){
          suggestion = [{ title:"Cerificate" }, { title :"Application Form" }, { title :"Create Multitude" }, { title :"Creche Remains Closed" }, { title :"Creche Helpers" }, { title :"Lunch in School" }, { title :"Training Centre" }, { title :"Inferior Quality" } ]; 
        } 


        let responseObj = getResponseObject(textMsg, suggestion);                    
        return res.json(responseObj);
      } else if (intent=="complaint-problem-area"){        
        //requestPermission(app);
        var dept = req.body.queryResult.outputContexts[0].parameters['dept'];
        var problem = req.body.queryResult.parameters['problem'];
        console.log("complaint-area: " + dept + ", " + problem);
        var textMsg = getProblem(dept, problem);
        var suggestion = [{ title:"Chandlodia" }, { title:"Shahpur" }, { title :"Dariapur" }, { title :"Jamalpur" }, { title:"Khadia" }, { title:"Naroda" }, { title:"Sardar nagar" }, { title:"Kuber nagar" }  ]; 
        let responseObj = getResponseObject(textMsg, suggestion);                    
        return res.json(responseObj);
      } else if (intent=="complaint-problem-area-address"){
        //var area = req.body.queryResult.queryText;
        var dept = req.body.queryResult.outputContexts[0].parameters['dept'];
        var problem = req.body.queryResult.outputContexts[0].parameters['problem'];
        var area = req.body.queryResult.outputContexts[0].parameters['address'];
        //console.log("complaint-confirm: " + dept + ", " + problem + ", " + area);
        //var TEXT = getProblem(dept, problem);
        var textMsg = getWardDetails(area);
        var suggestion = [{ title:"9825819075" }, { title :"8200144248" }]; 
        //var TEXT = "Complaint Registered, Thanks"
        let responseObj = getResponseObject(textMsg, suggestion);                    
        return res.json(responseObj);
      } else if (intent=="complaint-problem-area-address-mobile"){
        var dept = req.body.queryResult.outputContexts[1].parameters['dept'];
        var problem = req.body.queryResult.outputContexts[1].parameters['problem'];
        //var area = req.body.queryResult.outputContexts[0].parameters['area'];
        var address = req.body.queryResult.outputContexts[1].parameters['address'];
        var mobile = req.body.queryResult.outputContexts[1].parameters['mobile'];
        //console.log("complaint-confirm: " + dept + ", " + problem + ", " + area);
        //var TEXT = getProblem(dept, problem);
        var textMsg = "Please confirm your complaint details:\n" +        
        "\nName: " + userName + "\n" +
        "Mobile: " + mobile + "\n" +
        "Email: " + userEmail + "\n" +
        "Department: " + dept + "\n" +
        "Problem: " + problem + "\n" +
        "Address: " + address + "\n"
        var suggestion = [{ title:"Confirm" }, { title :"Ok" }, { title :"Yes" }]; 
        let responseObj = getResponseObject(textMsg, suggestion);                    
        return res.json(responseObj);
      } else if (intent=="complaint-problem-area-address-mobile-confirm"){
        var dept = req.body.queryResult.outputContexts[1].parameters['dept'];
        var problem = req.body.queryResult.outputContexts[1].parameters['problem'];
        var area = req.body.queryResult.outputContexts[1].parameters['address'];
        var address = req.body.queryResult.outputContexts[1].parameters['address'];
        var mobile = req.body.queryResult.outputContexts[1].parameters['mobile'];                
        var textMsg = AddComplaint(userName, userEmail, mobile, dept, problem, area, address );
        var suggestion = [{ title:"Make a complaint" }, { title :"Check Status" }];             
        let responseObj = getResponseObject(textMsg, suggestion);                    
        return res.json(responseObj);
      } else if (intent=="checkstatus"){
        if (checkstatus != undefined){ 
            if (checkstatus == "check status"){
                if (phonenumber == ""){ phonenumber = "9825819075";}  
                if (phonenumber != ""){ 
                      var TokenNo = "";
                      var MobileNo = phonenumber;
                      var TEXT = getCheckStatus(TokenNo,MobileNo);
                      let responseObj = getResponseObject("Dear " + userName + ",\n" + TEXT);     
                      //let responseObj = getResponseObjectNew(TEXT);
                      console.log(responseObj);
                      return res.json(responseObj);
                }  
            }      
        }  
      } else if(intent=="Flat_Details"){
        if (flatno != undefined){
          var TEXT = 'NONE';
          TEXT = getFlatDetails(flatno);

          let responseObj = getResponseObject(TEXT);        
          return res.json(responseObj);
        } 
      } else if(intent=="Add_Confirm"){
        var flatno = req.body.queryResult.outputContexts[0].parameters['Entity_FlatNo'];
        var OwnerName = req.body.queryResult.outputContexts[0].parameters['Owner_Name'] + " " + req.body.queryResult.outputContexts[0].parameters['last-name'];
        var OwnerContact = req.body.queryResult.outputContexts[0].parameters['phone-number'];
  
        //console.log("Enter in Add_Confirm");
        //console.log("Para Val: " + flatno + ", " + OwnerName + ", " + OwnerContact );        
        if (flatno != undefined){
          var TEXT = 'NONE';
          //TEXT = getFlatDetails(flatno);          
          TEXT = updateFlatDetails(flatno, OwnerName, OwnerContact);

          let responseObj = getResponseObject(TEXT);        
          return res.json(responseObj);
        } 
      } else if(intent=="Delete_Flat_Details"){
        var flatno = req.body.queryResult.parameters['Entity_FlatNo'];        
        if (flatno != undefined){
          var TEXT = 'NONE';
                              
          TEXT = deleteFlatDetails(flatno);

          let responseObj = getResponseObject(TEXT);        
          return res.json(responseObj);
        } 
      }
      
      
      var TEXT = "No details found";
      let responseObj = getResponseObject(TEXT);        
      return res.json(responseObj);
  })  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/****************************************************METHODS******************************************************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  function deleteFlatDetails(flatno){    
    var itemRef = ref.child(flatno + "/");
    itemRef.update({
      Owner: "Not registered yet",
      Contact: "None"
    })
    .catch(function (err) {
      //console.log('Default data update has been failed due to error', err);      
      return "Default data update has been failed due to error: " + err;
    });
    return "Details has been updated succesfully along with default data.";
  }
  function updateFlatDetails(flatno, Owner, ContactNo){    
    var itemRef = ref.child(flatno + "/");
    itemRef.update({
      Owner: Owner,
      Contact: ContactNo
     })
     .catch(function (err) {
      //console.log('Update has been failed due to error', err);      
      return "Update has been failed due to error: " + err;
     });
     return "Details has been updated succesfully.";
  }

  function getFlatDetails(flatno) {  
    var retVal = undefined;     
    var itemRef = ref.child(flatno + "/");
    itemRef.on("value", function(snapshot) {
      if (snapshot.exists()) {
        var value = snapshot.val();
        retVal = "Details of the flat no " + flatno + "\nOwner: " + value.Owner + "\nContact: " +  value.Contact ;        
        //console.log("Flat Details: " + retVal);        
        return retVal;
      } else {
        retVal = "Cannot read a Flat details with flat no " + flatno + " that does not exist.";
        return retVal;
      }
    }, function (errorObject) {
      retVal = "Failed" + errorObject.code;      
      return retVal;      
    });

    while(retVal === undefined) {
      require('deasync').sleep(100);
    }
    return retVal;   
  }
  
  function getTableCard(header, rowData){
    /* ,
    {
      "tableCard": 
      {
        "rows": [   { "cells": [ {"text": "1"},{"text": "Water"}  ], "dividerAfter": true},    { "cells": [ {"text": "2"},{"text": "Light"} ], "dividerAfter": true}    ],
        "columnProperties": [ {"header": "Sr."},  {"header": "List of Categories"}  ]
      }
    } */

    var cnt = 0;
    var rows = [];
    var columnProperties = [ {"header": "Sr."},  {"header": header} ];
    console.log("rowData: " + JSON.stringify(rowData));
    var array = rowData;
    array.forEach(element => {
      cnt += 1;
      var sr = "(" + cnt + ")";
      var cell = { "cells": [ { text: sr }, {text: element.title} ], "dividerAfter": true };          
      rows.push(cell);              
    });
        
    var tablecard = { "tableCard": { rows, columnProperties } }
    //console.log("tablecard: " + JSON.stringify(tablecard));    
    return tablecard;
  }

  function getCategorySuggestionList(){
    var retVal = undefined;
    var http = require('http');

    var options = {
      host: '103.50.152.102',
      port: 80,
      method: 'GET',
      path: '/SMASTH_NewLocal/Webservice/Citizenapp.asmx/GetCategory_AI',
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    
    http.get(options, (resp) => {
      let data = '';    
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        var result = "";
        var array = JSON.parse(data)["Head"];
        var cnt = 0; 
        var retArr = [];
        array.forEach(element => {
          cnt += 1;
          if ( cnt <= 7 ) {
            result += "\n" + cnt + ")  " + element.GroupCategory_Name;
            var tag = { title: element.GroupCategory_Name};          
            retArr.push(tag);
          }          
        });
        
        retVal = retArr;
        //console.log("suggestion:" + retVal);
        //console.log("suggestion J:" + JSON.stringify(retVal));
        //console.log(JSON.parse(data).explanation);
        //retVal = "For which category you want to add a complaint?" + result;
        return retVal;   
      });    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });

    while(retVal === undefined) {
      require('deasync').sleep(100);
    }
    //console.log("WebService Result: " + retVal);
    return retVal;

  }

  function getCategoryList(){
    var retVal = undefined;
    var http = require('http');

    var options = {
      host: '103.50.152.102',
      port: 80,
      method: 'GET',
      path: '/SMASTH_NewLocal/Webservice/Citizenapp.asmx/GetCategory_AI',
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    
    http.get(options, (resp) => {
      let data = '';    
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        var result = "";
        var array = JSON.parse(data)["Head"];
        var cnt = 0; 
        array.forEach(element => {
          cnt += 1;
          result += "\n" + cnt + ")  " + element.GroupCategory_Name;
        });                
        //console.log("result:" + result);
        //console.log(JSON.parse(data).explanation);
        retVal = "For which category you want to add a complaint?" + result;
        return retVal;   
      });    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });

    while(retVal === undefined) {
      require('deasync').sleep(100);
    }
    //console.log("WebService Result: " + retVal);
    return retVal;

  }

  function getProblemList(GroupCateName){
    var retVal = undefined;
    var http = require('http');
    var querystring = require('querystring');
    var para = { GroupCateName: GroupCateName };
    //console.log("WebService Para: " + querystring.stringify(para));
    var options = {
        host: '103.50.152.102',
        port: 80,
        method: 'POST',
        path: '/SMASTH_NewLocal/Webservice/Citizenapp.asmx/GetCategorywiseProblem_AI',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(querystring.stringify(para))
        }
    };    
    var reqnew = http.request(options, function (res) { 
      let data = '';        
      res.on('data', function (chunk){        
        data += chunk;  
      });
      res.on('end', function () {        
        var result = "";       
        //console.log("data:"+data);
        var array = JSON.parse(data)["Head"];
        console.log(array.length);        
        if (array.length>0){
          var cnt = 0; 
          array.forEach(element => {
            cnt += 1;
            result += "\n" + cnt + ")  " + element.Problem_Description;
          });                  
        }        
        retVal =  "For which problem you want to add a complaint?" + result;                   
        return retVal;
      });
      res.on('error', function (err) {
        console.log('Err:' + err);
      })
    });
     
  reqnew.write(querystring.stringify(para));    
  reqnew.end();

  while(retVal === undefined) {
    require('deasync').sleep(100);
  }
  console.log("WebService Problem List: " + retVal);
  return retVal;
}

function getProblem(dept, problem){
    var retVal = undefined;
    var http = require('http');
    var querystring = require('querystring');
    var para = { ProblemName: problem, GrouCateName: dept };
    console.log("WebService Para: " + querystring.stringify(para));
    var options = {
        host: '103.50.152.102',
        port: 80,
        method: 'POST',
        path: '/SMASTH_NewLocal/Webservice/Citizenapp.asmx/GetProblemDetails_AI',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(querystring.stringify(para))
        }
    };    
    var reqnew = http.request(options, function (res) { 
      let data = '';        
      res.on('data', function (chunk){        
        data += chunk;  
      });
      res.on('end', function () {        
        var result = "";        
        var array = JSON.parse(data)["Head"][0];
        var problem_id = array.Problem_ID;
        var problem_desc = array.Problem_Description;
        var problem_cat_id = array.PrblCatg_ID;
        var problem_cat_name = array.PrblCatg_Name;
        var problem_dept_id = array.Dept_ID;
        var problem_dept_name = array.Dept_Name;

        result += "Your selected problem, ward and category details are follows:";
        result += "\n" + problem_desc + "("+ problem_id +")";
        result += "\n" + problem_cat_name + "("+ problem_cat_id +")";
        result += "\n" + problem_dept_name + "("+ problem_dept_id +")\n";

        retVal =  result + "\nFor which area you want to add a complaint?" ;                   
        return retVal;
      });
      res.on('error', function (err) {
        console.log('Err:' + err);
      })
    });
    
    reqnew.write(querystring.stringify(para));    
    reqnew.end();
    
    while(retVal === undefined) {
      require('deasync').sleep(100);
    }
    //console.log("WebService Problem List: " + retVal);
    return retVal;
  }

  function getLatLong(area){
    var retVal = undefined;
    var SERVER_KEY = "AIzaSyCV9wZEvRG7R6HzGoyOqpk8hhEsSlmvlSQ";
    var BROWSER_KEY1 = "AIzaSyBfJaiD7yAhwnQfk9Aqx6FLkKRT5-UPMaA";
    var BROWSER_KEY2 = "AIzaSyB1IOQUnPvDIR2cytTR8ApBmxUKIh0-iU8";
    var request = require("request");
    var options = { method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: { 
      address: area,
      key: SERVER_KEY // Need to get API Key From Google
      },
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      retVal = body.results[0].geometry.location;
    });

    while(retVal === undefined) {
      require('deasync').sleep(100);
    }      
      return retVal;
  }

  function getWardDetails(area){
    /* var dataLL = getLatLong(area);
    var arrLatLong = JSON.parse(dataLL)
    var lat = arrLatLong.lat;
    var lng = arrLatLong.lng; */

      var retVal = undefined;
      var http = require('http');
      var querystring = require('querystring');
      var para = { AreaName: area, WardID: 0 };
      console.log("WebService Para: " + querystring.stringify(para));
      var options = {
          host: '103.50.152.102',
          port: 80,
          method: 'POST',
          path: '/SMASTH_NewLocal/Webservice/Citizenapp.asmx/GetSearchAreaDetail',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(querystring.stringify(para))
          }
      };   
      
      var reqnew = http.request(options, function (res) { 
        let data = '';        
        res.on('data', function (chunk){        
          data += chunk;  
        });
        res.on('end', function () {        
          var result = "";        
          var array = JSON.parse(data)["Head"][0];
          var area_id = array.Area_ID;
          var area_name = array.Area_Name;
          var ward_id = array.Ward_ID;
          var ward_name = array.Ward_Name;
          result += "\nYour area is " + area + "("+ area_id +")";
          result += "\nYour ward is " + ward_name + "("+ ward_id +")";
  
          retVal =  result + "\n\nPlease let me know your mobile number for further process";
          return retVal;
        });
        res.on('error', function (err) {
          console.log('Err:' + err);
        })
      });
      
      reqnew.write(querystring.stringify(para));    
      reqnew.end();
      
      while(retVal === undefined) {
        require('deasync').sleep(100);
      }
      //console.log("WebService Problem List: " + retVal);
      return retVal;
  }


  function getProblemID(dept, problem){
    var retVal = undefined;
    var http = require('http');
    var querystring = require('querystring');
    var para = { ProblemName: problem, GrouCateName: dept };
    console.log("WebService Para: " + querystring.stringify(para));
    var options = {
        host: '103.50.152.102',
        port: 80,
        method: 'POST',
        path: '/SMASTH_NewLocal/Webservice/Citizenapp.asmx/GetProblemDetails_AI',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(querystring.stringify(para))
        }
    };    
    var reqnew = http.request(options, function (res) { 
      let data = '';        
      res.on('data', function (chunk){        
        data += chunk;  
      });
      res.on('end', function () {        
        var array = JSON.parse(data)["Head"][0];
        var problem_id = array.Problem_ID;
        retVal = problem_id
        return retVal;
      });
      res.on('error', function (err) {
        console.log('Err:' + err);
      })
    });
    
    reqnew.write(querystring.stringify(para));    
    reqnew.end();
    
    while(retVal === undefined) {
      require('deasync').sleep(100);
    }
    //console.log("WebService Problem List: " + retVal);
    return retVal;
  }

  function getWardID(area){
    var retVal = undefined;
    var http = require('http');
    var querystring = require('querystring');
    var para = { AreaName: area, WardID: 0 };
    console.log("WebService Para: " + querystring.stringify(para));
    var options = {
        host: '103.50.152.102',
        port: 80,
        method: 'POST',
        path: '/SMASTH_NewLocal/Webservice/Citizenapp.asmx/GetSearchAreaDetail',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(querystring.stringify(para))
        }
    };    
    var reqnew = http.request(options, function (res) { 
      let data = '';        
      res.on('data', function (chunk){        
        data += chunk;  
      });
      res.on('end', function () {        
        var array = JSON.parse(data)["Head"][0];        
        var area_id = array.Area_ID;
        var area_name = array.Area_Name;
        var ward_id = array.Ward_ID;
        var ward_name = array.Ward_Name;

        retVal = {Area_ID: area_id, Ward_ID: ward_id}
        return retVal;
      });
      res.on('error', function (err) {
        console.log('Err:' + err);
      })
    });
    
    reqnew.write(querystring.stringify(para));    
    reqnew.end();
    
    while(retVal === undefined) {
      require('deasync').sleep(100);
    }
    //console.log("WebService Problem List: " + retVal);
    return retVal;
  }

  function AddComplaint(userName, userEmail, mobile, dept, problem, area, address){
    var retVal = undefined;
    var problem_id = getProblemID (dept, problem);
    var warddetails = getWardID (area);
    //console.log("warddetails: " + JSON.stringify(warddetails));
    //var wardarray = JSON.parse(warddetails);
    //var area_id = wardarray.Area_ID;
    //var ward_id = wardarray.Ward_ID;
    var ward_id = warddetails.Ward_ID;

      var http = require('http');
      var querystring = require('querystring');
      var para = { ComplainantMobile: mobile, Remarks:"Complaint added by Google Assistant", ComplainantName: userName, ComplainantAddress: "", ComplainantEmailID: userEmail, ProblemID: problem_id, ComplainantContact: userName, WardID: ward_id, AreaID:0, LocationAddr: address };
      console.log("WebService Para: " + querystring.stringify(para));
      var options = {
          host: '103.50.152.102',
          port: 80,
          method: 'POST',
          path: '/SMASTH_NewLocal/Webservice/Citizenapp.asmx/RegisterComplaint',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(querystring.stringify(para))
          }
      };    
      var reqnew = http.request(options, function (res) { 
        let data = '';        
        res.on('data', function (chunk){        
          data += chunk;  
        });
        res.on('end', function () {        
          var result = "";        
          var array = JSON.parse(data)["Head"];
          console.log("array: " + array);
          //var token_no = array.Token_No;
          var token_no = array;
          console.log("Token No generated: " + token_no);
          result = token_no;
          retVal =  "Your complaint has been registered with token number " + result;                   
          return retVal;
        });
        res.on('error', function (err) {
          console.log('Err:' + err);
        })
      });
      
      reqnew.write(querystring.stringify(para));    
      reqnew.end();
      
      while(retVal === undefined) {
        require('deasync').sleep(100);
      }
      //console.log("WebService Problem List: " + retVal);
      return retVal;
  }

  function getCheckStatus(TokenNo, MobileNo){
    //result = undefined;
    //TokenNo = "HL-02181511740";
    //MobileNo = "9825819075";
    var retVal = undefined;
    var http = require('http');
    var querystring = require('querystring');
    var para = { TokenNo: TokenNo, MobileNo: MobileNo };
    console.log("WebService Para: " + querystring.stringify(para));
    var options = {
        //host: '210.212.122.114',
        host: '103.50.152.102',
        port: 80,
        method: 'POST',
        //path: '/CCRSTesting/WebService/CitizenApp.asmx/GetAllTokenComplaintStatus',
        path: '/SMASTH_NewLocal/Webservice/Citizenapp.asmx/GetTokenComplaintStatus',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(querystring.stringify(para))
        }
    };    
    var reqnew = http.request(options, function (res) {        
      var result = '';      
      res.on('data', function (chunk){        
        result += chunk;  
      });
      res.on('end', function () {        
        let resultnew = JSON.parse(result)["Head"][0];
                  let output = '';                  
                  output += "Status is " + resultnew.Status + " for token " + resultnew.Token_No + " on dated " + resultnew.StatusDate + ".";
                  output+="\n"
                  output += "The token was registered for the problem is " + resultnew.Problem;
                  console.log("VBS LOG output :" + output);
                  retVal =  output;                   
                  return retVal;                  
      });
      res.on('error', function (err) {
        console.log('Err:' + err);
      })
    });
     
  reqnew.write(querystring.stringify(para));    
  reqnew.end();
  //require('deasync').loopWhile(function(){return !done;});
  //deasync.loopWhile(function(){return !done;});
  /* while (retVal === undefined){
    //require ('deasync').runLoopOnce();
    retVal = cb.response;
  } */
  while(retVal === undefined) {
    require('deasync').sleep(100);
  }
  //console.log("WebService Result: " + retVal);
  return retVal;
}

function getTempResponse(){
  var res = "Testing list";
  var ret = {
    "fulfillmentText" : "", 
    "fulfillmentMessages" : [{ "text": {"text" : [res]}}], 
    "source" : "",
    "payload": {
      "google": {        
        "expectUserResponse": true,
        "noInputPrompts":[

        ],
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": res
              }
            }
          ], suggetions: [{ title:"Make a complaint" }, { title :"Check Status" }]
        }
        ,"systemIntent": {
          "intent": "actions.intent.OPTION",
          "data": {
            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
            "listSelect": {
              "title": "Ask any one from options",
              "items": [
                {
                  "optionInfo": {
                    "key": "complaint"
                  },
                  "description": "Citizen can register complaint through the app 24/7",
                  "image": {
                    "url": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png"
                    ,"accessibilityText": "Make a complaint"
                  },
                  "title": "Make a complaint"
                },
                {
                  "optionInfo": {
                    "key": "checkstatus"
                  },
                  "description": "Complainant can check status of his complaint by mobile number",
                  "image": {
                    "url": "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw"
                    ,"accessibilityText": "Check-Status"
                  },
                  "title": "Check status"
                }
              ]
            }
          }
        }
        ,"expectedInputs": [
          {
              "inputPrompt": {
                  "initialPrompts": [
                      {
                          "textToSpeech": "Alright! Here are a few things you can learn. Which sounds interesting?"
                      }
                  ],
                  "noInputPrompts": []
              },
              "possibleIntents": [
                  {
                      "intent": "actions.intent.OPTION",
                      "inputValueData": {
                          "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
                          "listSelect": {
                              "title": "Ask any one from options",
                              "items": [
                                  {
                                      "optionInfo": {
                                          "key": "complaint",
                                          "synonyms": [
                                              "complaint",
                                              "make a complaint"
                                          ]
                                      },
                                      "title": "Make a complaint",
                                      "description": "Complainant can check status of his complaint by mobile number",
                                      "image": {
                                          "url": "http://example.com/math_and_prime.jpg",
                                          "accessibilityText": "Make a complaint"
                                      }
                                  },
                                  {
                                      "optionInfo": {
                                          "key": "checkstatus",
                                          "synonyms": [
                                              "checkstatus",
                                              "check status",
                                              "status"
                                          ]
                                      },
                                      "title": "Check status",
                                      "description": "Complainant can check status of his complaint by mobile number",
                                      "image": {
                                          "url": "http://example.com/egypt",
                                          "accessibilityText": "Check-Status"
                                      }
                                  }                                  
                              ]
                          }
                      }
                  }
              ]
          }
      ]
    }
    }, 
    "outputContexts": [],
    "followupEventInput": {}
  };


  return ret;
}

function getResponseInputPromptObject(res){
  return {
    "fulfillmentText" : "", 
    "fulfillmentMessages" : [{ "text": {"text" : [res]}}], 
    "source" : "",
    "payload": {
      "google": {
        "expectUserResponse": true,        
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": res
              }
            }
          ], suggetions: [{ title:"Make a complaint" }, { title :"Check Status" }]
        }
        /* ,
      "possibleIntents": [
        {
          "intent": "actions.intent.PERMISSION",
          "inputValueData": {
            "@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
            "optContext": "To deliver your order",
            "permissions": [
              "NAME",
              "DEVICE_PRECISE_LOCATION"
            ]
          }
        }
      ] */
        ,"systemIntent": {
          "intent": "actions.intent.OPTION",
          "data": {
            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
            "listSelect": {
              "title": "Ask any one from options",
              "items": [
                {
                  "optionInfo": {
                    "key": "complaint"
                  },
                  "description": "Citizen can register complaint through the app 24/7",
                  "image": {
                    "url": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png"
                    ,"accessibilityText": "Make a complaint"
                  },
                  "title": "Make a complaint"
                },
                {
                  "optionInfo": {
                    "key": "checkstatus"
                  },
                  "description": "Complainant can check status of his complaint by mobile number",
                  "image": {
                    "url": "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw"
                    ,"accessibilityText": "Check-Status"
                  },
                  "title": "Check status"
                }
              ]
            }
          }
        }                
    }
      ,
      "facebook": {
        "text": res
      },
      "slack": {
        "text": res
      }
    }, 
    "outputContexts": [],
    "followupEventInput": {}
  };
}

function getResponseObject(res, suggestion, tableCard){
  return {
    "fulfillmentText" : "", 
    "fulfillmentMessages" : [{ "text": {"text" : [res]}}], 
    "source" : "",
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": res
              }
            } , tableCard 
            /* ,{
              "tableCard": {
                "rows": [
                  {
                    "cells": [
                      {
                        "text": "1"
                      },
                      {
                        "text": "Water"
                      }
                    ],
                    "dividerAfter": true
                  },
                  {
                    "cells": [
                      {
                        "text": "2"
                      },
                      {
                        "text": "Road"
                      }
                    ],
                    "dividerAfter": true
                  }
                ],
                "columnProperties": [
                  {
                    "header": "Sr."
                  },
                  {
                    "header": "List of Categories"
                  }
                ]
              }
            } */
            
            /* , {
              "basicCard": {
                  "title": "List of Categories",
                  "formattedText": "42 is an even composite number. It\n    is composed of three distinct prime numbers multiplied together. It\n    has a total of eight divisors. 42 is an abundant number, because the\n    sum of its proper divisors 54 is greater than itself. To count from\n    1 to 42 would take you about twenty-one…",
                  "image": {
                      "url": "https://example.google.com/42.png",
                      "accessibilityText": "Image alternate text"
                  },
                  "buttons": [
                      {
                          "title": "Read more",
                          "openUrlAction": {
                              "url": "https://example.google.com/mathandprimes"
                          }
                      }
                  ],
                  "imageDisplayOptions": "CROPPED"
              }
            } */
          // ] , "suggestions": [ { "title":"Make a complaint" }, { "title":"Check status for XXXXX..." } ]
          ] , "suggestions": suggestion
        }
        
        /* , "systemIntent": {
          "intent": "actions.intent.OPTION",
          "data": {
            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
            "carouselSelect": {
              "items": [
                {
                  "optionInfo": {
                    "key": "first title"
                  },
                  "description": "first description",
                  "image": {
                    "url": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                    "accessibilityText": "first alt"
                  },
                  "title": "first title"
                },
                {
                  "optionInfo": {
                    "key": "second"
                  },
                  "description": "second description",
                  "image": {
                    "url": "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
                    "accessibilityText": "second alt"
                  },
                  "title": "second title"
                }
              ]
            }
          }
        } */
      },
      "facebook": {
        "text": res
      },
      "slack": {
        "text": res
      }
    }, 
    "outputContexts": [],
    "followupEventInput": {}
  };
}

function getResponseObjectNew(res){
  return {
    "fulfillmentText" : "", 
    "fulfillmentMessages" : [{ "text": {"text" : [res]}}], 
    "source" : "",
    "payload": {
      "google": {
        "conversationToken": "",
        "expectUserResponse": true,
        "expectedInputs": [
            {
                "inputPrompt": {
                    "initialPrompts": [
                        {
                            "textToSpeech": "Alright! Here are a few things you can learn. Which sounds interesting?"
                        }
                    ],
                    "noInputPrompts": []
                },
                "possibleIntents": [
                    {
                        "intent": "actions.intent.OPTION",
                        "inputValueData": {
                            "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
                            "listSelect": {
                                "title": "Things to learn about",
                                "items": [
                                    {
                                        "optionInfo": {
                                            "key": "MATH_AND_PRIME",
                                            "synonyms": [
                                                "math",
                                                "math and prime",
                                                "prime numbers",
                                                "prime"
                                            ]
                                        },
                                        "title": "Math & prime numbers",
                                        "description": "42 is an abundant number because the sum of its proper divisors 54 is greater…",
                                        "image": {
                                            "url": "http://example.com/math_and_prime.jpg",
                                            "accessibilityText": "Math & prime numbers"
                                        }
                                    },
                                    {
                                        "optionInfo": {
                                            "key": "EGYPT",
                                            "synonyms": [
                                                "religion",
                                                "egpyt",
                                                "ancient egyptian"
                                            ]
                                        },
                                        "title": "Ancient Egyptian religion",
                                        "description": "42 gods who ruled on the fate of the dead in the afterworld. Throughout the under…",
                                        "image": {
                                            "url": "http://example.com/egypt",
                                            "accessibilityText": "Egypt"
                                        }
                                    },
                                    {
                                        "optionInfo": {
                                            "key": "RECIPES",
                                            "synonyms": [
                                                "recipes",
                                                "recipe",
                                                "42 recipes"
                                            ]
                                        },
                                        "title": "42 recipes with 42 ingredients",
                                        "description": "Here's a beautifully simple recipe that's full of flavor! All you need is some ginger and…",
                                        "image": {
                                            "url": "http://example.com/recipe",
                                            "accessibilityText": "Recipe"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    },
      "facebook": {
        "text": res
      },
      "slack": {
        "text": res
      }
    }, 
    "outputContexts": [],
    "followupEventInput": {}
  };
}