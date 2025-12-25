const prisma = require("../utils/client");

exports.createPelanggan = (data) => {
  return prisma.pelanggan.create({
    data,
    select: {
      id: true,
      nama_pelanggan: true,
      alamat: true,
      telepon: true,
      createdAt: true,
    },
  });
};

exports.getAllPelanggan = () => {
  return prisma.pelanggan.findMany();
};

exports.getPelangganById = (id) => {
  return prisma.pelanggan.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true, 
      nama_pelanggan: true,
      alamat: true,
      telepon: true,
      createdAt: true,
    },
  });
};

exports.updatePelanggan = (id, data) => {
  return prisma.pelanggan.update({ 
    where: {
      id: parseInt(id), 
    },
    data,
    select: {
      id: true, 
      nama_pelanggan: true,
      alamat: true,
      telepon: true,
      createdAt: true,
    },
  });
};

exports.deletePelanggan = (id) => {
  return prisma.pelanggan.delete({
    where: {
      id: parseInt(id), 
    },
    select: {
      id: true, 
      nama_pelanggan: true,
      alamat: true,
      telepon: true,
      createdAt: true,
    },
  });
};