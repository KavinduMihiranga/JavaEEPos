
$("#btnGetAllCustomer").click(function () {
    loadAllCustomers();
});
loadAllCustomers();

//Methods
//Customer
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