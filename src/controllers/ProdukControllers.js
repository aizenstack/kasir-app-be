const {
  createProduk,
  getAllProduk,
  getProdukById,
  updateProduk,
  deleteProduk,
} = require("../models/ProdukModels");

exports.createProduk = async (req, res) => {
  try {
    const { nama_produk, harga, stok } = req.body;

    if (!nama_produk || !harga || !stok) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validasi tipe data
    if (typeof nama_produk !== 'string' || nama_produk.trim() === '') {
      return res.status(400).json({ message: "Nama produk must be a non-empty string" });
    }

    const hargaNum = parseFloat(harga);
    const stokNum = parseInt(stok);

    if (isNaN(hargaNum) || hargaNum <= 0) {
      return res.status(400).json({ message: "Harga must be a positive number" });
    }

    if (isNaN(stokNum) || stokNum < 0) {
      return res.status(400).json({ message: "Stok must be a non-negative integer" });
    }

    const newProduk = await createProduk({
      nama_produk: nama_produk.trim(),
      harga: hargaNum,
      stok: stokNum,
    });

    return res.status(201).json({
      message: "Produk created successfully",
      data: newProduk,
    });
  } catch (error) {
    console.error("Create produk error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Produk with this name already exists" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllProduk = async (req, res) => {
  try {
    const data = await getAllProduk();
    return res.status(200).json({
      message: "Produk retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Get all produk error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getProdukById = async (req, res) => {
  try {
    const { id } = req.params;
    const produkId = parseInt(id);

    if (isNaN(produkId)) {
      return res.status(400).json({ message: "Invalid produk ID" });
    }

    const produk = await getProdukById(produkId);

    if (!produk) {
      return res.status(404).json({
        message: "Produk Not Found",
      });
    }

    return res.status(200).json({
      message: "Produk retrieved successfully",
      data: produk,
    });
  } catch (error) {
    console.error("Get produk by id error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, harga, stok } = req.body;
    const produkId = parseInt(id);

    if (isNaN(produkId)) {
      return res.status(400).json({ message: "Invalid produk ID" });
    }

    const existingProduk = await getProdukById(produkId);
    if (!existingProduk) {
      return res.status(404).json({
        message: "Produk Not Found",
      });
    }

    if (!nama_produk && !harga && !stok) {
      return res.status(400).json({
        message: "At least one field is required to update",
      });
    }

    const updateData = {};
    if (nama_produk) {
      if (typeof nama_produk !== 'string' || nama_produk.trim() === '') {
        return res.status(400).json({ message: "Nama produk must be a non-empty string" });
      }
      updateData.nama_produk = nama_produk.trim();
    }
    if (harga !== undefined) {
      const hargaNum = parseFloat(harga);
      if (isNaN(hargaNum) || hargaNum <= 0) {
        return res.status(400).json({ message: "Harga must be a positive number" });
      }
      updateData.harga = hargaNum;
    }
    if (stok !== undefined) {
      const stokNum = parseInt(stok);
      if (isNaN(stokNum) || stokNum < 0) {
        return res.status(400).json({ message: "Stok must be a non-negative integer" });
      }
      updateData.stok = stokNum;
    }

    const updatedProduk = await updateProduk(produkId, updateData);

    return res.status(200).json({
      success: true,
      message: "Produk updated successfully",
      data: updatedProduk,
    });
  } catch (error) {
    console.error("Update produk error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Produk with this name already exists" });
    }
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const produkId = parseInt(id);

    if (isNaN(produkId)) {
      return res.status(400).json({ message: "Invalid produk ID" });
    }

    const existingProduk = await getProdukById(produkId);
    if (!existingProduk) {
      return res.status(404).json({
        message: "Produk Not Found",
      });
    }

    await deleteProduk(produkId);

    return res.status(200).json({
      message: "Produk deleted successfully",
    });
  } catch (error) {
    console.error("Delete produk error:", error);
    if (error.code === 'P2003') {
      return res.status(400).json({
        message: "Cannot delete produk: has related penjualan records",
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
