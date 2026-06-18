const BatchModel = require('../models/batch')
const {getPagination} = require('../helpers/pagination')





exports.getAllBatches = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req);

        const totalBatches = await BatchModel.countDocuments();

        const batches = await BatchModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (batches.length === 0) {
            return res.status(404).json({
                message: `No batches found`
            });
        }

        const totalPages = Math.ceil(totalBatches / limit);

        res.status(200).json({
            message: `All batches found successfully`,
            data: batches,
            pagination: {
                currentPage: page,
                perPage: limit,
                totalBatches,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

// before ganination
// exports.getAllBatches = async(req, res, next)=>{
//     try {
//          const batches = await BatchModel.find()
//          console.log(batches)

//          res.status(200).json({
//          message: ` All Batches found successfully`,
//          data: batches
//         })
 

//         } catch (error) {
//         console.log(error)
//         next(error) 
//     }
// }

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


