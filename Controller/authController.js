const userModel = require("../Schema/user");
// const otpModel = require("../schema/otp");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");



async function register(req, res) {
    const {
        fullName, email, password , role
    } = req.body;

    const emailExists = await userModel.findOne({email});

    if(emailExists) {
        res.status(409).send({
            message: "Email already exist"
        });
        return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await userModel.create({
        fullName, email, password: hashedPassword, role
    });

      res.status(201).send({
        message: "User created successfully!",
        
    });
}


async function login(req, res) {

    const {email, password} = req.body;

    const userDetail = await userModel.findOne({email});
    if(!userDetail) {
        res.status(404).send({
            message: "User not found"
        });
        return;
    }

    const passwordsMatch = bcrypt.compareSync(password, userDetail.password);

    if(!passwordsMatch) {
        res.status(400).send({
            message: "Invalid credentials"
        });
        return;
    }

    const token = jsonWebToken.sign({userId: userDetail.id, email: userDetail.email, role: userDetail.role}, process.env.JWT_KEY);

    res.send({
        message: "Login successful",
        userDetail: {
            fullName: userDetail.fullName,
            email: userDetail.email,
            role: userDetail.role
        },
        token
    });
}

const getProfile = async (req, res) => {
    try {
      const userId = req.user.userId; // ✅ match payload key
  
      const user = await userModel.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        message: 'Profile retrieved successfully',
        profile: user,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  module.exports = getProfile;
  



module.exports = {
    register,
    login,
    getProfile
    
}
