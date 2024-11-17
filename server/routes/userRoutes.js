const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const savedUser =await User.findOne({email: email});
  if(savedUser){
      return res.status(422).json({error:"User already exists with this Email"})
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  try {
    await user.save()
    res.json({message:"Registered Successfully"})
  } catch (error){
    console.log(error)
}
});

const Jwt_secret = "kamlesh chandel"
router.post("/login", async (req,res) => {
    const {email, password} = req.body
    if (!email || !password) {
       return  res.status(422).json({error: "Please add both Email and Password"})
    }
    const savedUser = await User.findOne({email:email})
    if (!savedUser) {
        return res.status(422).json({error:"Invalid Email"})
    }
    try {
        const match = await bcrypt.compare(password, savedUser.password)
        if(match){
            const token = jwt.sign({_id:savedUser.id}, Jwt_secret)
            const {_id, name, username, email} = savedUser
            return res.json({token,
                message:"Signed In Successfully", user:{_id,name,username,email}})
        }else{
            return res.status(422).json({error : "Invalid password"})
        }
    } catch (err){
        console.log(err)
    }
})

router.get('/all-customers', async (req,res) => {
    const data = await User.find();
    res.json({data: data});
})
module.exports = router;