

//Item
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