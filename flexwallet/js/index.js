//  define the global variables
var token;
var BankId;
var accountId;
var filterDate;
var LogStatus = 'offline';
var searchedBank;
var bankSource = [];

// Add event listeners to wait for device ready before executing each function   
document.addEventListener('deviceready', document.getElementById("submit").addEventListener("click", login2OBP), false);
document.addEventListener('deviceready',document.getElementById("selectBank").addEventListener("click", queryOBP), false);
document.addEventListener('deviceready',document.getElementById("selectBank2").addEventListener("click", queryOBP), false);
document.addEventListener('deviceready',document.getElementById("selectBank3").addEventListener("click", queryOBP), false);
document.addEventListener('deviceready',document.getElementById("searchBank").addEventListener("click", queryOBP), false);
document.addEventListener('deviceready',document.getElementById("selectAccount").addEventListener("click", getAccount), false);
document.addEventListener('deviceready',document.getElementById("showTransaction").addEventListener("click", getTransactions), false);
document.addEventListener('deviceready',document.getElementById("printCurrencies").addEventListener("click", getcurrencies), false); 
document.addEventListener('deviceready',document.getElementById("showATM").addEventListener("click", getATM), false);

// Define login2OBP() to verify username and password. This is used to achieve the role of a database which is used to verify user login details.
function login2OBP() {
    var username = document.getElementById("user").value;
    var password = document.getElementById("pwd").value;
    
    // Check if username and password are correct
    if (username.trim().toLowerCase() === "nathan.fr.29@example.com"){
        if (password === "bde179")  {
            console.log("login details confirmed");

            // clear the login inputs
            document.getElementById("pwd").value = "";
            document.getElementById("user").value = "";

            // Extract the user name before the first '.' and convert it to uppercase. To be used in main page welcome
            const username2 = (username.indexOf('.') !== -1 ? username.substring(0, username.indexOf('.')) : username).toUpperCase();

            document.getElementById("presentUser").innerHTML= username2;
            loginOBP(username,password);
        } else {
            document.getElementById("loginfo").innerHTML = "Incorrect password, try again.";
        }

    } else {
        document.getElementById("loginfo").innerHTML = "Incorrect email, try again.";
    }
}


// manage the wallets using jquery widgets
// Initially hide the content
 $('.bal').hide();

 // When the button is clicked, toggle the visibility of wallet balances
 $('#toggleButton').click(function () {
     $('.bal').toggle();
 });

// define loginOBP to login user to Open Bank API
function loginOBP(user, pswd) {
    $.ajax({
        url: "https://apisandbox.openbankproject.com/my/logins/direct",
        type: "POST",
        dataType:"json",
        crossDomain: true,
        cache: false,
        contentType:"application/json; charset=utf-8",

        beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization",'DirectLogin username="'+user+'", password="' +pswd+ '",consumer_key="pysaxanan454hchj0igc2l11ldectfduocruxew2"'); 
        },

        success: function( data, textStatus, jQxhr ){
        console.log("successful login to OBP");
        LogStatus = 'online'; // change LogStatus to online
        window.location.href = "#page3";
        token = data.token;
        // change to LOGOUT when LogStatus is 'online'
        if (LogStatus === 'online') {
            document.getElementById("log").innerHTML = "LOG OUT";
        };
        },

        error: function( jqXhr, textStatus, errorThrown ){
        console.log("login error");
        document.getElementById("loginfo").innerHTML = "Login unsuccessfull";
        }
    });
}

// First functioinality: define queryOBP to get banks from Open Bank API
function queryOBP() {
    console.log("getting banks");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v4.0.0/banks",
        type: "GET",
        dataType:"json",
        crossDomain: true,
        contentType:"application/json; charset=utf-8",

        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
            xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        },

        success: function( data, textStatus, jQxhr ){
            console.log("success");
            console.log(data);
            //  clear the banks table
            document.getElementById("bankTableBody").innerHTML = ""; 
            //  append banks
            $("#bankTableBody").append("<tr><td id='bhead'>BANK NAME (BANK ID)</td></tr>");
            if (bankSource.length === 0) {
                data.banks.forEach(appendRow);
            } else {
                data.banks.forEach(AppendRow);
            };
            data.banks.forEach(appendRow5);
            data.banks.forEach(appendRow6);
            console.log("succesful appending of banks");
            document.getElementById("searchValue").value = ""; // clear searched value
        },

        error: function( jqXhr, textStatus, errorThrown ){
            console.log("Error");
        }
    });
}


// define apppendRow to append banks to bankTableBody when bankSource is empty
function appendRow(bank) {
    var currentBank = bank.short_name;
    searchedBank = document.getElementById("searchValue").value;
    //  append to bankSource only when it is empty
    bankSource.push(bank.short_name);

    // if statement to append only rows with the city same with the filterCity
    if (!searchedBank || currentBank.toLowerCase() === searchedBank.toLowerCase()) {
        $("#bankTableBody").append("<tr><td><a href='#page7' id='bankSelect' onclick=\"output_bank('" + bank.id + "','" + bank.short_name + "')\">" + bank.short_name + " (" + bank.id + ")</a></td></tr>");
    }
}

