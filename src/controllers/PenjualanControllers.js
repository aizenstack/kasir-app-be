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
    const { tanggal_penjualan, pelanggan_id, detail_penjualan } = req.body;

    if (!tanggal_penjualan || !detail_penjualan || !Array.isArray(detail_penjualan) || detail_penjualan.length === 0) {
      return res.status(400).json({
        message: "Tanggal penjualan and detail penjualan are required",
      });
    }

    // Validasi dan hitung total harga
    let total_harga = 0;
    const detailPenjualanData = [];

    for (const detail of detail_penjualan) {
      const { produk_id, jumlah_produk } = detail;

      if (!produk_id || !jumlah_produk || jumlah_produk <= 0) {
        return res.status(400).json({
          message: "Produk ID and jumlah produk are required and jumlah must be greater than 0",
        });
      }

      // Cek produk dan stok
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
      total_harga += subtotal;

      detailPenjualanData.push({
        produk_id,
        jumlah_produk,
        subtotal,
      });
    }

    // Buat penjualan dan detail penjualan dalam transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create penjualan
      const newPenjualan = await tx.penjualan.create({
        data: {
          tanggal_penjualan: new Date(tanggal_penjualan),
          total_harga: total_harga,
          pelanggan_id: pelanggan_id || null,
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

      // Create detail penjualan dan update stok produk
      const detailWithPenjualanId = detailPenjualanData.map((detail) => ({
        ...detail,
        penjualan_id: newPenjualan.id,
      }));

      await tx.detail_penjualan.createMany({
        data: detailWithPenjualanId,
      });

      // Update stok produk
      for (const detail of detail_penjualan) {
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

      // Get detail penjualan dengan produk info
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
    return res.status(500).json({
      message: "Internal Server Error",
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

    // Delete detail penjualan terlebih dahulu (akan otomatis terhapus karena cascade)
    await deleteDetailPenjualanByPenjualanId(penjualanId);

    // Delete penjualan
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
    });
  }
};

