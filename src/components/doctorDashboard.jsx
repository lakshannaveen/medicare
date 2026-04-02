// import React, { useState, useEffect } from 'react';
// import { NavLink, Outlet } from 'react-router-dom';
// import '../styles/doctorDashboard.css';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/medicare_logo.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faSignOutAlt, faHistory, faPills, faCalendarAlt, faClock, faUserMd, faClinicMedical, faTimes, faFlask } from '@fortawesome/free-solid-svg-icons';
// import { FaCaretDown, FaBars } from 'react-icons/fa';

// export default function Doctordashboard() {
//     const [isOpen, setIsOpen] = useState(true);
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const role = localStorage.getItem('Role');

//     // Pre-load Appointment interface for doctors when component mounts
//     useEffect(() => {
//         if (role === 'Doc') {
//             // Pre-fetch appointments data or pre-load the appointments component
//             setLoading(true);
//             // You can add logic here to pre-fetch appointments data
//             // For example: dispatch(fetchTodayAppointments());
            
//             // Simulate pre-loading completion
//             const timer = setTimeout(() => {
//                 setLoading(false);
//             }, 1000);
            
//             return () => clearTimeout(timer);
//         }
//     }, [role]);

//     const toggleNavbar = () => {
//         setIsOpen(!isOpen);
//         setShowMobileMenu(!showMobileMenu);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('Token');
//         localStorage.removeItem('Role');
//         navigate('/admin');
//     };

//     const closeSidebar = () => {
//         setShowMobileMenu(false);
//     };

//     return (
//         <div className={`doctorDashboard ${isOpen ? 'open' : 'closed'}`}>
//             {/* Sidebar */}
//             <div className={`sidebar ${isOpen ? 'open' : 'closed'} ${showMobileMenu ? 'show-mobile' : ''}`}>
//                 <div className="logo">
//                     <img src={logo} alt="Doctor Dashboard Logo" />
//                     {/* Close button for mobile view */}
//                     <FontAwesomeIcon
//                         icon={faTimes}
//                         className="close-icon"
//                         onClick={closeSidebar}
//                     />
//                 </div>
//                 <ul className="menu">
//                     {['Doc', 'Admin', 'Phuser'].includes(role) && (
//                         <li>
//                             <NavLink
//                                 to="daily-appointments"
//                                 className={({ isActive }) =>
//                                     isActive ? "active-tab" : ""
//                                 }
//                                 onClick={closeSidebar}
//                             >
//                                 <FontAwesomeIcon icon={faCalendarAlt} /> {isOpen && 'Appointments'}
//                                 {role === 'Doc' && loading && <span className="loading-indicator">Loading...</span>}
//                             </NavLink>
//                         </li>
//                     )}
                   
//                     <li>
//                         <NavLink
//                             to="/dashboard/medical-history"
//                             className={({ isActive }) =>
//                                 isActive ? "active-tab" : ""
//                             }
//                             onClick={closeSidebar}
//                         >
//                             <FontAwesomeIcon icon={faHistory} /> {isOpen && 'Patient Details'}
//                         </NavLink>
//                     </li>
                   
//                     <li>
//                         <NavLink
//                             to="register-medicines"
//                             className={({ isActive }) =>
//                                 isActive ? "active-tab" : ""
//                             }
//                             onClick={closeSidebar}
//                         >
//                             <FontAwesomeIcon icon={faPills} /> {isOpen && 'Drug details'}
//                         </NavLink>
//                     </li>

//                     {/* Laboratory Section - Available for both Doctor and Admin */}
//                     {(role === 'Doc' || role === 'Admin') && (
//                         <li>
//                             <NavLink
//                                 to="laboratory"
//                                 className={({ isActive }) =>
//                                     isActive ? "active-tab" : ""
//                                 }
//                                 onClick={closeSidebar}
//                             >
//                                 <FontAwesomeIcon icon={faFlask} /> {isOpen && 'Laboratory'}
//                             </NavLink>
//                         </li>
//                     )}

//                     <li>
//                         <NavLink
//                             to="pharmacy"
//                             className={({ isActive }) =>
//                                 isActive ? "active-tab" : ""
//                             }
//                             onClick={closeSidebar}
//                         >
//                             <FontAwesomeIcon icon={faClinicMedical} /> {isOpen && 'Pharmacy'}
//                         </NavLink>
//                     </li>
                    
//                     <li>
//                         <NavLink
//                             to="doctor-profile"
//                             className={({ isActive }) =>
//                                 isActive ? "active-tab" : ""
//                             }
//                             onClick={closeSidebar}
//                         >
//                             <FontAwesomeIcon icon={faUserMd} /> {isOpen && 'User Profile'}
//                         </NavLink>
//                     </li>

                    
//                     {/* Admin-specific routes */}
//                     {role === 'Admin' && (
//                         <>
//                             <li>
//                                 <NavLink
//                                     to="add-timeslot"
//                                     className={({ isActive }) =>
//                                         isActive ? "active-tab" : ""
//                                     }
//                                     onClick={closeSidebar}
//                                 >
//                                     <FontAwesomeIcon icon={faClock} /> {isOpen && 'Add Timeslots'}
//                                 </NavLink>
//                             </li>
//                             <li>
//                                 <NavLink
//                                     to="add-users"
//                                     className={({ isActive }) =>
//                                         isActive ? "active-tab" : ""
//                                     }
//                                     onClick={closeSidebar}
//                                 >
//                                     <FontAwesomeIcon icon={faUserMd} /> {isOpen && 'Add Users'}
//                                 </NavLink>
//                             </li>
//                         </>
//                     )}

