// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import axios from "../../../setup/axios";
// import "./Settings.css";
// import { FaSave, FaRedo, FaServer, FaEnvelope, FaCreditCard, FaGlobe, FaShieldAlt } from "react-icons/fa";

// const Settings = () => {
//     const [loading, setLoading] = useState(false);
//     const [generalSettings, setGeneralSettings] = useState({
//         siteName: "EeWeb - Electronic E-commerce",
//         siteDescription: "Your one-stop shop for electronic components and devices",
//         contactEmail: "contact@eeweb.com",
//         phoneNumber: "+84 123 456 789",
//         address: "123 Tech Street, Da Nang City, Vietnam"
//     });

//     const [emailSettings, setEmailSettings] = useState({
//         smtpHost: "smtp.example.com",
//         smtpPort: "587",
//         smtpUsername: "notifications@eeweb.com",
//         smtpPassword: "••••••••••",
//         senderName: "EeWeb Notifications",
//         senderEmail: "notifications@eeweb.com"
//     });

//     const [paymentSettings, setPaymentSettings] = useState({
//         currencyCode: "VND",
//         paypalEnabled: true,
//         stripeEnabled: false,
//         codEnabled: true,
//         paypalClientId: "your-paypal-client-id",
//         stripePublicKey: "",
//         taxRate: "10"
//     });

//     const [systemSettings, setSystemSettings] = useState({
//         maintenanceMode: false,
//         debugMode: false,
//         itemsPerPage: "12",
//         enableUserRegistration: true,
//         requireEmailVerification: true,
//         sessionTimeout: "60"
//     });

//     // Handle form inputs change
//     const handleGeneralChange = (e) => {
//         const { name, value } = e.target;
//         setGeneralSettings(prev => ({ ...prev, [name]: value }));
//     };

//     const handleEmailChange = (e) => {
//         const { name, value } = e.target;
//         setEmailSettings(prev => ({ ...prev, [name]: value }));
//     };

//     const handlePaymentChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setPaymentSettings(prev => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value
//         }));
//     };

//     const handleSystemChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setSystemSettings(prev => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value
//         }));
//     };

//     // Save settings
//     const saveSettings = async (settingType) => {
//         setLoading(true);
//         try {
//             let endpoint;
//             let data;
            
//             switch (settingType) {
//                 case 'general':
//                     endpoint = "/settings/general";
//                     data = generalSettings;
//                     break;
//                 case 'email':
//                     endpoint = "/settings/email";
//                     data = emailSettings;
//                     break;
//                 case 'payment':
//                     endpoint = "/settings/payment";
//                     data = paymentSettings;
//                     break;
//                 case 'system':
//                     endpoint = "/settings/system";
//                     data = systemSettings;
//                     break;
//                 default:
//                     throw new Error("Invalid settings type");
//             }
            
//             // Mock API call - replace with actual API when backend is ready
//             // const response = await axios.post(endpoint, data);
            
//             // Simulate API delay
//             await new Promise(resolve => setTimeout(resolve, 800));
            
//             toast.success(`${settingType.charAt(0).toUpperCase() + settingType.slice(1)} settings saved successfully`);
//         } catch (error) {
//             console.error(`Error saving ${settingType} settings:`, error);
//             toast.error(`Failed to save ${settingType} settings. Please try again.`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Reset form to last saved values
//     const resetForm = (settingType) => {
//         // For now, we'll just reset to the initial state
//         // In a real app, you would fetch the current values from the server
        
