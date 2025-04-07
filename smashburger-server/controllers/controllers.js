const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const ProductCategory = require('../models/productCategory');
const Product = require('../models/product');
const ProductVariant = require('../models/productVariant');
const OrderItem = require('../models/order_item');
const Order = require('../models/order');
const io = require('../socket')

exports.postUser = async (req, res, next) => {
  try {
      const { email, password, passwordConfirmation } = req.body;
      /* if (!email || !password || !passwordConfirmation) {
          return res.status(400).json({ message: "All fields are required." });
      } */

      if (password !== passwordConfirmation) {
          return res.status(400).json({ message: "Passwords do not match." });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
          return res.status(400).json({ message: "User with this email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
          email: email,
          password: hashedPassword,
      });

      return res.status(201).json({ message: "User created successfully. Please log in.", user });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred.", error });
  }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(401).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true, // Prevents XSS attacks
            secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
            sameSite: "strict", // Prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });        

        res.json({ message: "Logged in successfully", user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.logoutUser = async (req, res, next) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};

exports.authCheck = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      res.json({user: decoded});
      next();
    });
  };

  exports.isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    else{
        res.json({ message: "Welcome Admin!" });
        next();
    }
  };

  exports.authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Get token from cookies
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const user = await User.findByPk(decoded.id); // Find user in DB
        
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user to request
        next(); // Move to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error });
    }
};
 
exports.getProducts = async (req, res) => {
    try{

        const products = await Product.findAll({
            include: [{model: ProductVariant, as: "size"},{model: ProductCategory, as: "category"}],
            // include: [{model: ProductCategory}],
        });
        
        res.json(products);
    }
    catch(err){
        console.error("Error fetching burgers:", err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.placeOrder = async (req, res) => {

    try {
        const User = req.user; // User ID from the authenticated request
        const { cart } = req.body; // Cart items from frontend
        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty." });
        }

        let totalAmount = 0;
        
        // Calculate total price
        for (const item of cart) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
            }
            totalAmount += (parseFloat(item.price) * parseInt(item.quantity));
            console.log("Product Price:", product.price, typeof product.price);
            console.log("Item Quantity:", item.quantity, typeof item.quantity);       
        }

        // Create order and associated order items in a single transaction
        const order = await User.createOrder({
            totalAmount,
            status: "pending",
            OrderItems: cart.map(item => ({
                productId: item.productId,
                variantId: item.variantId,
                smashburgerPanId: item.pan,
                quantity: item.quantity,
                price: item.price,
            })),
        }, {
            include: [OrderItem] // Include associated order items
        });
        console.log('Emitting new order:', order);
        io.getIO().emit('orders', { action: 'create', order: order});
        
        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ["email"], // ✅ Fetch only email
                },
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            as: "product", // ✅ Fetch main product
                            attributes: ["id", "name", "price"],
                        },
                        {
                            model: ProductVariant,  // ✅ Fetch product variant
                            as: "variant",
                            attributes: ["id", "size", "price"], // Only necessary fields
                        }
                    ]
                }

            ]
        });

        io.getIO().emit("orders", { action: "create",  order: orders});


        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getOrderHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { userId },  
            include: [{ model: OrderItem,
                include: [
                    {
                        model: Product,
                        as: "product", // ✅ Fetch main product
                        attributes: ["id", "name", "price"],
                    },
                    {
                        model: ProductVariant,  // ✅ Fetch product variant
                        as: "variant",
                        attributes: ["id", "size", "price"], // Only necessary fields
                    }
                ] }],
        });

        res.status(200).json(orders);
    } catch(error){
        console.error("Error getting order history:", error);
        res.status(500).json({ message: "Order history error", error });
    }
};

exports.changeOrderStatus = async (req, res) => {
    const { id, preparationTime } = req.body;
    try {
        await Order.update(
            { 
                status: "preparation", 
                preparationTime: preparationTime, 
                startTime: new Date()
            }, 
            { where: { id } }
        );

        io.getIO().emit("orderUpdated", { id, status: "preparation" });
        
    } catch (error) {
        console.error("Error changing order status:", error);
        res.status(500).json({ message: "Error changing order status", error });
    }
};

exports.changeOrderStatusToDelivering = async (req, res) => {
    const { id } = req.body;
    try {
        await Order.update(
            { 
                status: "delivering", 
            }, 
            { where: { id } }
        );

        io.getIO().emit("orderUpdatedToDeliveing", { id, status: "delivering" });
        
    } catch (error) {
        console.error("Error changing order status:", error);
        res.status(500).json({ message: "Error changing order status", error });
    }
};

exports.changeOrderStatusToCanceled = async (req, res, next) => {
    const { id } = req.body;
    try {
        await Order.update(
            { 
                status: "canceled", 
            }, 
            { where: { id } }
        );
        

        io.getIO().emit("orderUpdatedToCanceled", { id, status: "canceled" });

        res.status(200).json({ message: "Order canceled successfully", id });
        
    } catch (error) {
        console.error("Error changing order status:", error);
        res.status(500).json({ message: "Error changing order status", error });
    }
}

exports.saveUserInfo = async (req, res) => {
    try {
        const token = req.cookies.token;
        const { adress, number, floor, phone, note } = req.body.formData;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const user = await User.findByPk(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        await user.update(
            { 
                adress: adress,        
                adressNumber: number,
                floor: floor,
                phoneNumber: phone,
                note: note

            }, 
        );
        return res.status(200).json({ message: "Profile updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Can not submit the data", error });
    }
}

exports.getUserInfo = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return user data (excluding sensitive information like password)
      const userData = {
        adress: user.adress,
        number: user.adressNumber, 
        floor: user.floor,
        phone: user.phoneNumber,  
        note: user.note
      };
  
      res.status(200).json(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}



