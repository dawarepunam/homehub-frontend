
// "use client";

// import { useState } from "react";
// import styles from "./AuthMethodModal.module.css";

// export default function AuthMethodModal({
//   role = "User",
//   onClose,
// }) {
//   const [method, setMethod] = useState("mobile");

//   const isUser = role === "User";

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>

//         {/* Close */}
//         <button
//           type="button"
//           className={styles.closeButton}
//           onClick={onClose}
//           aria-label="Close"
//         >
//           ×
//         </button>

//         {/* Header */}
//         <div className={styles.header}>
//           <span className={styles.roleBadge}>
//             {isUser ? "👤" : "🏠"}
//           </span>

//           <h2>
//             Login / Sign Up
//           </h2>

//           <p>
//             Continue as{" "}
//             <strong>{role}</strong>
//           </p>
//         </div>

//         {/* Mobile / Email Toggle */}
//         <div className={styles.methodToggle}>

//           <button
//             type="button"
//             className={
//               method === "mobile"
//                 ? `${styles.methodButton} ${styles.active}`
//                 : styles.methodButton
//             }
//             onClick={() => setMethod("mobile")}
//           >
//             <span>📱</span>
//             Mobile
//           </button>

//           <button
//             type="button"
//             className={
//               method === "email"
//                 ? `${styles.methodButton} ${styles.active}`
//                 : styles.methodButton
//             }
//             onClick={() => setMethod("email")}
//           >
//             <span>✉</span>
//             Email
//           </button>

//         </div>

//         {/* Form */}
//         <div className={styles.form}>

//           {method === "mobile" ? (
//             <>
//               <label htmlFor="mobile">
//                 Mobile Number
//               </label>

//               <div className={styles.mobileInput}>
//                 <span className={styles.countryCode}>
//                   +91
//                 </span>

//                 <input
//                   id="mobile"
//                   type="tel"
//                   inputMode="numeric"
//                   maxLength={10}
//                   placeholder="Enter mobile number"
//                 />
//               </div>
//             </>
//           ) : (
//             <>
//               <label htmlFor="email">
//                 Email Address
//               </label>

//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email address"
//                 className={styles.input}
//               />
//             </>
//           )}

//           <button
//             type="button"
//             className={styles.continueButton}
//           >
//             Continue →
//           </button>

//         </div>

//         {/* Divider */}
//         <div className={styles.divider}>
//           <span>or continue with</span>
//         </div>

//         {/* Google */}
//         <button
//           type="button"
//           className={styles.googleButton}
//         >
//           <span className={styles.googleIcon}>G</span>
//           Continue with Google
//         </button>

//         {/* Footer */}
//         <p className={styles.footerText}>
//           By continuing, you agree to HomeHub&apos;s{" "}
//           <span>Terms & Privacy Policy</span>
//         </p>

//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import styles from "./AuthMethodModal.module.css";

// export default function AuthMethodModal({
//   role = "User",
//   onClose,
// }) {
//   const [method, setMethod] = useState("mobile");

//   // Input values
//   const [mobile, setMobile] = useState("");
//   const [email, setEmail] = useState("");

//   // Next step
//   const [showVerification, setShowVerification] = useState(false);

//   const isUser = role === "User";

//   // =========================
//   // CONTINUE
//   // =========================
//   const handleContinue = () => {
//     if (method === "mobile") {
//       const cleanMobile = mobile.replace(/\D/g, "");

//       if (cleanMobile.length !== 10) {
//         alert("Please enter a valid 10-digit mobile number.");
//         return;
//       }
//     }

//     if (method === "email") {
//       const emailValue = email.trim();

//       if (!emailValue) {
//         alert("Please enter your email address.");
//         return;
//       }

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//       if (!emailRegex.test(emailValue)) {
//         alert("Please enter a valid email address.");
//         return;
//       }
//     }

//     // Move to verification step
//     setShowVerification(true);
//   };

//   // =========================
//   // VERIFICATION SCREEN
//   // =========================
//   if (showVerification) {
//     return (
//       <div className={styles.overlay}>
//         <div className={styles.modal}>

//           {/* Close */}
//           <button
//             type="button"
//             className={styles.closeButton}
//             onClick={onClose}
//             aria-label="Close"
//           >
//             ×
//           </button>

//           {/* Header */}
//           <div className={styles.header}>

//             <span className={styles.roleBadge}>
//               {isUser ? "👤" : "🏠"}
//             </span>

//             <h2>
//               Verify Your {method === "mobile" ? "Mobile" : "Email"}
//             </h2>

//             <p>
//               We&apos;ll verify your{" "}
//               {method === "mobile"
//                 ? "mobile number"
//                 : "email address"}{" "}
//               to continue as <strong>{role}</strong>.
//             </p>
//           </div>

//           {/* Verification Information */}
//           <div
//             style={{
//               padding: "16px",
//               marginBottom: "20px",
//               borderRadius: "14px",
//               background: "#f6f4ec",
//               border: "1px solid #e4dfcf",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "13px",
//                 color: "#77736a",
//                 marginBottom: "6px",
//               }}
//             >
//               {method === "mobile"
//                 ? "Mobile Number"
//                 : "Email Address"}
//             </div>

//             <div
//               style={{
//                 fontSize: "16px",
//                 fontWeight: 700,
//                 color: "#18352a",
//               }}
//             >
//               {method === "mobile"
//                 ? `+91 ${mobile}`
//                 : email}
//             </div>
//           </div>