// define apppendRow to append banks to bankTableBody when bankSource is not empty
function AppendRow(bank) {
    var currentBank = bank.short_name;
    searchedBank = document.getElementById("searchValue").value;

    // if statement to append only rows with the city same with the filterCity
    if (!searchedBank || currentBank.toLowerCase() === searchedBank.toLowerCase()) {
        $("#bankTableBody").append("<tr><td><a href='#page7' id='bankSelect' onclick=\"output_bank('" + bank.id + "','" + bank.short_name + "')\">" + bank.short_name + " (" + bank.id + ")</a></td></tr>");
    }
}


//  autocomplete jquery for bank quick search
$("#searchValue").autocomplete({
    source: bankSource
});


// define apppendRow5 to append banks to select bank input in the currencies page
function appendRow5(bank) {
    $("#selectBank2").append("<option value= '" + bank.id + "'>" + bank.short_name +" (" + bank.id +")</option>");
    }

// define apppendRow6 to append banks to select bank input in the ATM page
function appendRow6(bank) {
    $("#selectBank3").append("<option value= '" + bank.id + "'>" + bank.short_name +" (" + bank.id +")</option>");
    }

// define output_bank to show selected bank ID on the console
function output_bank(b,c) {
    console.log("Bank ID: "+b);
    BankId = b;
    // show the value on the input for user to see
    document.getElementById("selectBank").value = c;

    // clear the searchValue filter entry
    document.getElementById("searchValue").innerHTML = "";
}


// event listerner on the #selectBank2 on the currencies page
$("#selectBank2").change(function() {
    // Get the selected value
    BankId = $(this).val();
    
    // Call the output_bank function with the selected bank ID
    output_bank(BankId);
});

// event listerner on the #selectBank3 on the ATM page
$("#selectBank3").change(function() {
    // Get the selected value
    BankId = $(this).val();
    
    // Call the output_bank function with the selected bank ID
    output_bank(BankId);
});

// second functionality to get accounts of a selected bank
// define getAccount
function getAccount() {
    console.log("getting accounts");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v4.0.0/banks/" +BankId+ "/accounts/account_ids/private",
        type: "GET",
        dataType:"json",
        crossDomain: true,
        contentType:"application/json; charset=utf-8",

        beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        },

        success: function( data, textStatus, jQxhr ){
        console.log("bank accounts retrieved successfully");
        console.log(data);
        document.getElementById("selectAccount").innerHTML = "";
        $("#selectAccount").append('<option value= "Select Account">Select Account</option>');
        data.accounts.forEach(appendRow2)
        },

        error: function( jqXhr, textStatus, errorThrown ){
        console.log("error getting bank accounts");
        }
    });
}

// define apppendRow2 to append accountss to the select in transactions page
function appendRow2(accountID) {
    $("#selectAccount").append("<option value= '" + accountID.id + "'>" + accountID.id + "</option>");
    }

//  function to print selected bank account ID on console
function output_account(b) {
    console.log("Account ID: "+b);
    }

// event listener on the #selectAccount
$("#selectAccount").change(function() {
    // Get the selected value
    accountId = $(this).val();
    
    // Call the output_account function with the selected account id
    output_account(accountId);
});


// Third functionality to get transactions.
//  define a fucntion, getTransactions.
function getTransactions() {
    document.getElementById("transactionsTable").innerHTML = ""; // clear the transaction table body
    document.getElementById("tx-table").innerHTML = ""; // clear the transaction table head
    console.log("getting transactions");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v5.0.0/my/banks/"+BankId+"/accounts/"+accountId+"/transactions",
        type: "GET",
        dataType:"json",
        crossDomain: true,
        contentType:"application/json; charset=utf-8",

        beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        },

        success: function( data, textStatus, jQxhr ){
        console.log("Transactions retrieved successfully");
        console.log(data);
        $("#tx-table").append("<tr style= 'font-weight: bold;'><th> Date </th> <th>Time</th> <th >Transaction Type</th>"+
        "<th>Currency</th> <th>Amount</th> <th>Balance</th> <th>Description</th> </tr>");
        data.transactions.forEach(appendRow3)
        },

        error: function( jqXhr, textStatus, errorThrown ){
        console.log("error getting account transactions");
        }
    });
}


