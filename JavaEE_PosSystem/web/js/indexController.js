$("#homeContent").css("display", "block");
$("#customerContent").css("display", "none");
$("#itemContent").css("display", "none");
$("#orderContent").css("display", "none");


$("#linkCustomer").click(function () {
    $("#customerContent").css("display", "block");
    $("#homeContent").css("display", "none");
    $("#itemContent").css("display", "none");
    $("#orderContent").css("display", "none");


});

$("#linkItem").click(function () {
    $("#itemContent").css("display", "block");
    $("#customerContent").css("display", "none");
    $("#homeContent").css("display", "none");
    $("#orderContent").css("display", "none");


});

$("#linkOrder").click(function () {
    $("#orderContent").css("display", "block");
    $("#customerContent").css("display", "none");
    $("#homeContent").css("display", "none");
    $("#itemContent").css("display", "none");


});


$("#linkHome").click(function () {
    $("#homeContent").css("display", "block");
    $("#itemContent").css("display", "none");
    $("#customerContent").css("display", "none");
    $("#orderContent").css("display", "none");

});
