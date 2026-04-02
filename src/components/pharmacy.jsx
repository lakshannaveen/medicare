// import axios from "axios";
// import { useEffect, useState } from "react";
// import '../styles/pharmacy.css';
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { FaClinicMedical } from "react-icons/fa"; // Import the desired icon

// export default function Pharmacy() {
//   const [pharmacypatients, setPharmacypatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [treatments, setTreatment] = useState(null);
//   const [popup, setPopup] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [selectedMedicines, setSelectedMedicines] = useState([]);
//   const [totaldrugfee, setTotaldrugfee] = useState(0);
//   const [stockError, setStockError] = useState(""); // Add this state to handle stock errors

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPharmacyPatients = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/Treatment/preparationcomplete`
//         );
//         setPharmacypatients(response.data);
//       } catch (error) {
//         console.error("Error fetching pharmacy patients:", error);
//       }
//     };

//     fetchPharmacyPatients();

//     const intervalId = setInterval(fetchPharmacyPatients, 5000);

//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchTreatmentDetails = async (patientId, serialNo) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serialNo}`
//       );

//       const updatedDrugs = response.data.Drugs.map((drug) => ({
//         ...drug,
//         MDD_GIVEN_QUANTITY: drug.MDD_QUANTITY, // Initialize given quantity
//       }));

//       setTreatment({ ...response.data, Drugs: updatedDrugs });
//       setSelectedMedicines([]);
//       setTotaldrugfee(0);
//     } catch (error) {
//       console.error("Error fetching the treatments", error);
//     }
//   };

//   const popupOpen = (patient) => {
//     setSelectedPatient(patient);
//     fetchTreatmentDetails(patient.MPD_PATIENT_CODE, patient.MTD_SERIAL_NO);
//     setPopup(true);
//   };

//   const closePopup = () => {
//     setPopup(false);
//     setSelectedPatient(null);
//     setTreatment(null);
//     setSelectedMedicines([]);
//     setTotaldrugfee(0);
//   };

//   const handleSaveAndProceed = async () => {
//     // Check for out-of-stock medicines
//     const outOfStockDrugs = selectedMedicines.filter(
//       (drug) => drug.MDD_GIVEN_QUANTITY > drug.Stock
//     );

//     if (outOfStockDrugs.length > 0) {
//       const message = outOfStockDrugs
//         .map(
//           (drug) =>
//             `${drug.DrugName} (Available: ${drug.Stock}, Requested: ${drug.MDD_GIVEN_QUANTITY})`
//         )
//         .join(", ");
//       setStockError(`The following medicines are out of stock: ${message}`);
//       return;
//     }

//     try {
//       // Proceed with the save and update logic
//       const medicinesData = selectedMedicines.map((medicine) => ({
//         MDD_PATIENT_CODE: selectedPatient.MPD_PATIENT_CODE,
//         MDD_SERIAL_NO: selectedPatient.MTD_SERIAL_NO,
//         MDD_MATERIAL_CODE: medicine.MDD_MATERIAL_CODE,
//         MDD_GIVEN_QUANTITY: medicine.MDD_GIVEN_QUANTITY,
//       }));

//       console.log("Sending data:", medicinesData);

//       await axios.patch(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/update/status/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
//         medicinesData,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       navigate(
//         `/dashboard/pharmacy-invoice/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
//         {
//           state: { selectedMedicines, totaldrugfee },
//         }
//       );
//     } catch (error) {
//       console.error("Error updating treatment status and given quantities:", error.response?.data || error);
//     }
//   };

//   const filteredPatients = pharmacypatients.filter((patient) =>
//     patient.MPD_MOBILE_NO.includes(searchTerm) || patient.MPD_PATIENT_NAME.includes(searchTerm)
//   );

//   const calculateTotalDrugFee = (medicines) => {
//     const totalFee = medicines.reduce(
//       (total, drug) => total + (drug.MDD_GIVEN_QUANTITY || 0) * drug.MDD_RATE,
//       0
//     );
//     setTotaldrugfee(totalFee);
//   };

//   const handleDrugSelection = (drugIndex, event) => {
//     const updatedMedicines = [...selectedMedicines];

//     if (event.target.checked) {
//       updatedMedicines.push(treatments.Drugs[drugIndex]);
//     } else {
//       const index = updatedMedicines.findIndex(
//         (drug) => drug.DrugName === treatments.Drugs[drugIndex].DrugName
//       );
//       if (index > -1) {
//         updatedMedicines.splice(index, 1);
//       }
//     }

//     setSelectedMedicines(updatedMedicines);
//     calculateTotalDrugFee(updatedMedicines);
//   };

//   const handleQuantityChange = (drugIndex, newQuantity) => {
//     setTreatment((prevTreatment) => {
//       const updatedDrugs = prevTreatment.Drugs.map((drug, i) =>
//         i === drugIndex ? { ...drug, MDD_GIVEN_QUANTITY: newQuantity } : drug
//       );

//       return { ...prevTreatment, Drugs: updatedDrugs };
//     });

//     // Update selected medicines if drug is selected
//     setSelectedMedicines((prevSelected) => {
//       const updatedSelected = prevSelected.map((drug) =>
//         drug.DrugName === treatments.Drugs[drugIndex].DrugName
//           ? { ...drug, MDD_GIVEN_QUANTITY: newQuantity }
//           : drug
//       );
//       calculateTotalDrugFee(updatedSelected);
//       return updatedSelected;
//     });
//   };

//   return (
//     <div className="pharmacy-container">
//       {/* Add Icon and Heading */}
//       <div className="heading-container">
//         <FaClinicMedical className="heading-icon" size={65} />
//         <h1>Allocated Patients</h1>
//       </div>

//       <input
//         type="search"
//         placeholder="Search patient by name or contact..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="search-input"
//       />

//       <div className="pharmacy-table-container">
//         {filteredPatients.length > 0 ? (
//           <table className="pharmacy-table">
//             <thead>
//               <tr>
//                 <th>Patient Code</th>
//                 <th>Patient Name</th>
//                 <th>Mobile Number</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPatients.map((patient, index) => (
//                 <tr key={index}>
//                   <td>{patient.MPD_PATIENT_CODE}</td>
//                   <td>{patient.MPD_PATIENT_NAME}</td>
//                   <td>{patient.MPD_MOBILE_NO}</td>
//                   <td>{patient.MTD_TREATMENT_STATUS === "P" ? "Preparation Complete" : patient.MTD_TREATMENT_STATUS}</td>
//                   <td>
//                     <button onClick={() => popupOpen(patient)} className="view-btn">
//                       Medicines
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div className="no-patients">
//             <p>No pharmacy patients found.</p>
//           </div>
//         )}
//       </div>

