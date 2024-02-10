/**                    
 _____  _____  _____  _____ ___ ___ _____ 
/     \/   __\/  _  \/  ___>\  |  //  ___>
|  |--||   __||  |  ||___  | |   | |___  |
\_____/\_____/\__|__/<_____/ \___/ <_____/
                                           
 * Call Censys API to investigate number of publicly-exposed BAS/BMS devices
 * FINALLY written 2022 Feb 05 by dd
 * #np - Letterkenny S1-S10 Soundtrack
 * https://open.spotify.com/playlist/5DiW7sTqF4zLCCdAFwy5Kv?si=6366faa73dfa4ff4
 */

function hackMyBuilding() {
  
  // API key info for Censys API
  var apiId = PropertiesService.getScriptProperties().getProperty("API_ID");
  var apiSecret = PropertiesService.getScriptProperties().getProperty("API_SECRET");

  var apiBACnetUrl = "https://search.censys.io/api/v2/hosts/aggregate?q=bacnet&field=services.bacnet.vendor_name&num_buckets=50&virtual_hosts=EXCLUDE";
  var apiMQTTUrl = "https://search.censys.io/api/v2/hosts/search?q=mqtt&virtual_hosts=EXCLUDE";
  var apiModbusUrl = "https://search.censys.io/api/v2/hosts/search?q=modbus&virtual_hosts=EXCLUDE";
  var apiOccUrl = "https://search.censys.io/api/v2/hosts/search?q=occupancy&virtual_hosts=EXCLUDE";
  
  // super basic auth. irony.
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(apiId + ':' + apiSecret)
  };

  var params = {
    "method":"GET",
    "headers":headers
  };

  var nowTime = new Date();
  var writeData = [];

  // get BACnet results 
  var responseBACnet = UrlFetchApp.fetch(apiBACnetUrl, params);
  Logger.log("BACnet results: " + JSON.parse(responseBACnet).result.total);
  var numBACnet = JSON.parse(responseBACnet).result.total;

  // get count by vendor name
  for(var i=0;i<JSON.parse(responseBACnet).result.buckets.length;i++){

    var arrBACnet = {
    "timestamp": nowTime,
    "type": "bacnet",
    "results": JSON.parse(responseBACnet).result.buckets[i].count,
    "vendorName": JSON.parse(responseBACnet).result.buckets[i].key
    };

    writeData.push(arrBACnet);

  }
  
  // get MQTT results 
  var responseMQTT = UrlFetchApp.fetch(apiMQTTUrl, params);
  Logger.log("MQTT results: " + JSON.parse(responseMQTT).result.total);
  var numMQTT = JSON.parse(responseMQTT).result.total;
  var arrMQTT = {
    "timestamp": nowTime,
    "type": "mqtt",
    "results": numMQTT,
    "vendorName": "All-MQTT"
  }
  writeData.push(arrMQTT);

  // get Modbus results 
  var responseModbus = UrlFetchApp.fetch(apiModbusUrl, params);
  Logger.log("Modbus results: " + JSON.parse(responseModbus).result.total);
  var numModbus = JSON.parse(responseModbus).result.total;
  var arrModbus = {
    "timestamp": nowTime,
    "type": "modbus",
    "results": numModbus,
    "vendorName": "All-Modbus"
  }
  writeData.push(arrModbus);

  // get Occupancy (occ) results 
  var responseOcc = UrlFetchApp.fetch(apiOccUrl, params);
  Logger.log("Occupancy results: " + JSON.parse(responseOcc).result.total);
  var numOcc = JSON.parse(responseOcc).result.total;
  var arrOcc = {
    "timestamp": nowTime,
    "type": "occupancy",
    "results": numOcc,
    "vendorName": "All-Occupancy"
  }
  writeData.push(arrOcc);

  // now write to Google Sheet
  writeToSheet(writeData);

}

function writeToSheet(writeData){

  var sheetUrl = "GOOGLE SHEET URL GOES HERE";
  var sheetId = sheetUrl.match(/[-\w]{25,}/);
  var censysSheet = SpreadsheetApp.openByUrl(sheetUrl);

  // activate the raw data tab
  var censysSheetTab = censysSheet.getSheetByName("Results");

  // get the last row
  var lastRow = censysSheetTab.getDataRange().getLastRow();
  Logger.log("last row: " + lastRow);

  // prep the 2D array to push into Sheets
  var insertArr = [];
  insertArr = prepArray(writeData);

  // write to Sheet
  censysSheetTab.getRange(lastRow+1,1,insertArr.length,insertArr[0].length).setValues(insertArr);

}

function prepArray(writeData){

  var tempArr = [];

  for(i=0;i<writeData.length;i++){
    tempArr.push([writeData[i].timestamp,
    writeData[i].type,
    writeData[i].results,
    writeData[i].vendorName
    ]);
  }

  return tempArr;

}
