package servlet;

import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(urlPatterns = "/order")
public class OrderServlet extends HttpServlet {
    @Resource(name = "java:comp/env/jdbc/pool")
    DataSource ds;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            String option = req.getParameter("option");
            resp.setContentType("application/json");
            Connection connection = ds.getConnection();
            PrintWriter writer = resp.getWriter();

//            resp.addHeader("Access-Control-Allow-Origin", "*");

            switch (option){
                case "SEARCHITEM":
                    String code= req.getParameter("orderItemCode");
                    ResultSet rst2 = connection.prepareStatement("SELECT * from Item where I_Code='"+code+"'").executeQuery();
                    JsonArrayBuilder arrayBuilder2=Json.createArrayBuilder();

                    while (rst2.next()){
                        String oIName = rst2.getString(1);
                        String oIQty = rst2.getString(2);
                        String oIPrice = rst2.getString(3);
                        String oICode = rst2.getString(4);

                        JsonObjectBuilder objectBuilder=Json.createObjectBuilder();
                        objectBuilder.add("orderItemName",oIName);
                        objectBuilder.add("orderQtyOnHand",oIQty);
                        objectBuilder.add("itemSellPrice",oIPrice);
                        objectBuilder.add("orderItemCode",oICode);
                        arrayBuilder2.add(objectBuilder.build());

                    }
                    JsonObjectBuilder response2 = Json.createObjectBuilder();
                    response2.add("status", 200);
                    response2.add("message", "Done");
                    response2.add("data", arrayBuilder2.build());
                    writer.print(response2.build());

                    break;
                case "SEARCHCUSTOMER":
                    String id= req.getParameter("orderCustomerId");
                    ResultSet rst1 = connection.prepareStatement("SELECT * from Customer where C_Id='"+id+"'").executeQuery();
                    JsonArrayBuilder arrayBuilder1=Json.createArrayBuilder();

                    while (rst1.next()){
                        String oCName = rst1.getString(1);
                        String oCAddress = rst1.getString(2);
                        String oCPhoneNo = rst1.getString(3);
                        String oCId = rst1.getString(4);

                        JsonObjectBuilder objectBuilder=Json.createObjectBuilder();
                        objectBuilder.add("orderCustomerName",oCName);
                        objectBuilder.add("orderCustomerAddress",oCAddress);
                        objectBuilder.add("orderCustomerPhoneNo",oCPhoneNo);
                        objectBuilder.add("orderCustomerId",oCId);
                        arrayBuilder1.add(objectBuilder.build());

                    }
                    JsonObjectBuilder response1 = Json.createObjectBuilder();
                    response1.add("status", 200);
                    response1.add("message", "Done");
                    response1.add("data", arrayBuilder1.build());
                    writer.print(response1.build());

                    break;
                case "GETALL":
                    ResultSet rst = connection.prepareStatement(" select I_Code,Id_Name,od_Price,od_Discount,od_qty,od_TotalPrice from OrderDetail od LEFT JOIN `Order` o ON od.I_Code=o.O_Id").executeQuery();
                    JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
                    while (rst.next()){
                        String iCode = rst.getString(1);
                        String iName = rst.getString(2);
                        String iPrice = rst.getString(3);
                        String iDiscount = rst.getString(4);
                        String iQty = rst.getString(5);
                        String iTotal = rst.getString(6);

                        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                        objectBuilder.add("O_ICode",iCode);
                        objectBuilder.add("O_IName",iName);
                        objectBuilder.add("O_IPrice",iPrice);
                        objectBuilder.add("O_IDiscount",iDiscount);
                        objectBuilder.add("O_IQty",iQty);
                        objectBuilder.add("O_ITotal",iTotal);
                        arrayBuilder.add(objectBuilder.build());
                    }
                    JsonObjectBuilder response = Json.createObjectBuilder();
                    response.add("status", 200);
                    response.add("message", "Done");
                    response.add("data", arrayBuilder.build());
                    writer.print(response.build());
                    break;
            }
            connection.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            String orderOption = req.getParameter("orderOption");
            resp.setContentType("application/json");
            Connection connection = ds.getConnection();
            PrintWriter writer = resp.getWriter();

//            resp.addHeader("Access-Control-Allow-Origin", "*");

