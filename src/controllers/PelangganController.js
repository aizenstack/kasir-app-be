const {
  createPelanggan,
  getAllPelanggan,
  getPelangganById,
  updatePelanggan,
  deletePelanggan,
} = require("../models/PelangganModels");

exports.createPelanggan = async (req, res) => {
  try {
    const { 
      nama_pelanggan, 
      nama,  
      alamat, 
      telepon,
      no_telp 
    } = req.body;

    const finalNamaPelanggan = nama_pelanggan || nama;
    
    if (!finalNamaPelanggan) {
      return res
        .status(400)
        .json({ message: "Nama pelanggan is required" });
    }

    if (typeof finalNamaPelanggan !== 'string' || finalNamaPelanggan.trim() === '') {
      return res.status(400).json({ message: "Nama pelanggan must be a non-empty string" });
    }

    const finalTelepon = telepon || no_telp;

    if (alamat !== undefined && alamat !== null && alamat !== '') {
      if (typeof alamat !== 'string') {
        return res.status(400).json({ message: "Alamat must be a string" });
      }
    }

    if (finalTelepon !== undefined && finalTelepon !== null && finalTelepon !== '') {
      if (typeof finalTelepon !== 'string') {
        return res.status(400).json({ message: "Telepon must be a string" });
      }
    }

    const pelangganData = {
      nama_pelanggan: finalNamaPelanggan.trim(),
    };

    if (alamat !== undefined && alamat !== null && alamat !== '') {
      pelangganData.alamat = alamat.trim();
    } else {
      pelangganData.alamat = '';
    }

    if (finalTelepon !== undefined && finalTelepon !== null && finalTelepon !== '') {
      pelangganData.telepon = finalTelepon.trim();
    } else {
      pelangganData.telepon = ''; 
    }

    const newPelanggan = await createPelanggan(pelangganData);

    return res.status(201).json({
      message: "Pelanggan created successfully",
      data: newPelanggan,
    });
  } catch (error) {
    console.error("Create pelanggan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getAllPelanggan = async (req, res) => {
  try {
    const data = await getAllPelanggan();
    return res.status(200).json({
      message: "Pelanggan retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Get all pelanggan error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getPelangganById = async (req, res) => {
  try {
    const { id } = req.params;
    const pelangganId = parseInt(id);

    if (isNaN(pelangganId)) {
      return res.status(400).json({ message: "Invalid pelanggan ID" });
    }

    const pelanggan = await getPelangganById(pelangganId);

    if (!pelanggan) {
      return res.status(404).json({
        message: "Pelanggan Not Found",
      });
    }

    return res.status(200).json({
      message: "Pelanggan retrieved successfully",
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
    const pelangganId = parseInt(id);

    if (isNaN(pelangganId)) {
      return res.status(400).json({ message: "Invalid pelanggan ID" });
    }

    const existingPelanggan = await getPelangganById(pelangganId);
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
    if (nama_pelanggan) {
      if (typeof nama_pelanggan !== 'string' || nama_pelanggan.trim() === '') {
        return res.status(400).json({ message: "Nama pelanggan must be a non-empty string" });
      }
      updateData.nama_pelanggan = nama_pelanggan.trim();
    }
    if (alamat) {
      if (typeof alamat !== 'string' || alamat.trim() === '') {
        return res.status(400).json({ message: "Alamat must be a non-empty string" });
      }
      updateData.alamat = alamat.trim();
    }
    if (telepon) {
      if (typeof telepon !== 'string' || telepon.trim() === '') {
        return res.status(400).json({ message: "Telepon must be a non-empty string" });
      }
      updateData.telepon = telepon.trim();
    }

    const updatedPelanggan = await updatePelanggan(pelangganId, updateData);

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
    const pelangganId = parseInt(id);

    if (isNaN(pelangganId)) {
      return res.status(400).json({ message: "Invalid pelanggan ID" });
    }

    const existingPelanggan = await getPelangganById(pelangganId);
    if (!existingPelanggan) {
      return res.status(404).json({
        message: "Pelanggan Not Found",
      });
    }

    await deletePelanggan(pelangganId);

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
