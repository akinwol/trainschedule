

// Initialize firebase
var config = {
    apiKey: "AIzaSyDCDHC5Ib0nEvvhfSQEGbz4kKcITyqheqw",
    authDomain: "trainscheduler-e9d69.firebaseapp.com",
    databaseURL: "https://trainscheduler-e9d69.firebaseio.com",
    projectId: "trainscheduler-e9d69",
    storageBucket: "trainscheduler-e9d69.appspot.com",
    messagingSenderId: "909150485838"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("#addTrain").on("click", function() {
      event.preventDefault();

    //   grab the user input 

    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = moment($("#first-train-time").val().trim(), "HH:mm").format("X") ;
    var frequency = $("#frequency-min").val().trim();

    // console.log(trainName);
    // console.log(destination);
    // console.log(firstTrainTime);
    // console.log(frequency);

    var newTrain = {
        name: trainName,
        station: destination,
        time: firstTrainTime,
        freq: frequency,
        nextArrival: "",
        minutesAway: "",
    };

    database.ref().push(newTrain);

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency-min").val("");
  });

  database.ref().on("child_added", function(childsnap){

    var trainName = childsnap.val().name;
    var destination = childsnap.val().station;
    var firstTrainTime = childsnap.val().time;
    var frequency = childsnap.val().freq;
    // console.log(trainName);
    // console.log(destination);
    // console.log(firstTrainTime);
    // console.log(frequency);

    // this gives me the difference from the first train time to now in minutes
    var difference = moment().diff(moment(firstTrainTime, "X"), "minutes");
    // divide the difference in minutes by the frequency subtrack the remainder from the freqency
    // that will give me the time in minutes that is remaining  
    var minutesRemaining = frequency - (difference % frequency) 

    var nextArrival = moment().add(minutesRemaining, 'm').format("h:mm a");

      var newRow = $("<tr>").append( $("<td>").text(trainName), $("<td>").text(destination), 
      $("<td>").text(frequency + " mins"),$("<td>").text(nextArrival),$("<td>").text(minutesRemaining + " mins") );
     $("tbody").append(newRow);

    console.log("First train time: " + moment(firstTrainTime, "X").format("HH:mm"));
     console.log("Diff: " + moment().diff(moment(firstTrainTime, "X"), "minutes")) 
     console.log("minutes away: " + minutesRemaining)
     console.log("next arrival: " + moment().add(minutesRemaining, 'm').format("HH:mm"))

  });