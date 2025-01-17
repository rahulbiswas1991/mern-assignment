const mongoose = require('mongoose');
const AppError = require('../utility/appError');


const userSchema = mongoose.Schema(
    {
        name:
        {
            type: String,
            required: [true, 'User name is required']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        },
        dob:
        {
            type: Date,
            required: [true, 'Date of birth is required'],
            validate: {
                validator: function (value) {
                    return value <= new Date();
                },
                message: 'Date of birth cannot be in the future.',
            }
        }
    }
);
// attach collection with schema using mongoose
const User = mongoose.model('User', userSchema);

// fetch row counts
exports.totalCount = async () => {
    return await User.countDocuments({});
}

// fetch all users from db
exports.allUsers = async (limit = 10, page = 1, showAll = false) => {
    try {
        const offset = (page - 1) * limit;
        if(!showAll){
            return await User.find()
            .skip(offset)
            .limit(parseInt(limit));
        }else{
            return await User.find();
        }
    } catch (error) {
        return new AppError(error, 400);
    }
};

// fetch user from db by using id
exports.getUserById = async (prodId) => {
    try {
        return await User.findById(prodId);
    } catch (error) {
        return new AppError(error, 400);
    }
};

// add new user to db
exports.addUser = async (name, email, dob) => {
    try {
        const userDetails = { name, email, dob };        
        return await User.create(userDetails);
    } catch (error) {
        return new AppError(error, 400);
    }
};

// edit user in db with  id
exports.editUser = async (id, name, email, dob) => {
    try {
        const editData = { name, email, dob };
        return await User.findByIdAndUpdate(id, editData, { runValidators: true, new: true });
    } catch (error) {
        return new AppError(error, 400);
    }
};

// Delete user from db by id
exports.deleteUser = async (id) => {
    try {
        const delId = { _id: id };
        console.log('delId',delId);
        
        return await User.findByIdAndDelete(delId);
    } catch (error) {
        return new AppError(error, 400);
    }
};