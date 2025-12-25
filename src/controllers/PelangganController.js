const {
  createPelanggan,
  getAllPelanggan,
  getPelangganById,
  updatePelanggan,
  deletePelanggan,
} = require("../models/PelangganModels");

exports.createPelanggan = async (req, res) => {
  try {
    const { nama_pelanggan, alamat, telepon } = req.body;

    if (!nama_pelanggan || !alamat || !telepon) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    const newPelanggan = await createPelanggan({
      nama_pelanggan,
      alamat,
      telepon,
    });

    return res.status(201).json({
      message: "Pelanggan created successfully",
      data: newPelanggan,
    });
  } catch (error) {
    // console.error("Create pelanggan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getAllPelanggan = async (req, res) => {
  try {
    const data = await getAllPelanggan();
    return res.status(200).json({
      data,
    });
  } catch (error) {
    // console.error("Get all pelanggan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getPelangganById = async (req, res) => {
  try {
    const { id } = req.params;

    const pelanggan = await getPelangganById(id);

    if (!pelanggan) {
      return res.status(404).json({
        message: "Pelanggan Not Found",
      });
    }

    return res.status(200).json({
      data: pelanggan,
    });
  } catch (error) {
    console.error("Get pelanggan by id error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.updatePelanggan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pelanggan, alamat, telepon } = req.body;

    const existingPelanggan = await getPelangganById(id);
    if (!existingPelanggan) {
      return res.status(404).json({
        message: "Pelanggan Not Found",
      });
    }

    if (!nama_pelanggan && !alamat && !telepon) {
      return res.status(400).json({
        message: "At least one field is required to update",
      });
    }

    const updateData = {};
    if (nama_pelanggan) updateData.nama_pelanggan = nama_pelanggan;
    if (alamat) updateData.alamat = alamat;
    if (telepon) updateData.telepon = telepon;

    const updatedPelanggan = await updatePelanggan(id, updateData);

    return res.status(200).json({
      success: true,
      message: "Pelanggan updated successfully",
      data: updatedPelanggan,
    });
  } catch (error) {
    console.error("Update pelanggan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.deletePelanggan = async (req, res) => {
  try {
    const { id } = req.params;
    const existingPelanggan = await getPelangganById(id);
    if (!existingPelanggan) {
      return res.status(404).json({
        message: "Pelanggan Not Found",
      });
    }

    await deletePelanggan(id);

    return res.status(200).json({
      message: "Pelanggan deleted successfully",
    });
  } catch (error) {
    console.error("Delete pelanggan error:", error);
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Cannot delete pelanggan: has related penjualan records",
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
