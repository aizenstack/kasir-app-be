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

    if (jumlah_produk <= 0) {
      return res.status(400).json({
        message: "Jumlah produk must be greater than 0",
      });
    }

    // Cek penjualan exists
    const penjualan = await getPenjualanById(penjualan_id);
    if (!penjualan) {
      return res.status(404).json({
        message: "Penjualan Not Found",
      });
    }

    // Cek produk dan stok
    const produk = await getProdukById(produk_id);
    if (!produk) {
      return res.status(404).json({
        message: "Produk Not Found",
      });
    }

    if (produk.stok < jumlah_produk) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${produk.stok}, Requested: ${jumlah_produk}`,
      });
    }

    const subtotal = parseFloat(produk.harga) * jumlah_produk;

    // Create detail penjualan dan update stok dalam transaction
    const result = await prisma.$transaction(async (tx) => {
      const newDetailPenjualan = await tx.detail_penjualan.create({
        data: {
          penjualan_id: parseInt(penjualan_id),
          produk_id: parseInt(produk_id),
          jumlah_produk,
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

      // Update stok produk
      await tx.produk.update({
        where: { id: parseInt(produk_id) },
        data: {
          stok: produk.stok - jumlah_produk,
        },
      });

      // Update total harga penjualan
      const currentTotal = parseFloat(penjualan.total_harga);
      await tx.penjualan.update({
        where: { id: parseInt(penjualan_id) },
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

    const detailPenjualan = await getDetailPenjualanById(id);

    if (!detailPenjualan) {
      return res.status(404).json({
        message: "Detail Penjualan Not Found",
      });
    }

    return res.status(200).json({
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

    const detailPenjualan = await getDetailPenjualanByPenjualanId(penjualan_id);

    return res.status(200).json({
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

    const existingDetailPenjualan = await getDetailPenjualanById(id);
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

    // Jika jumlah_produk diubah, perlu update subtotal dan total penjualan
    let newSubtotal = existingDetailPenjualan.subtotal;
    let produk = await getProdukById(existingDetailPenjualan.produk_id);

    if (jumlah_produk) {
      if (jumlah_produk <= 0) {
        return res.status(400).json({
          message: "Jumlah produk must be greater than 0",
        });
      }

      // Cek stok jika jumlah_produk berubah
      const stokDifference = jumlah_produk - existingDetailPenjualan.jumlah_produk;
      if (stokDifference > 0 && produk.stok < stokDifference) {
        return res.status(400).json({
          message: `Insufficient stock. Available: ${produk.stok}, Needed: ${stokDifference}`,
        });
      }

      newSubtotal = parseFloat(produk.harga) * jumlah_produk;
    }

    if (produk_id && produk_id !== existingDetailPenjualan.produk_id) {
      const newProduk = await getProdukById(produk_id);
      if (!newProduk) {
        return res.status(404).json({
          message: "Produk Not Found",
        });
      }
      produk = newProduk;
      if (jumlah_produk) {
        newSubtotal = parseFloat(newProduk.harga) * jumlah_produk;
      } else {
        newSubtotal = parseFloat(newProduk.harga) * existingDetailPenjualan.jumlah_produk;
      }
    }

    const updateData = {};
    if (produk_id) updateData.produk_id = parseInt(produk_id);
    if (jumlah_produk) updateData.jumlah_produk = jumlah_produk;
    updateData.subtotal = newSubtotal;

    // Update dalam transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedDetail = await tx.detail_penjualan.update({
        where: { id: parseInt(id) },
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

      // Update total harga penjualan
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

      // Update stok jika jumlah_produk berubah
      if (jumlah_produk) {
        const stokDifference = jumlah_produk - existingDetailPenjualan.jumlah_produk;
        if (stokDifference !== 0) {
          const currentProduk = await tx.produk.findUnique({
            where: { id: produk_id || existingDetailPenjualan.produk_id },
          });
          await tx.produk.update({
            where: { id: produk_id || existingDetailPenjualan.produk_id },
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
    const existingDetailPenjualan = await getDetailPenjualanById(id);
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
        where: { id: parseInt(id) },
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

