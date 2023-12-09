import React, { useState, useEffect } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSearch,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";

import { DatePicker } from "antd";
import moment from "moment";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/stock.css";

const StockDetailsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicineData, setMedicineData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromExpiryDate, setFromExpiryDate] = useState(null);
  const [toExpiryDate, setToExpiryDate] = useState(null);
  const [loader, setLoader] = useState(false);
  const [editedRows, setEditedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedData, setEditedData] = useState({
    originalData: {}, 
    lastEditTimestamp: null, 
  });
  const [editMode, setEditMode] = useState(null);
  const itemsPerPage = 25;

  const filteredData = medicineData
    .filter(
      (item) =>
        item.medicinename &&
        item.medicinename.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!fromExpiryDate ||
          moment(item.expirydate).isSameOrAfter(fromExpiryDate)) &&
        (!toExpiryDate || moment(item.expirydate).isSameOrBefore(toExpiryDate))
    )
    .sort((a, b) => {
      return moment(a.expirydate) - moment(b.expirydate);
    });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const dataOnCurrentPage = filteredData.slice(startIndex, endIndex);

  const fetchStockData = async () => {
    try {
        const response = await axios.get("https://api.5ytechno.com/stock", {
                    params: { medicinename: searchQuery, fromExpiryDate, toExpiryDate },
      });

      setMedicineData(response.data);
      console.log("Updated Medicine Data:", response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [searchQuery, fromExpiryDate, toExpiryDate]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("https://api.5ytechno.com/stock");
        setMedicineData(response.data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
  }, []);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  const handleFromDateChange = (date, dateString) => {
    setFromExpiryDate(moment(dateString).startOf('day').toISOString());
    setCurrentPage(1); 
  };
  
  const handleToDateChange = (date, dateString) => {
    setToExpiryDate(moment(dateString).endOf('day').toISOString());
    setCurrentPage(1); 
  };


  const handleSaveEdit = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `https://api.5ytechno.com/stock/update/${id}`,
        updatedData
      );

      setEditedRows((prevEditedRows) => [
        ...prevEditedRows,
        { id, timestamp: new Date() },
      ]);

      setMedicineData((prevMedicineData) => {
        const updatedMedicineData = prevMedicineData.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item
        );
        return updatedMedicineData;
      });

      setEditMode(null);
      alert("Stock item updated successfully");
    } catch (error) {
      console.error("Error updating stock item:", error);
      alert("Error updating stock item. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting item with ID:", id);

    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `https://api.5ytechno.com/stock/delete/${id}`
        );
        console.log("Delete response:", response.data);

        if (response.status === 200) {
          setMedicineData((prevMedicineData) =>
            prevMedicineData.filter((item) => item.id !== id)
          );

          alert("Stock item deleted successfully");
        } else {
          alert("Failed to delete stock item. Please try again later.");
        }
      } catch (error) {
        console.error("Error deleting stock item:", error);
        alert("Error deleting stock item. Please try again later.");
      }
    }
  };

  const handleEdit = (id) => {
    const editedItem = medicineData.find((item) => item.id === id);
    setEditMode(id);
    setEditedData({
      ...editedItem,
      originalData: { ...editedItem },
      lastEditTimestamp: new Date(),
    });
  };

  const isRowEdited = (id) => editedRows.some((row) => row.id === id);

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedData({});
  };

  const handleChangeEditData = (name, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
      lastEditTimestamp: new Date(),
    }));
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("StockData");

    worksheet.columns = [
      { header: "Purchase Date", key: "purchasedate", width: 15 },
      { header: "Medicine Name", key: "medicinename", width: 15 },
      { header: "Dosage", key: "dosage", width: 15 },
      { header: "Brand Names", key: "brandname", width: 15 },
      { header: "Purchase Price", key: "purchaseprice", width: 15 },

      { header: "MRP", key: "mrp", width: 15 },
      { header: "Total Qty", key: "totalqty", width: 15 },
      { header: "Expiry Date", key: "expirydate", width: 15 },
    ];

    const headerRow = worksheet.getRow(1);

    worksheet.columns.forEach((column) => {
      const cell = headerRow.getCell(column.key);
      if (
        [
          "purchasedate",
          "medicinename",
          "dosage",
          "brandname",
          "purchaseprice",

          "mrp",
          "totalqty",
          "expirydate",
        ].includes(column.key)
      ) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF001F3F" },
        };
        cell.alignment = { horizontal: "center" };
      }
      cell.font = {
        color: { argb: "FFFFFF" },
        bold: true,
      };
    });

    filteredData.forEach((item) => {
      const formattedDate = item.purchasedate
        ? moment(item.purchasedate).format("YYYY-MM-DD")
        : "N/A";

      const dataRow = worksheet.addRow({
        purchasedate: formattedDate,
        medicinename: item.medicinename || "N/A",
        dosage: item.dosage || "N/A",
        brandname: item.brandname || "N/A",
        purchaseprice: item.purchaseprice || "N/A",

        mrp: item.mrp || "N/A",
        totalqty: item.totalqty || "N/A",
        expirydate: item.expirydate
          ? moment(item.expirydate).format("YYYY-MM-DD")
          : "N/A",
      });

      dataRow.alignment = { horizontal: "center" };

      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "stock.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const downloadPDF = () => {
    const html2canvasOptions = {
      scale: 2,
      logging: false,
      allowTaint: true,
    };

    const capture = document.querySelector(".stock-table");
    setLoader(true);

    html2canvas(capture, html2canvasOptions).then((canvas) => {
      const jsPDFOptions = {
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      };

      const pdf = new jsPDF(jsPDFOptions);
      const imageWidth = 210;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(43, 128, 176);

      const headingText =
        fromExpiryDate && toExpiryDate
          ? `Stock Details from ${moment(fromExpiryDate).format(
              "YYYY-MM-DD"
            )} to ${moment(toExpiryDate).format("YYYY-MM-DD")}`
          : "Stock Details as on Today";

      pdf.text(headingText, 10, 10, null, null, "left");

      const headingHeight = 20;
      const tableStartY = 0 + headingHeight;
      const firstPageData = filteredData.slice(0, itemsPerPage);
      const firstPageBodyData = firstPageData.map((currentData) => [
        currentData.purchasedate
          ? moment(currentData.purchasedate).format("YYYY-MM-DD")
          : "N/A",
        currentData.medicinename || "N/A",
        currentData.dosage || "N/A",
        currentData.brandname || "N/A",
        currentData.purchaseprice || "N/A",

        currentData.mrp || "N/A",
        currentData.totalqty || "N/A",
        currentData.expirydate
          ? moment(currentData.expirydate).format("YYYY-MM-DD")
          : "N/A",
      ]);

      pdf.autoTable({
        head: [
          [
            "Purchase Date",
            "Medicine Name",
            "Dosage",
            "Brand Name",
            "Purchase Price",
            "Purchase Amount",
            "MRP",
            "Total Qty",
            "Expiry Date",
          ],
        ],
        body: firstPageBodyData,
        startY: tableStartY,
        theme: "grid",
        styles: {
          fontSize: 9,
          halign: "center",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          lineWidth: 0.3,
        },
        columnStyles: {
          0: { cellWidth: 20, cellHeight: 10 },
          1: { cellWidth: 30, cellHeight: 10 },
        },
        alternateRowStyles: {
          fillColor: [224, 224, 224],
          lineWidth: 0.3,
        },
      });

      let rowIndex = itemsPerPage;
      const numberOfRows = filteredData.length;

      while (rowIndex < numberOfRows) {
        pdf.addPage();
        pdf.text(`Page ${Math.ceil((rowIndex + 1) / itemsPerPage)}`, 10, 10);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(43, 128, 176);

        const currentPageData = filteredData.slice(
          rowIndex,
          rowIndex + itemsPerPage
        );
        const bodyData = currentPageData.map((currentData) => [
          currentData.purchasedate
            ? moment(currentData.purchasedate).format("YYYY-MM-DD")
            : "N/A",
          currentData.medicinename || "N/A",
          currentData.dosage || "N/A",
          currentData.brandname || "N/A",
          currentData.purchaseprice || "N/A",

          currentData.mrp || "N/A",
          currentData.totalqty || "N/A",
          currentData.expirydate
            ? moment(currentData.expirydate).format("YYYY-MM-DD")
            : "N/A",
        ]);

        pdf.autoTable({
          head: [
            [
              "Purchase Date",
              "Medicine Name",
              "Dosage",
              "Brand Name",
              "Purchase Price",
              "Purchase Amount",
              "MRP",
              "Total Qty",
              "Expiry Date",
            ],
          ],
          body: bodyData,
          startY: tableStartY,
          theme: "grid",
          styles: {
            fontSize: 9,
            halign: "center",
          },
          headerStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            lineWidth: 0.3,
          },
          columnStyles: {
            0: { cellWidth: 20, cellHeight: 10 },
            1: { cellWidth: 30, cellHeight: 10 },
          },
          alternateRowStyles: {
            fillColor: [224, 224, 224],
            lineWidth: 0.3,
          },
        });

        rowIndex += itemsPerPage;
      }

      setLoader(false);
      pdf.save("stock.pdf");
    });
  };

  const tdStyle = {
    textAlign: "center",
    whiteSpace: "nowrap",
  };
  const thStyle = {
    textAlign: "center",
  };

  return (
    <div>
      <div
        style={{
          marginTop: "10px",
          fontFamily: "serif",
        }}
      >
        <div style={{ margin: "15px" }}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2>
                <b> Stock Details</b>
              </h2>
              <h6 style={{ textAlign: "center" }}>View your stock list</h6>
            </div>
            <div>
              <button onClick={exportToExcel} className="export">
                Export as Excel
              </button>
              <button
                onClick={downloadPDF}
                disabled={!(loader === false)}
                className="export"
              >
                {loader ? (
                  <span>Downloading</span>
                ) : (
                  <span>Download as PDF</span>
                )}
              </button>
            </div>
          </div>
          <br />

          <div className="row align-items-center ">
            <div className="col-10 col-md-8 ">
              <div
                className="search-bar d-flex align-items-center"
                style={{ marginLeft: "0px" }}
              >
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  style={{ height: "30px" }}
                  onChange={(event) => handleSearchChange(event.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mt-5 mt-md-0 ">
              <h6
                style={{
                  fontSize: "18px",
                  fontFamily: "serif",
                  textAlign: "end",
                  marginRight: "100px",
                }}
              >
                <b>Expiry Date Filter</b>
              </h6>
              <div className="d-flex justify-content-md-end">
                <span className="bold-placeholder me-3">
                  From{" "}
                  <DatePicker
                    onChange={handleFromDateChange}
                    className="bold-placeholder"
                  />{" "}
                </span>
                <span className="bold-placeholder">
                  To{" "}
                  <DatePicker
                    onChange={handleToDateChange}
                    className="bold-placeholder"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="stock-table" style={{ marginLeft: "0px" }}>
          {dataOnCurrentPage.length === 0 ? (
            <p>No search results found</p>
          ) : (
            <div>
              <div style={{ overflowX: "auto" }}>
                <div className="scrollable-body">
                  <table className="table">
                    <thead className="sticky-top bg-light">
                      <tr>
                        <th style={thStyle}>Purchase Date</th>
                        <th style={thStyle}>Medicine Name</th>
                        <th style={thStyle}>Dosage</th>
                        <th style={thStyle}>Brand Name</th>
                        <th style={thStyle}>Purchase Price</th>
                        <th style={thStyle}>MRP</th>
                        <th style={thStyle}>Total Qty</th>
                        <th style={thStyle}>Expiry Date</th>
                        <th style={thStyle}></th>
                        <th style={thStyle}>Edit</th>
                        <th style={thStyle}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={item.id}>
                          <td style={tdStyle}>
                            {item.purchasedate
                              ? moment(item.purchasedate).format("YYYY-MM-DD")
                              : "N/A"}
                          </td>

                          <td style={{ ...tdStyle, textAlign: "left" }}>
                            {item.medicinename || "N/A"}
                          </td>
                          <td style={tdStyle}>{item.dosage || "N/A"}</td>
                          <td style={tdStyle}>
                            {editMode === item.id ? (
                              <input
                                type="text"
                                value={editedData.brandname}
                                onChange={(e) =>
                                  handleChangeEditData(
                                    "brandname",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              item.brandname || "N/A"
                            )}
                          </td>
                          <td style={tdStyle}>
                            {editMode === item.id ? (
                              <input
                                type="text"
                                value={editedData.purchaseprice}
                                onChange={(e) =>
                                  handleChangeEditData(
                                    "purchaseprice",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              item.purchaseprice || "N/A"
                            )}
                          </td>

                          <td style={tdStyle}>
                            {editMode === item.id ? (
                              <input
                                type="text"
                                value={editedData.mrp}
                                onChange={(e) =>
                                  handleChangeEditData("mrp", e.target.value)
                                }
                              />
                            ) : (
                              item.mrp || "N/A"
                            )}
                          </td>
                          <td style={tdStyle}>
                            {editMode === item.id ? (
                              <input
                                type="text"
                                value={editedData.totalqty}
                                onChange={(e) =>
                                  handleChangeEditData(
                                    "totalqty",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              item.totalqty || "N/A"
                            )}
                          </td>
                          <td style={tdStyle}>
                            {editMode === item.id ? (
                              <input
                                type="text"
                                value={editedData.expirydate}
                                onChange={(e) =>
                                  handleChangeEditData(
                                    "expirydate",
                                    e.target.value
                                  )
                                }
                              />
                            ) : item.expirydate ? (
                              moment(item.expirydate).format("YYYY-MM-DD")
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td style={tdStyle}>
                            {isRowEdited(item.id) ? (
                              <span style={{ color: "orange" }}>Edited</span>
                            ) : null}
                          </td>
                          <td style={tdStyle}>
                            {editMode === item.id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleSaveEdit(item.id, editedData)
                                  }
                                  style={{ marginRight: "5px" }}
                                >
                                  Save
                                </button>
                                <button onClick={handleCancelEdit}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <FontAwesomeIcon
                                icon={faEdit}
                                onClick={() => handleEdit(item.id)}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "10px",
                                  color: "blue",
                                }}
                              />
                            )}
                          </td>
                          <td style={tdStyle}>
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() => handleDelete(item.id)}
                              style={{
                                cursor: "pointer",
                                marginRight: "10px",
                                color: "red",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pagination">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            {" "}
            {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNext}
            disabled={
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockDetailsPage;
