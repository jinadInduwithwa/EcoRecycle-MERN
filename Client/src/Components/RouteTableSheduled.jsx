import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { IoBuild, IoTrashSharp, IoPrint, IoChatbubbleEllipses } from 'react-icons/io5';
import { useAllRoutes } from '../pages/Route'; // Ensure this path is correct
import customFetch from '../utils/customFetch';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { base64url } from "../../../Utils/base64url";

export default function RouteTableScheduled() {
    const { data, refetch } = useAllRoutes();
    const [showConfirm, setShowConfirm] = useState({ visible: false, id: null });
    const [searchTerm, setSearchTerm] = useState('');
    const tableRef = useRef();

    const openConfirmModal = (id) => {
        setShowConfirm({ visible: true, id });
    };

    const closeConfirmModal = () => {
        setShowConfirm({ visible: false, id: null });
    };

    const handleDelete = async (id) => {
        try {
            await customFetch.delete(`/routePath/deleteRoutePath/${id}`);
            toast.success("Route deleted successfully!");
            refetch();
        } catch (error) {
            toast.error("Failed to delete route");
            console.error("Delete error", error);
        } finally {
            closeConfirmModal();
        }
    };

    const approvedData = data
        ? data.filter(
              (route) =>
                  route.Status === 'Scheduled' &&
                  (route.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      route.ContactNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      route.RouteId.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        : [];

    // PDF generation function
    const generatePDF = () => {
        const doc = new jsPDF();

        // Adding a frame around the PDF content
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

        // Adding a company logo to the header
        doc.addImage(base64url, "PNG", 10, 10, 50, 20); // Add your base64 logo here

        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text("Eco Recycle Company", 70, 15);

        doc.setFontSize(12);
        doc.setTextColor(80);
        doc.text("Eco Recycle, 123 Green Street, Recycle City, 54321", 70, 22);

        doc.setFontSize(12);
        doc.text("Generated on: " + new Date().toLocaleDateString(), 70, 29);

        doc.setFontSize(12);
        doc.setTextColor(80);
        doc.text("Contact: info@ecorecycle.com", 14, 45);
        doc.text("Phone: +94 772931811", 14, 50);
        doc.text("Website: www.ecorecycle.com", 14, 55);

        doc.setFontSize(16);
        doc.setTextColor(34, 153, 84);
        doc.text("Driver Approved Route List", 14, 70);

        const startY = 75;

        const tableColumn = [
            "Route ID",
            "Customer Name",
            "Contact Number",
            "Arrive Time",
            "Arrive Date",
            "Vehicle"
        ];

        // Define table rows by mapping the approved route data
        const tableRows = approvedData.map((route) => [
            route.RouteId,
            route.CustomerName,
            route.ContactNumber,
            route.ArriveTime,
            route.ArriveDate,
            route.Vehicle
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: startY,
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: [34, 153, 84],
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            alternateRowStyles: {
                fillColor: [234, 248, 239],
            },
            margin: { top: startY },
        });

        // Save the PDF
        doc.save("approved_routes.pdf");
    };

    // Send WhatsApp message function
    const handleWhatsappMessage = (route) => {
        const message = `Hello ${route.CustomerName}, your route is scheduled to arrive on ${route.ArriveDate} at ${route.ArriveTime}. Vehicle: ${route.Vehicle}. If you have any changes regarding your pickup time and date, please contact us directly for assistance. -ecoRecycle-`;
        const phoneNumber = route.ContactNumber;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="bg-white border border-gray-200 overflow-x-auto">
            <div className="m-4 text-xl text-gray-600 ">
                <h1>Scheduled Routes</h1>
            </div>

            {/* Search Input */}
            <div className="p-4 no-print">
                <input
                    type="text"
                    placeholder="Search by Route Id, Customer Name, or Contact Number"
                    className="px-4 py-2 border rounded w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Generate PDF Button */}
            <div className="p-4 pt-2 pb-2">
                <button
                    onClick={generatePDF}
                    className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded shadow-md"
                >
                    <IoPrint className="inline-block mr-2" />
                    Generate Report
                </button>
            </div>

            {/* Table */}
            <table ref={tableRef} className="min-w-[1000px] w-full text-gray-700">
                <thead>
                    <tr>
                        <th>Route Id</th>
                        <th>Customer Name</th>
                        <th>Contact Number</th>
                        <th>Arrive Time</th>
                        <th>Arrive Date</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {approvedData.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                <label>No scheduled routes found</label>
                            </td>
                        </tr>
                    ) : (
                        approvedData.map((route) => (
                            <tr key={route._id}>
                                <td>{route.RouteId}</td>
                                <td>{route.CustomerName}</td>
                                <td>{route.ContactNumber}</td>
                                <td>{route.ArriveTime}</td>
                                <td>{route.ArriveDate}</td>
                                <td>{route.Vehicle}</td>
                                <td>{route.Status}</td>
                                <td>
                                    <div className="flex flex-row gap-1">
                                        <Link to={`../editRoute/${route._id}`}>
                                            <button className="bg-orange-500 text-white px-4 py-2 hover:bg-orange-600 rounded shadow-md">
                                                <IoBuild />
                                            </button>
                                        </Link>
                                        <button
                                            className="bg-red text-white px-4 py-2 hover:bg-red-600 rounded shadow-md"
                                            onClick={() => openConfirmModal(route._id)}
                                        >
                                            <IoTrashSharp />
                                        </button>
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 hover:bg-red-600 rounded shadow-md"
                                            onClick={() => handleWhatsappMessage(route)}
                                        >
                                            <IoChatbubbleEllipses />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Confirmation Modal */}
            {showConfirm.visible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <p className="mb-4 text-gray-700">
                            Are you sure you want to delete this route?
                        </p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => handleDelete(showConfirm.id)}
                                className="px-4 py-2 bg-red text-white rounded hover:bg-red-600"
                            >
                                Yes
                            </button>
                            <button
                                onClick={closeConfirmModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
