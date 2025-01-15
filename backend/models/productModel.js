const mongoose = require('mongoose');
const AppError = require('../utility/appError');

const productSchema = mongoose.Schema(
    {
        pname:
        {
            type: String,
            unique: true,
            trim: true,
            required: [true, 'Product name is required']
        },
        picture:
        {
            type: Buffer
        },
        cost:
        {
            type: Number,
            required: [true, 'Cost is required'],
            validate: {
                validator: function (value) {
                    return value > 0
                },
                message: props => `${props.value} is invalid amount`
            }
        },
        userid: {
            type: String,
            ref: 'User',
            required: [true, 'Product id is required']
        }
    },
    {
        timestamps: true
    }
);

productSchema.index({ pname: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
const Product = mongoose.model('Product', productSchema);


// Define the aggregation pipeline
const pipeline = (limit, skip, filters = {}) => {
    console.log(filters);
    
    const matchConditions = {};

    // Apply filter for userName
    if (filters.user === "filterUser") {        
        matchConditions["productDetails.name"] = { $regex: filters.searchInput, $options: "i" };
    }
    // Apply filter for pname
    if (filters.user === "filterProduct") {
        console.log("product", filters.searchInput)
        matchConditions["pname"] = { $regex:filters.searchInput, $options: "i" };
    }

    // Apply filter for cost
    if (filters.user === "filterCost") {
        matchConditions["cost"] = { 
            $gte: parseInt(filters.value[0]),
            $lte: parseInt(filters.value[1]) 
        };
    }

    return [
        {
            $addFields: {
                userid: { $toObjectId: "$userid" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "userid",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        {
            $unwind: "$productDetails",
        },
        {
            $match: matchConditions,
        },
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: skip },
                    { $limit: parseInt(limit) },
                    {
                        $project: {
                            _id: 1,
                            pname: 1,
                            picture: 1,
                            cost: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            userName: "$productDetails.name",
                            userId: "$productDetails._id",
                        },
                    },
                ],
            },
        },
    ];
};

// Total count
exports.totalProductCount = async () => {
    return await Product.countDocuments({});
}
// fetch all products from db
exports.allProducts = async (limit = 10, page = 1, filter) => {
    try {
        const offset = (page - 1) * limit;
        return await Product.aggregate(pipeline(limit, offset, filter));
    } catch (error) {
        return new AppError(error, 400);
    }
};

// fetch product from db by using id
exports.getProductById = async (prodId) => {
    try {
        return await Product.findById(prodId);
    } catch (error) {
        return new AppError(error, 400);
    }
};

// add new product to db
exports.addProductToDB = async (pname, picture, cost, userid) => {
    try {
        const productDetails = { pname, picture, cost, userid };
        const addProdResp = await Product.create(productDetails);
        return await Product.findById(addProdResp._id).populate({
            path: 'userid',
            select: 'name',
        });
    } catch (error) {
        return new AppError(error, 400);
    }
};

// edit product in db with id
exports.editProduct = async (id, pname, picture, cost, userid) => {
    try {
        const editData = { pname, picture, cost, userid };
        const editPropResp = await Product.findByIdAndUpdate(id, editData,{ runValidators: true, new: true });
        return await Product.findById(editPropResp._id).populate({
            path: 'userid',
            select: 'name',
        });
    } catch (error) {
        return new AppError(error, 400);
    }
};

// Delete product from db by id
exports.deleteProduct = async (id) => {
    try {
        const delId = { _id: id };
        return await Product.findByIdAndDelete(delId);
    } catch (error) {
        return new AppError(error, 400);
    }
};