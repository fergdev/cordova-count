/////////////////////////////////////////////////////////////////////////////////
// Init all the things 
document.addEventListener("deviceready", init, false);

function init(){
	console.log('HELLO WORLD');
	initListeners();
	dbConnect();
}
/////////////////////////////////////////////////////////////////////////////////
// Setup listeners 

function initListeners(){
	console.log('Init listeners');
	$('#aboutButton').on('click', 	function(){$.mobile.changePage( $('#about-page'), 'slide', true, true)});
	$('#settingsButton').on('click',function(){showSettings();});	
	$('#addButton').on('click',	function(){$.mobile.changePage( $('#add-counter-page'), 'slide', true, true)});


	$('#updateSettingsBtn').on('click',	function(){updateSettings();});

	$('.numbersOnly').keypress(function (e) {
		//if the letter is not digit then display error and don't type anything
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
               		return false;
    		}
   	});
}

/////////////////////////////////////////////////////////////////////////////////
// Globals

var gVibrate = true;
var gPlaySound = true;

/////////////////////////////////////////////////////////////////////////////////
// Conversion helpers
function toBool(str){
	if(str =='true'){
		return true;
	}
	return false;
}
function boolToStr(b){
	if(b){
		return 'true';
	}
	return 'false';
}
/////////////////////////////////////////////////////////////////////////////////
//Default Callbacks
function successCB(){
	console.log('Success');
} 
function errorCB(error){
	console.log('FAIL ' + error.code + ' ' + error.message );
}

/////////////////////////////////////////////////////////////////////////////////
// Settings

function updateSettings(){
	console.log('UPDATE SETTINGS');
	gVibrate = $('#vibrateCB').prop("checked");
	gPlaySound = $('#soundCB').prop('checked');

	console.log('SETTINGS ' + gVibrate + ' ' + gPlaySound);

	// Write to db
	var db = getDB();
	db.transaction(
		function(tx){
			tx.executeSql('UPDATE settings SET value="'+boolToStr(gVibrate)+'" WHERE key="vibrate"');
			tx.executeSql('UPDATE settings SET value="'+boolToStr(gPlaySound)+'" WHERE key="playSound"');
		}
	,errorCB, successCB);

	//Change page
	$.mobile.changePage("#index-page",{transition:"fade"});
}


function loadSettings(){
	console.log('Load settings')
	var db = getDB(); 
	db.transaction(
		function(tx){tx.executeSql('SELECT * FROM settings',[],loadSettingsCB,errorCB)},
		errorCB,successCB);	
}
function loadSettingsCB(tx, results){
	console.log('Loading settings CB');
	
	for(var i =0; i < results.rows.length; i++){
	
		var row = results.rows.item(i);
		console.log('MAH KEY ' + row['key']);
		if (row['key']=='vibrate'){
			gVibrate=toBool(row['value']);
		}else{
			gPlaySound=toBool(row['value']);
		}			
	}	
	console.log('SETTINGS ' + gVibrate + ' ' + gPlaySound);
}
function loadSettingsFail(){
	console.log("Load settings fail");
}
function showSettings(){
	console.log('SHOW SETTINGS');
	console.log('SETTINGS ' + gVibrate + ' ' + gPlaySound);
	
	$('#vibrateCB').prop('checked', gVibrate);
	$('#soundCB').prop('checked',gPlaySound);
	$.mobile.changePage( $('#settings-page'), 'fade', true, true);
}

/////////////////////////////////////////////////////////////////////////////////

function getDB(){
	return window.openDatabase("counters", "1.0", "counters", 200000);
}
function dbConnect(){
	console.log("DBCONNECT");
	var db = getDB();
	db.transaction(populateDB, errorCB, successCB);
}

/////////////////////////////////////////////////////////////////////////////////
function populateDB(tx){
	console.log('POPULATE DB');


	tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='settings'", [], function (tx, result) {
		if (result.rows.length == 0) {
        		//Your logic if table doesnt exist
			console.log('SETTINGS DOES NOT EXIST');
			/*tx.executeSql('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
			tx.executeSql('INSERT INTO settings VALUES ("vibrate", "true")');
			tx.executeSql('INSERT INTO settings VALUES ("playSound", "true")');	*/
			initSettings();	
		}else{
			console.log('SETTINGS EXISTS');
			loadSettings();
		}
	});

	tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='counters'", [], function (tx, result) {
		if (result.rows.length == 0) {
        		//Your logic if table doesnt exist
			console.log('COUNTERS DOES NOT EXIST');
			/*tx.executeSql('CREATE TABLE IF NOT EXISTS counters (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, value INTEGER NOT NULL, increment INTEGER NOT NULL)');
			tx.executeSql('INSERT INTO counters VALUES ("Laughed", 0, 1)');
			tx.executeSql('INSERT INTO counters VALUES ("Farted", 0, 1)');
			tx.executeSql('INSERT INTO counters VALUES ("Smiled", 0, 1)');
*/
			initCounters();
		}else{
			console.log('COUNTERS EXISTS');
			getCounters();
		}
	});
}	

function initSettings(){
	console.log('INIT SETTINGS');
	// Write to db
	var db = getDB();
	db.transaction(
		function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
			tx.executeSql('INSERT INTO settings VALUES ("vibrate", "true")');
			tx.executeSql('INSERT INTO settings VALUES ("playSound", "true")');			
		}
	,errorCB, successCB);
}

