const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.prisma = prisma;

class User {
    constructor(name,email,password){
        this.name = name;
        this.email = email;
        this.password = password;
    }
}


  module.exports = User;