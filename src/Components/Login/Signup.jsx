
import React, { useState, useEffect } from 'react';
import './style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState("");
    const [employId, setEmployId] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [workLocation, setWorkLocation] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [password, setPassword] = useState("");
    const [files, setFiles] = useState('');
    const [errors, setErrors] = useState({
        name: "",
        employId: "",
        mobileNumber: "",
        workLocation: "",
        department: "",
        designation: "",
        password: ""
    });

    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const [locationList, setLocationList] = useState([]);
    const [DesignationD, setDesignationList] = useState([]);
    const [Department, setDepartmentList] = useState([]);

    const [file, setFile] = useState('');





    useEffect(() => {
        const url = localStorage.getItem('url');
        setUrl(url);
        console.log('API URL:', url);

    }, []);

    useEffect(() => {
        getLocationData();
        getDesignationData();
        getDepartmentData();
    }, [url]);




    const getLocationData = async () => {
        try {
            const response = await fetch(`http://srv515471.hstgr.cloud:5000/api/workLocation/work-location-list`, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            console.log('Location Data:', data);
            setLocationList(data.workLocations || []);
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    };

    const getDepartmentData = async (site) => {
        const url = `http://srv515471.hstgr.cloud:5000/api/department/department-list`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            setDepartmentList(data.departmentList);
        } catch (error) {
            console.error('Error fetching department data:', error);
        }
    };

    const getDesignationData = async (site) => {
        const url = `http://srv515471.hstgr.cloud:5000/api/dsignation/designation-list`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            setDesignationList(data.designationList);
        } catch (error) {
            console.error('Error fetching designation data:', error);
        }
    };



    const handleFileUpload = async () => {
        if (!file) {
            toast.error("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append('userId');
        formData.append('user-profile', file, `${file.name}`);

        setLoading(true);

        try {
            const response = await axios.post(
                `${url}/user/upload-user-image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    validateStatus: (status) => true,
                }
            );

            if (response.data) {
                toast.success("Employee registered successfully.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file.");
        } finally {
            setLoading(false);
        }
    }




    const handleFieldChange = (field, value) => {
        const newErrors = { ...errors };
        if (!value) {
            newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
        } else {
            newErrors[field] = "";
        }
        setErrors(newErrors);
    };

    const handleMobileNumberChange = (e) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        if (onlyNums.length <= 10) {
            setMobileNumber(onlyNums);
            setErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                if (onlyNums.length === 0) {
                    updatedErrors.mobileNumber = 'Mobile number is required';
                } else if (onlyNums.length !== 10) {
                    updatedErrors.mobileNumber = 'Mobile number must be 10 digits';
                } else {
                    updatedErrors.mobileNumber = '';
                }
                return updatedErrors;
            });
        }
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setFiles(selectedFile);
    };


    // const handleImageUpload = async (userId) => {
    //     if (!files) {
    //         toast.error("Please select a file.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('userId', userId);
    //     formData.append('user-profile', files, files.name);

    //     try {
    //         setLoading(true);
    //         const response = await axios.post(
    //             `${url}/api/user/upload-user-image`,
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 },
    //             }
    //         );


    //         console.log('File Upload Response:', response);



    //         if (response.status === 200) {
    //             toast.success("Profile image uploaded successfully.");
    //         } else {
    //             toast.error("Failed to upload image.");
    //         }
    //     } catch (error) {
    //         console.error("Error uploading file:", error);
    //         toast.error("Error uploading file.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleImageUpload = async (userId) => {
        if (!files) {
            toast.error("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('user-profile', files, files.name);

        console.log('Uploading File with User ID:', userId);
        console.log('Form Data:', formData.get('userId'), formData.get('user-profile'));

        try {
            setLoading(true);
            const response = await axios.post(
                `${url}/api/user/upload-user-image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    validateStatus: (status) => true,
                }
            );

            console.log('Image Upload:', response.data);

            if (response.status === 200) {
                toast.success("Profile image uploaded successfully.");
            } else {
                toast.error("Failed to upload image.");
            }
        } catch (error) {
            console.error("Error uploading file:", error.response || error.message);
            toast.error("Error uploading file.");
        } finally {
            setLoading(false);
        }
    };



    const validateForm = () => {
        const newErrors = {};

        if (!name) newErrors.name = "User Name is required";
        if (!employId) newErrors.employId = "Employ Id is required";
        if (!mobileNumber) newErrors.mobileNumber = "Mobile Number is required";
        if (!workLocation) newErrors.workLocation = "Company Name is required";
        if (!department) newErrors.department = "Department is required";
        if (!designation) newErrors.designation = "Designation is required";
        if (!password) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const formData = {
                userName: name,
                employeeId: employId,
                mobileNumber: mobileNumber,
                workLocation: workLocation,
                department: department,
                designation: designation,
                password: password
            };

            console.log('All  Data:', formData);
            try {
                setLoading(true);
                const response = await fetch(`${url}/api/user/create-account`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                setLoading(false);

                if (response.ok) {
                    setName('')
                    setEmployId('');
                    setMobileNumber('');
                    setWorkLocation('');
                    setDepartment('');
                    setDesignation('');
                    setPassword('');

                    toast.success("Account created successfully!", { autoClose: 5000 });
                    navigate('/home');


                    console.log("fgdfgdfg", response.data.personID);



                } else {
                    toast.error("Failed to create account. Please try again.", { autoClose: 5000 });
                }
            } catch (error) {
                setLoading(false);
                toast.error("An error occurred. Please try again later.", { autoClose: 5000 });
            }
        } else {
            toast.error("Please fix the errors in the form.", { autoClose: 5000 });
        }
    };



    const inputStyle = {
        borderColor: 'black',
        borderWidth: '1px',
        borderRadius: '5px',
        boxShadow: 'none',
    };

    const inputStyles = {
        borderColor: 'red',
        borderWidth: '1px',
        borderRadius: '5px',
    };

    return (
        <div className="form-SignUP form-SignUP-card py-5">
            {loading && <Loader />}
            <form onSubmit={handleOnSubmit}>
                <h1>Create Account</h1>
                <label htmlFor="">User Name</label>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="User Name"
                    style={errors.name ? inputStyles : inputStyle}
                />
                {errors.name && <div style={{ fontSize: "13px" }} className="text-danger">{errors.name}</div>}
                <label htmlFor="">Employee Id</label>
                <input
                    type="text"
                    name="employId"
                    value={employId}
                    onChange={(e) => setEmployId(e.target.value)}
                    placeholder="Employ Id"
                    style={errors.employId ? inputStyles : inputStyle}
                />
                {errors.employId && <div style={{ fontSize: "13px" }} className="text-danger">{errors.employId}</div>}
                <label htmlFor="">Mobile Number</label>
                <input
                    type="text"
                    name="mobileNumber"
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                    placeholder="Mobile Number"
                    style={errors.mobileNumber ? inputStyles : inputStyle}
                />
                {errors.mobileNumber && <div style={{ fontSize: "13px" }} className="text-danger">{errors.mobileNumber}</div>}
                <label htmlFor="">Work Location</label>
                <select
                    name="workLocation"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    style={errors.workLocation ? inputStyles : inputStyle}
                >
                    <option value="">Select Work Location</option>
                    {locationList.map((location, index) => (
                        <option key={index} value={location.workLocationName}>
                            {location.workLocationName}
                        </option>
                    ))}
                </select>
                {errors.workLocation && <div style={{ fontSize: "13px" }} className="text-danger">{errors.workLocation}</div>}
                <label htmlFor="">Department</label>
                <select
                    name="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={errors.department ? inputStyles : inputStyle}
                >
                    <option value="">Select Department</option>
                    {Department.map((dept, index) => (
                        <option key={index} value={dept.DepartmentName}>
                            {dept.DepartmentName}
                        </option>
                    ))}
                </select>
                {errors.department && <div style={{ fontSize: "13px" }} className="text-danger">{errors.department}</div>}
                <label htmlFor="">Designation</label>
                <select
                    name="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    style={errors.designation ? inputStyles : inputStyle}
                >
                    <option value="">Select Designation</option>
                    {DesignationD.map((desig, index) => (
                        <option key={index} value={desig.DesignationName}>
                            {desig.DesignationName}
                        </option>
                    ))}
                </select>
                {errors.designation && <div style={{ fontSize: "13px" }} className="text-danger">{errors.designation}</div>}

                <label htmlFor="">Password</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={errors.password ? inputStyles : inputStyle}
                />
                {errors.password && <div style={{ fontSize: "13px" }} className="text-danger">{errors.password}</div>}
                <label htmlFor="">Upload Image</label>
                <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                    style={{ border: '1px solid #ced4da', borderRadius: '.25rem', padding: '.375rem .75rem' }}
                />

                <button type="submit" className="Signup-btn">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
