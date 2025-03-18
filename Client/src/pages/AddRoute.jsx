import React, { useState, useEffect } from 'react';
import { Form, redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';


export const loader = async ({ params, request }) => {
  try {
    // Get request ID from query params
    const url = new URL(request.url);
    const reqId = url.searchParams.get('reqId'); 

    // Fetch customer and vehicle data in parallel
    const [customerResponse, vehicleResponse, requestResponce] = await Promise.all([
      customFetch(`/users/${params.id}`),  
      customFetch(`/vehicle/retrivevehicles`), 
      customFetch(`/request/retrieveSpecificRequest/${reqId}`),
    ]);

    // Return the fetched data
    return {
      customer: customerResponse.data,
      vehicles: vehicleResponse.data,
      request: requestResponce.data,
      reqId,
      cusId: params.id,
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg || 'Failed to load data');
    return redirect("/AdminDashboard/request"); 
  }
};

export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.formData());

  // Extract  form data
  const Reqid = formData.get('RequestId');

  try {
    // Add the route
    await customFetch.post('routePath/addRoutePath', Object.fromEntries(formData));
    toast.success('Route Added Successfully');

    // Update status in request
    if (Reqid) {
      try {
        const response = await customFetch.put(`/request/updateRequestStatus/${Reqid}`, {
          status: 'done',
        });
        if (response.status !== 200) {
          throw new Error('Update failed with status code: ' + response.status);
        }
      } catch (error) {
        toast.error(error?.response?.data?.msg);
      }
    } else {
      throw new Error('Request ID is missing');
    }

    return redirect('/AdminDashboard/request');
  } catch (error) {
    toast.error(error?.response?.data?.msg || 'Failed to add route');
    return null;
  }
};

const AddRoute = () => {
  const { vehicles, customer, request, reqId, cusId } = useLoaderData();
  const [formValues, setFormValues] = useState({
    ContactNumber: request?.phoneNo || '',
    PickupPath: '',
    ArriveDate: '',
    ArriveTime: '',
    Vehicle: vehicles?.[0]?._id || ''
  });
  const [errors, setErrors] = useState({});
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    if (vehicles && Array.isArray(vehicles)) {
      setVehicleOptions(vehicles);
    }

    // Set the minimum date to today
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setMinDate(formattedToday);
  }, [vehicles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "ContactNumber":
        const phonePattern = /^[0-9]{10}$/;  // Assuming phone number format
        if (!value) {
          errorMsg = "Contact Number is required.";
        } else if (!phonePattern.test(value)) {
          errorMsg = "Contact Number is invalid.";
        }
        break;
      case "PickupPath":
        if (!value) errorMsg = "Pickup Path is required.";
        break;
      case "ArriveDate":
        if (!value) errorMsg = "Arrive Date is required.";
        break;
      case "ArriveTime":
        if (!value) errorMsg = "Arrive Time is required.";
        break;
      case "Vehicle":
        if (!value) errorMsg = "Vehicle selection is required.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const isSubmitting = false; 

  return (
    <div className='bg-white w-full flex items-center justify-center flex-col min-h-screen mb-10'>
      <div className='bg-white px-10 py-20 rounded w-2/3 overflow-auto' style={{ maxHeight: '90vh' }}>
        <h3 className='font-semibold text-green-600 text-3xl text-center'>ADD ROUTE</h3>

        <Form method="post">
          <input
            type='text'
            name='RequestId'
            className='w-full border-2 border-gray-100 rounded-xl p-3 mt-1'
            value={reqId || ''}
            readOnly
            hidden
          />
          <input
            type='text'
            name='CustomerId'
            className='w-full border-2 border-gray-100 rounded-xl p-3 mt-1'
            value={cusId}
            readOnly
            hidden
          />

          {/* Customer Name */}
          <div className='mt-8'>
            <label className='text-lg font-medium'>Contact Name</label>
            <input
              type='text'
              name='CustomerName'
              defaultValue={customer.user.name + ' ' + customer.user.lastName}
              className='w-full border-2 border-gray-100 rounded-xl p-3 mt-1'
              readOnly
            />
          </div>

          {/* Contact Number */}
          <div className='mt-8'>
            <label className='text-lg font-medium'>Contact Number</label>
            <input
              type='text'
              name='ContactNumber'
              value={formValues.ContactNumber}
              onChange={handleChange}
              readOnly
              className='w-full border-2 rounded-xl p-3 mt-1'
            />
            {errors.ContactNumber && <p className='text-red-500'>{errors.ContactNumber}</p>}
          </div>

          {/* Pickup Path */}
          <div className='mt-8'>
            <label className='text-lg font-medium'>Pickup Path Pin</label>
            <input
              type='text'
              name='PickupPath'
              value={formValues.PickupPath}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl p-3 mt-1 ${
                errors.PickupPath ? 'border-red' : 'border-gray-100'
              }`}
              placeholder='Enter Path'
            />
            {errors.PickupPath && <p className='text-red'>{errors.PickupPath}</p>}
          </div>

          {/* Arrive Date */}
          <div className='mt-4'>
            <label className='text-lg font-medium'>Arrive Date</label>
            <input
              type='date'
              name='ArriveDate'
              value={formValues.ArriveDate}
              onChange={handleChange}
              min={minDate}
              className={`w-full border-2 rounded-xl p-3 mt-1 ${
                errors.ArriveDate ? 'border-red' : 'border-gray-100'
              }`}
            />
            {errors.ArriveDate && <p className='text-red'>{errors.ArriveDate}</p>}
          </div>

          {/* Arrive Time */}
          <div className='mt-4'>
            <label className='text-lg font-medium'>Arrive Time</label>
            <input
              type='time'
              name='ArriveTime'
              value={formValues.ArriveTime}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl p-3 mt-1 ${
                errors.ArriveTime ? 'border-red' : 'border-gray-100'
              }`}
            />
            {errors.ArriveTime && <p className='text-red-500'>{errors.ArriveTime}</p>}
          </div>

          {/* Vehicle Selection */}
          <div className='mt-4'>
            <label className='text-lg font-medium'>Vehicle</label>
            <select
              name='Vehicle'
              value={formValues.Vehicle}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl p-3 mt-1 ${
                errors.Vehicle ? 'border-red' : 'border-gray-100'
              }`}
            >
              {vehicleOptions.length > 0 ? (
                vehicleOptions.map(vehicle => (
                  <option key={vehicle._id} value={vehicle.VehicleNumber}>
                    {vehicle.VehicleNumber} - {vehicle.VehicleName}
                  </option>
                ))
              ) : (
                <option disabled>No vehicles available</option>
              )}
            </select>
            {errors.Vehicle && <p className='text-red'>{errors.Vehicle}</p>}
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
};

export default AddRoute;
