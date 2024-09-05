import React, { useState, useEffect, useContext, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../ContextAPI';
import Loader from '../Loader/Loader';
import axios from 'axios';

const Gard = () => {
    const { token, setToken } = useContext(AppContext);
    const [vehicalNumber, setVehicalNumber] = useState('');
    const [vehicalType, setVehicalType] = useState('');
    const [partyName, setPartyName] = useState('');
    const [vehicalIN, setVehicalIN] = useState('');
    const [location, setLocation] = useState('');
    const [vehicalCancle, setVehicalCancle] = useState('');
    const [vehicalTransfer, setVehicalTransfer] = useState('');
    const [error, setError] = useState('');
    const [personID, setPersonID] = useState('');
    const navigate = useNavigate();
    const [fieldErrors, setFieldErrors] = useState({});
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const locationState = useLocation();
    const { GaurdId } = locationState.state || {};
    const [FormData, setFormData] = useState([]);


    const [images, setImages] = useState('')
    const [image, setImage] = useState(undefined);
    const [fileName, setFileName] = useState('');


    const fileInputRef = useRef(null);


    useEffect(() => {
        const token = localStorage.getItem("token");
        const personID = localStorage.getItem("CurrentUser");
        const url = localStorage.getItem('url');
        setUrl(url);

        if (personID) {
            setPersonID(personID);
        }
        if (token) {
            setToken(token);
        }
    }, [setToken]);

    useEffect(() => {
        if (GaurdId) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const url = localStorage.getItem('url');
                    const response = await axios.post(
                        `${url}/Maintenance/MachineListById`,
                        { GaurdId }
                    );

                    const machineData = response.data.data[0];
                    setFormData(machineData);
                    setVehicalNumber(machineData.VehicalNumber || '');
                    setVehicalType(machineData.VehicalType || '');
                    setPartyName(machineData.PartyName || '');
                    setVehicalIN(machineData.VehicalIN || '');
                    setLocation(machineData.Location || '');
                    setVehicalCancle(machineData.VehicalCancle || '');
                    setVehicalTransfer(machineData.VehicalTransfer || '');
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching machine data:', error);
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [GaurdId]);

    const addNewVehicle = async (vehicleData) => {
        try {
            setLoading(true);
            const res = await fetch(`${url}/Maintenance/AddVehicle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData),
            });
            let response = await res.json();
            if (res.ok) {
                setLoading(false);
                setVehicalNumber('');
                setVehicalType('');
                setPartyName('');
                setVehicalIN('');
                setLocation('');
                setVehicalCancle('');
                setVehicalTransfer('');
                setPersonID('');
                setError('');
                notifySuccess();
                setTimeout(() => {
                    navigate('/dashboard'); // Navigate to dashboard
                }, 1000);
            } else {
                setLoading(false);
                notifyError('Something went wrong');
            }
        } catch (error) {
            setLoading(false);
            notifyError('Failed to add new vehicle: ' + error.message);
        }
    };

    const notifySuccess = () => toast.success(GaurdId ? "Vehicle updated successfully!" : "Vehicle added successfully!", { autoClose: 5000 });
    const notifyError = (message) => toast.error(message, { autoClose: 5000 });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!personID) {
            setError('Already Exist');
            return;
        }
        const newFieldErrors = {};
        if (!vehicalNumber) newFieldErrors.vehicalNumber = 'Vehicle number is required';
        if (!vehicalType) newFieldErrors.vehicalType = 'Vehicle type is required';
        if (!partyName) newFieldErrors.partyName = 'Party name is required';
        if (!vehicalIN) newFieldErrors.vehicalIN = 'Vehicle IN is required';
        if (!location) newFieldErrors.location = 'Location is required';
        if (!vehicalCancle) newFieldErrors.vehicalCancle = 'Vehicle cancel is required';
        if (!vehicalTransfer) newFieldErrors.vehicalTransfer = 'Vehicle transfer is required';

        setFieldErrors(newFieldErrors);

        if (Object.keys(newFieldErrors).length === 0) {
            const vehicleData = {
                GaurdId: GaurdId ? GaurdId : "",
                VehicalNumber: vehicalNumber,
                VehicalType: vehicalType,
                PartyName: partyName,
                VehicalIN: vehicalIN,
                Location: location,
                VehicalCancle: vehicalCancle,
                VehicalTransfer: vehicalTransfer,
                CurrentUser: personID,
                Status: 'Active',
            };
            addNewVehicle(vehicleData);
        }
    };

    const handleFieldChange = (field, value) => {
        const newFieldErrors = { ...fieldErrors };
        if (!value) {
            newFieldErrors[field] = `${field.replace('vehical', '').replace(/([A-Z])/g, ' $1')} is required`;
        } else {
            delete newFieldErrors[field];
        }
        setFieldErrors(newFieldErrors);
        setError('');
    };

    const handleBack = () => {
        navigate('/vehiclelist');
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


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file)
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setImages(fileURL);  // Update the image state with the file URL
            // Update the fileName state if needed
        }



        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setFieldErrors((prev) => ({
                    ...prev,
                    fileInputRef: 'Only image files are allowed',
                }));
            } else {
                setFieldErrors((prev) => ({
                    ...prev,
                    fileInputRef: null,
                }));
                setFileName(file.name);

            }
        }
    };








    return (
        <Container style={{ marginTop: "3%", width: "100%", maxWidth: "1200px", padding: "0 20px", boxSizing: "border-box" }} className="fullPage">
            <div className="form-detail" style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
                {loading && (
                    <div className="loader-overlay">
                        <Loader type="ThreeDots" color="#006bff" height={80} width={80} />
                    </div>
                )}
                <div className={`form-content ${loading ? 'blurred' : ''}`}>
                    <h2 className="text-center" style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '24px', marginBottom: '20px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' }}>
                        {GaurdId ? "Edit Vehicle" : "Gaurd Form"}
                    </h2>

                    <Form onSubmit={handleSubmit}>
                        <Row className="subCard1">
                            <Col md={4} className="py-2 form-group">
                                <Form.Label>Vehicle Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="input-text"
                                    name="VehicalNumber"
                                    value={vehicalNumber}
                                    onChange={(e) => {
                                        setVehicalNumber(e.target.value);
                                        handleFieldChange('vehicalNumber', e.target.value);
                                    }}
                                    placeholder="Enter Vehicle Number"
                                    style={!fieldErrors.vehicalNumber ? inputStyle : inputStyles}
                                />
                                {fieldErrors.vehicalNumber && <div style={{ fontSize: "13px" }} className="text-danger">{fieldErrors.vehicalNumber}</div>}
                            </Col>

                            <Col md={4} className="py-2 form-group">
                                <Form.Label>Vehicle Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="input-text"
                                    value={vehicalType}
                                    onChange={(e) => {
                                        setVehicalType(e.target.value);
                                        handleFieldChange('vehicalType', e.target.value);
                                    }}
                                    placeholder="Enter Vehicle Type"
                                    style={!fieldErrors.vehicalType ? inputStyle : inputStyles}
                                />
                                {fieldErrors.vehicalType && <div style={{ fontSize: "13px" }} className="text-danger">{fieldErrors.vehicalType}</div>}
                            </Col>

                            <Col md={4} className="py-2 form-group">
                                <Form.Label>Party Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="input-text"
                                    value={partyName}
                                    onChange={(e) => {
                                        setPartyName(e.target.value);
                                        handleFieldChange('partyName', e.target.value);
                                    }}
                                    placeholder="Enter Party Name"
                                    style={!fieldErrors.partyName ? inputStyle : inputStyles}
                                />
                                {fieldErrors.partyName && <div style={{ fontSize: "13px" }} className="text-danger">{fieldErrors.partyName}</div>}
                            </Col>

                            <Col md={4} className="py-2 form-group">
                                <Form.Label>Driver Mobile Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    className="input-text"
                                    value={vehicalIN}
                                    onChange={(e) => {
                                        setVehicalIN(e.target.value);
                                        handleFieldChange('vehicalIN', e.target.value);
                                    }}
                                    placeholder="Enter Vehicle IN"
                                    style={!fieldErrors.vehicalIN ? inputStyle : inputStyles}
                                />
                                {fieldErrors.vehicalIN && <div style={{ fontSize: "13px" }} className="text-danger">{fieldErrors.vehicalIN}</div>}
                            </Col>

                            <Col md={4} className="py-2 form-group">
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="input-text"
                                    value={location}
                                    onChange={(e) => {
                                        setLocation(e.target.value);
                                        handleFieldChange('location', e.target.value);
                                    }}
                                    placeholder="Enter Location"
                                    style={!fieldErrors.location ? inputStyle : inputStyles}
                                />
                                {fieldErrors.location && <div style={{ fontSize: "13px" }} className="text-danger">{fieldErrors.location}</div>}
                            </Col>

                            <Col md={4} className="py-2 form-group">
                                <Form.Label>Vehicle Cancel</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="input-text"
                                    value={vehicalCancle}
                                    onChange={(e) => {
                                        setVehicalCancle(e.target.value);
                                        handleFieldChange('vehicalCancle', e.target.value);
                                    }}
                                    placeholder="Enter Vehicle Cancel"
                                    style={!fieldErrors.vehicalCancle ? inputStyle : inputStyles}
                                />
                                {fieldErrors.vehicalCancle && <div style={{ fontSize: "13px" }} className="text-danger">{fieldErrors.vehicalCancle}</div>}
                            </Col>

                            <Col md={4} className="py-2 form-group">
                                <Form.Label>Vehicle Transfer</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="input-text"
                                    value={vehicalTransfer}
                                    onChange={(e) => {
                                        setVehicalTransfer(e.target.value);
                                        handleFieldChange('vehicalTransfer', e.target.value);
                                    }}
                                    placeholder="Enter Vehicle Transfer"
                                    style={!fieldErrors.vehicalTransfer ? inputStyle : inputStyles}
                                />
                                {fieldErrors.vehicalTransfer && <div style={{ fontSize: "13px" }} className="text-danger">{fieldErrors.vehicalTransfer}</div>}
                            </Col>





                            <Col className='py-2' md={4}>
                                <Form.Group controlId="UploadFile">
                                    <Form.Label style={{ fontWeight: "bold" }}>Upload Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}  // Generic reference name
                                        style={!fieldErrors.fileInputRef ? inputStyle : inputStyles}
                                    />
                                    {/* {fieldErrors.fileInputRef && (
                                        <div style={{ fontSize: "13px" }} className="text-danger">
                                            {fieldErrors.fileInputRef}
                                        </div>
                                    )}
                                    <div>{fileName}</div>
                                    <div style={{ display: "flex" }}>
                                        {images ? (
                                            <img src={images} alt="Maintenance Image" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                        ) : (
                                            <p>No image available</p>
                                        )} */}
                                    {/* </div> */}
                                </Form.Group>
                            </Col>







                        </Row>

                        <Row>
                            <Col className="d-flex justify-content-center">
                                <Button variant="primary" type="submit" className="mr-2">Submit</Button>
                                <Button variant="secondary" onClick={handleBack}>Back</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <ToastContainer />
            </div>
        </Container >
    );
};

export default Gard;