            switch (orderOption) {
                case "POST":

                    String orderId = req.getParameter("orderId");
                    String orderDate = req.getParameter("orderDate");
                    String orderCustomerName = req.getParameter("orderCustomerName");
                    String orderCustomerId = req.getParameter("orderCustomerId");
                    String orderCustomerAddress = req.getParameter("orderCustomerAddress");

                    String itemCode = req.getParameter("orderItemCode");
                    String orderItemName = req.getParameter("orderItemName");
                    String orderQty = req.getParameter("orderQty");
                    String orderQtyOnHand = req.getParameter("orderQtyOnHand");


                    resp.setContentType("application/json");

                    try {

                        PreparedStatement pstm = connection.prepareStatement("Insert into `Order` values(?,?,?,?)");
                        pstm.setObject(1,orderId);
                        pstm.setObject(2,orderCustomerId);
                        pstm.setObject(3,orderDate);
                        pstm.setObject(4,orderQty);

                        if (pstm.executeUpdate()>0){
                            JsonObjectBuilder response = Json.createObjectBuilder();
                            resp.setStatus(HttpServletResponse.SC_CREATED);//201
                            response.add("status", 200);
                            response.add("message", "Successfully Added");
                            response.add("data", "");
                            writer.print(response.build());
                        }
                        connection.close();

                    } catch (SQLException throwables) {
                        JsonObjectBuilder response = Json.createObjectBuilder();
                        response.add("status", 400);
                        response.add("message", "Error");
                        response.add("data", throwables.getLocalizedMessage());
                        writer.print(response.build());
                        resp.setStatus(HttpServletResponse.SC_OK); //200
                        throwables.printStackTrace();
                    }
                    break;
                case "OrderDetail":
                    String odOItemCode = req.getParameter("orderItemCode");
                    String odOrderItemName = req.getParameter("orderItemName");
                    String odItemSellPrice = req.getParameter("itemSellPrice");
                    String odItemSellDiscount = req.getParameter("itemSellDiscount");
                    String odOrderQty = req.getParameter("orderQty");
                    String odIemSellTotalPrice = req.getParameter("itemSellTotalPrice");

                    resp.setContentType("application/json");

                    try {

                        PreparedStatement pstm = connection.prepareStatement("Insert into OrderDetail values(?,?,?,?,?,?)");
                        pstm.setObject(1,odOItemCode);
                        pstm.setObject(2,odOrderItemName);
                        pstm.setObject(3,odItemSellPrice);
                        pstm.setObject(4,odItemSellDiscount);
                        pstm.setObject(5,odOrderQty);
                        pstm.setObject(6,odIemSellTotalPrice);

                        if (pstm.executeUpdate()>0){
                            JsonObjectBuilder response = Json.createObjectBuilder();
                            resp.setStatus(HttpServletResponse.SC_CREATED);//201
                            response.add("status", 200);
                            response.add("message", "Successfully Added");
                            response.add("data", "");
                            writer.print(response.build());
                        }
                        connection.close();

                    } catch (SQLException throwables) {
                        JsonObjectBuilder response = Json.createObjectBuilder();
                        response.add("status", 400);
                        response.add("message", "Error");
                        response.add("data", throwables.getLocalizedMessage());
                        writer.print(response.build());
                        resp.setStatus(HttpServletResponse.SC_OK); //200
                        throwables.printStackTrace();
                    }
                    break;

            }

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }



     /*


        
        String orderId = req.getParameter("orderId");
        String orderDate = req.getParameter("orderDate");
        String orderCustomerName = req.getParameter("orderCustomerName");
        String orderCustomerId = req.getParameter("orderCustomerId");
        String orderCustomerAddress = req.getParameter("orderCustomerAddress");

        String itemCode = req.getParameter("orderItemCode");
        String orderItemName = req.getParameter("orderItemName");
        String orderQty = req.getParameter("orderQty");
        String orderQtyOnHand = req.getParameter("orderQtyOnHand");


        resp.addHeader("Access-Control-Allow-Origin", "*");

        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");

        try {
            Connection connection = ds.getConnection();
            PreparedStatement pstm = connection.prepareStatement("Insert into `Order` values(?,?,?,?)");
            pstm.setObject(1,orderId);
            pstm.setObject(2,orderCustomerId);
            pstm.setObject(3,orderDate);
            pstm.setObject(4,orderQty);

            if (pstm.executeUpdate()>0){
                JsonObjectBuilder response = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_CREATED);//201
                response.add("status", 200);
                response.add("message", "Successfully Added");
                response.add("data", "");
                writer.print(response.build());
            }
            connection.close();

        } catch (SQLException throwables) {
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status", 400);
            response.add("message", "Error");
            response.add("data", throwables.getLocalizedMessage());
            writer.print(response.build());
            resp.setStatus(HttpServletResponse.SC_OK); //200
            throwables.printStackTrace();
        }*/


    }

//    @Override
//    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        resp.addHeader("Access-Control-Allow-Origin", "*");
////        resp.addHeader("Access-Control-Allow-Origin", "http://localhost:63342");
//        resp.addHeader("Access-Control-Allow-Methods", "POST,PUT");
//        resp.addHeader("Access-Control-Allow-Headers", "Content-Type");
//    }
}
