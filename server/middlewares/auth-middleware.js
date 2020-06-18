const jwt=require('jsonwebtoken')
function auth (req,res,next){

const token=req.header('x-auth-token')
if(!token) return res.status(401).send("No provided Token")

try{
const decoded=jwt.verify(token,process.env.jwtsecret)
req.user=decoded
next()
}
catch(ex){
return res.status(400).send("Invalid Token")
}

}

module.exports=auth