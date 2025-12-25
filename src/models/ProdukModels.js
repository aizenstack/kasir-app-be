const prisma = require("../utils/client");

exports.createProduk = (data) => {
  return prisma.produk.create({
    data,
    select: {
      id: true,
      nama_produk: true,
      harga: true,
      stok: true,
      createdAt: true,
      updateAt: true,
    },
  });
};

exports.getAllProduk = () => {
  return prisma.produk.findMany();
};

exports.getProdukById = (id) => {
  return prisma.produk.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      nama_produk: true,
      harga: true,
      stok: true,
      createdAt: true,
      updateAt: true,
    },
  });
};

exports.updateProduk = (id, data) => {
  return prisma.produk.update({
    where: {
      id: parseInt(id),
    },
    data,
    select: {
      id: true,
      nama_produk: true,
      harga: true,
      stok: true,
      createdAt: true,
      updateAt: true,
    },
  });
};

exports.deleteProduk = (id) => {
  return prisma.produk.delete({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      nama_produk: true,
      harga: true,
      stok: true,
      createdAt: true,
      updateAt: true,
    },
  });
};
