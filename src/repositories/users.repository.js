import UsersDAO from "../dao/users.dao.js";

export default class UsersRepository {
    constructor() {
        this.dao = new UsersDAO();
    }

    async getUserById(id) {
        return await this.dao.getById(id);
    }

    async getUserByEmail(email) {
        return await this.dao.getByEmail(email);
    }

    async createUser(data) {
        return await this.dao.create(data);
    }

    async updatePassword(id, newPassword) {
        return await this.dao.updatePassword(id, newPassword);
    }
}