//       {/* When admin clicks Medicines button it opens this modal */}
//       {popup && selectedPatient && treatments && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <h2>Treatment Details</h2>
//             <p><strong>Patient Name:</strong> {selectedPatient.MPD_PATIENT_NAME}</p>
//             <p><strong>Prescribed Doctor:</strong> {treatments.MTD_DOCTOR}</p>
//             <h3>Medications</h3>
//             <div className="drug-container">
//               {treatments.Drugs && treatments.Drugs.length > 0 ? (
//                 <table className="drug-table">
//                   <thead>
//                     <tr>
//                       <th>Select</th>
//                       <th>Drug Name</th>
//                       <th>Takes</th>
//                       <th>Quantity</th>
//                       <th>Given quantity</th>
//                       <th>Rate</th>
//                       <th>Amount</th>
//                     </tr>
//                   </thead>
//                   {/* <tbody>
//                     {treatments.Drugs.map((drug, index) => (
//                       <tr key={index}>
//                         <td>
//                           <input
//                             type="checkbox"
//                             onChange={(event) => handleDrugSelection(index, event)}
//                           />
//                         </td>
//                         <td>{drug.DrugName}</td>
//                         <td>{drug.MDD_TAKES}</td>
//                         <td>{drug.MDD_QUANTITY}</td>
//                         <td>
//                           <input
//                             type="number"
//                             value={drug.MDD_GIVEN_QUANTITY}
//                             onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
//                           />
//                         </td>
//                         <td>{drug.MDD_RATE}</td>
//                         <td>{(drug.MDD_GIVEN_QUANTITY * drug.MDD_RATE).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody> */}
//                   <tbody>
//                     {treatments.Drugs.map((drug, index) => {
//                       const isOutOfStock = drug.MDD_GIVEN_QUANTITY > drug.Stock;
//                       return (
//                         <tr key={index}>
//                           <td>
//                             <input
//                               type="checkbox"
//                               onChange={(event) => handleDrugSelection(index, event)}
//                             />
//                           </td>
//                           <td>{drug.DrugName}</td>
//                           <td>{drug.MDD_TAKES}</td>
//                           <td>{drug.MDD_QUANTITY}</td>
//                           <td>
//                             <input
//                               type="number"
//                               value={drug.MDD_GIVEN_QUANTITY}
//                               onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
//                             />
//                             {isOutOfStock && (
//                               <span style={{ color: 'red', fontWeight: 'bold' }}>
//                                 {" "} (Out of stock, Available: {drug.Stock})
//                               </span>
//                             )}
//                           </td>
//                           <td>{drug.MDD_RATE}</td>
//                           <td>{(drug.MDD_GIVEN_QUANTITY * drug.MDD_RATE).toFixed(2)}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>

//                 </table>
//               ) : (
//                 <p>No drugs prescribed.</p>
//               )}
//             </div>
//             <p><strong>Total drug fee:</strong> Rs. {totaldrugfee.toFixed(2)}</p>
//             <div className="popup-buttons">
//               <button onClick={closePopup} className="close-btn">X</button>
//               <button onClick={handleSaveAndProceed} className="save-btn">Save & Proceed to Invoice</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import axios from "axios";
// import { useEffect, useState } from "react";
// import '../styles/pharmacy.css';
// import { useNavigate } from "react-router-dom";
// import { FaClinicMedical } from "react-icons/fa";

// export default function Pharmacy() {
//   const [pharmacypatients, setPharmacypatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [treatments, setTreatment] = useState(null);
//   const [popup, setPopup] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [selectedMedicines, setSelectedMedicines] = useState([]);
//   const [totaldrugfee, setTotaldrugfee] = useState(0);
//   const [stockError, setStockError] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const navigate = useNavigate();

//   const fetchPharmacyPatients = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/preparationcomplete`
//       );
//       setPharmacypatients(response.data);
//     } catch (error) {
//       console.error("Error fetching pharmacy patients:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPharmacyPatients();
//     const intervalId = setInterval(fetchPharmacyPatients, 5000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchTreatmentDetails = async (patientId, serialNo) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serialNo}`
//       );

//       const updatedDrugs = response.data.Drugs.map((drug) => ({
//         ...drug,
//         MDD_GIVEN_QUANTITY: drug.MDD_QUANTITY, // Initialize given quantity
//         initialStock: drug.Stock // Keep track of initial stock value
//       }));

//       setTreatment({ ...response.data, Drugs: updatedDrugs });
//       setSelectedMedicines([]);
//       setTotaldrugfee(0);
//       setStockError(""); // Clear any previous errors
//     } catch (error) {
//       console.error("Error fetching the treatments", error);
//     }
//   };

//   const popupOpen = (patient) => {
//     setSelectedPatient(patient);
//     fetchTreatmentDetails(patient.MPD_PATIENT_CODE, patient.MTD_SERIAL_NO);
//     setPopup(true);
//   };

//   const closePopup = () => {
//     setPopup(false);
//     setSelectedPatient(null);
//     setTreatment(null);
//     setSelectedMedicines([]);
//     setTotaldrugfee(0);
//     setStockError("");
//   };

//   const handleSaveAndProceed = async () => {
//     // Clear previous error
//     setStockError("");

//     // Validate that at least one medicine is selected
//     if (selectedMedicines.length === 0) {
//       setStockError("Please select at least one medicine to proceed.");
//       return;
//     }

//     // Check for out-of-stock medicines
//     const outOfStockDrugs = selectedMedicines.filter(
//       (drug) => drug.MDD_GIVEN_QUANTITY > drug.Stock
//     );

//     if (outOfStockDrugs.length > 0) {
//       const message = outOfStockDrugs
//         .map(
//           (drug) =>
//             `${drug.DrugName} (Available: ${drug.Stock}, Requested: ${drug.MDD_GIVEN_QUANTITY})`
//         )
//         .join(", ");
//       setStockError(`The following medicines are out of stock: ${message}`);
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       // Proceed with the save and update logic
//       const medicinesData = selectedMedicines.map((medicine) => ({
//         MDD_PATIENT_CODE: selectedPatient.MPD_PATIENT_CODE,
//         MDD_SERIAL_NO: selectedPatient.MTD_SERIAL_NO,
//         MDD_MATERIAL_CODE: medicine.MDD_MATERIAL_CODE,
//         MDD_GIVEN_QUANTITY: medicine.MDD_GIVEN_QUANTITY,
//       }));

