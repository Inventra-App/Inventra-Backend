const BatchModel = require('./models/batch');

exports.sellFifoIterative = (quantityToSell, batchList) => {
    let remaining = quantityToSell;
    for (let i = 0; i < batchList.length; i++) {
        if (remaining <= 0) break;
        const batch = batchList[i];
        if (batch.quantityRemaining <= remaining) {
            console.log(`Full consumed: ${batch.batchCode} (${batch.quantityRemaining} units)`);
            remaining -= batch.quantityRemaining;
            batch.quantityRemaining = 0;
        } else {
            console.log(`Partial: ${batch.batchCode} deducted ${remaining} units`);
            batch.quantityRemaining -= remaining;
            remaining = 0;
        }
    }
    if (remaining > 0) console.log(`Short! Need ${remaining} more units.`);
    return batchList;
};


const get = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getBatches = await BatchModel.find({
            supermarketId: id
        })
        .select('quantity', 'quantityRemaining')
        .sort({ createdAt: 1 });
        console.log(getBatches);
        res.json(getBatches);

    } catch (error) {
        console.log(error)
        next(error);
    }
}

module.exports = { get };