import React, { useEffect, useState, useRef } from 'react'
import "./products.css";
import addProductRequest from '../../store/thunk/product/addProductRequest';
import editProductRequest from '../../store/thunk/product/editProductRequest';
import userRequest from '../../store/thunk/user/userRequest';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


function ProductOperation({ productData }) {
    const [formData, setFormData] = useState({
        pname: "",
        picture: "",
        cost: "",
        userName: "",
        userId: ""
    });
    const [userData, setUserData] = useState([]);
    const [user, setUser] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const storeUser = useSelector(store => store.user);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(userRequest({ showAll: true }))
    }, [])
    const getAllNames = (data) => {
        if (data) {
            return data.map((val) => {
                return {
                    name: val.name,
                    id: val._id
                }
            })
        }
    }
    useEffect(() => {
        setUserData(getAllNames(storeUser.data));
    }, [storeUser]);

    //Handle editable data
    useEffect(() => {
        if (typeof productData.id !== "undefined" && productData.id) {
            setFormData(productData);
        }else{
            setFormData({
                pname: "",
                picture: "",
                cost: "",
                userName: "",
                userId: ""
            })
        }
        if (productData.picture) {
            setPreviewUrl(productData.picture)
        } else {
            setPreviewUrl('');
        }
        if (productData.userId) {
            setUser(productData.userId)
        }
    }, [productData])

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return btoa(binary); // Encode binary string to Base64
    }
    //Handle Picture
    const handleFileChange = (event) => {
        setPreviewUrl(null);
        const selectedFile = event.target.files[0];
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }
        // Use FileReader to read the file as an ArrayBuffer
        const reader = new FileReader();
        reader.onload = () => {
            const fileBuffer = reader.result;
            const base64 = arrayBufferToBase64(fileBuffer);

            setFormData((prevFormData) => ({
                ...prevFormData,
                picture: base64
            }));
        };
        reader.readAsArrayBuffer(selectedFile);
        const preview = URL.createObjectURL(selectedFile);
        setPreviewUrl(preview);

    };

    //handle User
    const handleUserChange = (event) => {
        const selectedUser = event.target.value;
        if (selectedUser) {
            setFormData({ ...formData, userId: selectedUser })
        }
        setUser(selectedUser);
    }
    // Handle form submission
    const handleFormSubmit = () => {
        //Dispatch edit product data
        if (typeof formData.id !== 'undefined') {
            dispatch(editProductRequest(formData))
        } else {
            //Dispath new product data
            if (formData.pname && formData.cost && formData.userId) {
                dispatch(addProductRequest(formData));
            } else {
                alert("Please provide all inputs");
            }
        }
        setFormData({
            pname: "",
            cost: "",
            picture: "",
            userId: ""
        })
        setPreviewUrl(null);
        setUser('');
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    return (
        <div className="product-form">
            <div>
                <label className="mx-3" style={{ fontWeight: 700 }}>
                    Product Name
                </label>
                <input
                    className="form-control mx-3"
                    type="string"
                    name="pname"
                    value={formData.pname}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label className="mx-3" style={{ fontWeight: 700 }}>
                    Picture
                </label>
                <input
                    className="form-control mx-3"
                    name="picture"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {previewUrl && (
                    <div style={{ margin: "20px 0", paddingLeft: "10%" }}>
                        <img
                            src={previewUrl.length > 100 ? `data:image/png;base64,${previewUrl}` : previewUrl}
                            alt="Preview"
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "10px" }}
                        />
                    </div>
                )}
            </div>
            <div>
                <label className="mx-3" style={{ fontWeight: 700 }}>
                    Cost
                </label>
                <input
                    className="form-control mx-3"
                    type="number"
                    name="cost"
                    min="1"
                    value={formData.cost}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label className="mx-3" style={{ fontWeight: 700 }}>
                    User
                </label>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={user}
                    label="user"
                    onChange={handleUserChange}
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        Select User
                    </MenuItem>
                    {userData.length > 0 &&
                        userData.map(user => {
                            return (<MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)
                        })}
                </Select>
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

export default ProductOperation