//         switch (settingType) {
//             case 'general':
//                 setGeneralSettings({
//                     siteName: "EeWeb - Electronic E-commerce",
//                     siteDescription: "Your one-stop shop for electronic components and devices",
//                     contactEmail: "contact@eeweb.com",
//                     phoneNumber: "+84 123 456 789",
//                     address: "123 Tech Street, Da Nang City, Vietnam"
//                 });
//                 break;
//             case 'email':
//                 setEmailSettings({
//                     smtpHost: "smtp.example.com",
//                     smtpPort: "587",
//                     smtpUsername: "notifications@eeweb.com",
//                     smtpPassword: "••••••••••",
//                     senderName: "EeWeb Notifications",
//                     senderEmail: "notifications@eeweb.com"
//                 });
//                 break;
//             case 'payment':
//                 setPaymentSettings({
//                     currencyCode: "VND",
//                     paypalEnabled: true,
//                     stripeEnabled: false,
//                     codEnabled: true,
//                     paypalClientId: "your-paypal-client-id",
//                     stripePublicKey: "",
//                     taxRate: "10"
//                 });
//                 break;
//             case 'system':
//                 setSystemSettings({
//                     maintenanceMode: false,
//                     debugMode: false,
//                     itemsPerPage: "12",
//                     enableUserRegistration: true,
//                     requireEmailVerification: true,
//                     sessionTimeout: "60"
//                 });
//                 break;
//             default:
//                 break;
//         }
        
//         toast.info(`${settingType.charAt(0).toUpperCase() + settingType.slice(1)} settings reset`);
//     };

//     return (
//         <div className="settings-container">
//             <div className="settings-header">
//                 <h2>System Settings</h2>
//                 <p className="text-muted">Manage your website configuration and preferences</p>
//             </div>

//             <div className="settings-grid">
//                 {/* General Settings */}
//                 <div className="settings-card">
//                     <div className="settings-card-header">
//                         <div className="settings-card-icon">
//                             <FaGlobe />
//                         </div>
//                         <h3>General Settings</h3>
//                     </div>
//                     <div className="settings-card-body">
//                         <div className="settings-form">
//                             <div className="form-group">
//                                 <label htmlFor="siteName">Site Name</label>
//                                 <input 
//                                     type="text" 
//                                     id="siteName"
//                                     name="siteName"
//                                     value={generalSettings.siteName}
//                                     onChange={handleGeneralChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="siteDescription">Site Description</label>
//                                 <textarea 
//                                     id="siteDescription"
//                                     name="siteDescription"
//                                     value={generalSettings.siteDescription}
//                                     onChange={handleGeneralChange}
//                                     rows="3"
//                                     className="form-control"
//                                 ></textarea>
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="contactEmail">Contact Email</label>
//                                 <input 
//                                     type="email" 
//                                     id="contactEmail"
//                                     name="contactEmail"
//                                     value={generalSettings.contactEmail}
//                                     onChange={handleGeneralChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="phoneNumber">Phone Number</label>
//                                 <input 
//                                     type="text" 
//                                     id="phoneNumber"
//                                     name="phoneNumber"
//                                     value={generalSettings.phoneNumber}
//                                     onChange={handleGeneralChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="address">Business Address</label>
//                                 <textarea 
//                                     id="address"
//                                     name="address"
//                                     value={generalSettings.address}
//                                     onChange={handleGeneralChange}
//                                     rows="2"
//                                     className="form-control"
//                                 ></textarea>
//                             </div>

