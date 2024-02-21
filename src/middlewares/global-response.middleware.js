const globalResponse=(err,req,res,next)=>{
    if(err){
        console.log(err)
        return res.status(err["cause"]||500).json({
            message:"catch error",
            err_message:err.message
        })
    }
    next()
}
export default globalResponse