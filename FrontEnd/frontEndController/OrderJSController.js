//Order

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


$("#txtOrderCustomerId").keydown(function (event) {
    if (event.key=="Enter"){
        OrderCustomerDetailFromCId();
        alert("hello");
    }

})

function OrderCustomerDetailFromCId() {
    $.ajax({
        url:"http://localhost:8080/JavaEEPos/order?option=SEARCHCUSTOMER",
        method:"GET",
        // dataType:"Json",
        success:function (resp) {
            for (const orderCust of resp.data){
                let orderCustName=$(this.orderCustomerName);
                let orderCustAddress=$(this.orderCustomerAddress);
                $("#txtOrderCustomer").val(orderCustName);
                $("#txtOrderCustomerAddress").val(orderCustAddress);
            }
        }
    })
}

