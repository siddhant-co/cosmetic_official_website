// "use client";
 
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useAppSelector } from "@/store/hooks/hooks";
// import { apiCore } from "@/api/ApiCore";
// import { Pencil, Trash2, Save, X, Plus } from "lucide-react";
// import { Address, AddressApiResponse } from "@/types/address";
 
// export default function ManageAddresses() {
//   const token = useAppSelector((state) => state.auth.token);
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [formData, setFormData] = useState<Partial<Address>>({});
//   const [showAddForm, setShowAddForm] = useState(false);
 
//   useEffect(() => {
//     fetchAddresses();
//   }, []);
 
//   const fetchAddresses = async () => {
//     try {
//       const res = await apiCore(
//         "/address",
//         "GET",
//         undefined,
//         token || undefined
//       );
//       const data = res as AddressApiResponse;
 
//       if (Array.isArray(data.address)) {
//         setAddresses(data.address);
//       } else {
//         toast.error("Invalid address response");
//       }
//     } catch {
//       toast.error("Failed to fetch addresses");
//     }
//   };
 
//   const handleEdit = (addr: Address) => {
//     setEditId(addr.id ?? null);
//     setFormData({ ...addr });
//   };
 
//   const handleUpdate = async () => {
//     if (!editId) return;
 
//     try {
//       await apiCore(
//         `/address/${editId}`,
//         "PATCH",
//         formData,
//         token || undefined
//       );
//       toast.success("Address updated");
//       setEditId(null);
//       fetchAddresses();
//     } catch {
//       toast.error("Update failed");
//     }
//   };
 
//   const handleDelete = async (id: number) => {
//     try {
//       await apiCore(`/address/${id}`, "DELETE", undefined, token || undefined);
//       toast.success("Address deleted");
//       fetchAddresses();
//     } catch {
//       toast.error("Delete failed");
//     }
//   };
 
//   const handleInputChange = (key: keyof Address, value: string) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };
 
//   const handleAddAddress = async () => {
//     try {
//       await apiCore("/address", "POST", formData, token || undefined);
//       toast.success("Address added");
//       setFormData({});
//       setShowAddForm(false);
//       fetchAddresses();
//     } catch {
//       toast.error("Failed to add address");
//     }
//   };
 
//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold">Manage Addresses</h2>
//         <button
//           onClick={() => {
//             setShowAddForm(!showAddForm);
//             setEditId(null);
//             setFormData({});
//           }}
//           className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1 rounded"
//         >
//           <Plus size={16} /> {showAddForm ? "Cancel" : "Add New Address"}
//         </button>
//       </div>
 
//       {showAddForm && (
//         <div className="border p-4 rounded shadow-sm mb-6 bg-white max-w-2xl">
//           <h3 className="text-lg font-semibold mb-3">New Address</h3>
//           {[
//             "fullName",
//             "phone",
//             "pincode",
//             "state",
//             "city",
//             "addressLine",
//             "landmark",
//             "type",
//           ].map((field) => (
//             <div key={field} className="mb-2">
//               <label className="block text-sm capitalize mb-1">{field}</label>
//               {field === "type" ? (
//                 <select
//                   value={formData.type || "SHIPPING"}
//                   onChange={(e) => handleInputChange("type", e.target.value)}
//                   className="border w-full px-2 py-1 rounded"
//                 >
//                   <option value="SHIPPING">Shipping</option>
//                   <option value="BILLING">Billing</option>
//                   <option value="BOTH">Both</option>
//                 </select>
//               ) : (
//                 <input
//                   type="text"
//                   value={(formData as any)[field] || ""}
//                   onChange={(e) =>
//                     handleInputChange(field as keyof Address, e.target.value)
//                   }
//                   className="border w-full px-2 py-1 rounded"
//                 />
//               )}
//             </div>
//           ))}
//           <button
//             onClick={handleAddAddress}
//             className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
//           >
//             Save Address
//           </button>
//         </div>
//       )}
 
//       <div className="grid gap-6 md:grid-cols-2">
//         {addresses.map((addr) => (
//           <div key={addr.id} className="self-start">
//             <div className="border p-4 rounded shadow-sm bg-white flex flex-col justify-between h-full relative">
//               <span
//                 className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold ${
//                   addr.type === "SHIPPING"
//                     ? "bg-blue-100 text-blue-700"
//                     : addr.type === "BILLING"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : "bg-purple-100 text-purple-800"
//                 }`}
//               >
//                 {addr.type}
//               </span>
 
