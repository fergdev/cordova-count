function dbConnect(){
	alert("HELLO WORLD");
	var db = window.openDatabase("MyFriends", "1.0", "myfriends", 200000);
	db.transaction(populateDB, errorCB, successCB);
}

function populateDB(tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS MyFriends (id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, Nickname TEXT NOT NULL)');
       	tx.executeSql('INSERT INTO MyFriends(Name,Nickname) VALUES ("Sunil Gupta", "android")');
        tx.executeSql('INSERT INTO MyFriends(Name,Nickname) VALUES ("Abhishek Tripathi", "Champoo")');
	tx.executeSql('INSERT INTO MyFriends(Name,Nickname) VALUES ("Sandeep Pal", "kaliya sandy")');
	tx.executeSql('INSERT INTO MyFriends(Name,Nickname) VALUES ("AmitVerma", "Budhiya")');
}	

function errorCB(err){
	alert("Error processing SQL : " + err.code );       
}
function successCB(){
	alert("SUCCESS");
	var db = window.openDatabase("MyFriends", "1.0", "myfriends", 200000);
	db.transaction(queryDB,errorCB);
}

function queryDB(tx){
	tx.executeSql('SELECT * FROM MyFriends',[],querySuccess,errorCB);
}

function querySuccess(tx, result){
	$('#MyFriendsList').empty();
	$.each(result.rows,function(index){
		var row = result.rows.item(index);
	        $('#MyFriendsList').append('<li><h3>'+row['Name']+'</h3></li>');
       	});
	$('#MyFriendsList').listview();
}
