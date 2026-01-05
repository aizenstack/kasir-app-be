const PDFDocument = require("pdfkit");
const {
  createPenjualan,
  getAllPenjualan,
  getPenjualanById,
  updatePenjualan,
  deletePenjualan,
} = require("../models/PenjualanModels");
const {
  createManyDetailPenjualan,
  deleteDetailPenjualanByPenjualanId,
} = require("../models/DetailPenjualanModels");
const { getProdukById, updateProduk } = require("../models/ProdukModels");
const prisma = require("../utils/client");

exports.createPenjualan = async (req, res) => {
  try {
    let { tanggal_penjualan, pelanggan_id, detail_penjualan } = req.body;

    if (tanggal_penjualan) {
      if (typeof tanggal_penjualan === 'string') {
        tanggal_penjualan = tanggal_penjualan.trim();
        if (tanggal_penjualan === '') {
          tanggal_penjualan = null;
        }
      }
    } else {
      tanggal_penjualan = null;
    }

    if (detail_penjualan && !Array.isArray(detail_penjualan)) {

      if (typeof detail_penjualan === 'string') {
        try {
          const trimmed = detail_penjualan.trim();
          if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
            detail_penjualan = null;
          } else {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed) && parsed.length > 0) {
              detail_penjualan = parsed;
            } else if (parsed && typeof parsed === 'object' && parsed.produk_id && parsed.jumlah_produk) {
              detail_penjualan = [parsed];
            } else {
              detail_penjualan = null;
            }
          }
        } catch (e) {
          console.warn("Failed to parse detail_penjualan as JSON:", e.message);
          detail_penjualan = null;
        }
      } else if (typeof detail_penjualan === 'object' && detail_penjualan !== null) {
        const keys = Object.keys(detail_penjualan);
        const isArrayLike = keys.every(key => !isNaN(parseInt(key)));

        if (isArrayLike && keys.length > 0) {
          const detailArray = [];
          const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
          for (const key of sortedKeys) {
            const item = detail_penjualan[key];
            if (item && typeof item === 'object' && item.produk_id && item.jumlah_produk) {
              detailArray.push({
                produk_id: parseInt(item.produk_id),
                jumlah_produk: parseInt(item.jumlah_produk)
              });
            }
          }
          detail_penjualan = detailArray.length > 0 ? detailArray : null;
        } else if (detail_penjualan.produk_id && detail_penjualan.jumlah_produk) {
          detail_penjualan = [{
            produk_id: parseInt(detail_penjualan.produk_id),
            jumlah_produk: parseInt(detail_penjualan.jumlah_produk)
          }];
        } else {
          detail_penjualan = null;
        }
      } else {
        detail_penjualan = null;
      }
    }



    let tanggalDate;
    if (tanggal_penjualan) {
      tanggalDate = new Date(tanggal_penjualan);
      if (isNaN(tanggalDate.getTime())) {
        return res.status(400).json({
          message: "Invalid tanggal_penjualan format. Use ISO 8601 format (e.g., 2024-12-27T10:00:00Z)",
        });
      }
    } else {
      tanggalDate = new Date();
    }

    if (!detail_penjualan || !Array.isArray(detail_penjualan) || detail_penjualan.length === 0) {
      return res.status(400).json({
        message: "Detail penjualan is required and must be a non-empty array",
      });
    }

    let total_harga = 0;
    const detailPenjualanData = [];

    for (const detail of detail_penjualan) {
      if (!detail || typeof detail !== 'object') {
        return res.status(400).json({
          message: "Invalid detail_penjualan format. Each item must be an object with produk_id and jumlah_produk",
        });
      }

      let { produk_id, jumlah_produk } = detail;

      if (produk_id === undefined || produk_id === null || produk_id === '') {
        return res.status(400).json({
          message: "Produk ID is required in detail_penjualan",
        });
      }

      produk_id = parseInt(produk_id);
      if (isNaN(produk_id) || produk_id <= 0) {
        return res.status(400).json({
          message: "Produk ID must be a positive integer",
        });
      }

      if (jumlah_produk === undefined || jumlah_produk === null || jumlah_produk === '') {
        return res.status(400).json({
          message: "Jumlah produk is required in detail_penjualan",
        });
      }

      jumlah_produk = parseInt(jumlah_produk);
      if (isNaN(jumlah_produk) || jumlah_produk <= 0) {
        return res.status(400).json({
          message: "Jumlah produk must be a positive integer greater than 0",
        });
      }

      const produk = await getProdukById(produk_id);
      if (!produk) {
        return res.status(404).json({
          message: `Produk with ID ${produk_id} not found`,
        });
      }

      if (produk.stok < jumlah_produk) {
        return res.status(400).json({
          message: `Insufficient stock for produk ${produk.nama_produk}. Available: ${produk.stok}, Requested: ${jumlah_produk}`,
        });
      }

      const subtotal = parseFloat(produk.harga) * jumlah_produk;
      if (isNaN(subtotal)) {
        return res.status(400).json({
          message: `Invalid harga for produk ${produk.nama_produk}`,
        });
      }

      total_harga += subtotal;

      detailPenjualanData.push({
        produk_id,
        jumlah_produk,
        subtotal,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      let finalPelangganId = null;
      if (pelanggan_id !== undefined && pelanggan_id !== null && pelanggan_id !== '') {
        const pelId = parseInt(pelanggan_id);
        if (!isNaN(pelId) && pelId > 0) {
          finalPelangganId = pelId;
        }
      }

      const newPenjualan = await tx.penjualan.create({
        data: {
          tanggal_penjualan: tanggalDate,
          total_harga: total_harga,
          pelanggan_id: finalPelangganId,
        },
        select: {
          id: true,
          tanggal_penjualan: true,
          total_harga: true,
          pelanggan_id: true,
          createdAt: true,
          pelanggan: {
            select: {
              id: true,
              nama_pelanggan: true,
              alamat: true,
              telepon: true,
            },
          },
        },
      });

      const detailWithPenjualanId = detailPenjualanData.map((detail) => ({
        ...detail,
        penjualan_id: newPenjualan.id,
      }));

      await tx.detail_penjualan.createMany({
        data: detailWithPenjualanId,
      });

      for (const detail of detailPenjualanData) {
        const produk = await tx.produk.findUnique({
          where: { id: detail.produk_id },
        });
        await tx.produk.update({
          where: { id: detail.produk_id },
          data: {
            stok: produk.stok - detail.jumlah_produk,
          },
        });
      }

      const detailPenjualan = await tx.detail_penjualan.findMany({
        where: { penjualan_id: newPenjualan.id },
        include: {
          produk: {
            select: {
              id: true,
              nama_produk: true,
              harga: true,
            },
          },
        },
      });

      return {
        ...newPenjualan,
        detailPenjualan,
      };
    });

    return res.status(201).json({
      message: "Penjualan created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create penjualan error:", error);
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);


    if (error.code === 'P2002') {
      return res.status(400).json({
        message: "Duplicate entry. Penjualan dengan data yang sama sudah ada.",
      });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        message: "Foreign key constraint failed. Pastikan produk_id dan pelanggan_id valid.",
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message || "Validation error",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message, // Temporarily expose error for debugging
      stack: error.stack
    });
  }
};

