package servlet;

//import org.apache.commons.dbcp2.BasicDataSource;

import javax.annotation.Resource;
import javax.json.*;
import javax.servlet.ServletContext;
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

@WebServlet(urlPatterns = "/customer")
public class CustomerServlet extends HttpServlet {
    @Resource(name = "java:comp/env/jdbc/pool")
    DataSource ds;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Request Received from Customer");
        try {
            String option = req.getParameter("option");
            resp.setContentType("application/json");
            Connection connection = ds.getConnection();
            PrintWriter writer = resp.getWriter();

//            resp.addHeader("Access-Control-Allow-Origin", "*");


            switch (option) {
                case "SEARCH":
                    String cid=req.getParameter("txtSearchCustomer");
                    ResultSet rst1 = connection.prepareStatement("SELECT C_Name,C_Address,C_PhoneNo from Customer where C_Id='"+cid+"'").executeQuery();
                    JsonArrayBuilder arrayBuilder1=Json.createArrayBuilder();

                    while (rst1.next()){
                        String CName = rst1.getString(1);
                        String CAddress = rst1.getString(2);
                        String C_PhoneNo = rst1.getString(2);
                        String CId = rst1.getString(3);

                        JsonObjectBuilder objectBuilder=Json.createObjectBuilder();
                        objectBuilder.add("customerName",CName);
                        objectBuilder.add("customerAddress",CAddress);
                        objectBuilder.add("customerPhoneNo",C_PhoneNo);
                        objectBuilder.add("customerId",CId);
                        arrayBuilder1.add(objectBuilder.build());

                    }
                    JsonObjectBuilder response1 = Json.createObjectBuilder();
                    response1.add("status", 200);
                    response1.add("message", "Done");
                    response1.add("data", arrayBuilder1.build());
                    writer.print(response1.build());

                    break;
                case "GETALL":
                    ResultSet rst = connection.prepareStatement("select * from Customer").executeQuery();
                    JsonArrayBuilder arrayBuilder = Json.createArrayBuilder(); // json array
                    while (rst.next()) {
                        String id = rst.getString(1);
                        String name = rst.getString(2);
                        String address = rst.getString(3);
                        String phoneNo = rst.getString(4);

                        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                        objectBuilder.add("C_Id", id);
                        objectBuilder.add("C_Name", name);
                        objectBuilder.add("C_Address", address);
                        objectBuilder.add("C_PhoneNo", phoneNo);
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
        String customerID = req.getParameter("customerId");
        String customerName = req.getParameter("customerName");
        String customerAddress = req.getParameter("customerAddress");
        String customerPhoneNo = req.getParameter("customerPhoneNo");

//        resp.addHeader("Access-Control-Allow-Origin", "*");

        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");

        try {
            Connection connection = ds.getConnection();
            PreparedStatement pstm = connection.prepareStatement("Insert into Customer values(?,?,?,?)");
            pstm.setObject(1, customerID);
            pstm.setObject(2, customerName);
            pstm.setObject(3, customerAddress);
            pstm.setObject(4, customerPhoneNo);

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
        String c_id = req.getParameter("customerId");
        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");

//        resp.addHeader("Access-Control-Allow-Origin", "*");

        try {
            Connection connection = ds.getConnection();
            PreparedStatement pstm = connection.prepareStatement("Delete from Customer where C_Id=?");
            pstm.setObject(1, c_id);

            if (pstm.executeUpdate() > 0) {
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 200);
                objectBuilder.add("data", "");
                objectBuilder.add("message", "Successfully Deleted");
                writer.print(objectBuilder.build());
            } else {
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 400);
                objectBuilder.add("data", "Wrong Id Inserted");
                objectBuilder.add("message", "");
                writer.print(objectBuilder.build());
            }
            connection.close();

        } catch (SQLException throwables) {
            resp.setStatus(200);
            JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
            objectBuilder.add("status", 500);
            objectBuilder.add("message", "Error");
            objectBuilder.add("data", throwables.getLocalizedMessage());
            writer.print(objectBuilder.build());
        }


    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JsonReader reader = Json.createReader(req.getReader());
        JsonObject jsonObject = reader.readObject();
        String customerId = jsonObject.getString("customerId");
        String customerName = jsonObject.getString("customerName");
        String customerAddress = jsonObject.getString("customerAddress");
        String customerPhoneNo = jsonObject.getString("customerPhoneNo");
        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");

//        resp.addHeader("Access-Control-Allow-Origin","*");
//        resp.addHeader("Access-Control-Allow-Origin", "http://localhost:63342");


        try {
            Connection connection = ds.getConnection();
            PreparedStatement pstm = connection.prepareStatement("Update Customer set C_Name=?,C_Address=?,C_PhoneNo=? where C_Id=?");
            pstm.setObject(1, customerName);
            pstm.setObject(2, customerAddress);
            pstm.setObject(3, customerPhoneNo);
            pstm.setObject(4, customerId);
            if (pstm.executeUpdate() > 0) {
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 200);
                objectBuilder.add("message", "Successfully Updated");
                objectBuilder.add("data", "");
                writer.print(objectBuilder.build());
            } else {
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
////        resp.addHeader("Access-Control-Allow-Origin", "http://localhost:63342");
//        resp.addHeader("Access-Control-Allow-Methods", "DELETE,PUT");
//        resp.addHeader("Access-Control-Allow-Headers", "Content-Type");
//    }
}
