const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");
const { sendSuccess } = require("../utils/apiResponse.js");

const userPayload = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
});
module.exports.apiCurrentUser = (req, res) => {
    return sendSuccess(res, {
        user: req.user ? userPayload(req.user) : null,
    });
};

module.exports.apiSignup = async(req,res,next)=>{
    try{
        let {username , email, password} = req.body;
        const newUser = new User({email , username});
        const registerUser = await User.register(newUser, password);

        req.login(registerUser, (err) => {
            if(err){
                 return next(err);
            }
            return sendSuccess(res, { user: userPayload(registerUser) }, 201);
        });
    }catch(e){
        throw new ExpressError(400, e.message);
    }
};

module.exports.apiLogin = async(req,res)=>{
       return sendSuccess(res, { user: userPayload(req.user) });
};

module.exports.apiLogout= (req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return next(err)
        }
        return sendSuccess(res, { loggedOut: true });
    })
};
