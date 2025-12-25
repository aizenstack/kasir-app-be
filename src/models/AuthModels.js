const prisma = require("../utils/client");

exports.createUser = (data) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });
};

exports.findUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      password: true,
      role: true,
      createdAt: true,
    },
  });
};

exports.getAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

exports.getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });
};

exports.updateUser = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });
};

exports.deleteUser = (id) => {
  return prisma.user.delete({
    where: { id },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });
};