//                             <div className="settings-form-actions">
//                                 <button 
//                                     className="btn-reset"
//                                     onClick={() => resetForm('general')}
//                                     disabled={loading}
//                                 >
//                                     <FaRedo /> Reset
//                                 </button>
//                                 <button 
//                                     className="btn-save"
//                                     onClick={() => saveSettings('general')}
//                                     disabled={loading}
//                                 >
//                                     <FaSave /> {loading ? "Saving..." : "Save Changes"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Email Settings */}
//                 <div className="settings-card">
//                     <div className="settings-card-header">
//                         <div className="settings-card-icon">
//                             <FaEnvelope />
//                         </div>
//                         <h3>Email Settings</h3>
//                     </div>
//                     <div className="settings-card-body">
//                         <div className="settings-form">
//                             <div className="form-group">
//                                 <label htmlFor="smtpHost">SMTP Host</label>
//                                 <input 
//                                     type="text" 
//                                     id="smtpHost"
//                                     name="smtpHost"
//                                     value={emailSettings.smtpHost}
//                                     onChange={handleEmailChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="smtpPort">SMTP Port</label>
//                                 <input 
//                                     type="text" 
//                                     id="smtpPort"
//                                     name="smtpPort"
//                                     value={emailSettings.smtpPort}
//                                     onChange={handleEmailChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="smtpUsername">SMTP Username</label>
//                                 <input 
//                                     type="text" 
//                                     id="smtpUsername"
//                                     name="smtpUsername"
//                                     value={emailSettings.smtpUsername}
//                                     onChange={handleEmailChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="smtpPassword">SMTP Password</label>
//                                 <input 
//                                     type="password" 
//                                     id="smtpPassword"
//                                     name="smtpPassword"
//                                     value={emailSettings.smtpPassword}
//                                     onChange={handleEmailChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="senderName">Sender Name</label>
//                                 <input 
//                                     type="text" 
//                                     id="senderName"
//                                     name="senderName"
//                                     value={emailSettings.senderName}
//                                     onChange={handleEmailChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="senderEmail">Sender Email</label>
//                                 <input 
//                                     type="email" 
//                                     id="senderEmail"
//                                     name="senderEmail"
//                                     value={emailSettings.senderEmail}
//                                     onChange={handleEmailChange}
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="settings-form-actions">
//                                 <button 
//                                     className="btn-reset"
//                                     onClick={() => resetForm('email')}
//                                     disabled={loading}
//                                 >
//                                     <FaRedo /> Reset
//                                 </button>
//                                 <button 
//                                     className="btn-save"
//                                     onClick={() => saveSettings('email')}
//                                     disabled={loading}
//                                 >
//                                     <FaSave /> {loading ? "Saving..." : "Save Changes"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Payment Settings */}
//                 <div className="settings-card">
//                     <div className="settings-card-header">
//                         <div className="settings-card-icon">
//                             <FaCreditCard />
//                         </div>
//                         <h3>Payment Settings</h3>
//                     </div>
//                     <div className="settings-card-body">
//                         <div className="settings-form">
//                             <div className="form-group">
//                                 <label htmlFor="currencyCode">Currency</label>
//                                 <select 
//                                     id="currencyCode"
//                                     name="currencyCode"
//                                     value={paymentSettings.currencyCode}
//                                     onChange={handlePaymentChange}
//                                     className="form-control"
//                                 >
//                                     <option value="VND">Vietnamese Dong (VND)</option>
//                                     <option value="USD">US Dollar (USD)</option>
//                                     <option value="EUR">Euro (EUR)</option>
//                                     <option value="GBP">British Pound (GBP)</option>
//                                 </select>
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="taxRate">Tax Rate (%)</label>
//                                 <input 
//                                     type="number" 
//                                     id="taxRate"
//                                     name="taxRate"
//                                     value={paymentSettings.taxRate}
//                                     onChange={handlePaymentChange}
//                                     min="0"
//                                     max="100"
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="form-group checkbox-group">
//                                 <input 
//                                     type="checkbox" 
//                                     id="paypalEnabled"
//                                     name="paypalEnabled"
//                                     checked={paymentSettings.paypalEnabled}
//                                     onChange={handlePaymentChange}
//                                 />
//                                 <label htmlFor="paypalEnabled">Enable PayPal</label>
//                             </div>

//                             {paymentSettings.paypalEnabled && (
//                                 <div className="form-group">
//                                     <label htmlFor="paypalClientId">PayPal Client ID</label>
//                                     <input 
//                                         type="text" 
//                                         id="paypalClientId"
//                                         name="paypalClientId"
//                                         value={paymentSettings.paypalClientId}
//                                         onChange={handlePaymentChange}
//                                         className="form-control"
//                                     />
//                                 </div>
//                             )}

//                             <div className="form-group checkbox-group">
//                                 <input 
//                                     type="checkbox" 
//                                     id="stripeEnabled"
//                                     name="stripeEnabled"
//                                     checked={paymentSettings.stripeEnabled}
//                                     onChange={handlePaymentChange}
//                                 />
//                                 <label htmlFor="stripeEnabled">Enable Stripe</label>
//                             </div>

//                             {paymentSettings.stripeEnabled && (
//                                 <div className="form-group">
//                                     <label htmlFor="stripePublicKey">Stripe Public Key</label>
//                                     <input 
//                                         type="text" 
//                                         id="stripePublicKey"
//                                         name="stripePublicKey"
//                                         value={paymentSettings.stripePublicKey}
//                                         onChange={handlePaymentChange}
//                                         className="form-control"
//                                     />
//                                 </div>
//                             )}

