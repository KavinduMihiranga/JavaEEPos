
$('#txtOrderId').keydown(function (event) {
    if (event.key == "Enter") {
        $('#txtOrderDate').focus();
    }
});

$('#txtOrderDate').keydown(function (event) {
    if (event.key == "Enter") {
        $('#txtOrderCustomer').focus();
    }
});

$('#txtOrderCustomer').keydown(function (event) {
    if (event.key == "Enter") {
        $('#txtOrderCustomerId').focus();
    }
});

$('#txtOrderCustomerId').keydown(function (event) {
    if (event.key == "Enter") {
        $('#txtOrderCustomerAddress').focus();
        orderCustomerDetailFromCId();

    }
});

$('#txtOrderItemCodes').keydown(function (event) {
    if (event.key == "Enter") {
        $('#txtOrderItemSellName').focus();
        orderItemDetailFormICode();
        alert("Item");
    }
});

$('#txtOrderItemSellName').keydown(function (event) {
    if (event.key == "Enter") {
        $('#txtOrderQuantity').focus();
    }
});

$('#txtOrderQuantity').keydown(function (event) {
    if (event.key == "Enter") {
        $('#txtQuantityOnHand').focus();
        qtyFunction();
    }
});

$('#txtQuantityOnHand').keydown(function (event) {
    if (event.key == "Enter") {
        $('#txtItemSellPrice').focus();
    }
});

$('#txtItemSellPrice').keydown(function (event) {
    if (event.key == "Enter") {
        $('#txtItemSellDiscount').focus();

    }
});
$('#txtItemSellDiscount').keydown(function (event) {
    if (event.key == "Enter") {
       $("#txtItemSellTotalPrice").focus();

    }
});

$('#txtItemSellTotalPrice').keydown(function (event) {
    if (event.key == "Enter") {
        loadAllOrderDetail();
        totalDiscountAndTotalPrice();
        qtyFunction();

    }
});


$("#lblTotalPrice").keydown(function (event) {
    if (event.key == "Enter") {
        // saveOrderItem();

        if (confirm("Do You Want To Add This Item..? ")) {

            alert("Add Order Item Successfully.!");
            saveOrderItem();

        } else {
            alert("Cancel Add Order Item !");
        }
    }
})

$('#lblCash').keydown(function (event) {
    if (event.key == "Enter") {
        if (confirm("Do You Want To Add This Order..? ")) {

            alert("Add Order Successfully.!");

        } else {
            alert("Cancel Add Order !");
        }
        lblCash();

    }
});


//Order
$("#linkOrder").click(function () {
    $("#orderTable").empty();
})

$("#btnOrderAddItem").click(function () {
    // var data=$("#orderForm").serialize();
    // $.ajax({
    //     url: "http://localhost:8080/JavaEEPos/order?orderOption=POST",
    //     method: "POST",
    //     data:data,
    //     success:function (res) {
    //         if (res.status==200){
    //             alert(res.message);
    //             loadAllItems();
    //         }else {
    //             alert(res.data)
    //         }
    //     },
    //     error:function (ob,textStatus,error) {
    //         console.log(ob);
    //         console.log(textStatus);
    //         console.log(error);
    //     }
    // })
    //

    var orderDetailData=$("#itemOrderForm").serialize();
    $.ajax({
        url: "http://localhost:8080/JavaEEPos/order?orderOption=OrderDetail",
        method: "POST",
        data:orderDetailData,
        success:function (res) {
            if (res.status==200){
                alert(res.message);
                loadAllItems();
            }else {
                alert(res.data)
            }
            loadAllOrderDetail();
            totalDiscountAndTotalPrice();
            qtyFunction();

        },
        error:function (ob,textStatus,error) {
            console.log(ob);
            console.log(textStatus);
            console.log(error);
        }
    })

})

function loadAllOrderDetail() {
    $("#orderTable").empty();
    $.ajax({
        url: "http://localhost:8080/JavaEEPos/order?option=GETALL",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            for (const order of resp.data) {
                let row = `<tr><td>${order.O_ICode}</td><td>${order.O_IName}</td><td>${order.O_IPrice}</td><td>${order.O_IDiscount}</td><td>${order.O_IQty}</td><td>${order.O_ITotal}</td></td></tr>`;
                $("#orderTable").append(row);
            }
            bindOrderClickEvents();
        }
    });
}

