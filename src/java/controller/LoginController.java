// File: src/main/java/controller/LoginController.java

package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import util.HibernateUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import org.hibernate.Session;
import org.hibernate.Transaction;

@WebServlet("/api/login")
public class LoginController extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();

        try {
            // Read JSON body
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                sb.append(line);
            }
            JsonObject json = gson.fromJson(sb.toString(), JsonObject.class);

            String username = json.get("username").getAsString();
            String password = json.get("password").getAsString(); // You need to add password field to User entity!

            Session s = HibernateUtil.getSessionFactory().openSession();
            Transaction tr = s.beginTransaction();

            // ✅ Find user by username
            User user = (User) s.createQuery("FROM User WHERE userName = :username")
                    .setParameter("username", username)
                    .uniqueResult();

            if (user != null && user.getPassword().equals(password)) { // ⚠️ You must add password field to User!
                JsonObject success = new JsonObject();
                success.addProperty("success", true);
                success.addProperty("userId", user.getId());
                out.print(gson.toJson(success));
            } else {
                JsonObject error = new JsonObject();
                error.addProperty("success", false);
                error.addProperty("message", "Invalid credentials");
                out.print(gson.toJson(error));
            }

            tr.commit();
            s.close();

        } catch (Exception e) {
            e.printStackTrace();
            JsonObject error = new JsonObject();
            error.addProperty("success", false);
            error.addProperty("message", "Server error");
            out.print(gson.toJson(error));
        }
    }
}