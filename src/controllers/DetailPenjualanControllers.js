const {
  createDetailPenjualan,
  getAllDetailPenjualan,
  getDetailPenjualanById,
  getDetailPenjualanByPenjualanId,
  updateDetailPenjualan,
  deleteDetailPenjualan,
} = require("../models/DetailPenjualanModels");
const { getProdukById, updateProduk } = require("../models/ProdukModels");
const { getPenjualanById } = require("../models/PenjualanModels");
const prisma = require("../utils/client");

exports.createDetailPenjualan = async (req, res) => {
  try {
    const { penjualan_id, produk_id, jumlah_produk } = req.body;

    if (!penjualan_id || !produk_id || !jumlah_produk) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const penjualanId = parseInt(penjualan_id);
    const produkId = parseInt(produk_id);
    const jumlahNum = parseInt(jumlah_produk);

    if (isNaN(penjualanId)) {
      return res.status(400).json({ message: "Invalid penjualan ID" });
    }

    if (isNaN(produkId)) {
      return res.status(400).json({ message: "Invalid produk ID" });
    }

    if (isNaN(jumlahNum) || jumlahNum <= 0) {
      return res.status(400).json({
        message: "Jumlah produk must be a positive integer",
      });
    }

    const penjualan = await getPenjualanById(penjualanId);
    if (!penjualan) {
      return res.status(404).json({
        message: "Penjualan Not Found",
      });
    }

    const produk = await getProdukById(produkId);
    if (!produk) {
      return res.status(404).json({
        message: "Produk Not Found",
      });
    }

    if (produk.stok < jumlahNum) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${produk.stok}, Requested: ${jumlahNum}`,
      });
    }

    const subtotal = parseFloat(produk.harga) * jumlahNum;

    const result = await prisma.$transaction(async (tx) => {
      const newDetailPenjualan = await tx.detail_penjualan.create({
        data: {
          penjualan_id: penjualanId,
          produk_id: produkId,
          jumlah_produk: jumlahNum,
          subtotal,
        },
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

      await tx.produk.update({
        where: { id: produkId },
        data: {
          stok: produk.stok - jumlahNum,
        },
      });

      const currentTotal = parseFloat(penjualan.total_harga);
      await tx.penjualan.update({
        where: { id: penjualanId },
        data: {
          total_harga: currentTotal + subtotal,
        },
      });

      return newDetailPenjualan;
    });

    return res.status(201).json({
      message: "Detail Penjualan created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create detail penjualan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getAllDetailPenjualan = async (req, res) => {
  try {
    const data = await getAllDetailPenjualan();
    return res.status(200).json({
      message: "Detail Penjualan retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Get all detail penjualan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getDetailPenjualanById = async (req, res) => {
  try {
    const { id } = req.params;
    const detailId = parseInt(id);

    if (isNaN(detailId)) {
      return res.status(400).json({ message: "Invalid detail penjualan ID" });
    }

    const detailPenjualan = await getDetailPenjualanById(detailId);

    if (!detailPenjualan) {
      return res.status(404).json({
        message: "Detail Penjualan Not Found",
      });
    }

    return res.status(200).json({
      message: "Detail Penjualan retrieved successfully",
      data: detailPenjualan,
    });
  } catch (error) {
    console.error("Get detail penjualan by id error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getDetailPenjualanByPenjualanId = async (req, res) => {
  try {
    const { penjualan_id } = req.params;
    const penjualanId = parseInt(penjualan_id);

    if (isNaN(penjualanId)) {
      return res.status(400).json({ message: "Invalid penjualan ID" });
    }

    const detailPenjualan = await getDetailPenjualanByPenjualanId(penjualanId);

    return res.status(200).json({
      message: "Detail Penjualan retrieved successfully",
      data: detailPenjualan,
    });
  } catch (error) {
    console.error("Get detail penjualan by penjualan id error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.updateDetailPenjualan = async (req, res) => {
  try {
    const { id } = req.params;
    const { produk_id, jumlah_produk } = req.body;
    const detailId = parseInt(id);

    if (isNaN(detailId)) {
      return res.status(400).json({ message: "Invalid detail penjualan ID" });
    }

    const existingDetailPenjualan = await getDetailPenjualanById(detailId);
    if (!existingDetailPenjualan) {
      return res.status(404).json({
        message: "Detail Penjualan Not Found",
      });
    }

    if (!produk_id && !jumlah_produk) {
      return res.status(400).json({
        message: "At least one field is required to update",
      });
    }

    let newSubtotal = existingDetailPenjualan.subtotal;
    let produk = await getProdukById(existingDetailPenjualan.produk_id);

    let jumlahNum = existingDetailPenjualan.jumlah_produk;
    if (jumlah_produk !== undefined) {
      jumlahNum = parseInt(jumlah_produk);
      if (isNaN(jumlahNum) || jumlahNum <= 0) {
        return res.status(400).json({
          message: "Jumlah produk must be a positive integer",
        });
      }

      const stokDifference = jumlahNum - existingDetailPenjualan.jumlah_produk;
      if (stokDifference > 0 && produk.stok < stokDifference) {
        return res.status(400).json({
          message: `Insufficient stock. Available: ${produk.stok}, Needed: ${stokDifference}`,
        });
      }

      newSubtotal = parseFloat(produk.harga) * jumlahNum;
    }

    let produkId = existingDetailPenjualan.produk_id;
    if (produk_id !== undefined) {
      produkId = parseInt(produk_id);
      if (isNaN(produkId)) {
        return res.status(400).json({ message: "Invalid produk ID" });
      }
      if (produkId !== existingDetailPenjualan.produk_id) {
        const newProduk = await getProdukById(produkId);
        if (!newProduk) {
          return res.status(404).json({
            message: "Produk Not Found",
          });
        }
        produk = newProduk;
        newSubtotal = parseFloat(newProduk.harga) * jumlahNum;
      }
    }

    const updateData = {};
    if (produk_id !== undefined) updateData.produk_id = produkId;
    if (jumlah_produk !== undefined) updateData.jumlah_produk = jumlahNum;
    updateData.subtotal = newSubtotal;

    const result = await prisma.$transaction(async (tx) => {
      const updatedDetail = await tx.detail_penjualan.update({
        where: { id: detailId },
        data: updateData,
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

      const penjualan = await tx.penjualan.findUnique({
        where: { id: existingDetailPenjualan.penjualan_id },
      });

      const subtotalDifference = parseFloat(newSubtotal) - parseFloat(existingDetailPenjualan.subtotal);
      await tx.penjualan.update({
        where: { id: existingDetailPenjualan.penjualan_id },
        data: {
          total_harga: parseFloat(penjualan.total_harga) + subtotalDifference,
        },
      });

      if (jumlah_produk !== undefined) {
        const stokDifference = jumlahNum - existingDetailPenjualan.jumlah_produk;
        if (stokDifference !== 0) {
          const currentProduk = await tx.produk.findUnique({
            where: { id: produkId },
          });
          await tx.produk.update({
            where: { id: produkId },
            data: {
              stok: currentProduk.stok - stokDifference,
            },
          });
        }
      }

      return updatedDetail;
    });

    return res.status(200).json({
      success: true,
      message: "Detail Penjualan updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update detail penjualan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.deleteDetailPenjualan = async (req, res) => {
  try {
    const { id } = req.params;
    const detailId = parseInt(id);

    if (isNaN(detailId)) {
      return res.status(400).json({ message: "Invalid detail penjualan ID" });
    }

    const existingDetailPenjualan = await getDetailPenjualanById(detailId);
    if (!existingDetailPenjualan) {
      return res.status(404).json({
        message: "Detail Penjualan Not Found",
      });
    }

    // Delete dalam transaction dan kembalikan stok
    await prisma.$transaction(async (tx) => {
      // Kembalikan stok produk
      const produk = await tx.produk.findUnique({
        where: { id: existingDetailPenjualan.produk_id },
      });
      await tx.produk.update({
        where: { id: existingDetailPenjualan.produk_id },
        data: {
          stok: produk.stok + existingDetailPenjualan.jumlah_produk,
        },
      });

      // Update total harga penjualan
      const penjualan = await tx.penjualan.findUnique({
        where: { id: existingDetailPenjualan.penjualan_id },
      });
      await tx.penjualan.update({
        where: { id: existingDetailPenjualan.penjualan_id },
        data: {
          total_harga: parseFloat(penjualan.total_harga) - parseFloat(existingDetailPenjualan.subtotal),
        },
      });

      // Delete detail penjualan
      await tx.detail_penjualan.delete({
        where: { id: detailId },
      });
    });

    return res.status(200).json({
      message: "Detail Penjualan deleted successfully",
    });
  } catch (error) {
    console.error("Delete detail penjualan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