//               {editId === addr.id ? (
//                 <>
//                   <h3 className="text-lg font-semibold mb-3">Edit Address</h3>
//                   {[
//                     "fullName",
//                     "phone",
//                     "pincode",
//                     "state",
//                     "city",
//                     "addressLine",
//                     "landmark",
//                   ].map((field) => (
//                     <div key={field} className="mb-2">
//                       <label className="block text-sm capitalize mb-1">
//                         {field}
//                       </label>
//                       <input
//                         type="text"
//                         value={(formData as any)[field] || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             field as keyof Address,
//                             e.target.value
//                           )
//                         }
//                         className="border w-full px-2 py-1 rounded"
//                       />
//                     </div>
//                   ))}
//                   <div className="flex gap-3 mt-4">
//                     <button
//                       onClick={handleUpdate}
//                       className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded"
//                     >
//                       <Save size={16} /> Save
//                     </button>
//                     <button
//                       onClick={() => setEditId(null)}
//                       className="flex items-center gap-1 bg-gray-300 text-black px-3 py-1 rounded"
//                     >
//                       <X size={16} /> Cancel
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div>
//                     <p className="text-base font-medium">{addr.fullName}</p>
//                     <p className="text-sm text-gray-600">{addr.phone}</p>
//                     <p className="text-sm text-gray-600">
//                       {addr.addressLine}, {addr.city}, {addr.state} -{" "}
//                       {addr.pincode}
//                     </p>
//                     {addr.landmark && (
//                       <p className="text-sm text-gray-500">
//                         Landmark: {addr.landmark}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex gap-4 mt-4">
//                     <button
//                       onClick={() => handleEdit(addr)}
//                       className="text-blue-600 flex items-center gap-1"
//                     >
//                       <Pencil size={16} /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(addr.id!)}
//                       className="text-red-600 flex items-center gap-1"
//                     >
//                       <Trash2 size={16} /> Delete
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
 
 "use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/store/hooks/hooks";
import { apiCore } from "@/api/ApiCore";
import { Pencil, Trash2, Save, X, Plus } from "lucide-react";
import { Address, AddressApiResponse } from "@/types/address";

// Reusable list of fields for form rendering
const ADDRESS_FIELDS: (keyof Address | "type")[] = [
  "fullName",
  "phone",
  "pincode",
  "state",
  "city",
  "addressLine",
  "landmark",
  "type",
];

export default function ManageAddresses() {
  const token = useAppSelector((state) => state.auth.token);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await apiCore("/address", "GET", undefined, token || undefined);
      const data = res as AddressApiResponse;

      if (Array.isArray(data.address)) {
        setAddresses(data.address);
      } else {
        toast.error("Invalid address response");
      }
    } catch {
      toast.error("Failed to fetch addresses");
    }
  }, [token]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleEdit = (addr: Address) => {
    setEditId(addr.id ?? null);
    setFormData({ ...addr } as unknown as Record<string, string>);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      await apiCore(`/address/${editId}`, "PATCH", formData, token || undefined);
      toast.success("Address updated");
      setEditId(null);
      fetchAddresses();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiCore(`/address/${id}`, "DELETE", undefined, token || undefined);
      toast.success("Address deleted");
      fetchAddresses();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddAddress = async () => {
    try {
      await apiCore("/address", "POST", formData, token || undefined);
      toast.success("Address added");
      setFormData({});
      setShowAddForm(false);
      fetchAddresses();
    } catch {
      toast.error("Failed to add address");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Manage Addresses</h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditId(null);
            setFormData({});
          }}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1 rounded"
        >
          <Plus size={16} /> {showAddForm ? "Cancel" : "Add New Address"}
        </button>
      </div>

      {showAddForm && (
        <div className="border p-4 rounded shadow-sm mb-6 bg-white max-w-2xl">
          <h3 className="text-lg font-semibold mb-3">New Address</h3>
          {ADDRESS_FIELDS.map((field) => (
            <div key={field} className="mb-2">
              <label className="block text-sm capitalize mb-1">{field}</label>
              {field === "type" ? (
                <select
                  value={formData.type || "SHIPPING"}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="border w-full px-2 py-1 rounded"
                >
                  <option value="SHIPPING">Shipping</option>
                  <option value="BILLING">Billing</option>
                  <option value="BOTH">Both</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData[field] || ""}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="border w-full px-2 py-1 rounded"
                />
              )}
            </div>
          ))}
          <button
            onClick={handleAddAddress}
            className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
          >
            Save Address
          </button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className="self-start">
            <div className="border p-4 rounded shadow-sm bg-white flex flex-col justify-between h-full relative">
              <span
                className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold ${
                  addr.type === "SHIPPING"
                    ? "bg-blue-100 text-blue-700"
                    : addr.type === "BILLING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {addr.type}
              </span>

              {editId === addr.id ? (
                <>
                  <h3 className="text-lg font-semibold mb-3">Edit Address</h3>
                  {ADDRESS_FIELDS.filter((f) => f !== "type").map((field) => (
                    <div key={field} className="mb-2">
                      <label className="block text-sm capitalize mb-1">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={formData[field] || ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="border w-full px-2 py-1 rounded"
                      />
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="flex items-center gap-1 bg-gray-300 text-black px-3 py-1 rounded"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-base font-medium">{addr.fullName}</p>
                    <p className="text-sm text-gray-600">{addr.phone}</p>
                    <p className="text-sm text-gray-600">
                      {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                      {addr.pincode}
                    </p>
                    {addr.landmark && (
                      <p className="text-sm text-gray-500">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="text-blue-600 flex items-center gap-1"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id!)}
                      className="text-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
