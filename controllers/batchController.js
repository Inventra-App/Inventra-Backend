const BatchModel = require('../models/batch')
const { filterRole } = require('../helpers/helpers');


exports.getAllBatches = async(req, res, next)=>{
    try {
         const { id, role } = req.user;
         const supermarketId = await filterRole(id, role);
         const batches = await BatchModel.find({ supermarketId })
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

        const { id: userId, role } = req.user;
        const supermarketId = await filterRole(userId, role);
        const batch = await BatchModel.findOne({ _id: id, supermarketId })

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

        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const batches = await  BatchModel.find({inventoryId: inventoryId, supermarketId })

        if(!batches || batches.length === 0){
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