//       const response = await axios.patch(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/update/status/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
//         medicinesData,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // Refresh the list of pharmacy patients
//       fetchPharmacyPatients();

//       // Navigate to invoice page with updated information
//       navigate(
//         `/dashboard/pharmacy-invoice/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
//         {
//           state: {
//             selectedMedicines,
//             totaldrugfee,
//             updatedStocks: response.data.updatedDrugs
//           },
//         }
//       );
//     } catch (error) {
//       setIsProcessing(false);
//       console.error("Error updating treatment status and given quantities:", error.response?.data || error);
//       setStockError("Failed to process prescription. Please try again later.");
//     }
//   };

//   const filteredPatients = pharmacypatients.filter((patient) =>
//     patient.MPD_MOBILE_NO.includes(searchTerm) ||
//     patient.MPD_PATIENT_NAME.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const calculateTotalDrugFee = (medicines) => {
//     const totalFee = medicines.reduce(
//       (total, drug) => total + (drug.MDD_GIVEN_QUANTITY || 0) * drug.MDD_RATE,
//       0
//     );
//     setTotaldrugfee(totalFee);
//   };

//   const handleDrugSelection = (drugIndex, event) => {
//     const updatedMedicines = [...selectedMedicines];
//     const selectedDrug = treatments.Drugs[drugIndex];

//     if (event.target.checked) {
//       // Add the drug if it's not already in the array
//       if (!updatedMedicines.some(drug => drug.MDD_MATERIAL_CODE === selectedDrug.MDD_MATERIAL_CODE)) {
//         updatedMedicines.push(selectedDrug);
//       }
//     } else {
//       // Remove the drug if it exists in the array
//       const index = updatedMedicines.findIndex(
//         (drug) => drug.MDD_MATERIAL_CODE === selectedDrug.MDD_MATERIAL_CODE
//       );
//       if (index > -1) {
//         updatedMedicines.splice(index, 1);
//       }
//     }

//     setSelectedMedicines(updatedMedicines);
//     calculateTotalDrugFee(updatedMedicines);
//   };

//   const handleQuantityChange = (drugIndex, newQuantity) => {
//     // Ensure the quantity is at least 0
//     const validQuantity = Math.max(0, newQuantity);

//     setTreatment((prevTreatment) => {
//       const updatedDrugs = prevTreatment.Drugs.map((drug, i) =>
//         i === drugIndex ? { ...drug, MDD_GIVEN_QUANTITY: validQuantity } : drug
//       );

//       return { ...prevTreatment, Drugs: updatedDrugs };
//     });

//     // Update selected medicines if drug is selected
//     setSelectedMedicines((prevSelected) => {
//       const updatedSelected = prevSelected.map((drug) =>
//         drug.MDD_MATERIAL_CODE === treatments.Drugs[drugIndex].MDD_MATERIAL_CODE
//           ? { ...drug, MDD_GIVEN_QUANTITY: validQuantity }
//           : drug
//       );
//       calculateTotalDrugFee(updatedSelected);
//       return updatedSelected;
//     });

//     // Clear stock error when quantity changes
//     if (stockError) setStockError("");
//   };

//   const isDrugSelected = (drugIndex) => {
//     return selectedMedicines.some(
//       drug => drug.MDD_MATERIAL_CODE === treatments.Drugs[drugIndex].MDD_MATERIAL_CODE
//     );
//   };

//   return (
//     <div className="pharmacy-container">
//       {/* Add Icon and Heading */}
//       <div className="heading-container">
//         <FaClinicMedical className="heading-icon" size={65} />
//         <h1>Allocated Patients</h1>
//       </div>

//       <input
//         type="search"
//         placeholder="Search patient by name or contact..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="search-input"
//       />

//       <div className="pharmacy-table-container">
//         {filteredPatients.length > 0 ? (
//           <table className="pharmacy-table">
//             <thead>
//               <tr>
//                 <th>Patient Code</th>
//                 <th>Patient Name</th>
//                 <th>Mobile Number</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPatients.map((patient, index) => (
//                 <tr key={index}>
//                   <td>{patient.MPD_PATIENT_CODE}</td>
//                   <td>{patient.MPD_PATIENT_NAME}</td>
//                   <td>{patient.MPD_MOBILE_NO}</td>
//                   <td>{patient.MTD_TREATMENT_STATUS === "P" ? "Preparation Complete" : patient.MTD_TREATMENT_STATUS}</td>
//                   <td>
//                     <button onClick={() => popupOpen(patient)} className="view-btn">
//                       Medicines
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div className="no-patients">
//             <p>No pharmacy patients found.</p>
//           </div>
//         )}
//       </div>

//       {/* When admin clicks Medicines button it opens this modal */}
//       {popup && selectedPatient && treatments && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <h2>Treatment Details</h2>
//             <p><strong>Patient Name:</strong> {selectedPatient.MPD_PATIENT_NAME}</p>
//             <p><strong>Prescribed Doctor:</strong> {treatments.MTD_DOCTOR}</p>
//             <h3>Medications</h3>

//             {stockError && (
//               <div className="error-message" style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>
//                 {stockError}
//               </div>
//             )}

