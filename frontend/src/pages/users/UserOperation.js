import React, { useEffect, useState } from 'react'
import "./users.css";
import addUserRequest from '../../store/thunk/user/addUserRequest';
import editUserRequest from '../../store/thunk/user/editUserRequest';
import { useDispatch } from 'react-redux';
import moment from 'moment';

function UserOperation({ userData }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        dob: "",
    });
    const dispatch = useDispatch();

    //Handle editable data
    useEffect(() => {
        if (typeof userData.dob !== "undefined" && userData.dob) {
            userData.dob = moment(userData.dob).format("YYYY-MM-DD");
            setFormData(userData);
        } else {
            setFormData({
                name: "",
                email: "",
                dob: "",
            })
        }
    }, [userData])

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "dob") {
            const utcDate = moment(value).format("YYYY-MM-DD");
            setFormData((prev) => ({
                ...prev,
                [name]: utcDate,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle form submission
    const handleFormSubmit = () => {
        //Dispatch edit user data
        if (typeof formData.id !== 'undefined') {
            dispatch(editUserRequest(formData))
        } else {
            //Dispath new user data
            if (formData.name && formData.email && formData.dob) {
                dispatch(addUserRequest(formData));
            } else {
                alert("Please provide all inputs");
            }
        }
        setFormData({
            name: "",
            email: "",
            dob: "",
        })
    };

    return (
        <div className="user-form">
            <div>
                <label className="mx-3" style={{ fontWeight: 700 }}>
                    Name
                </label>
                <input
                    className="form-control mx-3"
                    type="string"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label className="mx-3" style={{ fontWeight: 700 }}>
                    Email
                </label>
                <input
                    className="form-control mx-3"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label className="mx-3" style={{ fontWeight: 700 }}>
                    Date Of Birth
                </label>
                <input
                    className="form-control mx-3"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                />
            </div>
            <button
                className="btn btn-primary"
                onClick={handleFormSubmit}
                style={{ height: "3rem", width: "6rem", marginRight: "10px" }}
            >
                Submit
            </button>
        </div>
    );
}

export default UserOperation