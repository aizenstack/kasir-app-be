const prisma = require("../utils/client");

exports.createPenjualan = (data) => {
  return prisma.penjualan.create({
    data,
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
};

exports.getAllPenjualan = () => {
  return prisma.penjualan.findMany({
    include: {
      pelanggan: {
        select: {
          id: true,
          nama_pelanggan: true,
          alamat: true,
          telepon: true,
        },
      },
      detailPenjualan: {
        include: {
          produk: {
            select: {
              id: true,
              nama_produk: true,
              harga: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

exports.getPenjualanById = (id) => {
  return prisma.penjualan.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      pelanggan: {
        select: {
          id: true,
          nama_pelanggan: true,
          alamat: true,
          telepon: true,
        },
      },
      detailPenjualan: {
        include: {
          produk: {
            select: {
              id: true,
              nama_produk: true,
              harga: true,
            },
          },
        },
      },
    },
  });
};

exports.updatePenjualan = (id, data) => {
  return prisma.penjualan.update({
    where: {
      id: parseInt(id),
    },
    data,
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
};

exports.deletePenjualan = (id) => {
  return prisma.penjualan.delete({
    where: {
      id: parseInt(id),
    },
  });
};