//             <div className="drug-container">
//               {treatments.Drugs && treatments.Drugs.length > 0 ? (
//                 <table className="drug-table">
//                   <thead>
//                     <tr>
//                       <th>Select</th>
//                       <th>Drug Name</th>
//                       <th>Takes</th>
//                       <th>Prescribed Qty</th>
//                       <th>Given Quantity</th>
//                       <th>Available Stock</th>
//                       <th>Rate</th>
//                       <th>Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {treatments.Drugs.map((drug, index) => {
//                       const isOutOfStock = drug.MDD_GIVEN_QUANTITY > drug.Stock;
//                       return (
//                         <tr key={index} className={isOutOfStock ? "out-of-stock-row" : ""}>
//                           <td>
//                             <input
//                               type="checkbox"
//                               checked={isDrugSelected(index)}
//                               onChange={(event) => handleDrugSelection(index, event)}
//                             />
//                           </td>
//                           <td>{drug.DrugName}</td>
//                           <td>{drug.MDD_TAKES}</td>
//                           <td>{drug.MDD_QUANTITY}</td>
//                           <td>
//                             <input
//                               type="number"
//                               min="0"
//                               max={drug.Stock}
//                               value={drug.MDD_GIVEN_QUANTITY}
//                               onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
//                               className={isOutOfStock ? "invalid-quantity" : ""}
//                             />
//                           </td>
//                           <td className={drug.Stock <= 5 ? "low-stock" : ""}>
//                             {drug.Stock}
//                             {drug.Stock <= 5 && <span className="stock-warning"> (Low)</span>}
//                           </td>
//                           <td>{drug.MDD_RATE}</td>
//                           <td>{(drug.MDD_GIVEN_QUANTITY * drug.MDD_RATE).toFixed(2)}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No drugs prescribed.</p>
//               )}
//             </div>
//             <p><strong>Total drug fee:</strong> Rs. {totaldrugfee.toFixed(2)}</p>
//             <div className="popup-buttons">
//               <button onClick={closePopup} className="close-btn" disabled={isProcessing}>X</button>
//               <button
//                 onClick={handleSaveAndProceed}
//                 className="save-btn"
//                 disabled={isProcessing || selectedMedicines.length === 0}
//               >
//                 {isProcessing ? "Processing..." : "Save & Proceed to Invoice"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

//Modify this according to when the drug details are used for a treatment then the stock is reduced  - pharmacy page

// import axios from "axios";
// import { useEffect, useState } from "react";
// import "../styles/pharmacy.css";
// import { useNavigate } from "react-router-dom";
// import { FaClinicMedical } from "react-icons/fa";

// export default function Pharmacy() {
//   const [pharmacypatients, setPharmacypatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [treatments, setTreatment] = useState(null);
//   const [popup, setPopup] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [selectedMedicines, setSelectedMedicines] = useState([]);
//   const [totaldrugfee, setTotaldrugfee] = useState(0);
//   const [stockError, setStockError] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const navigate = useNavigate();

//   const fetchPharmacyPatients = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/preparationcomplete`
//       );
//       setPharmacypatients(response.data);
//     } catch (error) {
//       console.error("Error fetching pharmacy patients:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPharmacyPatients();
//     const intervalId = setInterval(fetchPharmacyPatients, 5000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchTreatmentDetails = async (patientId, serialNo) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serialNo}`
//       );

//       const updatedDrugs = response.data.Drugs.map((drug) => ({
//         ...drug,
//         MDD_GIVEN_QUANTITY: drug.MDD_QUANTITY, // Initialize given quantity
//         initialStock: drug.Stock, // Keep track of initial stock value
//       }));

//       setTreatment({ ...response.data, Drugs: updatedDrugs });
//       setSelectedMedicines([]);
//       setTotaldrugfee(0);
//       setStockError(""); // Clear any previous errors
//     } catch (error) {
//       console.error("Error fetching the treatments", error);
//     }
//   };

//   const popupOpen = (patient) => {
//     setSelectedPatient(patient);
//     fetchTreatmentDetails(patient.MPD_PATIENT_CODE, patient.MTD_SERIAL_NO);
//     setPopup(true);
//   };

//   const closePopup = () => {
//     setPopup(false);
//     setSelectedPatient(null);
//     setTreatment(null);
//     setSelectedMedicines([]);
//     setTotaldrugfee(0);
//     setStockError("");
//   };

//   const handleSaveAndProceed = async () => {
//     // Clear previous error
//     setStockError("");

//     // Validate that at least one medicine is selected
//     if (selectedMedicines.length === 0) {
//       setStockError("Please select at least one medicine to proceed.");
//       return;
//     }

//     // Check for out-of-stock medicines
//     const outOfStockDrugs = selectedMedicines.filter(
//       (drug) => drug.MDD_GIVEN_QUANTITY > drug.Stock
//     );

//     if (outOfStockDrugs.length > 0) {
//       setStockError("Some medicines have invalid quantities. Please check below.");
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       // Proceed with the save and update logic
//       const medicinesData = selectedMedicines.map((medicine) => ({
//         MDD_PATIENT_CODE: selectedPatient.MPD_PATIENT_CODE,
//         MDD_SERIAL_NO: selectedPatient.MTD_SERIAL_NO,
//         MDD_MATERIAL_CODE: medicine.MDD_MATERIAL_CODE,
//         MDD_GIVEN_QUANTITY: medicine.MDD_GIVEN_QUANTITY,
//       }));

//       const response = await axios.patch(
//         `${process.env.REACT_APP_API_BASE_URL}/Treatment/update/status/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
//         medicinesData,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // Refresh the list of pharmacy patients
//       fetchPharmacyPatients();

//       // Navigate to invoice page with updated information
//       navigate(
//         `/dashboard/pharmacy-invoice/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
//         {
//           state: {
//             selectedMedicines,
//             totaldrugfee,
//             updatedStocks: response.data.updatedDrugs,
//           },
//         }
//       );
//     } catch (error) {
//       setIsProcessing(false);
//       console.error(
//         "Error updating treatment status and given quantities:",
//         error.response?.data || error
//       );
//       setStockError("Failed to process prescription. Please try again later.");
//     }
//   };

//   const filteredPatients = pharmacypatients.filter(
//     (patient) =>
//       patient.MPD_MOBILE_NO.includes(searchTerm) ||
//       patient.MPD_PATIENT_NAME.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const calculateTotalDrugFee = (medicines) => {
//     const totalFee = medicines.reduce(
//       (total, drug) => total + (drug.MDD_GIVEN_QUANTITY || 0) * drug.MDD_RATE,
//       0
//     );
//     setTotaldrugfee(totalFee);
//   };

//   const handleDrugSelection = (drugIndex, event) => {
//     const updatedMedicines = [...selectedMedicines];
//     const selectedDrug = treatments.Drugs[drugIndex];

//     if (event.target.checked) {
//       // Add the drug if it's not already in the array
//       if (
//         !updatedMedicines.some(
//           (drug) => drug.MDD_MATERIAL_CODE === selectedDrug.MDD_MATERIAL_CODE
//         )
//       ) {
//         updatedMedicines.push(selectedDrug);
//       }
//     } else {
//       // Remove the drug if it exists in the array
//       const index = updatedMedicines.findIndex(
//         (drug) => drug.MDD_MATERIAL_CODE === selectedDrug.MDD_MATERIAL_CODE
//       );
//       if (index > -1) {
//         updatedMedicines.splice(index, 1);
//       }
//     }

