import React, { useEffect, useState } from "react";
import { Form, useNavigation, useOutletContext, useNavigate } from "react-router-dom";
import { FormRow } from "../Components";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import hero from "../assets/Images/account.jpg";
import ErrorModal from "../utils/ErrorModal";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);

  const isUpdate = formObject.id ? true : false;

// Validate fields
const validationError = validateFields(formObject);
console.log("validationError", validationError)
if (validationError) {
  console.log("name")
  return { error: validationError }; // Return error message for validation
}

  try {
    if (isUpdate) {
      await customFetch.patch(`/bank/${formObject.id}`, formObject);
      toast.success("Bank Details updated successfully");
    } else {
      await customFetch.post("/Bank", formObject);
      toast.success("Bank Details added successfully");
    }
    return null;
  }catch (error) {
    return { error: error?.response?.data?.msg || "Failed to submit form" }; // Return error message
  }
};
const validateFields = (formObject) => {
  const accountNameRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces
  const accountNumberRegex = /^[0-9]+$/; // Allows only numbers
  console.log("a", formObject)
  if (!accountNameRegex.test(formObject.Account_Name)) {
    return "Account Name must contain only letters.";
  }

  if (!accountNumberRegex.test(formObject.Account_Number)) {
    return "Account Number must contain only numbers.";
  }

  if(!formObject.Branch_Code){
    return "Please select a branch";
  }

  if(!formObject.Bank_Name){
    return "Please select a bank name";
  }
  return null; // No errors
};