//                             <div className="form-group checkbox-group">
//                                 <input 
//                                     type="checkbox" 
//                                     id="codEnabled"
//                                     name="codEnabled"
//                                     checked={paymentSettings.codEnabled}
//                                     onChange={handlePaymentChange}
//                                 />
//                                 <label htmlFor="codEnabled">Enable Cash on Delivery</label>
//                             </div>

//                             <div className="settings-form-actions">
//                                 <button 
//                                     className="btn-reset"
//                                     onClick={() => resetForm('payment')}
//                                     disabled={loading}
//                                 >
//                                     <FaRedo /> Reset
//                                 </button>
//                                 <button 
//                                     className="btn-save"
//                                     onClick={() => saveSettings('payment')}
//                                     disabled={loading}
//                                 >
//                                     <FaSave /> {loading ? "Saving..." : "Save Changes"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* System Settings */}
//                 <div className="settings-card">
//                     <div className="settings-card-header">
//                         <div className="settings-card-icon">
//                             <FaServer />
//                         </div>
//                         <h3>System Settings</h3>
//                     </div>
//                     <div className="settings-card-body">
//                         <div className="settings-form">
//                             <div className="form-group">
//                                 <label htmlFor="itemsPerPage">Products Per Page</label>
//                                 <select 
//                                     id="itemsPerPage"
//                                     name="itemsPerPage"
//                                     value={systemSettings.itemsPerPage}
//                                     onChange={handleSystemChange}
//                                     className="form-control"
//                                 >
//                                     <option value="8">8</option>
//                                     <option value="12">12</option>
//                                     <option value="16">16</option>
//                                     <option value="24">24</option>
//                                     <option value="36">36</option>
//                                 </select>
//                             </div>

//                             <div className="form-group">
//                                 <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
//                                 <input 
//                                     type="number" 
//                                     id="sessionTimeout"
//                                     name="sessionTimeout"
//                                     value={systemSettings.sessionTimeout}
//                                     onChange={handleSystemChange}
//                                     className="form-control"
//                                     min="5"
//                                 />
//                             </div>

//                             <div className="form-group checkbox-group">
//                                 <input 
//                                     type="checkbox" 
//                                     id="maintenanceMode"
//                                     name="maintenanceMode"
//                                     checked={systemSettings.maintenanceMode}
//                                     onChange={handleSystemChange}
//                                 />
//                                 <label htmlFor="maintenanceMode">Maintenance Mode</label>
//                             </div>

//                             <div className="form-group checkbox-group">
//                                 <input 
//                                     type="checkbox" 
//                                     id="debugMode"
//                                     name="debugMode"
//                                     checked={systemSettings.debugMode}
//                                     onChange={handleSystemChange}
//                                 />
//                                 <label htmlFor="debugMode">Debug Mode</label>
//                             </div>

//                             <div className="form-group checkbox-group">
//                                 <input 
//                                     type="checkbox" 
//                                     id="enableUserRegistration"
//                                     name="enableUserRegistration"
//                                     checked={systemSettings.enableUserRegistration}
//                                     onChange={handleSystemChange}
//                                 />
//                                 <label htmlFor="enableUserRegistration">Enable User Registration</label>
//                             </div>

//                             <div className="form-group checkbox-group">
//                                 <input 
//                                     type="checkbox" 
//                                     id="requireEmailVerification"
//                                     name="requireEmailVerification"
//                                     checked={systemSettings.requireEmailVerification}
//                                     onChange={handleSystemChange}
//                                 />
//                                 <label htmlFor="requireEmailVerification">Require Email Verification</label>
//                             </div>

//                             <div className="settings-form-actions">
//                                 <button 
//                                     className="btn-reset"
//                                     onClick={() => resetForm('system')}
//                                     disabled={loading}
//                                 >
//                                     <FaRedo /> Reset
//                                 </button>
//                                 <button 
//                                     className="btn-save"
//                                     onClick={() => saveSettings('system')}
//                                     disabled={loading}
//                                 >
//                                     <FaSave /> {loading ? "Saving..." : "Save Changes"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Settings;