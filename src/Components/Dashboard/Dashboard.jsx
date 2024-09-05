
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'



const Dashboard = () => {
    const [designation, setDesignation] = useState('');

    useEffect(() => {

        const Designation = localStorage.getItem("Designation");

        if (Designation) {
            setDesignation(Designation);
        }
    }, []);

    return (
        <>
            <div style={{ marginBottom: '3%' }}>
                {/* Purchase Order List in Dashboard */}
                <div className="container" style={{ width: "auto", display: "flex", marginTop: "-8%", }}>

                    <div style={{ width: "auto" }}>
                        {/* {designation === "Maintenance Engineer" ? "" : (designation === "Super Admin" ? <PurchaseOrderList /> : <SparePartInListing />)} */}
                    </div>

                </div>
            </div>

        </>

    );
}
export default Dashboard


