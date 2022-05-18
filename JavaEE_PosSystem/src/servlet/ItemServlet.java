package servlet;

import javax.annotation.Resource;
import javax.json.*;
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

@WebServlet(urlPatterns = "/item")
public class ItemServlet extends HttpServlet {
    @Resource(name = "java:comp/env/jdbc/pool")
    DataSource ds;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Request Received from Item");
        try {
            String option = req.getParameter("option");
            resp.setContentType("application/json");
            Connection connection = ds.getConnection();
            PrintWriter writer = resp.getWriter();

//            resp.addHeader("Access-Control-Allow-Origin", "*");


            switch (option) {
                case "SEARCH":
                    //write the code for customer search

                    break;
                case "GETALL":
                    ResultSet rst = connection.prepareStatement("select * from Item").executeQuery();
                    JsonArrayBuilder arrayBuilder = Json.createArrayBuilder(); // json array
                    while (rst.next()) {
                        String code = rst.getString(1);
                        String name = rst.getString(2);
                        double price = rst.getDouble(3);
                        int qty = rst.getInt(4);

                        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                        objectBuilder.add("I_Code", code);
                        objectBuilder.add("I_Name", name);
                        objectBuilder.add("I_Price", price);
                        objectBuilder.add("I_Qty", qty);
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
        String itemCode = req.getParameter("itemCode");
        String itemName = req.getParameter("itemName");
        String itemPrice = req.getParameter("itemPrice");
        String itemQty = req.getParameter("itemQty");

//        resp.addHeader("Access-Control-Allow-Origin", "*");

        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");

        try {
            Connection connection = ds.getConnection();
            PreparedStatement pstm = connection.prepareStatement("Insert into Item values(?,?,?,?)");
            pstm.setObject(1,itemCode);
            pstm.setObject(2,itemName);
            pstm.setObject(3,itemPrice);
            pstm.setObject(4,itemQty);

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

    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String i_Code = req.getParameter("itemCode");
        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");

//        resp.addHeader("Access-Control-Allow-Origin", "*");

        try {
            Connection connection = ds.getConnection();
            PreparedStatement pstm = connection.prepareStatement("Delete from Item where I_Code=?");
            pstm.setObject(1,i_Code);

            if (pstm.executeUpdate()>0){
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status",200);
                objectBuilder.add("data","");
                objectBuilder.add("message","Successfully Deleted");
                writer.print(objectBuilder.build());

            }else {
                JsonObjectBuilder objectBuilder=Json.createObjectBuilder();
                objectBuilder.add("status",400);
                objectBuilder.add("data","Wrong Id Inserted");
                objectBuilder.add("message","");
                writer.print(objectBuilder.build());
            }
            connection.close();

        } catch (SQLException throwables) {
            resp.setStatus(200);
            JsonObjectBuilder objectBuilder=Json.createObjectBuilder();
            objectBuilder.add("status",500);
            objectBuilder.add("message","Error");
            objectBuilder.add("data",throwables.getLocalizedMessage());
            writer.print(objectBuilder.build());
        }

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JsonReader reader = Json.createReader(req.getReader());
        JsonObject jsonObject = reader.readObject();
        String itemCode = jsonObject.getString("itemCode");
        String itemName = jsonObject.getString("itemName");
        String itemPrice = jsonObject.getString("itemPrice");
        String itemQty = jsonObject.getString("itemQty");
        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");

//        resp.addHeader("Access-Control-Allow-Origin", "*");

        try {
            Connection connection = ds.getConnection();
            PreparedStatement pstm = connection.prepareStatement("Update Item set I_Name=?,I_Price=?,I_Qty=? where I_Code=?");
            pstm.setObject(1,itemName);
            pstm.setObject(2,itemPrice);
            pstm.setObject(3,itemQty);
            pstm.setObject(4,itemCode);

            if (pstm.executeUpdate()>0){
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 200);
                objectBuilder.add("message", "Successfully Updated");
                objectBuilder.add("data", "");
                writer.print(objectBuilder.build());
            }else {
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 400);
                objectBuilder.add("message", "Update Failed");
                objectBuilder.add("data", "");
                writer.print(objectBuilder.build());
            }
            connection.close();

        } catch (SQLException throwables) {
            JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
            objectBuilder.add("status", 500);
            objectBuilder.add("message", "Update Failed");
            objectBuilder.add("data", throwables.getLocalizedMessage());
            writer.print(objectBuilder.build());
        }
    }

//    @Override
//    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        resp.addHeader("Access-Control-Allow-Origin", "*");
//        resp.addHeader("Access-Control-Allow-Methods", "DELETE,PUT");
//        resp.addHeader("Access-Control-Allow-Headers", "Content-Type");
//
//    }
}

