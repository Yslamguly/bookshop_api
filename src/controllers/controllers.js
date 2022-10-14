exports.home = async(req,res)=>{
    console.log(req.session)
    res.send(req.user)
}
exports.test = (req,res)=>{
    res.send('hello world');
}