const PaymentInfo = () => {
  const { user } = useOutletContext();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [bankDetails, setBankDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    if (user?._id) {
      fetchBankDetails(user._id);
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await action({ request: new Request('your-form-endpoint', { method: 'POST', body: new FormData(event.target) }) });
    if (result.error) {
      setErrorMessage(result.error);
      setShowModal(true);
    } else if (result.success) {
      toast.success(result.success);
      // Handle success logic
    }
  };


  const handleErrorClose = () => {
    setShowModal(false); // Close the modal
    setErrorMessage(""); // Clear error message
  };

  const fetchBankDetails = async (userId) => {
    try {
      const User_ID = userId;
      const response = await customFetch.get(`/bank/${User_ID}`);

      setBankDetails({
        _id: response.data._id,
        Account_Number: response.data.Account_Number,
        Account_Name: response.data.Account_Name,
        Bank_Name: response.data.Bank_Name,
        Branch_Code: response.data.Branch_Code,
      });

      console.warn("Bank details", bankDetails);

    } catch (error) {
      console.log("No existing bank details");
      setBankDetails(null);
    }
  };

  const handleDelete = async () => {
    if (!bankDetails || !bankDetails._id) {
      toast.error("No bank details to delete");
      return;
    }

    try {
      await customFetch.delete(`/bank/${bankDetails._id}`);
      navigate("/dashboard/Bank-Details");
      toast.success("Bank details deleted successfully");
      setBankDetails(null);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to delete bank details");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="font-mono mb-5 text-4xl font-bold text-center mt-4">
        {bankDetails ? "Update Bank Details" : "Add Bank Details"}
      </h2>
      <div className="mb-4">
        <img
          src={hero}
          alt="profile"
          className="w-48 h-48 rounded-full object-cover"
        />
      </div>
      <Form onSubmit={handleSubmit} method="post" className="grid grid-cols-2 gap-4 p-6" encType="multipart/form-data">
  <input type="hidden" name="id" value={bankDetails?._id || ''} />
  <input type="hidden" name="User_ID" value={user._id} />

  <FormRow
    type="text"
    name="Account_Number"
    labelText="Account Number"
    defaulyValue={bankDetails?.Account_Number || ''}
    className="w-full p-2 border border-gray-300 rounded-md"
    labelClass="text-xl text-gray-700 font-bold capitalize"
  />
  <FormRow
    type="text"
    name="Account_Name"
    labelText="Account Name"
    defaulyValue={bankDetails?.Account_Name || ''}
    className="w-full p-2 border border-gray-300 rounded-md"
    labelClass="text-xl text-gray-700 font-bold capitalize"
  />

  {/* Dropdown for Bank Name */}
  <div className="w-full p-2">
    <label className="text-xl text-gray-700 font-bold capitalize" htmlFor="Bank_Name">
      Bank Name
    </label>
    <select
      name="Bank_Name"
      id="Bank_Name"
      defaultValue={bankDetails?.Bank_Name || ''}
      className="w-full p-2 border border-gray-300 rounded-md"
    >
  <option value="" disabled>Select Bank</option>
  <option value="Alliance Finance Company PLC">Alliance Finance Company PLC</option>
  <option value="Amana Bank PLC">Amana Bank PLC</option>
  <option value="Axis Bank">Axis Bank</option>
  <option value="Bank of Ceylon">Bank of Ceylon</option>
  <option value="Cargills Bank Limited">Cargills Bank Limited</option>
  <option value="Central Bank of Sri Lanka">Central Bank of Sri Lanka</option>
  <option value="Central Finance PLC">Central Finance PLC</option>
  <option value="Citi Bank">Citi Bank</option>
  <option value="Citizen Development Business Finance PLC">Citizen Development Business Finance PLC</option>
  <option value="Commercial Bank PLC">Commercial Bank PLC</option>
  <option value="Commercial Credit & Finance PLC">Commercial Credit & Finance PLC</option>
  <option value="Commercial Leasing and Finance">Commercial Leasing and Finance</option>
  <option value="Deutsche Bank">Deutsche Bank</option>
  <option value="DFCC Bank PLC">DFCC Bank PLC</option>
  <option value="Habib Bank Ltd">Habib Bank Ltd</option>
  <option value="Hatton National Bank PLC">Hatton National Bank PLC</option>
  <option value="HDFC Bank">HDFC Bank</option>
  <option value="Hongkong Shanghai Bank">Hongkong Shanghai Bank</option>
  <option value="ICICI Bank Ltd">ICICI Bank Ltd</option>
  <option value="Indian Bank">Indian Bank</option>
  <option value="Indian Overseas Bank">Indian Overseas Bank</option>
  <option value="Kanrich Finance Limited">Kanrich Finance Limited</option>
  <option value="Lanka Orix Finance PLC">Lanka Orix Finance PLC</option>
  <option value="LB Finance PLC">LB Finance PLC</option>
  <option value="MCB Bank Ltd">MCB Bank Ltd</option>
  <option value="Mercantile Investment and Finance PLC">Mercantile Investment and Finance PLC</option>
  <option value="Merchant Bank of Sri Lanka & Finance PLC">Merchant Bank of Sri Lanka & Finance PLC</option>
  <option value="National Development Bank PLC">National Development Bank PLC</option>
  <option value="National Savings Bank">National Savings Bank</option>
  <option value="Nations Trust Bank PLC">Nations Trust Bank PLC</option>
  <option value="Pan Asia Banking Corporation PLC">Pan Asia Banking Corporation PLC</option>
  <option value="Peoples Bank">Peoples Bank</option>
  <option value="People’s Leasing & Finance PLC">People’s Leasing & Finance PLC</option>
  <option value="Public Bank">Public Bank</option>
  <option value="Regional Development Bank">Regional Development Bank</option>
  <option value="Sampath Bank PLC">Sampath Bank PLC</option>
  <option value="Sanasa Development Bank">Sanasa Development Bank</option>
  <option value="Senkadagala Finance PLC">Senkadagala Finance PLC</option>
  <option value="Seylan Bank PLC">Seylan Bank PLC</option>
  <option value="Standard Chartered Bank">Standard Chartered Bank</option>
  <option value="State Bank of India">State Bank of India</option>
  <option value="State Mortgage & Investment Bank">State Mortgage & Investment Bank</option>
  <option value="Union Bank of Colombo PLC">Union Bank of Colombo PLC</option>
  <option value="Vallibel Finance PLC">Vallibel Finance PLC</option>
    </select>
  </div>

  {/* Dropdown for Branch Code */}
  <div className="w-full p-2">
    <label className="text-xl text-gray-700 font-bold capitalize" htmlFor="Branch_Code">
      Branch Code
    </label>
    <select
      name="Branch_Code"
      id="Branch_Code"
      defaultValue={bankDetails?.Branch_Code || ''}
      className="w-full p-2 border border-gray-300 rounded-md"
    >
      <option value="" disabled>Select Branch Code</option>
      <option value="7852">7852</option>
<option value="7463">7463</option>
<option value="7472">7472</option>
<option value="7010">7010</option>
<option value="7481">7481</option>
<option value="8004">8004</option>
<option value="7825">7825</option>
<option value="7047">7047</option>
<option value="7746">7746</option>
<option value="7056">7056</option>
<option value="7870">7870</option>
<option value="7807">7807</option>
<option value="7205">7205</option>
<option value="7454">7454</option>
<option value="7074">7074</option>
<option value="7083">7083</option>
<option value="7737">7737</option>
<option value="7092">7092</option>
<option value="7384">7384</option>
<option value="7108">7108</option>
<option value="7117">7117</option>
<option value="7834">7834</option>
<option value="7861">7861</option>
<option value="7773">7773</option>
<option value="7269">7269</option>
<option value="7913">7913</option>
<option value="7898">7898</option>
<option value="7214">7214</option>
<option value="7719">7719</option>
<option value="7162">7162</option>
<option value="7311">7311</option>
<option value="7135">7135</option>
<option value="7922">7922</option>
<option value="7296">7296</option>
<option value="7755">7755</option>
<option value="7278">7278</option>
<option value="7728">7728</option>
<option value="7782">7782</option>
<option value="7287">7287</option>
<option value="7038">7038</option>
<option value="7144">7144</option>
<option value="7764">7764</option>
<option value="7302">7302</option>
<option value="7816">7816</option>

    </select>
  </div>

  <div className="col-span-1 flex justify-start">
    {bankDetails && (
      <button
        type="button"
        className="px-4 py-2 bg-orange-900 text-white rounded-md transition-colors duration-200"
        onClick={handleDelete}
      >
        Delete
      </button>
    )}
  </div>

  <div className="col-span-1 flex justify-end">
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Submitting..." : (bankDetails?._id ? "Update" : "Submit")}
    </button>
  </div>
</Form>
<div>
      {/* Your existing form goes here */}

      {/* Show modal if there's an error message */}
      {showModal && (
        <ErrorModal message={errorMessage} onClose={handleErrorClose} />
      )}
    </div>
    </div>
  );
};

export default PaymentInfo;