function bindOrderClickEvents() {
    $("#orderTable>tr").click(function () {
        //Get values from the selected row
        let o_ICode = $(this).children().eq(0).text();
        let o_IName = $(this).children().eq(1).text();
        let o_IPrice = $(this).children().eq(2).text();
        let o_IDiscount = $(this).children().eq(3).text();
        let o_IQty = $(this).children().eq(4).text();
        let o_ITotal = $(this).children().eq(5).text();

        //Set values to the text-fields
        $("#txtOrderItemCodes").val(o_ICode);
        $("#txtOrderItemSellName").val(o_IName);
        $("#txtItemSellPrice").val(o_IPrice);
        $("#txtItemSellDiscount").val(o_IDiscount);
        $("#txtOrderQuantity").val(o_IQty);
        $("#txtItemSellTotalPrice").val(o_ITotal);

    });
}
loadAllOrderDetail();

$("#buttonAddOrder").click(function () {

    // var orderDetailData=$("#itemOrderForm").serialize();
    // $.ajax({
    //     url: "http://localhost:8080/JavaEEPos/order?orderOption=OrderDetail",
    //     method: "POST",
    //     data:orderDetailData,
    //     success:function (res) {
    //         if (res.status==200){
    //             alert(res.message);
    //             loadAllItems();
    //         }else {
    //             alert(res.data)
    //         }
    //     },
    //     error:function (ob,textStatus,error) {
    //         console.log(ob);
    //         console.log(textStatus);
    //         console.log(error);
    //     }
    // })
    $("#orderTable").empty();

    var data=$("#orderForm").serialize();
    $.ajax({
        url: "http://localhost:8080/JavaEEPos/order?orderOption=POST",
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
    })


})

//
// $("#txtOrderCustomerId").keydown(function (event) {
//     if (event.key=="Enter"){
//         OrderCustomerDetailFromCId();
//
//     }
//
// })
$("#txtOrderItemCodes").click(function () {
orderItemDetailFormICode();
})
function orderItemDetailFormICode() {
    $.ajax({
        url:"http://localhost:8080/JavaEEPos/order?option=SEARCHITEM",
        method:"GET",
        dataType:"data",
        success:function (resp) {
            alert("Item");
            for (const orderItem of resp.data){
                let orderICode=$(orderItem.orderItemCode);
                let orderIName=$(orderItem.orderItemName);
                let orderIQty=$(orderItem.orderQtyOnHand);
                let orderIPrice=$(orderItem.itemSellPrice);
                alert(orderIName+"Item"+orderIQty);
                $("#txtQuantityOnHand").val(orderIName);
                $("#txtOrderCustomer").val(orderIQty);
                $("#txtItemSellPrice").val(orderIPrice);
                $("#txtOrderItemCodes").val(orderICode);



            }
        }
    })
}

function orderCustomerDetailFromCId() {
    $.ajax({
        url:"http://localhost:8080/JavaEEPos/order?option=SEARCHCUSTOMER",
        method:"GET",
        dataType:"data",
        success:function (resp) {
            for (const orderCust of resp.data){
                let orderCustId=$(orderCust.orderCustomerId);
                let orderCustName=$(orderCust.orderCustomerName);
                let orderCustAddress=$(orderCust.orderCustomerAddress);
                let orderCustPhoneNo=$(orderCust.orderCustomerPhoneNo);

                alert(orderCustName+"Cust"+orderCustAddress);
                $("#txtOrderCustomer").val(orderCustName);
                $("#txtOrderCustomerAddress").val(orderCustAddress);



            }
        }
    })

}

// $("#txtOrderQuantity").keydown(function (event) {
// if (event.key=="Enter"){
//     labelFunction();
// }
// })

// $("#lblCash").keydown(function (event) {
// if (event.key=="Enter"){
//     lblCash();
// }
// })

function qtyFunction() {

    let totalQty=parseInt($("#txtOrderQuantity").val());
    parseInt($("#lblTotalQty").val(totalQty));

}
function lblCash() {
    let totalPrice=parseFloat($("#lblTotalPrice").val());
    let cash=parseFloat($("#lblCash").val());
    parseFloat($("#lblBalance").val(cash-totalPrice));
}
$("#txtItemSellTotalPrice").keydown(function (event) {
    if (event.key=="Enter"){
        totalDiscountAndTotalPrice();
    }

})
function totalDiscountAndTotalPrice() {
    let totalDiscount=$("#txtOrderQuantity").val()*$("#txtItemSellDiscount").val();
    let totalPrice=$("#txtOrderQuantity").val()*$("#txtItemSellPrice").val();
    $("#lblTotalDiscount").val(totalDiscount);
    $("#lblSubTotalPrice").val(totalPrice);

    let lblTotal=$("#lblTotalPrice").val();
    let lblDiscount=$("#lblTotalDiscount").val();
    $("#lblTotalPrice").val(totalPrice-totalDiscount);

}
