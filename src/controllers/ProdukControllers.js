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

    const newProduk = await createProduk({
      nama_produk,
      harga,
      stok,
    });

    return res.status(201).json({
      message: "Produk created successfully",
      data: newProduk,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllProduk = async (req, res) => {
  try {
    const data = await getAllProduk();
    return res.status(200).json({
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getProdukById = async (req, res) => {
  try {
    const { id } = req.params;

    const produk = await getProdukById(id);

    if (!produk) {
      return res.status(404).json({
        message: "Produk Not Found",
      });
    }

    return res.status(200).json({
      data: produk,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, harga, stok } = req.body;

    const existingProduk = await getProdukById(id);
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
    if (nama_produk) updateData.nama_produk = nama_produk;
    if (harga) updateData.harga = harga;
    if (stok) updateData.stok = stok;

    const updatedProduk = await updateProduk(id, updateData);

    return res.status(200).json({
      success: true,
      message: "Produk updated successfully",
      data: updatedProduk,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduk = await getProdukById(id);
    if (!existingProduk) {
      return res.status(404).json({
        message: "Produk Not Found",
      });
    }

    await deleteProduk(id);

    return res.status(200).json({
      message: "Produk deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
