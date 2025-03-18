import React, { useEffect, useState } from 'react';
import { useParams, Form, redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

// Loader function to fetch route and vehicle data
export const loader = async ({ params }) => {
  try {
    const [routeResponse, vehicleResponse] = await Promise.all([
      customFetch(`/routePath/retriveSpecificRoutePath/${params.id}`),
      customFetch(`/vehicle/retrivevehicles`)
    ]);

    return {
      route: routeResponse.data,
      vehicles: vehicleResponse.data
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Failed to load data");
    return redirect("/AdminDashboard/route");
  }
};

// Action function for handling form updating
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await customFetch.put(`/routePath/updateRoutePath/${params.id}`, data);
    
    if (response.status === 200) {
      toast.success("Route updated successfully");
      return redirect("../route");
    } else {
      throw new Error("Update failed with status code: " + response.status);
    }
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

export default function EditRoute() {
  const { route, vehicles } = useLoaderData();
  const [formValues, setFormValues] = useState({
    CustomerName: route?.CustomerName || '',
    ContactNumber: route?.ContactNumber || '',
    PickupPath: route?.PickupPath || '',
    ArriveDate: route?.ArriveDate || '',
    ArriveTime: route?.ArriveTime || '',
    Vehicle: route?.Vehicle || ''
  });
  const [errors, setErrors] = useState({});
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [minDate, setMinDate] = useState('');

  // Populate vehicle options when data is fetched
  useEffect(() => {
    if (vehicles && Array.isArray(vehicles)) {
      setVehicleOptions(vehicles);
    }

    // Set the minimum date to today
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];  // Format as yyyy-mm-dd
    setMinDate(formattedToday);
  }, [vehicles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = '';

    switch (name) {
      case 'ContactNumber':
        const phonePattern = /^[0-9]{10}$/; // Assuming 10-digit phone number format
        if (!value) {
          errorMsg = 'Contact Number is required.';
        } else if (!phonePattern.test(value)) {
          errorMsg = 'Contact Number is invalid.';
        }
        break;
      case 'PickupPath':
        if (!value) errorMsg = 'Pickup Path is required.';
        break;
      case 'ArriveDate':
        if (!value) errorMsg = 'Arrive Date is required.';
        break;
      case 'ArriveTime':
        if (!value) errorMsg = 'Arrive Time is required.';
        break;
      case 'Vehicle':
        if (!value) errorMsg = 'Vehicle selection is required.';
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const isFormValid = () => {
    const newErrors = {};
    Object.keys(formValues).forEach((field) => validateField(field, formValues[field]));
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const isSubmitting = false; // Modify based on your form submission state

  if (!route) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-white w-full flex items-center justify-center flex-col min-h-screen mb-10'>
      <div className='bg-white px-10 py-20 rounded w-2/3 overflow-auto' style={{ maxHeight: '90vh' }}>
        <h3 className='font-semibold text-green-600 text-3xl text-center'>UPDATE ROUTE</h3>

        <Form method="post" onSubmit={(e) => {
          if (!isFormValid()) {
            e.preventDefault();
            toast.error('Please fix the errors before submitting.');
          }
        }}>
          <div className='mt-8'>
            <label className='text-lg font-medium'>Contact Name</label>
            <input
              type='text'
              name='CustomerName'
              value={formValues.CustomerName}
              className='w-full border-2 border-gray-100 rounded-xl p-3 mt-1'
              readOnly
            />
          </div>

          <div className='mt-8'>
            <label className='text-lg font-medium'>Contact Number</label>
            <input
              type='text'
              name='ContactNumber'
              value={formValues.ContactNumber}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl p-3 mt-1 ${errors.ContactNumber ? 'border-red-500' : 'border-gray-100'}`}
              placeholder='Enter Number'
            />
            {errors.ContactNumber && <p className='text-red-500'>{errors.ContactNumber}</p>}
          </div>

          <div className="mt-8">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block p-2 w-1/2 border-2 border-gray-700 text-gray-700 font-bold py-4 rounded hover:bg-sky-400 hover:text-white hover:no-underline text-center"
            >
              Select New Route Pin From Google Map
            </a>
          </div>

          <div className='mt-8'>
            <label className='text-lg font-medium'>Pickup Path Pin</label>
            <input
              type='text'
              name='PickupPath'
              value={formValues.PickupPath}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl p-3 mt-1 ${errors.PickupPath ? 'border-red-500' : 'border-gray-100'}`}
              placeholder='Enter Path'
            />
            {errors.PickupPath && <p className='text-red-500'>{errors.PickupPath}</p>}
          </div>

          <div className='mt-4'>
            <label className='text-lg font-medium'>Arrive Date</label>
            <input
              type='date'
              name='ArriveDate'
              value={formValues.ArriveDate}
              onChange={handleChange}
              min={minDate}
              className={`w-full border-2 rounded-xl p-3 mt-1 ${errors.ArriveDate ? 'border-red-500' : 'border-gray-100'}`}
            />
            {errors.ArriveDate && <p className='text-red-500'>{errors.ArriveDate}</p>}
          </div>

          <div className='mt-4'>
            <label className='text-lg font-medium'>Arrive Time</label>
            <input
              type='time'
              name='ArriveTime'
              value={formValues.ArriveTime}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl p-3 mt-1 ${errors.ArriveTime ? 'border-red-500' : 'border-gray-100'}`}
            />
            {errors.ArriveTime && <p className='text-red-500'>{errors.ArriveTime}</p>}
          </div>

          {/* Vehicle selection */}
          <div className='mt-4'>
            <label className='text-lg font-medium'>Vehicle</label>
            <select
              name='Vehicle'
              value={formValues.Vehicle}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl p-3 mt-1 ${errors.Vehicle ? 'border-red-500' : 'border-gray-100'}`}
            >
              <option value=''>Select a vehicle</option>
              {vehicleOptions.length > 0 ? (
                vehicleOptions.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle.VehicleNumber}>
                    {vehicle.VehicleNumber} - {vehicle.VehicleName}
                  </option>
                ))
              ) : (
                <option disabled>No vehicles available</option>
              )}
            </select>
            {errors.Vehicle && <p className='text-red-500'>{errors.Vehicle}</p>}
          </div>

          <div className='mt-8 flex justify-center'>
            <button
              type='submit'
              className='bg-green-500 text-white font-bold py-4 rounded w-full hover:bg-green-700 duration-150'
              disabled={isSubmitting}
            >
              SUBMIT
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