function initCounters(){
	console.log('INIT COUNTERS');
	// Write to db
	var db = getDB();
	db.transaction(
		function(tx){
			
			tx.executeSql('CREATE TABLE IF NOT EXISTS counters (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, value INTEGER NOT NULL, increment INTEGER NOT NULL)');
			tx.executeSql('INSERT INTO counters(name,value,increment) VALUES ("Laughed", 0, 1)');
			tx.executeSql('INSERT INTO counters(name,value,increment) VALUES ("Farted", 0, 1)');
			tx.executeSql('INSERT INTO counters(name,value,increment) VALUES ("Smiled", 0, 1)');
		}
	,errorCB, getCounters);
}


/////////////////////////////////////////////////////////////////////////////////

function getCounters(){
	console.log('getCounters')
	var db = getDB(); 
	db.transaction(selectCounters,selectCountersError);	
}
function selectCounters(tx){
	tx.executeSql("SELECT * FROM counters", [], renderCounters, selectCountersError);
}
function selectCountersError(error){
	console.log('SELECT COUNTER ERROR ');
}
function renderCounters(tx, results){
	console.log('RENDER COUNTERS');
	var counterList = $('#counterList');
	counterList.empty();
	console.log('TODO cleanup event handlers on li');

	console.log('ROWS ' + results.rows.length);
	for(var i =0; i < results.rows.length; i++){
		var row = results.rows.item(i);
		console.log('ROW ' + row['name']);
		var html= '<div id="count-'+row['id']+'" class="counter-li">'; 
		html+='<div class="column-a"><i class="fa fa-minus fa-2x inc-btn" onclick="decrementCounter('+row['id']+','+row['increment']+');"></i></div>';		

		html+='<div class="column-c"><i class="fa fa-plus fa-2x inc-btn" onclick="incrementCounter('+row['id']+','+row['increment']+');"></i></div>';		
			
		html+='<div class="column-b">';
		html+='<h4 class="counter-name">'+row['name']+'</h4>';
		html+='<h4 id="cv-'+row['id']+'" class="counter-value">'+row['value']+'</h4>';
		html+='</div>';
	
		html += '</div>';
		//console.log(html);	
		counterList.append(html);
		$("#count-"+row['id']).swiperight(function(){
		//	console.log("SWIPE R" + row['id'] );
			removeCounter(row['id']);
		});
		$("#count-"+row['id']).swipeleft(function(){
			console.log("SWIPE L" + row['id'] );
			removeCounter(row['id']);
		});
	};
}
function addCounter(){
	console.log("Add counter");

	counter_name_tb = $('#counter-name');
	value_tb = $('#counter-value');
	increment_tb = $('#counter-increment');

	name = counter_name_tb.prop('value');
	value = value_tb.prop('value');
	increment = increment_tb.prop('value');

	if(value == ""){
		value = 0;
	}
	if(increment == ""){
		increment = 1;
	}

	counter_name_tb.val(counter_name_tb.prop("defaultValue"));
	value_tb.val(value_tb.prop("defaultValue"));
	increment_tb.val(increment_tb.prop("defaultValue"));

	console.log('NAME ' + name + " " + value + " " + increment )
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("INSERT INTO counters(name,value,increment) VALUES (\'"+name+"\',"+value+","+increment+")",[],successCB,errorCB)	
	});
	
	//Change page
	$.mobile.changePage("#index-page",{transition:"fade"});

	//redraw counters
	getCounters();
	console.log('END ADD COUNTER');
}

function removeCounter(id){
	console.log('REMOVE COUNTER ' + id)
	
	// Fade out li
	$("#count-"+id).stop(true,true).fadeOut("slow",function(){}); 
	
	
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("DELETE FROM counters WHERE id= "+id,[],successCB,errorCB)	
	});
	playFeedBack();
	//redraw counters
	getCounters();
}
function decrementCounter(id, diff){
	console.log('Decrement Counter');
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	
	// Get and update value in html
	elem = $("#cv-"+id);
	var val = parseInt(elem.text());
	val = val - diff;
	elem.text(val);
	// Update db
	db.transaction(function(tx){
		tx.executeSql("UPDATE counters SET value = "+val+" WHERE id = "+id,[],successCB,errorCB);	
	});

	// wiggle dec btn
	doBounce($("#dec-btn-"+id), 3, '10px', 50);
	animateUpdate(id);
	
	playFeedBack();
}
function incrementCounter(id, diff){
	console.log('Increment Counter');
	var db = window.openDatabase("counters", "1.0", "counters", 200000);

	elem = $("#cv-"+id);
	var val = parseInt(elem.text());
	val = val + diff;
	elem.text(val);
	
	db.transaction(function(tx){
		tx.executeSql("UPDATE counters SET value = "+val+" WHERE id = "+id,[],successCB,errorCB);
	});
	
	// wiggle inc btn
	doBounce($("#inc-btn-"+id), 3, '10px', 50);
	animateUpdate(id);
	playFeedBack();

}
function playFeedBack(){

	if(gVibrate){
		navigator.vibrate(0);
		navigator.vibrate(250);
	}
	if(gPlaySound){
		navigator.notification.beep(1);
	}

}

function animateUpdate(id){
	console.log('AnimateUpdate')
	$('#cv-'+id).stop(true,true).animate({opacity:0},250);
	$('#cv-'+id).stop(true,true).animate({opacity:1},250);
}

function doBounce(element, times, distance, speed) {
	element.finish();
	for(i = 0; i < times; i++) {
        	element.animate({marginTop: '-='+distance},speed)
            	.animate({marginTop: '+='+distance},speed);
    	}        
}
