exports.home = async(req,res)=>{
    res.send(req.user)
}
exports.test = (req,res)=>{
    res.send('hello world');
}
