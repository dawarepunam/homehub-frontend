// "use client";

// import { useState } from "react";

// import { createEnquiry } from "@/services/enquiry";
// import { createNotification } from "@/services/notification";

// export default function ContactOwnerForm({ property }) {

//   const [formData, setFormData] = useState({
//     Name: "",
//     Phone: "",
//     Email: "",
//     Message: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {

//     setFormData({

//       ...formData,

//       [e.target.name]: e.target.value,

//     });

//   };

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     setLoading(true);

//     try {

//       // Save Enquiry
//       await createEnquiry({

//         Name: formData.Name,

//         Phone: formData.Phone,

//         Email: formData.Email,

//         Message: formData.Message,

//         Statuss: "Pending",

//         property: property.documentId,

//       });

//       // Create Notification
//       await createNotification({

//         Title: "New Property Enquiry",

//         Message: `${formData.Name} has sent an enquiry for ${property.Title}`,

//         Type: "Enquiry",

//         IsRead: false,

//         property: property.documentId,

//       });

//       setSuccess("Enquiry Sent Successfully.");

//       setFormData({

//         Name: "",

//         Phone: "",

//         Email: "",

//         Message: "",

//       });

//     } catch (error) {

//       console.log(error);

//       alert("Failed to send enquiry.");

//     }

//     setLoading(false);

//   };

//   return (

//     <form
//       onSubmit={handleSubmit}
//       className="space-y-5 rounded-xl bg-white p-8 shadow"
//     >

//       <h2 className="text-2xl font-bold">

//         Contact Property Owner

//       </h2>

//       {success && (

//         <div className="rounded-lg bg-green-100 p-3 text-green-700">

//           {success}

//         </div>

//       )}

//       <input
//         type="text"
//         name="Name"
//         value={formData.Name}
//         onChange={handleChange}
//         placeholder="Your Name"
//         required
//         className="w-full rounded-lg border p-3"
//       />

//       <input
//         type="text"
//         name="Phone"
//         value={formData.Phone}
//         onChange={handleChange}
//         placeholder="Phone Number"
//         required
//         className="w-full rounded-lg border p-3"
//       />

//       <input
//         type="email"
//         name="Email"
//         value={formData.Email}
//         onChange={handleChange}
//         placeholder="Email Address"
//         required
//         className="w-full rounded-lg border p-3"
//       />

//       <textarea
//         rows={5}
//         name="Message"
//         value={formData.Message}
//         onChange={handleChange}
//         placeholder="Write your enquiry..."
//         required
//         className="w-full rounded-lg border p-3"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
//       >

//         {loading ? "Sending..." : "Send Enquiry"}

//       </button>

//     </form>

//   );

// }
