const BatchModel = require('../models/batch')


exports.getAllBatches = async(req, res, next)=>{
    try {
         const batches = await BatchModel.find()
         console.log(batches)

         res.status(200).json({
         message: ` All Batches found successfully`,
         data: batches
        })
 

        } catch (error) {
        console.log(error)
        next(error) 
    }
}

exports.getOneBatch = async(req,res,next)=>{
    try {
        const {id} = req.params;

        const batch =await  BatchModel.findById(id)

   if(!batch){
      return res.status(404).json({
      message:`batch not found!`
     
      })  
    }

    res.status(200).json({
        message:`Batch found successfully`,
        data:batch
    })

    } catch (error) {
        console.log(error)
        next(error)
    }

}

exports.getAllBatchesByInventoryItem = async(req , res ,next)=>{
    try {
        const { inventoryId } = req.params;
        console.log( inventoryId )

        const batches = await  BatchModel.find({inventoryId: inventoryId})

        if(!batches){
            return res.status(404).json({
                message:`batch not found!`
            })  
        }

        res.status(200).json({
            message:`batches found successfully`,
            data: batches
        })

    } catch (error) {
        console.log(error)
        next(error)
    }

}