//     setSelectedMedicines(updatedMedicines);
//     calculateTotalDrugFee(updatedMedicines);
//   };

//   const handleQuantityChange = (drugIndex, newQuantity) => {
//     // Ensure the quantity is at least 0
//     const validQuantity = Math.max(0, newQuantity);

//     setTreatment((prevTreatment) => {
//       const updatedDrugs = prevTreatment.Drugs.map((drug, i) =>
//         i === drugIndex ? { ...drug, MDD_GIVEN_QUANTITY: validQuantity } : drug
//       );

//       return { ...prevTreatment, Drugs: updatedDrugs };
//     });

//     // Update selected medicines if drug is selected
//     setSelectedMedicines((prevSelected) => {
//       const updatedSelected = prevSelected.map((drug) =>
//         drug.MDD_MATERIAL_CODE === treatments.Drugs[drugIndex].MDD_MATERIAL_CODE
//           ? { ...drug, MDD_GIVEN_QUANTITY: validQuantity }
//           : drug
//       );
//       calculateTotalDrugFee(updatedSelected);
//       return updatedSelected;
//     });

//     // Clear stock error when quantity changes
//     if (stockError) setStockError("");
//   };

//   const isDrugSelected = (drugIndex) => {
//     return selectedMedicines.some(
//       (drug) =>
//         drug.MDD_MATERIAL_CODE === treatments.Drugs[drugIndex].MDD_MATERIAL_CODE
//     );
//   };

//   return (
//     <div className="pharmacy-container">
//       {/* Add Icon and Heading */}
//       <div className="heading-container">
//         <FaClinicMedical className="heading-icon" size={65} />
//         <h1>Allocated Patients</h1>
//       </div>

//       <input
//         type="search"
//         placeholder="Search Patient by Name or Contact..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="search-input"
//       />

//       <div className="pharmacy-table-container">
//         {filteredPatients.length > 0 ? (
//           <table className="pharmacy-table">
//             <thead>
//               <tr>
//                 <th>Patient Code</th>
//                 <th>Patient Name</th>
//                 <th>Mobile Number</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPatients.map((patient, index) => (
//                 <tr key={index}>
//                   <td>{patient.MPD_PATIENT_CODE}</td>
//                   <td>{patient.MPD_PATIENT_NAME}</td>
//                   <td>{patient.MPD_MOBILE_NO}</td>
//                   <td>
//                     {patient.MTD_TREATMENT_STATUS === "P"
//                       ? "Preparation Complete"
//                       : patient.MTD_TREATMENT_STATUS}
//                   </td>
//                   <td>
//                     <button
//                       onClick={() => popupOpen(patient)}
//                       className="view-btn"
//                     >
//                       Medicines
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div className="no-patients">
//             <p>No pharmacy patients found.</p>
//           </div>
//         )}
//       </div>

//       {/* When admin clicks Medicines button it opens this modal */}
//       {popup && selectedPatient && treatments && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <h2>Treatment Details</h2>
//             <p>
//               <strong>Patient Name:</strong> {selectedPatient.MPD_PATIENT_NAME}
//             </p>
//             <p>
//               <strong>Prescribed Doctor:</strong> {treatments.MTD_DOCTOR}
//             </p>
//             <h3>Medications</h3>

//             {stockError && (
//               <div
//                 className="error-message"
//                 style={{
//                   color: "red",
//                   marginBottom: "10px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 {stockError}
//               </div>
//             )}

//             <div className="drug-container">
//               {treatments.Drugs && treatments.Drugs.length > 0 ? (
//                 <table className="drug-table">
//                   <thead>
//                     <tr>
//                       <th>Select</th>
//                       <th>Drug Name</th>
//                       <th>Takes</th>
//                       <th>Prescribed Qty</th>
//                       <th>Given Quantity</th>
//                       <th>Available Stock</th>
//                       <th>Rate</th>
//                       <th>Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {treatments.Drugs.map((drug, index) => {
//                       const isOutOfStock = drug.MDD_GIVEN_QUANTITY > drug.Stock;
//                       return (
//                         <tr
//                           key={index}
//                           className={isOutOfStock ? "out-of-stock-row" : ""}
//                         >
//                           <td>
//                             <input
//                               type="checkbox"
//                               checked={isDrugSelected(index)}
//                               onChange={(event) =>
//                                 handleDrugSelection(index, event)
//                               }
//                             />
//                           </td>
//                           <td>{drug.DrugName}</td>
//                           <td>{drug.MDD_TAKES}</td>
//                           <td>{drug.MDD_QUANTITY}</td>
//                           <td>
//                             <input
//                               type="number"
//                               min="0"
//                               max={drug.Stock}
//                               value={drug.MDD_GIVEN_QUANTITY}
//                               onChange={(e) =>
//                                 handleQuantityChange(
//                                   index,
//                                   Number(e.target.value)
//                                 )
//                               }
//                               className={isOutOfStock ? "invalid-quantity" : ""}
//                             />
//                             {isOutOfStock && (
//                               <div className="drug-error-message">
//                                 "Invalid Stock:{drug.Stock}"
//                               </div>
//                             )}
//                           </td>
//                           <td className={drug.Stock <= 5 ? "low-stock" : ""}>
//                             {drug.Stock}
//                             {drug.Stock <= 5 && (
//                               <span className="stock-warning"> (Low)</span>
//                             )}
//                           </td>
//                           <td>{drug.MDD_RATE}</td>
//                           <td>
//                             {(drug.MDD_GIVEN_QUANTITY * drug.MDD_RATE).toFixed(
//                               2
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No drugs prescribed.</p>
//               )}
//             </div>
//             <p>
//               <strong>Total drug fee:</strong> Rs. {totaldrugfee.toFixed(2)}
//             </p>
//             <div className="popup-buttons">
//               <button
//                 onClick={closePopup}
//                 className="close-btn"
//                 disabled={isProcessing}
//               >
//                 X
//               </button>
//               <button
//                 onClick={handleSaveAndProceed}
//                 className="save-btn"
//                 disabled={isProcessing || selectedMedicines.length === 0}
//               >
//                 {isProcessing ? "Processing..." : "Save & Proceed to Invoice"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
  Tooltip,
  Badge,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  LocalPharmacy as PharmacyIcon,
  MedicalServices as MedicalIcon,
  Receipt as InvoiceIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle,
  Pending,
} from "@mui/icons-material";

