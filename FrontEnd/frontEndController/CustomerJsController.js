//validation


var regExCusID = /^(C00-)[0-9]{3,4}$/;
//  var regExCusID = /^(C-)[0-9]{3,4}$/;
$("#txtCustomerId").keyup(function () {
    let input = $("#txtCustomerId").val();
    if (regExCusID.test(input)) {
        $("#txtCustomerId").css('border', '2px solid green');
        $("#errorId").text("");
        $("#btnAddCustomer").prop("disabled", false);
    } else {
        $("#txtCustomerId").css('border', '2px solid red');
        $("#errorId").text("Wrong format : C00-001");
        $("#btnAddCustomer").prop("disabled", true);

    }
});

var regExCusName = /^[a-zA-Z ]+$/;

$("#txtCustomerName").keyup(function () {
    let input = $("#txtCustomerName").val();
    if (regExCusName.test(input)) {
        $("#txtCustomerName").css('border', '2px solid green');
        $("#errorName").text("");
        $("#btnAddCustomer").prop("disabled", false);

    } else {
        $("#txtCustomerName").css('border', '2px solid red');
        $("#errorName").text("Wrong format : Type Your Name");
        $("#btnAddCustomer").prop("disabled", true);

    }
});

var regExCusAddress = /^[A-Za-z0-9'\.\-\s\,]+$/;

$("#txtCustomerAddress").keyup(function () {
    let input = $("#txtCustomerAddress").val();
    if (regExCusAddress.test(input)) {
        $("#txtCustomerAddress").css('border', '2px solid green');
        $("#errorAddress").text("");
        $("#btnAddCustomer").prop("disabled", false);

    } else {
        $("#txtCustomerAddress").css('border', '2px solid red');
        $("#errorAddress").text("Wrong format : Type Your Address");
        $("#btnAddCustomer").prop("disabled", true);

    }
});

var regExCusPhoneNo = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

$("#txtCustomerTP").keyup(function () {
    let input = $("#txtCustomerTP").val();
    if (regExCusPhoneNo.test(input)) {
        $("#txtCustomerTP").css('border', '2px solid green');
        $("#errorTp").text("");
        $("#btnAddCustomer").prop("disabled", false);

    } else {
        $("#txtCustomerTP").css('border', '2px solid red');
        $("#errorTp").text("Wrong format : Type Your Phone No");
        $("#btnAddCustomer").prop("disabled", true);

    }
});

$('#txtCustomerId,#txtCustomerName,#txtCustomerAddress,#txtCustomerTP').on('keydown', function (eventObj) {
    if (eventObj.key == "Tab") {
        eventObj.preventDefault();
    }
});


//Crud Operation
$("#txtCustomerSearchId").keyup(function (event) {
    if (event=="Enter") {
        customerTxtAdd();
    }

})
$("#txtCustomerSearchId").click(function () {
    customerTxtAdd();
})

$("#btnGetAllCustomer").click(function () {
    loadAllCustomers();
});
loadAllCustomers();

//Methods
//Customer
$("#txtCustomerId").keydown(function (event) {
    if (event.key=="ENTER"){
        customerTxtAdd();
        alert("hello");
    }
})
function customerTxtAdd() {
    $.ajax({
        url: "http://localhost:8080/JavaEEPos/customer?option=SEARCH",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            for (const customer of resp.data) {
                let custId=$(customer.CId);
                let custName=$(customer.CName);
                let custAddress=$(customer.CAddress);
                let custPhoneNo=$(customer.C_PhoneNo);
                $("#txtCustomerId").val(custId);
                $("#txtCustomerName").val(custName);
                $("#txtCustomerAddress").val(custAddress);
                $("#txtCustomerTP").val(custPhoneNo);
            }
        }
    });
}
function loadAllCustomers() {
    $("#custTable").empty();
    $.ajax({
        url: "http://localhost:8080/JavaEEPos/customer?option=GETALL",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            for (const customer of resp.data) {
                let row = `<tr><td>${customer.C_Id}</td><td>${customer.C_Name}</td><td>${customer.C_Address}</td><td>${customer.C_PhoneNo}</td></tr>`;
                $("#custTable").append(row);
            }
            bindClickEvents();
        }
    });
}

//Bind click events to the table rows
function bindClickEvents() {
    $("#custTable>tr").click(function () {
        //Get values from the selected row
        let id = $(this).children().eq(0).text();
        let name = $(this).children().eq(1).text();
        let address = $(this).children().eq(2).text();
        let phoneNo = $(this).children().eq(3).text();
        //Set values to the text-fields
        $("#txtCustomerId").val(id);
        $("#txtCustomerName").val(name);
        $("#txtCustomerAddress").val(address);
        $("#txtCustomerTP").val(phoneNo);
    });
}

$("#btnAddCustomer").click(function () {
    var data=$("#customerForm").serialize();
    $.ajax({
        url: "http://localhost:8080/JavaEEPos/customer",
        method: "POST",
        data:data,
        success:function (res) {
            if (res.status==200){
                alert(res.message);
                loadAllCustomers();
            }else {
                alert(res.data)
            }
        },
        error:function (ob,textStatus,error) {
            console.log(ob);
            console.log(textStatus);
            console.log(error);
        }
    });
});

$("#btnDeleteCustomer").click(function () {
    let customerId=$("#txtCustomerId").val();
    $.ajax({
        url:"http://localhost:8080/JavaEEPos/customer?customerId=" + customerId,
        method: "DELETE",
        // data: data,
        success: function (res) {
            console.log(res);
            if (res.status == 200) {
                alert(res.message);
                loadAllCustomers();
            } else if (res.status == 400) {
                alert(res.data);
            } else {
                alert(res.data);
            }

        },
        error: function (ob, status, t) {
            console.log(ob);
            console.log(status);
            console.log(t);
        }
    });
});

$("#btnUpdateCustomer").click(function () {
    var cusOb={
        customerId:$("#txtCustomerId").val(),
        customerName:$("#txtCustomerName").val(),
        customerAddress:$("#txtCustomerAddress").val(),
        customerPhoneNo:$("#txtCustomerTP").val()
    }
    $.ajax({
        url:"http://localhost:8080/JavaEEPos/customer",
        method:"PUT",
        contentType:"application/json",
        data:JSON.stringify(cusOb),
        success:function (res) {
            if (res.status==200){
                alert(res.message);
                loadAllCustomers();
            }else if (res.status==400){
                alert(res.message)
            }else {
                alert(res.data);
            }
        },
        error:function (ob,errorStus) {
            console.log(ob);
        }
    });
});