//  appendRow3 fucntion to append transantions on the table in transaction page based on the filterDate value
function appendRow3(transactions) {
    var transactionDate = convertUTCToUK(transactions.details.completed).substring(0, 10);
    filterDate = document.getElementById("datepicker").value;

    // if statement to append only rows with the date same with the filterDate
    if (!filterDate || transactionDate === filterDate) {
        $("#transactionsTable").append("<tr><td style='text-align: center;' >" + convertUTCToUK(transactions.details.completed).substring(0, 10) +"</td><td style='text-align: center;'>" 
        + convertUTCToUK(transactions.details.completed).substring(12, 21) +"</td><td style='text-align: center;'>" 
        + transactions.details.type +"</td><td  style='text-align: center;'>" 
        + transactions.details.value.currency +"</td><td style='text-align: right;'>" 
        + transactions.details.value.amount +"</td><td style='text-align: right;'>" 
        + transactions.details.new_balance.amount +"</td><td style='text-align: right;'>" 
        + transactions.details.description +"</td></tr>");
    }
}


// jquery to toggle transactions table
$('#toggleTransactions').click(function () {
    $('#transtable').toggle();
});

// jquery to toggle currenciess table
$('#togglecurrencies').click(function () {
    $('#currenciesTable').toggle();
});

// Date picker jquery from jquery UI
$( function() {
    $( "#datepicker" ).datepicker({
      dateFormat: 'dd/mm/yy',
      position: { my: "right", at: "right" },
    });
  });

//  autocomplete jquery for username at login page.
$("#user").autocomplete({
      source: ["nathan.fr.29@example.com"]
  });

// fourth functionality to get currencies.
//  define getcurrencies function
function getcurrencies() {
    document.getElementById("currenciesTable").innerHTML = "";
    console.log("getting transactions");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v5.1.0/banks/"+BankId+"/currencies",
        type: "GET",
        dataType:"json",
        crossDomain: true,
        contentType:"application/json; charset=utf-8",

        beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        },

        success: function( data, textStatus, jQxhr ){
        console.log("currencies retrieved successfully");
        console.log(data);
        $("#currenciesTable").append("<tr style= 'font-weight: bold;'><td> Available Currencies</td>  </tr>");
        data.currencies.forEach(appendRow4)
        },

        error: function( jqXhr, textStatus, errorThrown ){
        console.log("error getting currencies");
        }
    });
}

//  define appendRow4 to append currencies to table.
function appendRow4(currency) {
    $("#currenciesTable").append("<tr><td>" + currency.alphanumeric_code + "</td></tr>");
    }


// Function to convert UTC time to UK time
function convertUTCToUK(utcDateString) {
    // Create a new Date object from the UTC date string
    var utcDate = new Date(utcDateString);

    // Use toLocaleString() to convert to London timezone
    var ukDateString = utcDate.toLocaleString('en-GB', { timeZone: 'Europe/London' });

    // Return the UK date and time as a string
    return ukDateString;
}

// fifth functionality to get Bank ATMs.
//  define getATM function
function getATM() {
    document.getElementById("atmTableBody").innerHTML = "";
    document.getElementById("atmTableHead").innerHTML = "";
    console.log("getting ATMs");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v5.1.0/banks/"+BankId+"/atms",
        type: "GET",
        dataType:"json",
        crossDomain: true,
        contentType:"application/json; charset=utf-8",

        beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        },

        success: function( data, textStatus, jQxhr ){
        console.log("currencies retrieved successfully");
        console.log(data);
        $("#atmTableHead").append("<tr style= 'font-weight: bold;'><th> ATM Name</th> <th> ATM ID</th><th> Postcode</th><th> City</th><th> State</th></tr>");
        data.atms.forEach(appenATMs)
        },

        error: function( jqXhr, textStatus, errorThrown ){
        console.log("error getting ATMS");
        }
    });
}

//  declare variable for the city to filter for an ATM
var filterCity
//  define appendATMs to append ATM details to table.
function appenATMs(atm) {
        var ATMcity =  atm.address.city; // a variable to hold the ATMcity to compare with the user filtercity
        filterCity = document.getElementById("citySelect").value;
    
        // if statement to append only rows with the city same with the filterCity
        if (!filterCity || ATMcity.toLowerCase() === filterCity.toLowerCase()) {
            $("#atmTableBody").append("<tr><td>" + atm.name +"</td><td>" 
            + atm.id +"</td><td>" 
            + atm.address.postcode +"</td><td>" 
            + atm.address.city +"</td><td >" 
            + atm.address.state +"</td></tr>");
        }
        // clear the city filter entry
        document.getElementById("citySelect").innerHTML = "";
    }

// jquery to toggle ATMs table
$('#toggleATM').click(function () {
    $('#atmTable').toggle();
});

// logout and refresh the html file
$("#logoutButton").click(function() {
    // Navigate to login page
    window.location.href = "#page2";
    // delay before reloading
    setTimeout(() => window.location.reload(), 100); 
    LogStatus == 'offline';
});

// change to LOG ON when LOgStatus is 'offline'
if (LogStatus === 'offline') {
    document.getElementById("log").innerHTML = "LOG ON";
};