const StatusChip = ({ status, pendingCount }) => {
  switch (status) {
    case "C":
      return (
        <Chip
          icon={<CheckCircle fontSize="small" />}
          label="Completed"
          color="success"
          variant="outlined"
          size="small"
        />
      );
    case "P":
      return (
        <Chip
          icon={<Pending fontSize="small" />}
          label={`Pending (${pendingCount})`}
          color="info"
          variant="outlined"
          size="small"
        />
      );
    default:
      return (
        <Chip
          icon={<Pending fontSize="small" />}
          label="Unknown Status"
          color="warning"
          variant="outlined"
          size="small"
        />
      );
  }
};

export default function Pharmacy() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [pharmacypatients, setPharmacypatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [treatments, setTreatment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [totaldrugfee, setTotaldrugfee] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // const fetchPharmacyPatients = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/Treatment/preparationcomplete`
  //     );
  //     setPharmacypatients(response.data);
  //   } catch (error) {
  //     console.error("Error fetching pharmacy patients:", error);
  //     showSnackbar("Failed to fetch patients", "error");
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };

  //Sort patients according to newset patients in top
  const fetchPharmacyPatients = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Treatment/preparationcomplete`,
      );
      const sortedPatients = response.data.sort((a, b) => {
        return new Date(b.MTD_DATE) - new Date(a.MTD_DATE);
      });

      setPharmacypatients(sortedPatients);
    } catch (error) {
      console.error("Error fetching pharmacy patients:", error);
      showSnackbar("Failed to fetch patients", "error");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPharmacyPatients();
    const intervalId = setInterval(fetchPharmacyPatients, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // const fetchTreatmentDetails = async (patientId, serialNo) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serialNo}`
  //     );

  //     const updatedDrugs = response.data.Drugs.map((drug) => ({
  //       ...drug,
  //       MDD_GIVEN_QUANTITY: drug.MDD_QUANTITY,
  //       initialStock: drug.Stock,
  //     }));

  //     setTreatment({ ...response.data, Drugs: updatedDrugs });
  //     setSelectedMedicines([]);
  //     setTotaldrugfee(0);
  //     setError("");
  //   } catch (error) {
  //     console.error("Error fetching treatment details:", error);
  //     showSnackbar("Failed to fetch treatment details", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //Modfied  according to when the medicnes are not at sttock that medicies will kepp untill they avaiable,(without this option old code will be upper)
  const fetchTreatmentDetails = async (patientId, serialNo) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/Treatment/patient/record/${patientId}/${serialNo}`,
      );

      const pendingDrugs = response.data.Drugs.filter(
        (drug) =>
          drug.MDD_GIVEN_QUANTITY === null || drug.MDD_GIVEN_QUANTITY <= 0,
      );

      const updatedDrugs = pendingDrugs.map((drug) => ({
        ...drug,
        MDD_GIVEN_QUANTITY: drug.MDD_QUANTITY,
        initialStock: drug.Stock,
      }));

      setTreatment({
        ...response.data,
        Drugs: updatedDrugs,
        originalDrugsCount: response.data.Drugs.length,
      });
      setSelectedMedicines([]);
      setTotaldrugfee(0);
      setError("");
    } catch (error) {
      console.error("Error fetching treatment details:", error);
      showSnackbar("Failed to fetch treatment details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient);
    fetchTreatmentDetails(patient.MPD_PATIENT_CODE, patient.MTD_SERIAL_NO);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
    setTreatment(null);
    setSelectedMedicines([]);
    setTotaldrugfee(0);
    setError("");
  };

  // const handleSaveAndProceed = async () => {
  //   setError("");

  //   if (selectedMedicines.length === 0) {
  //     setError("Please select at least one medicine to proceed.");
  //     return;
  //   }

  //   const outOfStockDrugs = selectedMedicines.filter(
  //     (drug) => drug.MDD_GIVEN_QUANTITY > drug.Stock
  //   );

  //   if (outOfStockDrugs.length > 0) {
  //     setError("Some medicines have invalid quantities. Please check below.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const medicinesData = selectedMedicines.map((medicine) => ({
  //       MDD_PATIENT_CODE: selectedPatient.MPD_PATIENT_CODE,
  //       MDD_SERIAL_NO: selectedPatient.MTD_SERIAL_NO,
  //       MDD_MATERIAL_CODE: medicine.MDD_MATERIAL_CODE,
  //       MDD_GIVEN_QUANTITY: medicine.MDD_GIVEN_QUANTITY,
  //     }));

  //     const response = await axios.patch(
  //       `${process.env.REACT_APP_API_BASE_URL}/Treatment/update/status/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
  //       medicinesData,
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     fetchPharmacyPatients();
  //     showSnackbar("Prescription processed successfully");

  //     navigate(
  //       `/dashboard/pharmacy-invoice/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
  //       {
  //         state: {
  //           selectedMedicines,
  //           totaldrugfee,
  //           updatedStocks: response.data.updatedDrugs,
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error updating treatment status:", error);
  //     setError("Failed to process prescription. Please try again later.");
  //     showSnackbar("Failed to process prescription", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSaveAndProceed = async () => {
  //   setError("");

  //   if (selectedMedicines.length === 0) {
  //     setError("Please select at least one medicine to proceed.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await axios.patch(
  //       `${process.env.REACT_APP_API_BASE_URL}/Treatment/update/status/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
  //       selectedMedicines.map((drug) => ({
  //         MDD_PATIENT_CODE: selectedPatient.MPD_PATIENT_CODE,
  //         MDD_SERIAL_NO: selectedPatient.MTD_SERIAL_NO,
  //         MDD_MATERIAL_CODE: drug.MDD_MATERIAL_CODE,
  //         MDD_GIVEN_QUANTITY: drug.MDD_GIVEN_QUANTITY,
  //       })),
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     // Check if all drugs have been provided
  //     const allDrugsProvided =
  //       treatments.originalDrugsCount ===
  //       response.data.providedDrugCodes.length;

  //     if (allDrugsProvided) {
  //       // Refresh the patient list if treatment is fully completed
  //       fetchPharmacyPatients();
  //       showSnackbar("All medicines provided. Treatment completed.");
  //     } else {
  //       // Refresh just the current treatment to remove provided medicines
  //       fetchTreatmentDetails(
  //         selectedPatient.MPD_PATIENT_CODE,
  //         selectedPatient.MTD_SERIAL_NO
  //       );
  //       showSnackbar(
  //         "Medicines processed successfully. Pending medicines remain."
  //       );
  //     }

  //     // Generate invoice for provided medicines
  //     navigate(
  //       `/dashboard/pharmacy-invoice/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
  //       {
  //         state: {
  //           selectedMedicines,
  //           totaldrugfee,
  //           updatedStocks: response.data.updatedDrugs,
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error updating treatment status:", error);
  //     setError("Failed to process prescription. Please try again later.");
  //     showSnackbar("Failed to process prescription", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //Modfied  according to when the medicnes are not at sttock that medicies will kepp untill they avaiable,(without this option old code will be upper)
  const handleSaveAndProceed = async () => {
    setError("");

    if (selectedMedicines.length === 0) {
      setError("Please select at least one medicine to proceed.");
      return;
    }

    const outOfStockDrugs = selectedMedicines.filter(
      (drug) => drug.MDD_GIVEN_QUANTITY > drug.Stock,
    );

    if (outOfStockDrugs.length > 0) {
      const drugNames = outOfStockDrugs.map((d) => d.DrugName).join(", ");
      setError(
        `Cannot provide these medicines due to insufficient stock: ${drugNames}`,
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/Treatment/update/status/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
        selectedMedicines.map((drug) => ({
          MDD_PATIENT_CODE: selectedPatient.MPD_PATIENT_CODE,
          MDD_SERIAL_NO: selectedPatient.MTD_SERIAL_NO,
          MDD_MATERIAL_CODE: drug.MDD_MATERIAL_CODE,
          MDD_GIVEN_QUANTITY: drug.MDD_GIVEN_QUANTITY,
        })),
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.isCompleted) {
        showSnackbar("All medicines provided. Treatment completed.");
        fetchPharmacyPatients();
      } else {
        showSnackbar(
          "Medicines processed successfully. Treatment still pending.",
        );
        fetchTreatmentDetails(
          selectedPatient.MPD_PATIENT_CODE,
          selectedPatient.MTD_SERIAL_NO,
        );
      }

      navigate(
        `/dashboard/pharmacy-invoice/${selectedPatient.MPD_PATIENT_CODE}/${selectedPatient.MTD_SERIAL_NO}`,
        {
          state: {
            selectedMedicines,
            totaldrugfee,
            updatedStocks: response.data.updatedDrugs,
          },
        },
      );
    } catch (error) {
      console.error("Error updating treatment status:", error);
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.join("\n"));
        showSnackbar("Stock validation failed", "error");
      } else {
        setError("Failed to process prescription. Please try again later.");
        showSnackbar("Failed to process prescription", "error");
      }
    } finally {
      setLoading(false);
    }
  };
  // const filteredPatients = pharmacypatients.filter(
  //   (patient) =>
  //     patient.MPD_MOBILE_NO.includes(searchTerm) ||
  //     patient.MPD_PATIENT_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredPatients = pharmacypatients
    .filter(
      (patient) =>
        patient.MPD_MOBILE_NO.includes(searchTerm) ||
        patient.MPD_PATIENT_NAME.toLowerCase().includes(
          searchTerm.toLowerCase(),
        ),
    )
    .sort((a, b) => new Date(b.MTD_DATE) - new Date(a.MTD_DATE));

  const calculateTotalDrugFee = (medicines) => {
    const totalFee = medicines.reduce(
      (total, drug) => total + (drug.MDD_GIVEN_QUANTITY || 0) * drug.MDD_RATE,
      0,
    );
    setTotaldrugfee(totalFee);
  };

  const handleDrugSelection = (drugIndex, event) => {
    const updatedMedicines = [...selectedMedicines];
    const selectedDrug = treatments.Drugs[drugIndex];

    if (event.target.checked) {
      if (
        !updatedMedicines.some(
          (drug) => drug.MDD_MATERIAL_CODE === selectedDrug.MDD_MATERIAL_CODE,
        )
      ) {
        updatedMedicines.push(selectedDrug);
      }
    } else {
      const index = updatedMedicines.findIndex(
        (drug) => drug.MDD_MATERIAL_CODE === selectedDrug.MDD_MATERIAL_CODE,
      );
      if (index > -1) {
        updatedMedicines.splice(index, 1);
      }
    }

    setSelectedMedicines(updatedMedicines);
    calculateTotalDrugFee(updatedMedicines);
  };

  const handleQuantityChange = (drugIndex, newQuantity) => {
    const validQuantity = Math.max(0, newQuantity);

    setTreatment((prevTreatment) => {
      const updatedDrugs = prevTreatment.Drugs.map((drug, i) =>
        i === drugIndex ? { ...drug, MDD_GIVEN_QUANTITY: validQuantity } : drug,
      );
      return { ...prevTreatment, Drugs: updatedDrugs };
    });

    setSelectedMedicines((prevSelected) => {
      const updatedSelected = prevSelected.map((drug) =>
        drug.MDD_MATERIAL_CODE === treatments.Drugs[drugIndex].MDD_MATERIAL_CODE
          ? { ...drug, MDD_GIVEN_QUANTITY: validQuantity }
          : drug,
      );
      calculateTotalDrugFee(updatedSelected);
      return updatedSelected;
    });

    if (error) setError("");
  };

  const isDrugSelected = (drugIndex) => {
    return selectedMedicines.some(
      (drug) =>
        drug.MDD_MATERIAL_CODE ===
        treatments.Drugs[drugIndex].MDD_MATERIAL_CODE,
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPharmacyPatients();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <PharmacyIcon
            sx={{ fontSize: 60, color: theme.palette.primary.main, mr: 2 }}
          />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="primary"
            fontWeight={600}
          >
            Pharmacy Management
          </Typography>
          {/* <Tooltip title="Refresh patient list">
          <IconButton
            onClick={handleRefresh}
            color="primary"
            sx={{ ml: "auto" }}
            disabled={refreshing}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip> */}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mb: 3,
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              minWidth: isMobile ? "100%" : "300px",
            }}
          >
            <Paper
              sx={{
                p: 2,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: theme.palette.primary.light,
                color: "white",
              }}
            >
              <Typography variant="h6">
                Total Patients : {pharmacypatients.length}
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Card elevation={3}>
          <CardContent>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ mb: 2 }}
              color="primary"
              fontWeight={600}
            >
              Allocated Patients
            </Typography>
            {filteredPatients.length > 0 ? (
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table
                  aria-label="patients table"
                  size={isMobile ? "small" : "medium"}
                >
                  <TableHead
                    sx={{ backgroundColor: theme.palette.primary.light }}
                  >
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Patient Code
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Mobile
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {/* <TableBody>
                    {filteredPatients.map((patient, index) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{patient.MPD_PATIENT_CODE}</TableCell>
                        <TableCell>{patient.MPD_PATIENT_NAME}</TableCell>
                        <TableCell>{patient.MPD_MOBILE_NO}</TableCell>
                        <TableCell align="center">
                          <Badge
                            color={
                              patient.MTD_TREATMENT_STATUS === "P"
                                ? "error"
                                : "success"
                            }
                            variant="dot"
                            invisible={patient.MTD_TREATMENT_STATUS === "C"}
                          >
                            {patient.MTD_TREATMENT_STATUS === "P"
                              ? "Pending"
                              : "Completed"}
                            {patient.PendingDrugsCount > 0 &&
                              ` (${patient.PendingDrugsCount})`}
                          </Badge>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<MedicalIcon />}
                            onClick={() => handleOpenDialog(patient)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody> */}
                  {/* <TableBody>
                    {filteredPatients.map((patient, index) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{patient.MPD_PATIENT_CODE}</TableCell>
                        <TableCell>{patient.MPD_PATIENT_NAME}</TableCell>
                        <TableCell>{patient.MPD_MOBILE_NO}</TableCell>
                        <TableCell align="center">
                          <StatusChip
                            status={patient.MTD_TREATMENT_STATUS}
                            pendingCount={patient.PendingDrugsCount}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<MedicalIcon />}
                            onClick={() => handleOpenDialog(patient)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody> */}
                  <TableBody>
                    {filteredPatients.map((patient, index) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          {new Date(patient.MTD_DATE).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{patient.MPD_PATIENT_CODE}</TableCell>
                        <TableCell>{patient.MPD_PATIENT_NAME}</TableCell>
                        <TableCell>{patient.MPD_MOBILE_NO}</TableCell>
                        <TableCell align="center">
                          <StatusChip
                            status={patient.MTD_TREATMENT_STATUS}
                            pendingCount={patient.PendingDrugsCount}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<MedicalIcon />}
                            onClick={() => handleOpenDialog(patient)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 100,
                }}
              >
                <Typography variant="body1" color="textSecondary">
                  No patients found
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="lg"
          fullScreen={isMobile}
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MedicalIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6" color="primary" fontWeight={600}>
                  Treatment Details - {selectedPatient?.MPD_PATIENT_NAME}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Prescribed by: {treatments?.MTD_DOCTOR}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {treatments?.Drugs && treatments.Drugs.length > 0 ? (
                  <TableContainer sx={{ maxHeight: 370 }}>
                    <Table size={isMobile ? "small" : "medium"}>
                      <TableHead
                        sx={{ backgroundColor: theme.palette.primary.light }}
                      >
                        <TableRow>
                          <TableCell padding="checkbox"></TableCell>
                          <TableCell
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Drug
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Dosage
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Prescribed
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Given
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Stock
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Rate
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {treatments.Drugs.map((drug, index) => {
                          const isOutOfStock =
                            drug.MDD_GIVEN_QUANTITY > drug.Stock;
                          const isLowStock = drug.Stock <= 5;
                          const isSelected = isDrugSelected(index);

                          return (
                            <TableRow
                              key={index}
                              hover
                              selected={isSelected}
                              // sx={{
                              //   backgroundColor: isOutOfStock
                              //     ? theme.palette.error.light
                              //     : "inherit",
                              //   "& .MuiTableCell-root": {
                              //     borderBottomColor: isOutOfStock
                              //       ? theme.palette.error.main
                              //       : "inherit",
                              //   },
                              // }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isSelected}
                                  onChange={(event) =>
                                    handleDrugSelection(index, event)
                                  }
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>{drug.DrugName}</TableCell>
                              <TableCell align="center">
                                {drug.MDD_TAKES}
                              </TableCell>
                              <TableCell align="center">
                                {drug.MDD_QUANTITY}
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  size="small"
                                  variant="outlined"
                                  value={drug.MDD_GIVEN_QUANTITY}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      index,
                                      Number(e.target.value),
                                    )
                                  }
                                  inputProps={{
                                    min: 0,
                                    max: drug.Stock,
                                    step: 1,
                                  }}
                                  sx={{
                                    width: 80,
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: isOutOfStock
                                        ? theme.palette.error.lighter
                                        : "inherit",
                                    },
                                  }}
                                  error={isOutOfStock}
                                />
                                {isOutOfStock && (
                                  <Typography
                                    variant="caption"
                                    color="error"
                                    display="block"
                                  >
                                    Max: {drug.Stock}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {drug.Stock}
                                  {isLowStock && (
                                    <Tooltip title="Low stock">
                                      <WarningIcon
                                        color="warning"
                                        fontSize="small"
                                        sx={{ ml: 0.5 }}
                                      />
                                    </Tooltip>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                {drug.MDD_RATE}
                              </TableCell>
                              <TableCell align="center">
                                {(
                                  drug.MDD_GIVEN_QUANTITY * drug.MDD_RATE
                                ).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 100,
                    }}
                  >
                    <Typography variant="body1" color="textSecondary">
                      No drugs prescribed for this treatment
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    p: 2,
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h6">
                    Total: Rs. {totaldrugfee.toFixed(2)}
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAndProceed}
              variant="contained"
              color="primary"
              disabled={loading || selectedMedicines.length === 0}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <InvoiceIcon />
                )
              }
            >
              {loading ? "Processing..." : "Generate Invoice"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {/* <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert> */}
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            variant="filled"
            sx={{
              width: "100%",
              minWidth: "420px",
              fontSize: "1.1rem",
              fontWeight: 600,
              py: 1.5,
              px: 2,
              borderRadius: "14px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              "& .MuiAlert-icon": {
                fontSize: "32px",
                alignItems: "center",
              },
              "& .MuiAlert-message": {
                fontSize: "1.05rem",
                fontWeight: 600,
              },
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}
