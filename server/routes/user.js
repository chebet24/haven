const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
 const JWT_SECRET_KEY = "2FxXT1NTf2K1Mo4i6AOvtdI";
 const multer = require('multer');

 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Choose the destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Keep the original file name
  }
});
const upload = multer({ storage: storage });
// Route for user registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, addresses } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ name, email, password, phoneNumber, addresses });
    await newUser.save();

    // Generate JWT token
    const token = newUser.getJwtToken();

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = user.getJwtToken();

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get/:_id", async (req, res) => {
  try {
    const id = req.params._id;
    console.log("Received ID:", id);

    // Check if the shop exists
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to log out",
    });
  }
});


router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const tokenParts = token.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }

  const jwtToken = tokenParts[1];

  jwt.verify(jwtToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    console.log('Received token:', token);
    console.log('Decoded user:', decoded);

    // Attach the decoded user information to the request object
    req.user = decoded; // Assign the decoded user object directly to req.user
    next();
  });
};

router.put("/update-user", async (req, res, next) => {
  const { email, password, phoneNumber, name } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return ("User not found", 400);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return ("Please provide the correct information", 400);
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    (error); // Let the error be handled by the default error handler
  }
});
// router.put("/update-avatar", upload.single('avatar'),async (req, res, next) => {
//   try {
//     console.log(req.body.email)
//     // Retrieve the user's email from the token payload
//     const userEmail = req.body.email;

//     // Find the user by email
//     let existsUser = await User.findOne({ email: userEmail });

//     if (!existsUser) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     if (req.body.avatar !== "") {
//       // Handle the avatar update manually
//       // Assuming req.body.avatar contains the base64 encoded image data
//       const avatarData = req.body.avatar;

//       // Update the user's avatar with the base64 data
//       existsUser.avatar = {
//         data: avatarData, // Specify the image content type here
//       };
//     }

//     // Save the updated user object
//     await existsUser.save();

//     res.status(200).json({
//       success: true,
//       user: existsUser,
//     });
//   } catch (error) {
//     console.error(error); // Log the error for debugging purposes
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

router.put("/update-user-password", async (req, res) => {
  try {
    // const userEmail = req.body.email;
    console.log(req.body.email)
    const user = await User.findOne({ email: req.body.email }).select("+password");


    const isPasswordMatched = await user.comparePassword(
      req.body.oldPassword
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect!",
      });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match!",
      });
    }

    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
router.put("/update-address", async (req, res, next) => {
  try {
    const { email, addressData } = req.body; // Destructure email and addressData from req.body
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const sameTypeAddress = user.addresses.find(
      (address) => address.addressType === addressData.addressType
    );
    if (sameTypeAddress) {
      return res.status(400).json({ success: false, message: `${addressData.addressType} address already exists` });
    }

    const existsAddressIndex = user.addresses.findIndex(
      (address) => address._id === addressData._id
    );

    if (existsAddressIndex !== -1) {
      // Update existing address
      user.addresses[existsAddressIndex] = addressData;
    } else {
      // Add the new address to the array
      user.addresses.push(addressData);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

















router.get('/info', verifyToken, async (req, res) => {
  try {
    // Fetch user information based on the decoded user ID
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







router.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



    

// Route to get user profile
router.get("/profile", async (req, res) => {
  try {
    // Ensure authentication before reaching this endpoint
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
