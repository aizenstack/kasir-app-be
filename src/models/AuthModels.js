const prisma = require("../utils/client");

exports.createUser = (data) => {
  return prisma.users.create({
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
  return prisma.users.findUnique({
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
  return prisma.users.findMany({
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
  return prisma.users.findUnique({
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
  return prisma.users.update({
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
  return prisma.users.delete({
    where: { id },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });
};
