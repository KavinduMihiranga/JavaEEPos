
// VALIDATION
// var regExItemCode = /^(I00-)[0-9]{3,4}$/;
var regExItemCode = /^(I-)[0-9]{3,4}$/;

$("#txtItemCode").keyup(function () {
    let input = $("#txtItemCode").val();
    if (regExItemCode.test(input)) {
        $("#txtItemCode").css('border', '2px solid green');
        $("#errorCode").text("");
        $("#btnAddItem").prop("disabled", false);

    } else {
        $("#txtItemCode").css('border', '2px solid red');
        $("#errorCode").text("Wrong format : I00-001");
        $("#btnAddItem").prop("disabled", true);

    }
});

var regExItemName = /^[a-zA-Z ]+$/;

$("#txtItemName").keyup(function () {
    let input = $("#txtItemName").val();
    if (regExItemName.test(input)) {
        $("#txtItemName").css('border', '2px solid green');
        $("#errorItemName").text("");
        $("#btnAddItem").prop("disabled", false);

    } else {
        $("#txtItemName").css('border', '2px solid red');
        $("#errorItemName").text("Wrong format : Type Item Name");
        $("#btnAddItem").prop("disabled", true);

    }
});

var regExItemPrice = /^\d{0,8}(\.\d{1,2})?$/;

$("#txtItemPrice").keyup(function () {
    let input = $("#txtItemPrice").val();
    if (regExItemPrice.test(input)) {
        $("#txtItemPrice").css('border', '2px solid green');
        $("#errorPrice").text("");
        $("#btnAddItem").prop("disabled", false);

    } else {
        $("#txtItemPrice").css('border', '2px solid red');
        $("#errorPrice").text("Wrong format : Type Item Price");
        $("#btnAddItem").prop("disabled", true);

    }
});

var regExItemQty = /^\d{0,8}(\.\d{1,3})?$/;

$("#txtItemQty").keyup(function () {
    let input = $("#txtItemQty").val();
    if (regExItemQty.test(input)) {
        $("#txtItemQty").css('border', '2px solid green');
        $("#errorQty").text("");
        $("#btnAddItem").prop("disabled", false);

    } else {
        $("#txtItemQty").css('border', '2px solid red');
        $("#errorQty").text("Wrong format : Type Item Qty");
        $("#btnAddItem").prop("disabled", true);

    }
});

$('#txtItemCode,#txtItemName,#txtItemPrice,#txtItemQty').on('keydown', function (eventObj) {
    if (eventObj.key == "Tab") {
        eventObj.preventDefault();
    }
});

//Item Crud Operation
$("#btnSearchItem").click(function () {
searchItem();
})
function searchItem(){
    $.ajax({
        url: "http://localhost:8080/JavaEEPos/item?option=SEARCH",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            let iCode=$(resp.itemCode);
            let iName=$(resp.itemName);
            let iPrice=$(resp.itemPrice);
            let iQty=$(resp.itemQty);


            $("#txtItemCode").val(iCode);
            $("#txtItemName").val(iName);
            $("#txtItemPrice").val(iPrice);
            $("#txtItemQty").val(iQty);
        }
    });
}

$("#btnGetAllItem").click(function () {
    loadAllItems();
});
loadAllItems();
function loadAllItems() {
    $("#itemTable").empty();
    $.ajax({
        url: "http://localhost:8080/JavaEEPos/item?option=GETALL",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            for (const item of resp.data) {
                let row = `<tr><td>${item.I_Code}</td><td>${item.I_Name}</td><td>${item.I_Price}</td><td>${item.I_Qty}</td></tr>`;
                $("#itemTable").append(row);
            }
            bindItemClickEvents();
        }
    });
}

function bindItemClickEvents() {
    $("#itemTable>tr").click(function () {
        //Get values from the selected row
        let code = $(this).children().eq(0).text();
        let name = $(this).children().eq(1).text();
        let price = $(this).children().eq(2).text();
        let qty = $(this).children().eq(3).text();
        //Set values to the text-fields
        $("#txtItemCode").val(code);
        $("#txtItemName").val(name);
        $("#txtItemPrice").val(price);
        $("#txtItemQty").val(qty);
    });
}
$("#btnAddItem").click(function () {
    var data=$("#itemForm").serialize();
    $.ajax({
        url: "http://localhost:8080/JavaEEPos/item",
        method: "POST",
        data:data,
        success:function (res) {
            if (res.status==200){
                alert(res.message);
                loadAllItems();
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

$("#btnDeleteItem").click(function () {
    let itemCode=$("#txtItemCode").val();
    $.ajax({
        url:"http://localhost:8080/JavaEEPos/item?itemCode=" + itemCode,
        method:"DELETE",
        // data:data,
        success:function (res) {
            console.log(res);
            if (res.status==200){
                alert(res.message);
                loadAllItems();
            }else if (res.status==400){
                alert(res.data)
            }else {
                alert(res.data)
            }
        },
        error:function (ob,status,t) {
            console.log(ob);
            console.log(status);
            console.log(t);
        }
    })
});

$("#btnUpdateItem").click(function () {
    var itemOb={
        itemCode:$("#txtItemCode").val(),
        itemName:$("#txtItemName").val(),
        itemPrice:$("#txtItemPrice").val(),
        itemQty:$("#txtItemQty").val()
    }
    $.ajax({
        url:"http://localhost:8080/JavaEEPos/item",
        method:"PUT",
        contentType: "application/json",
        data:JSON.stringify(itemOb),
        success:function (res) {
            if (res.status==200){
                alert(res.message);
                loadAllItems();
            }else if (res.status==400){
                alert(res.message);
            }else {
                alert(res.data)
            }
        },
        error:function (ob,errorStus) {
            console.log(ob)
        }
    })
});