//           {/* OTP Input */}
//           <div className={styles.form}>

//             <label htmlFor="verificationCode">
//               Enter Verification Code
//             </label>

//             <input
//               id="verificationCode"
//               type="text"
//               inputMode="numeric"
//               maxLength={6}
//               placeholder="Enter 6-digit code"
//               className={styles.input}
//             />

//             <button
//               type="button"
//               className={styles.continueButton}
//               onClick={() => {
//                 alert(
//                   `${role} ${method} verification step is ready.`
//                 );
//               }}
//             >
//               Verify & Continue →
//             </button>

//           </div>

//           {/* Back */}
//           <button
//             type="button"
//             onClick={() => setShowVerification(false)}
//             style={{
//               width: "100%",
//               marginTop: "12px",
//               padding: "12px",
//               border: "none",
//               background: "transparent",
//               color: "#176b4d",
//               fontSize: "14px",
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             ← Change {method === "mobile" ? "mobile" : "email"}
//           </button>

//           <p className={styles.footerText}>
//             By continuing, you agree to HomeHub&apos;s{" "}
//             <span>Terms & Privacy Policy</span>
//           </p>

//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // MOBILE / EMAIL SCREEN
//   // =========================
//   return (
//     <div className={styles.overlay}>

//       <div className={styles.modal}>

//         {/* Close */}
//         <button
//           type="button"
//           className={styles.closeButton}
//           onClick={onClose}
//           aria-label="Close"
//         >
//           ×
//         </button>

//         {/* Header */}
//         <div className={styles.header}>

//           <span className={styles.roleBadge}>
//             {isUser ? "👤" : "🏠"}
//           </span>

//           <h2>
//             Login / Sign Up
//           </h2>

//           <p>
//             Continue as <strong>{role}</strong>
//           </p>

//         </div>

//         {/* Mobile / Email Toggle */}
//         <div className={styles.methodToggle}>

//           <button
//             type="button"
//             className={
//               method === "mobile"
//                 ? `${styles.methodButton} ${styles.active}`
//                 : styles.methodButton
//             }
//             onClick={() => setMethod("mobile")}
//           >
//             <span>📱</span>
//             Mobile
//           </button>

//           <button
//             type="button"
//             className={
//               method === "email"
//                 ? `${styles.methodButton} ${styles.active}`
//                 : styles.methodButton
//             }
//             onClick={() => setMethod("email")}
//           >
//             <span>✉</span>
//             Email
//           </button>

//         </div>

//         {/* Form */}
//         <div className={styles.form}>

//           {/* MOBILE */}
//           {method === "mobile" ? (
//             <>
//               <label htmlFor="mobile">
//                 Mobile Number
//               </label>

//               <div className={styles.mobileInput}>

//                 <span className={styles.countryCode}>
//                   +91
//                 </span>

//                 <input
//                   id="mobile"
//                   type="tel"
//                   inputMode="numeric"
//                   maxLength={10}
//                   value={mobile}
//                   onChange={(e) => {
//                     const value =
//                       e.target.value.replace(/\D/g, "");

//                     setMobile(value);
//                   }}
//                   placeholder="Enter mobile number"
//                 />

//               </div>
//             </>
//           ) : (
//             /* EMAIL */
//             <>
//               <label htmlFor="email">
//                 Email Address
//               </label>

//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) =>
//                   setEmail(e.target.value)
//                 }
//                 placeholder="Enter your email address"
//                 className={styles.input}
//               />
//             </>
//           )}

//           {/* Continue */}
//           <button
//             type="button"
//             className={styles.continueButton}
//             onClick={handleContinue}
//           >
//             Continue →
//           </button>

//         </div>

//         {/* Divider */}
//         <div className={styles.divider}>
//           <span>or continue with</span>
//         </div>

//         {/* Google */}
//         <button
//           type="button"
//           className={styles.googleButton}
//           onClick={() => {
//             alert(
//               `Google login will continue as ${role}.`
//             );
//           }}
//         >
//           <span className={styles.googleIcon}>
//             G
//           </span>

//           Continue with Google
//         </button>

//         {/* Footer */}
//         <p className={styles.footerText}>
//           By continuing, you agree to HomeHub&apos;s{" "}
//           <span>Terms & Privacy Policy</span>
//         </p>

//       </div>

//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import styles from "./AuthMethodModal.module.css";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL ||
//   "http://localhost:1337/api";

// export default function AuthMethodModal({
//   role = "User",
//   onClose,
// }) {
//   const [method, setMethod] = useState("mobile");

//   const [mobile, setMobile] = useState("");
//   const [email, setEmail] = useState("");

//   const [otp, setOtp] = useState("");

//   const [showVerification, setShowVerification] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const [otpSentTo, setOtpSentTo] = useState("");

//   const isUser = role === "User";

//   // ==========================================
//   // SEND OTP
//   // ==========================================

//   const handleContinue = async () => {
//     setError("");
//     setMessage("");

//     // --------------------------
//     // MOBILE VALIDATION
//     // --------------------------

//     if (method === "mobile") {
//       const cleanMobile = mobile.replace(/\D/g, "");

//       if (cleanMobile.length !== 10) {
//         setError(
//           "Please enter a valid 10-digit mobile number."
//         );
//         return;
//       }

//       setLoading(true);