exports.getAllPenjualan = async (req, res) => {
  try {
    const data = await getAllPenjualan();
    return res.status(200).json({
      message: "Penjualan retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Get all penjualan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getPenjualanById = async (req, res) => {
  try {
    const { id } = req.params;
    const penjualanId = parseInt(id);

    if (isNaN(penjualanId)) {
      return res.status(400).json({ message: "Invalid penjualan ID" });
    }

    const penjualan = await getPenjualanById(penjualanId);

    if (!penjualan) {
      return res.status(404).json({
        message: "Penjualan Not Found",
      });
    }

    return res.status(200).json({
      message: "Penjualan retrieved successfully",
      data: penjualan,
    });
  } catch (error) {
    console.error("Get penjualan by id error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.updatePenjualan = async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggal_penjualan, total_harga, pelanggan_id } = req.body;
    const penjualanId = parseInt(id);

    if (isNaN(penjualanId)) {
      return res.status(400).json({ message: "Invalid penjualan ID" });
    }

    const existingPenjualan = await getPenjualanById(penjualanId);
    if (!existingPenjualan) {
      return res.status(404).json({
        message: "Penjualan Not Found",
      });
    }

    if (!tanggal_penjualan && !total_harga && pelanggan_id === undefined) {
      return res.status(400).json({
        message: "At least one field is required to update",
      });
    }

    const updateData = {};
    if (tanggal_penjualan) {
      const date = new Date(tanggal_penjualan);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      updateData.tanggal_penjualan = date;
    }
    if (total_harga !== undefined) {
      const totalNum = parseFloat(total_harga);
      if (isNaN(totalNum) || totalNum < 0) {
        return res.status(400).json({ message: "Total harga must be a non-negative number" });
      }
      updateData.total_harga = totalNum;
    }
    if (pelanggan_id !== undefined) {
      if (pelanggan_id === null || pelanggan_id === '') {
        updateData.pelanggan_id = null;
      } else {
        const pelId = parseInt(pelanggan_id);
        if (isNaN(pelId)) {
          return res.status(400).json({ message: "Invalid pelanggan ID" });
        }
        updateData.pelanggan_id = pelId;
      }
    }

    const updatedPenjualan = await updatePenjualan(penjualanId, updateData);

    return res.status(200).json({
      success: true,
      message: "Penjualan updated successfully",
      data: updatedPenjualan,
    });
  } catch (error) {
    console.error("Update penjualan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.deletePenjualan = async (req, res) => {
  try {
    const { id } = req.params;
    const penjualanId = parseInt(id);

    if (isNaN(penjualanId)) {
      return res.status(400).json({ message: "Invalid penjualan ID" });
    }

    const existingPenjualan = await getPenjualanById(penjualanId);
    if (!existingPenjualan) {
      return res.status(404).json({
        message: "Penjualan Not Found",
      });
    }

    await deleteDetailPenjualanByPenjualanId(penjualanId);

    await deletePenjualan(penjualanId);

    return res.status(200).json({
      message: "Penjualan deleted successfully",
    });
  } catch (error) {
    console.error("Delete penjualan error:", error);
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Cannot delete penjualan: has related records",
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      stack: error.stack
    });
  }
};

exports.downloadNota = async (req, res) => {
  try {
    const { id } = req.params;
    const penjualanId = parseInt(id);

    if (isNaN(penjualanId)) {
      return res.status(400).json({ message: "Invalid penjualan ID" });
    }

    const penjualan = await getPenjualanById(penjualanId);

    if (!penjualan) {
      return res.status(404).json({
        message: "Penjualan Not Found",
      });
    }

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=nota-${penjualanId}.pdf`
    );

    doc.pipe(res);

    const startY = 30;
    const pageWidth = 595.28;
    const margin = 30;
    const contentWidth = pageWidth - margin * 2;

    const cashierName = "Administrator";
    const customerName = penjualan.pelanggan
      ? `${penjualan.pelanggan.nama_pelanggan} - ${penjualan.pelanggan.alamat} - ${penjualan.pelanggan.telepon}`
      : "Umum";

    const saleDate = new Date(penjualan.tanggal_penjualan);
    const timeZone = 'Asia/Jakarta';
    const formattedDate = saleDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone });
    const formattedTime = saleDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone });
    const invoiceNo = `${saleDate.getFullYear()}${(saleDate.getMonth() + 1).toString().padStart(2, 0)}${saleDate.getDate().toString().padStart(2, 0)}.${penjualan.id.toString().padStart(5, '0')}`;



    const fs = require('fs');
    const path = require('path');
    const logoPath = path.join(__dirname, '../assets/logo.png');

    const logoSize = 50;
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, margin, startY, { fit: [logoSize, logoSize] });
    }

    doc.font("Helvetica-BoldOblique").fontSize(14).fillColor("#6a1b9a")
      .text("Sistem Informasi Kasir", margin, startY + logoSize + 5);

    doc.fillColor("black");

    const metadataX = 400;
    const metadataY = startY;
    const lineHeight = 12;

    doc.fontSize(9).font("Helvetica");

    doc.text("No #", metadataX, metadataY);
    doc.text(":", metadataX + 60, metadataY);
    doc.text(invoiceNo, metadataX + 70, metadataY);

    doc.text("Cashier", metadataX, metadataY + lineHeight);
    doc.text(":", metadataX + 60, metadataY + lineHeight);
    doc.text(cashierName, metadataX + 70, metadataY + lineHeight);

    doc.text("Date & Time", metadataX, metadataY + lineHeight * 2);
    doc.text(":", metadataX + 60, metadataY + lineHeight * 2);
    doc.text(`${formattedDate}   ${formattedTime}`, metadataX + 70, metadataY + lineHeight * 2);

    doc.text("Customer", metadataX, metadataY + lineHeight * 3);
    doc.text(":", metadataX + 60, metadataY + lineHeight * 3);
    doc.text(customerName, metadataX + 70, metadataY + lineHeight * 3);


    const tableTop = startY + 85;

    const colX = [margin, margin + 25, margin + 220, margin + 270, margin + 310, margin + 370, margin + 440];

    doc.moveTo(margin, tableTop).lineTo(pageWidth - margin, tableTop).stroke();

    const headerY = tableTop + 5;
    doc.fontSize(9).font("Helvetica");
    doc.text("No", colX[0], headerY);
    doc.text("Description Item / Service", colX[1], headerY);
    doc.text("Quantity", colX[2], headerY);
    doc.text("Unit", colX[3], headerY);
    doc.text("Unit Price", colX[4], headerY, { width: 60, align: "right" });
    doc.text("Item Discount", colX[5], headerY, { width: 70, align: "right" });
    doc.text("Total Price", colX[6], headerY, { width: 90, align: "right" });

    doc.moveTo(margin, tableTop + 20).lineTo(pageWidth - margin, tableTop + 20).stroke();

    let currentY = tableTop + 30;
    let itemNo = 1;
    let totalQty = 0;

    penjualan.detailPenjualan.forEach((item) => {
      doc.font("Helvetica").fontSize(9);
      doc.text(itemNo.toString(), colX[0], currentY);
      doc.text(item.produk.nama_produk, colX[1], currentY, { width: 190 });
      doc.text(item.jumlah_produk.toString(), colX[2], currentY, { align: "center", width: 40 });
      doc.text("pcs", colX[3], currentY);
      doc.text(parseFloat(item.produk.harga).toLocaleString("id-ID"), colX[4], currentY, { width: 60, align: "right" });
      doc.text("0", colX[5], currentY, { width: 70, align: "right" });
      doc.text(parseFloat(item.subtotal).toLocaleString("id-ID"), colX[6], currentY, { width: 90, align: "right" });

      currentY += 15;
      itemNo++;
      totalQty += item.jumlah_produk;
    });

    doc.moveTo(margin, currentY + 5).lineTo(pageWidth - margin, currentY + 5).stroke();


    const footerTop = currentY + 15;
    doc.text("Total Item", margin + 180, footerTop);
    doc.text(totalQty.toString(), margin + 270, footerTop);

    const rightSideX = 400;

    doc.text("SUBTOTAL", rightSideX, footerTop);
    doc.text(parseFloat(penjualan.total_harga).toLocaleString("id-ID"), margin, footerTop, { align: "right" });

    doc.text("DISCOUNT", rightSideX, footerTop + 15);
    doc.text("0", margin, footerTop + 15, { align: "right" });

    doc.dash(1, { space: 2 });
    doc.moveTo(rightSideX, footerTop + 30).lineTo(pageWidth - margin, footerTop + 30).stroke();
    doc.undash();

    doc.font("Helvetica-Bold");
    doc.text("TOTAL", rightSideX, footerTop + 35);
    doc.text(parseFloat(penjualan.total_harga).toLocaleString("id-ID"), margin, footerTop + 35, { align: "right" });

    const signatureY = footerTop + 40;
    doc.font("Helvetica");
    doc.text("CASHIER", margin + 50, signatureY);

    doc.dash(1, { space: 2 });
    doc.moveTo(margin + 20, signatureY + 50).lineTo(margin + 150, signatureY + 50).stroke();
    doc.undash();

    doc.text(cashierName, margin + 60, signatureY + 55);


    doc.fontSize(10).font("Helvetica");
    doc.text("THANK YOU FOR YOUR VISIT", margin, signatureY + 90, { align: "center", width: contentWidth });

    doc.end();
  } catch (error) {
    console.error("Download nota error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
};