//                      {/* Laboratory Section - Available for both Doctor and Admin */}
//                     {(role === 'Lab') && (
//                         <li>
//                             <NavLink
//                                 to="laboratoryDashboard"
//                                 className={({ isActive }) =>
//                                     isActive ? "active-tab" : ""
//                                 }
//                                 onClick={closeSidebar}
//                             >
//                                 <FontAwesomeIcon icon={faFlask} /> {isOpen && 'Laboratory Dashboard'}
//                             </NavLink>
//                         </li>
//                     )}

//                 </ul>

//                 <ul className="below">
//                     <li onClick={handleLogout}>
//                         <FontAwesomeIcon icon={faSignOutAlt} /> Logout
//                     </li>
//                 </ul>
//             </div>

//             {/* Main Content */}
//             <div className={`main-content1 ${isOpen && window.innerWidth <= 600 ? 'hide-content' : ''}`}>
//                 <FontAwesomeIcon
//                     icon={faBars}
//                     className="menu-icon"
//                     onClick={() => setShowMobileMenu(!showMobileMenu)}
//                 />
                
//                 {/* Loading indicator for appointments pre-loading */}
//                 {role === 'Doc' && loading && (
//                     <div className="preload-indicator">
//                         <div className="spinner"></div>
//                         <p>Loading appointments...</p>
//                     </div>
//                 )}
                
//                 <Outlet />
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../styles/doctorDashboard.css';
import logo from '../assets/medicare_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSignOutAlt,
  faHistory,
  faPills,
  faCalendarAlt,
  faClock,
  faUserMd,
  faClinicMedical,
  faTimes,
  faFlask
} from '@fortawesome/free-solid-svg-icons';

export default function Doctordashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('Role');

  useEffect(() => {
    if (role === 'Doc') {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [role]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    setShowMobileMenu(!showMobileMenu);
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;
    localStorage.removeItem('Token');
    localStorage.removeItem('Role');
    navigate('/admin');
  };

  const closeSidebar = () => {
    setShowMobileMenu(false);
  };

  return (
    <div className={`doctorDashboard ${isOpen ? 'open' : 'closed'}`}>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'} ${showMobileMenu ? 'show-mobile' : ''}`}>
        <div className="logo">
          <img src={logo} alt="Logo" />
          <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={closeSidebar} />
        </div>

        <ul className="menu">

          {/* ================= LAB USER ================= */}
          {role === 'Lab' && (
            <li>
              <NavLink
                to="laboratoryDashboard"
                className={({ isActive }) => (isActive ? "active-tab" : "")}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faFlask} /> {isOpen && 'Laboratory Dashboard'}
              </NavLink>
            </li>
          )}

          {/* ================= DOCTOR / ADMIN / PHUSER ================= */}
          {['Doc', 'Admin', 'Phuser'].includes(role) && (
            <>
              <li>
                <NavLink
                  to="daily-appointments"
                  className={({ isActive }) => (isActive ? "active-tab" : "")}
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} /> {isOpen && 'Appointments'}
                  {role === 'Doc' && loading && <span className="loading-indicator">Loading...</span>}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="medical-history"
                  className={({ isActive }) => (isActive ? "active-tab" : "")}
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faHistory} /> {isOpen && 'Patient Details'}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="register-medicines"
                  className={({ isActive }) => (isActive ? "active-tab" : "")}
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faPills} /> {isOpen && 'Drug Details'}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="laboratory"
                  className={({ isActive }) => (isActive ? "active-tab" : "")}
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faFlask} /> {isOpen && 'Laboratory'}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="pharmacy"
                  className={({ isActive }) => (isActive ? "active-tab" : "")}
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faClinicMedical} /> {isOpen && 'Pharmacy'}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="doctor-profile"
                  className={({ isActive }) => (isActive ? "active-tab" : "")}
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faUserMd} /> {isOpen && 'User Profile'}
                </NavLink>
              </li>
            </>
          )}

          {/* ================= ADMIN ONLY ================= */}
          {role === 'Admin' && (
            <>
              <li>
                <NavLink
                  to="add-timeslot"
                  className={({ isActive }) => (isActive ? "active-tab" : "")}
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faClock} /> {isOpen && 'Add Timeslots'}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="add-users"
                  className={({ isActive }) => (isActive ? "active-tab" : "")}
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faUserMd} /> {isOpen && 'Add Users'}
                </NavLink>
              </li>
            </>
          )}

        </ul>

        {/* Logout */}
        <ul className="below">
          <li onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content1 ${isOpen && window.innerWidth <= 600 ? 'hide-content' : ''}`}>
        <FontAwesomeIcon
          icon={faBars}
          className="menu-icon"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        />

        {role === 'Doc' && loading && (
          <div className="preload-indicator">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
}