//       try {
//         const response = await fetch(
//           `${STRAPI_URL}/auth/request-otp`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               role: role.toLowerCase(),
//               method: "mobile",
//               mobile: cleanMobile,
//             }),
//           }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(
//             data?.error?.message ||
//               data?.message ||
//               "Unable to send OTP."
//           );
//         }

//         setOtpSentTo(`+91 ${cleanMobile}`);

//         setMessage(
//           data?.message ||
//             "OTP sent successfully to your mobile number."
//         );

//         setShowVerification(true);
//       } catch (err) {
//         console.error("Mobile OTP Error:", err);

//         setError(
//           err.message ||
//             "Something went wrong while sending OTP."
//         );
//       } finally {
//         setLoading(false);
//       }

//       return;
//     }

//     // --------------------------
//     // EMAIL VALIDATION
//     // --------------------------

//     const emailValue = email.trim();

//     if (!emailValue) {
//       setError("Please enter your email address.");
//       return;
//     }

//     const emailRegex =
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(emailValue)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(
//         `${STRAPI_URL}/auth/request-otp`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             role: role.toLowerCase(),
//             method: "email",
//             email: emailValue,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data?.error?.message ||
//             data?.message ||
//             "Unable to send OTP."
//         );
//       }

//       setOtpSentTo(emailValue);

//       setMessage(
//         data?.message ||
//           "OTP sent successfully to your email."
//       );

//       setShowVerification(true);
//     } catch (err) {
//       console.error("Email OTP Error:", err);

//       setError(
//         err.message ||
//           "Something went wrong while sending OTP."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // VERIFY OTP
//   // ==========================================

//   const handleVerifyOTP = async () => {
//     setError("");
//     setMessage("");

//     const cleanOtp = otp.replace(/\D/g, "");

//     if (cleanOtp.length !== 6) {
//       setError("Please enter the 6-digit OTP.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const body = {
//         role: role.toLowerCase(),
//         method,
//         otp: cleanOtp,
//       };

//       if (method === "mobile") {
//         body.mobile = mobile;
//       } else {
//         body.email = email.trim();
//       }

//       const response = await fetch(
//         `${STRAPI_URL}/auth/verify-otp`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(body),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data?.error?.message ||
//             data?.message ||
//             "Invalid OTP."
//         );
//       }

//       // --------------------------------
//       // LOGIN SUCCESS
//       // --------------------------------

//       if (data?.token) {
//         localStorage.setItem(
//           "homehub_token",
//           data.token
//         );
//       }

//       if (data?.user) {
//         localStorage.setItem(
//           "homehub_user",
//           JSON.stringify(data.user)
//         );
//       }

//       setMessage(
//         data?.message ||
//           `Welcome to HomeHub! You are logged in as ${role}.`
//       );

//       // Give backend response a moment
//       // before closing modal.
//       setTimeout(() => {
//         onClose?.();
//       }, 800);
//     } catch (err) {
//       console.error("OTP Verification Error:", err);

//       setError(
//         err.message ||
//           "OTP verification failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // GOOGLE LOGIN
//   // ==========================================

//   const handleGoogleLogin = () => {
//     /*
//       Google provider will be connected later
//       through Strapi Users & Permissions.

//       For now we open the Strapi Google
//       authentication endpoint.
//     */

//     const googleAuthUrl =
//       `${STRAPI_URL}/connect/google` +
//       `?role=${encodeURIComponent(
//         role.toLowerCase()
//       )}`;

//     window.location.href = googleAuthUrl;
//   };

//   // ==========================================
//   // VERIFICATION SCREEN
//   // ==========================================

//   if (showVerification) {
//     return (
//       <div className={styles.overlay}>
//         <div className={styles.modal}>

//           {/* Close */}
//           <button
//             type="button"
//             className={styles.closeButton}
//             onClick={onClose}
//             aria-label="Close"
//           >
//             ×
//           </button>

//           {/* Header */}
//           <div className={styles.header}>

//             <span className={styles.roleBadge}>
//               {isUser ? "👤" : "🏠"}
//             </span>

//             <h2>
//               Verify Your{" "}
//               {method === "mobile"
//                 ? "Mobile"
//                 : "Email"}
//             </h2>

//             <p>
//               Enter the verification code sent to{" "}
//               <strong>{otpSentTo}</strong>
//             </p>

//           </div>

//           {/* Success Message */}
//           {message && (
//             <div
//               style={{
//                 marginBottom: "16px",
//                 padding: "12px 14px",
//                 borderRadius: "10px",
//                 background: "#edf8f2",
//                 border:
//                   "1px solid #cde8d9",
//                 color: "#176b4d",
//                 fontSize: "13px",
//                 lineHeight: 1.5,
//               }}
//             >
//               {message}
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div
//               style={{
//                 marginBottom: "16px",
//                 padding: "12px 14px",
//                 borderRadius: "10px",
//                 background: "#fff1f0",
//                 border:
//                   "1px solid #f1c8c4",
//                 color: "#b42318",
//                 fontSize: "13px",
//                 lineHeight: 1.5,
//               }}
//             >
//               {error}
//             </div>
//           )}

//           {/* OTP Form */}
//           <div className={styles.form}>

//             <label htmlFor="verificationCode">
//               Enter 6-digit OTP
//             </label>

//             <input
//               id="verificationCode"
//               type="text"
//               inputMode="numeric"
//               maxLength={6}
//               value={otp}
//               onChange={(e) => {
//                 const value =
//                   e.target.value.replace(
//                     /\D/g,
//                     ""
//                   );

//                 setOtp(value);
//               }}
//               placeholder="Enter OTP"
//               className={styles.input}
//               autoFocus
//             />

//             <button
//               type="button"
//               className={styles.continueButton}
//               onClick={handleVerifyOTP}
//               disabled={loading}
//             >
//               {loading
//                 ? "Verifying..."
//                 : "Verify & Continue →"}
//             </button>

//           </div>

//           {/* Change Method */}
//           <button
//             type="button"
//             onClick={() => {
//               setShowVerification(false);
//               setOtp("");
//               setMessage("");
//               setError("");
//             }}
//             style={{
//               width: "100%",
//               marginTop: "12px",
//               padding: "12px",
//               border: "none",
//               background: "transparent",
//               color: "#176b4d",
//               fontSize: "14px",
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             ← Change{" "}
//             {method === "mobile"
//               ? "mobile number"
//               : "email address"}
//           </button>

//           <p className={styles.footerText}>
//             By continuing, you agree to HomeHub&apos;s{" "}
//             <span>
//               Terms & Privacy Policy
//             </span>
//           </p>

//         </div>
//       </div>
//     );
//   }

//   // ==========================================
//   // MOBILE / EMAIL SCREEN
//   // ==========================================

//   return (
//     <div className={styles.overlay}>

//       <div className={styles.modal}>

//         {/* Close */}
//         <button
//           type="button"
//           className={styles.closeButton}
//           onClick={onClose}
//           aria-label="Close"
//         >
//           ×
//         </button>

//         {/* Header */}
//         <div className={styles.header}>

//           <span className={styles.roleBadge}>
//             {isUser ? "👤" : "🏠"}
//           </span>

//           <h2>
//             Login / Sign Up
//           </h2>

//           <p>
//             Continue as{" "}
//             <strong>{role}</strong>
//           </p>

//         </div>

//         {/* Mobile / Email Toggle */}
//         <div className={styles.methodToggle}>

//           <button
//             type="button"
//             className={
//               method === "mobile"
//                 ? `${styles.methodButton} ${styles.active}`
//                 : styles.methodButton
//             }
//             onClick={() => {
//               setMethod("mobile");
//               setError("");
//               setMessage("");
//             }}
//           >
//             <span>📱</span>
//             Mobile
//           </button>

//           <button
//             type="button"
//             className={
//               method === "email"
//                 ? `${styles.methodButton} ${styles.active}`
//                 : styles.methodButton
//             }
//             onClick={() => {
//               setMethod("email");
//               setError("");
//               setMessage("");
//             }}
//           >
//             <span>✉</span>
//             Email
//           </button>

//         </div>

//         {/* Error */}
//         {error && (
//           <div
//             style={{
//               marginTop: "16px",
//               padding: "12px 14px",
//               borderRadius: "10px",
//               background: "#fff1f0",
//               border:
//                 "1px solid #f1c8c4",
//               color: "#b42318",
//               fontSize: "13px",
//               lineHeight: 1.5,
//             }}
//           >
//             {error}
//           </div>
//         )}

//         {/* Success */}
//         {message && (
//           <div
//             style={{
//               marginTop: "16px",
//               padding: "12px 14px",
//               borderRadius: "10px",
//               background: "#edf8f2",
//               border:
//                 "1px solid #cde8d9",
//               color: "#176b4d",
//               fontSize: "13px",
//               lineHeight: 1.5,
//             }}
//           >
//             {message}
//           </div>
//         )}

//         {/* Form */}
//         <div className={styles.form}>

//           {/* MOBILE */}
//           {method === "mobile" ? (
//             <>
//               <label htmlFor="mobile">
//                 Mobile Number
//               </label>

//               <div className={styles.mobileInput}>

//                 <span
//                   className={styles.countryCode}
//                 >
//                   +91
//                 </span>

//                 <input
//                   id="mobile"
//                   type="tel"
//                   inputMode="numeric"
//                   maxLength={10}
//                   value={mobile}
//                   onChange={(e) => {
//                     const value =
//                       e.target.value.replace(
//                         /\D/g,
//                         ""
//                       );

//                     setMobile(value);
//                   }}
//                   placeholder="Enter mobile number"
//                 />

//               </div>
//             </>
//           ) : (
//             /* EMAIL */
//             <>
//               <label htmlFor="email">
//                 Email Address
//               </label>

//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) =>
//                   setEmail(e.target.value)
//                 }
//                 placeholder="Enter your email address"
//                 className={styles.input}
//               />
//             </>
//           )}

//           {/* Continue */}
//           <button
//             type="button"
//             className={styles.continueButton}
//             onClick={handleContinue}
//             disabled={loading}
//           >
//             {loading
//               ? "Sending OTP..."
//               : "Continue →"}
//           </button>

//         </div>

//         {/* Divider */}
//         <div className={styles.divider}>
//           <span>
//             or continue with
//           </span>
//         </div>

//         {/* Google */}
//         <button
//           type="button"
//           className={styles.googleButton}
//           onClick={handleGoogleLogin}
//           disabled={loading}
//         >
//           <span
//             className={styles.googleIcon}
//           >
//             G
//           </span>

//           Continue with Google
//         </button>

//         {/* Footer */}
//         <p className={styles.footerText}>
//           By continuing, you agree to HomeHub&apos;s{" "}
//           <span>
//             Terms & Privacy Policy
//           </span>
//         </p>

//       </div>

//     </div>
//   );
// }
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import styles from "./AuthMethodModal.module.css";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL ||
//   "http://localhost:1337/api";

// export default function AuthMethodModal({
//   role = "User",
//   onClose,
// }) {
//   const router = useRouter();

//   const [method, setMethod] = useState("mobile");

//   const [mobile, setMobile] = useState("");
//   const [email, setEmail] = useState("");

//   const [otp, setOtp] = useState("");

//   const [showVerification, setShowVerification] =
//     useState(false);

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const isUser = role === "User";

//   // =====================================================
//   // ROLE
//   // =====================================================

//   const roleValue = isUser ? "user" : "owner";

//   // =====================================================
//   // REQUEST OTP
//   // =====================================================

//   const handleContinue = async () => {
//     setError("");
//     setSuccess("");

//     let payload = {
//       role: roleValue,
//       method,
//     };

//     // ---------------------------------------------------
//     // MOBILE
//     // ---------------------------------------------------

//     if (method === "mobile") {
//       const cleanMobile =
//         mobile.replace(/\D/g, "");

//       if (cleanMobile.length !== 10) {
//         setError(
//           "Please enter a valid 10-digit mobile number."
//         );
//         return;
//       }

//       payload.mobile = cleanMobile;
//     }

//     // ---------------------------------------------------
//     // EMAIL
//     // ---------------------------------------------------

//     if (method === "email") {
//       const cleanEmail =
//         email.trim().toLowerCase();

//       if (!cleanEmail) {
//         setError(
//           "Please enter your email address."
//         );
//         return;
//       }

//       const emailRegex =
//         /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//       if (!emailRegex.test(cleanEmail)) {
//         setError(
//           "Please enter a valid email address."
//         );
//         return;
//       }

//       payload.email = cleanEmail;
//     }

//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${STRAPI_URL}/auth/request-otp`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data?.error?.message ||
//             data?.message ||
//             "Unable to send OTP."
//         );
//       }

//       setSuccess(
//         method === "mobile"
//           ? "OTP generated. Check your Strapi terminal."
//           : "OTP has been sent to your email."
//       );

//       setShowVerification(true);
//     } catch (error) {
//       console.error(
//         "Request OTP Error:",
//         error
//       );

//       setError(
//         error.message ||
//           "Unable to send OTP."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // VERIFY OTP
//   // =====================================================

//   const handleVerifyOtp = async () => {
//     setError("");
//     setSuccess("");

//     const cleanOtp =
//       otp.replace(/\D/g, "");

//     if (cleanOtp.length !== 6) {
//       setError(
//         "Please enter the 6-digit OTP."
//       );
//       return;
//     }

//     const payload = {
//       role: roleValue,
//       method,
//       otp: cleanOtp,
//     };

//     if (method === "mobile") {
//       payload.mobile =
//         mobile.replace(/\D/g, "");
//     }

//     if (method === "email") {
//       payload.email =
//         email.trim().toLowerCase();
//     }

//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${STRAPI_URL}/auth/verify-otp`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data?.error?.message ||
//             data?.message ||
//             "Invalid OTP."
//         );
//       }

//       if (!data?.verified) {
//         throw new Error(
//           "OTP verification failed."
//         );
//       }

//       // =================================================
//       // SAVE LOGIN INFORMATION
//       // =================================================

//       const loginData = {
//         role: roleValue,
//         method,
//         verified: true,

//         ...(method === "mobile"
//           ? {
//               mobile:
//                 mobile.replace(
//                   /\D/g,
//                   ""
//                 ),
//             }
//           : {
//               email:
//                 email
//                   .trim()
//                   .toLowerCase(),
//             }),

//         loginTime:
//           new Date().toISOString(),
//       };

//       localStorage.setItem(
//         "homehubAuth",
//         JSON.stringify(loginData)
//       );

//       // =================================================
//       // REDIRECT BASED ON ROLE
//       // =================================================

//       if (roleValue === "owner") {
//         router.push("/owner");
//       } else {
//         router.push("/user");
//       }

//       router.refresh();
//     } catch (error) {
//       console.error(
//         "Verify OTP Error:",
//         error
//       );

//       setError(
//         error.message ||
//           "OTP verification failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // VERIFICATION SCREEN
//   // =====================================================

//   if (showVerification) {
//     return (
//       <div className={styles.overlay}>
//         <div className={styles.modal}>

//           <button
//             type="button"
//             className={styles.closeButton}
//             onClick={onClose}
//             aria-label="Close"
//           >
//             ×
//           </button>

//           <div className={styles.header}>

//             <span
//               className={styles.roleBadge}
//             >
//               {isUser ? "👤" : "🏠"}
//             </span>

//             <h2>
//               Verify Your{" "}
//               {method === "mobile"
//                 ? "Mobile"
//                 : "Email"}
//             </h2>

//             <p>
//               Continue as{" "}
//               <strong>{role}</strong>
//             </p>

//           </div>

//           {/* Contact Information */}

//           <div
//             style={{
//               padding: "16px",
//               marginBottom: "20px",
//               borderRadius: "14px",
//               background: "#f6f4ec",
//               border:
//                 "1px solid #e4dfcf",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: "13px",
//                 color: "#77736a",
//                 marginBottom: "6px",
//               }}
//             >
//               {method === "mobile"
//                 ? "Mobile Number"
//                 : "Email Address"}
//             </div>

//             <div
//               style={{
//                 fontSize: "16px",
//                 fontWeight: 700,
//                 color: "#18352a",
//               }}
//             >
//               {method === "mobile"
//                 ? `+91 ${mobile}`
//                 : email}
//             </div>
//           </div>

//           {error && (
//             <div
//               style={{
//                 marginBottom: "14px",
//                 padding: "11px 13px",
//                 borderRadius: "10px",
//                 background: "#fff1ef",
//                 color: "#b42318",
//                 fontSize: "13px",
//               }}
//             >
//               {error}
//             </div>
//           )}

//           {success && (
//             <div
//               style={{
//                 marginBottom: "14px",
//                 padding: "11px 13px",
//                 borderRadius: "10px",
//                 background: "#edf8f1",
//                 color: "#176b4d",
//                 fontSize: "13px",
//               }}
//             >
//               {success}
//             </div>
//           )}

//           <div className={styles.form}>

//             <label htmlFor="verificationCode">
//               Enter Verification Code
//             </label>

//             <input
//               id="verificationCode"
//               type="text"
//               inputMode="numeric"
//               maxLength={6}
//               value={otp}
//               onChange={(e) => {
//                 setOtp(
//                   e.target.value.replace(
//                     /\D/g,
//                     ""
//                   )
//                 );
//               }}
//               placeholder="Enter 6-digit code"
//               className={styles.input}
//             />

//             <button
//               type="button"
//               className={
//                 styles.continueButton
//               }
//               onClick={handleVerifyOtp}
//               disabled={loading}
//             >
//               {loading
//                 ? "Verifying..."
//                 : "Verify & Continue →"}
//             </button>

//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               setShowVerification(false);
//               setOtp("");
//               setError("");
//               setSuccess("");
//             }}
//             style={{
//               width: "100%",
//               marginTop: "12px",
//               padding: "12px",
//               border: "none",
//               background:
//                 "transparent",
//               color: "#176b4d",
//               fontSize: "14px",
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             ← Change{" "}
//             {method === "mobile"
//               ? "mobile"
//               : "email"}
//           </button>

//           <p
//             className={
//               styles.footerText
//             }
//           >
//             By continuing, you agree to
//             HomeHub&apos;s{" "}
//             <span>
//               Terms & Privacy Policy
//             </span>
//           </p>

//         </div>
//       </div>
//     );
//   }

//   // =====================================================
//   // MOBILE / EMAIL SCREEN
//   // =====================================================

//   return (
//     <div className={styles.overlay}>

//       <div className={styles.modal}>

//         <button
//           type="button"
//           className={styles.closeButton}
//           onClick={onClose}
//           aria-label="Close"
//         >
//           ×
//         </button>

//         <div className={styles.header}>

//           <span
//             className={styles.roleBadge}
//           >
//             {isUser ? "👤" : "🏠"}
//           </span>

//           <h2>
//             Login / Sign Up
//           </h2>

//           <p>
//             Continue as{" "}
//             <strong>{role}</strong>
//           </p>

//         </div>

//         {/* Method Toggle */}

//         <div
//           className={
//             styles.methodToggle
//           }
//         >

//           <button
//             type="button"
//             className={
//               method === "mobile"
//                 ? `${styles.methodButton} ${styles.active}`
//                 : styles.methodButton
//             }
//             onClick={() => {
//               setMethod("mobile");
//               setError("");
//               setSuccess("");
//             }}
//           >
//             <span>📱</span>
//             Mobile
//           </button>

//           <button
//             type="button"
//             className={
//               method === "email"
//                 ? `${styles.methodButton} ${styles.active}`
//                 : styles.methodButton
//             }
//             onClick={() => {
//               setMethod("email");
//               setError("");
//               setSuccess("");
//             }}
//           >
//             <span>✉</span>
//             Email
//           </button>

//         </div>

//         {error && (
//           <div
//             style={{
//               marginTop: "14px",
//               padding: "11px 13px",
//               borderRadius: "10px",
//               background: "#fff1ef",
//               color: "#b42318",
//               fontSize: "13px",
//             }}
//           >
//             {error}
//           </div>
//         )}

//         <div className={styles.form}>

//           {/* MOBILE */}

//           {method === "mobile" ? (
//             <>
//               <label htmlFor="mobile">
//                 Mobile Number
//               </label>

//               <div
//                 className={
//                   styles.mobileInput
//                 }
//               >

//                 <span
//                   className={
//                     styles.countryCode
//                   }
//                 >
//                   +91
//                 </span>

//                 <input
//                   id="mobile"
//                   type="tel"
//                   inputMode="numeric"
//                   maxLength={10}
//                   value={mobile}
//                   onChange={(e) => {
//                     setMobile(
//                       e.target.value.replace(
//                         /\D/g,
//                         ""
//                       )
//                     );
//                   }}
//                   placeholder="Enter mobile number"
//                 />

//               </div>
//             </>
//           ) : (
//             <>
//               <label htmlFor="email">
//                 Email Address
//               </label>

//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) =>
//                   setEmail(
//                     e.target.value
//                   )
//                 }
//                 placeholder="Enter your email address"
//                 className={styles.input}
//               />
//             </>
//           )}

//           <button
//             type="button"
//             className={
//               styles.continueButton
//             }
//             onClick={handleContinue}
//             disabled={loading}
//           >
//             {loading
//               ? "Sending OTP..."
//               : "Continue →"}
//           </button>

//         </div>

//         <div
//           className={styles.divider}
//         >
//           <span>
//             or continue with
//           </span>
//         </div>

//         <button
//           type="button"
//           className={
//             styles.googleButton
//           }
//           onClick={() => {
//             setError(
//               "Google login will be connected separately."
//             );
//           }}
//         >
//           <span
//             className={
//               styles.googleIcon
//             }
//           >
//             G
//           </span>

//           Continue with Google
//         </button>

//         <p
//           className={
//             styles.footerText
//           }
//         >
//           By continuing, you agree to
//           HomeHub&apos;s{" "}
//           <span>
//             Terms & Privacy Policy
//           </span>
//         </p>

//       </div>

//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AuthMethodModal.module.css";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337/api";

const USER_HOME_PATH = "/user";

export default function AuthMethodModal({
  role = "User",
  onClose,
}) {
  const router = useRouter();

  // =====================================================
  // ROLE NORMALIZATION
  // =====================================================

  const normalizedRole = String(role).trim().toLowerCase();

  const isUser = normalizedRole === "user";
  const isOwner = normalizedRole === "owner";

  // Backend role
  const roleValue = isOwner ? "owner" : "user";

  // =====================================================
  // STATES
  // =====================================================

  const [method, setMethod] = useState("mobile");

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [showVerification, setShowVerification] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // REDIRECT AFTER LOGIN
  // =====================================================

  const redirectAfterLogin = () => {
    console.log("LOGIN ROLE:", role);
    console.log("NORMALIZED ROLE:", normalizedRole);
    console.log("REDIRECT ROLE:", roleValue);

    // USER
    if (roleValue === "user") {
      console.log("Redirecting to USER module");

      router.replace(USER_HOME_PATH);
      router.refresh();

      setTimeout(() => {
        if (window.location.pathname !== USER_HOME_PATH) {
          window.location.replace(USER_HOME_PATH);
        }
      }, 300);

      return;
    }

    // OWNER
    if (roleValue === "owner") {
      console.log("Redirecting to OWNER module");

      router.replace("/");
      return;
    }

    // Safety fallback
    console.log("Unknown role. Redirecting to user.");

    router.replace(USER_HOME_PATH);
  };

  // =====================================================
  // SEND OTP
  // =====================================================

  const handleContinue = async () => {
    setError("");
    setSuccess("");

    let payload = {
      role: roleValue,
      method,
    };

    // ===================================================
    // MOBILE
    // ===================================================

    if (method === "mobile") {
      const cleanMobile = mobile.replace(/\D/g, "");

      if (cleanMobile.length !== 10) {
        setError(
          "Please enter a valid 10-digit mobile number."
        );
        return;
      }

      payload.mobile = cleanMobile;
    }

    // ===================================================
    // EMAIL
    // ===================================================

    if (method === "email") {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        setError("Please enter your email address.");
        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        setError(
          "Please enter a valid email address."
        );
        return;
      }

      payload.email = cleanEmail;
    }

    // ===================================================
    // API REQUEST
    // ===================================================

    try {
      setLoading(true);

      console.log(
        "Sending OTP request:",
        payload
      );

      const response = await fetch(
        `${STRAPI_URL}/auth/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log(
        "Request OTP response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            data?.message ||
            "Unable to send OTP."
        );
      }

      setSuccess(
        method === "mobile"
          ? "OTP sent successfully."
          : "OTP has been sent to your email."
      );

      setShowVerification(true);
    } catch (error) {
      console.error(
        "Request OTP Error:",
        error
      );

      setError(
        error.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    const cleanOtp = otp.replace(/\D/g, "");

    if (cleanOtp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    const payload = {
      role: roleValue,
      method,
      otp: cleanOtp,
    };

    if (method === "mobile") {
      payload.mobile =
        mobile.replace(/\D/g, "");
    }

    if (method === "email") {
      payload.email =
        email.trim().toLowerCase();
    }

    try {
      setLoading(true);

      console.log(
        "VERIFY OTP REQUEST:",
        payload
      );

      const response = await fetch(
        `${STRAPI_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log(
        "VERIFY OTP RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            data?.message ||
            "Invalid OTP."
        );
      }

      // =================================================
      // VERIFY SUCCESS
      // =================================================

      if (data?.verified === false) {
        throw new Error(
          "OTP verification failed."
        );
      }

      // =================================================
      // SAVE LOGIN DATA
      // =================================================

      const loginData = {
        role: roleValue,
        method,
        verified: true,
        loginTime:
          new Date().toISOString(),
      };

      if (method === "mobile") {
        loginData.mobile =
          mobile.replace(/\D/g, "");
      }

      if (method === "email") {
        loginData.email =
          email.trim().toLowerCase();
      }

      const authToken =
        data?.token || data?.jwt || null;

      if (roleValue === "owner" && !authToken) {
        throw new Error(
          "Owner dashboard requires an email linked with an Owner account. Please login with your Owner email."
        );
      }

      // Save authentication
      localStorage.setItem(
        "homehubAuth",
        JSON.stringify(loginData)
      );

      // Save token if backend sends one
      if (authToken) {
        localStorage.setItem(
          "homehub_token",
          authToken
        );

        localStorage.setItem(
          "token",
          authToken
        );
      }

      // Save user if backend sends one
      if (data?.user) {
        localStorage.setItem(
          "homehub_user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      localStorage.setItem(
        "userRole",
        roleValue === "owner" ? "Owner" : "User"
      );

      console.log(
        "LOGIN SUCCESSFUL"
      );

      console.log(
        "ROLE:",
        roleValue
      );

      // =================================================
      // REDIRECT
      // =================================================

      redirectAfterLogin();
    } catch (error) {
      console.error(
        "Verify OTP Error:",
        error
      );

      setError(
        error.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = () => {
    setError(
      "Google login will be connected separately."
    );
  };

  // =====================================================
  // VERIFICATION SCREEN
  // =====================================================

  if (showVerification) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>

          {/* Close */}
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

          {/* Header */}
          <div className={styles.header}>

            <span
              className={styles.roleBadge}
            >
              {isUser ? "👤" : "🏠"}
            </span>

            <h2>
              Verify Your{" "}
              {method === "mobile"
                ? "Mobile"
                : "Email"}
            </h2>

            <p>
              Continue as{" "}
              <strong>
                {isUser
                  ? "User"
                  : "Owner"}
              </strong>
            </p>

          </div>

          {/* Contact */}
          <div
            style={{
              padding: "16px",
              marginBottom: "20px",
              borderRadius: "14px",
              background: "#f6f4ec",
              border:
                "1px solid #e4dfcf",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#77736a",
                marginBottom: "6px",
              }}
            >
              {method === "mobile"
                ? "Mobile Number"
                : "Email Address"}
            </div>

            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#18352a",
              }}
            >
              {method === "mobile"
                ? `+91 ${mobile}`
                : email}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: "14px",
                padding: "11px 13px",
                borderRadius: "10px",
                background: "#fff1ef",
                color: "#b42318",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              style={{
                marginBottom: "14px",
                padding: "11px 13px",
                borderRadius: "10px",
                background: "#edf8f1",
                color: "#176b4d",
                fontSize: "13px",
              }}
            >
              {success}
            </div>
          )}

          {/* OTP */}
          <div className={styles.form}>

            <label htmlFor="verificationCode">
              Enter 6-digit OTP
            </label>

            <input
              id="verificationCode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setOtp(value);
              }}
              placeholder="Enter OTP"
              className={styles.input}
              autoFocus
            />

            <button
              type="button"
              className={
                styles.continueButton
              }
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify & Continue →"}
            </button>

          </div>

          {/* Change */}
          <button
            type="button"
            onClick={() => {
              setShowVerification(false);
              setOtp("");
              setError("");
              setSuccess("");
            }}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "12px",
              border: "none",
              background:
                "transparent",
              color: "#176b4d",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ← Change{" "}
            {method === "mobile"
              ? "mobile number"
              : "email address"}
          </button>

          <p
            className={
              styles.footerText
            }
          >
            By continuing, you agree to
            HomeHub&apos;s{" "}
            <span>
              Terms & Privacy Policy
            </span>
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // LOGIN SCREEN
  // =====================================================

  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        {/* Close */}
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <div className={styles.header}>

          <span
            className={styles.roleBadge}
          >
            {isUser ? "👤" : "🏠"}
          </span>

          <h2>
            Login / Sign Up
          </h2>

          <p>
            Continue as{" "}
            <strong>
              {isUser
                ? "User"
                : "Owner"}
            </strong>
          </p>

        </div>

        {/* Mobile / Email */}
        <div
          className={
            styles.methodToggle
          }
        >

          <button
            type="button"
            className={
              method === "mobile"
                ? `${styles.methodButton} ${styles.active}`
                : styles.methodButton
            }
            onClick={() => {
              setMethod("mobile");
              setError("");
              setSuccess("");
            }}
          >
            <span>📱</span>
            Mobile
          </button>

          <button
            type="button"
            className={
              method === "email"
                ? `${styles.methodButton} ${styles.active}`
                : styles.methodButton
            }
            onClick={() => {
              setMethod("email");
              setError("");
              setSuccess("");
            }}
          >
            <span>✉</span>
            Email
          </button>

        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: "14px",
              padding: "11px 13px",
              borderRadius: "10px",
              background: "#fff1ef",
              color: "#b42318",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <div className={styles.form}>

          {/* MOBILE */}
          {method === "mobile" ? (
            <>
              <label htmlFor="mobile">
                Mobile Number
              </label>

              <div
                className={
                  styles.mobileInput
                }
              >

                <span
                  className={
                    styles.countryCode
                  }
                >
                  +91
                </span>

                <input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    );
                  }}
                  placeholder="Enter mobile number"
                />

              </div>
            </>
          ) : (
            /* EMAIL */
            <>
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email address"
                className={
                  styles.input
                }
              />
            </>
          )}

          {/* Continue */}
          <button
            type="button"
            className={
              styles.continueButton
            }
            onClick={handleContinue}
            disabled={loading}
          >
            {loading
              ? "Sending OTP..."
              : "Continue →"}
          </button>

        </div>

        {/* Divider */}
        <div
          className={
            styles.divider
          }
        >
          <span>
            or continue with
          </span>
        </div>

        {/* Google */}
        <button
          type="button"
          className={
            styles.googleButton
          }
          onClick={
            handleGoogleLogin
          }
          disabled={loading}
        >
          <span
            className={
              styles.googleIcon
            }
          >
            G
          </span>

          Continue with Google
        </button>

        {/* Footer */}
        <p
          className={
            styles.footerText
          }
        >
          By continuing, you agree to
          HomeHub&apos;s{" "}
          <span>
            Terms & Privacy Policy
          </span>
        </p>

      </div>

    </div>
  );
}
