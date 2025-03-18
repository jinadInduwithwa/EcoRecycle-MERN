import React, { useState } from "react";
import { useAllCollectedWaste } from "../pages/CollectedWaste";
import { IoBuild, IoTrashSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import  'jspdf-autotable'
import { base64url } from '../../../Utils/base64url'

export default function CollectedWasteTable() {
  const { data: waste, refetch } = useAllCollectedWaste();
  const [showConfirm, setShowConfirm] = useState({ visible: false, id: null });
  const [showWarning, setShowWarning] = useState(false); // For warning before deletion
  const [searchTerm, setSearchTerm] = useState("");

  const openComfirmModal = (id) => {
    setShowWarning(true); // Show warning message first
    setShowConfirm({ visible: true, id });
  };

  const closeConfirmModal = () => {
    setShowWarning(false); // Hide warning message
    setShowConfirm({ visible: false, id: null });
  };

  const handleDelete = async (id) => {
    try {
      await customFetch.delete(`/waste/deleteWaste/${id}`);
      toast.success("Waste deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete waste");
      console.error("Delete error", error);
    } finally {
      closeConfirmModal();
    }
  };

  const filteredData = waste.filter(
    (w) =>
      w.CustomerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.CustomerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to export table to PDF
  const generatePDF = () => {

    const doc = new jsPDF();

     // Adding a frame around the PDF content
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    doc.addImage(base64url, "PNG", 10,10,50,20);

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

    doc.setFontSize(12);
    doc.setTextColor(34, 153, 84);
    doc.text("Collected Waste List", 14, 70); 

    const startY = 75;

    const tableColumn = [
      "Customer ID",
      "Customer Name",
      "Price",
      "Weight",
      "Waste Category",
      "Collected Date",
    ];

    const tableRows = [];

    waste.forEach((wastes) => {
      const wasteData = [
        wastes.CustomerId.slice(0,6),
        wastes.CustomerName,
        wastes.Price,
        wastes.Weight,
        wastes.WasteCategory,
        wastes.CollectedDate,
      ];
      tableRows.push(wasteData);
    });

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

        // Footer
    const footerY = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text("All rights reserved © Eco Recycle Company", 14, footerY);
    doc.text(
      `Page ${doc.internal.getNumberOfPages()}`,
      pageWidth - 30,
      footerY,
      { align: "right" }
      );

    doc.save("Collected Waste.pdf"); 

  };

  return (
    <div className="overflow-x-auto bg-white border border-gray-200">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search by Customer ID or Customer Name"
          className="w-full px-4 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Export to PDF Button */}
      <div className="p-4">
        <button
          onClick={generatePDF}
          className="px-4 py-2 text-white bg-green-500 rounded shadow-md hover:bg-green-600"
        >
          Export to PDF
        </button>
      </div>

      {/* Table to Export */}
      <table id="tableToExport" className="min-w-[1000px] w-full text-gray-700">
        <thead>
          <tr>
            <th>Customer Id</th>
            <th>Customer Name</th>
            <th>Price</th>
            <th>Weight</th>
            <th>Waste Category</th>
            <th>Collected Date</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((waste) => (
            <tr key={waste._id}>
              <td>CUS{waste.CustomerId.slice(0, 6)}</td>
              <td>{waste.CustomerName}</td>
              <td>{waste.Price}</td>
              <td>{waste.Weight}</td>
              <td>{waste.WasteCategory}</td>
              <td>{waste.CollectedDate}</td>
              <td>
                <div className="flex flex-row gap-1 no-print">
                  <Link to={`/DriverDashboard/edit-daily-waste/${waste._id}`}>
                    <button className="px-4 py-2 text-white bg-orange-500 rounded shadow-md hover:bg-orange-600">
                      <IoBuild />
                    </button>
                  </Link>
                  <button
                    className="px-4 py-2 text-white rounded shadow-md bg-red hover:bg-red"
                    onClick={() => openComfirmModal(waste._id)}
                  >
                    <IoTrashSharp />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded shadow-lg">
            {showWarning ? (
              <>
                <p className="mb-4 text-gray-700">
                  Do you want to keep a copy of this table as a PDF before
                  deleting?
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={generatePDF}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Export to PDF
                  </button>
                  <button
                    onClick={() => setShowWarning(false)}
                    className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                  >
                    Continue without PDF
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4 text-gray-700">
                  Are you sure you want to delete this waste?
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleDelete(showConfirm.id)}
                    className="px-4 py-2 text-white rounded bg-red hover:bg-red"
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeConfirmModal}
                    className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                  >
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
