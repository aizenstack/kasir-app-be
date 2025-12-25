const prisma = require("../utils/client");

exports.createDetailPenjualan = (data) => {
  return prisma.detail_penjualan.create({
    data,
    select: {
      id: true,
      penjualan_id: true,
      produk_id: true,
      jumlah_produk: true,
      subtotal: true,
      createdAt: true,
      produk: {
        select: {
          id: true,
          nama_produk: true,
          harga: true,
        },
      },
    },
  });
};

exports.createManyDetailPenjualan = (data) => {
  return prisma.detail_penjualan.createMany({
    data,
  });
};

exports.getAllDetailPenjualan = () => {
  return prisma.detail_penjualan.findMany({
    include: {
      penjualan: {
        select: {
          id: true,
          tanggal_penjualan: true,
          total_harga: true,
        },
      },
      produk: {
        select: {
          id: true,
          nama_produk: true,
          harga: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

exports.getDetailPenjualanById = (id) => {
  return prisma.detail_penjualan.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      penjualan: {
        select: {
          id: true,
          tanggal_penjualan: true,
          total_harga: true,
        },
      },
      produk: {
        select: {
          id: true,
          nama_produk: true,
          harga: true,
        },
      },
    },
  });
};

exports.getDetailPenjualanByPenjualanId = (penjualanId) => {
  return prisma.detail_penjualan.findMany({
    where: {
      penjualan_id: parseInt(penjualanId),
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
};

exports.updateDetailPenjualan = (id, data) => {
  return prisma.detail_penjualan.update({
    where: {
      id: parseInt(id),
    },
    data,
    select: {
      id: true,
      penjualan_id: true,
      produk_id: true,
      jumlah_produk: true,
      subtotal: true,
      createdAt: true,
      produk: {
        select: {
          id: true,
          nama_produk: true,
          harga: true,
        },
      },
    },
  });
};

exports.deleteDetailPenjualan = (id) => {
  return prisma.detail_penjualan.delete({
    where: {
      id: parseInt(id),
    },
  });
};

exports.deleteDetailPenjualanByPenjualanId = (penjualanId) => {
  return prisma.detail_penjualan.deleteMany({
    where: {
      penjualan_id: parseInt(penjualanId),
    },
  });
};

