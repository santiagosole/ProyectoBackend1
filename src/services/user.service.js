import UsersDao from '../repositories/UsersDao.js';
import UserDTO from '../dto/UserDTO.js';

class UserService {
  constructor() {
    this.userDao = new UsersDao();
  }

  async register(userData) {
    return await this.userDao.create(userData);
  }

  async login(email) {
    return await this.userDao.getByEmail(email);
  }

  async getCurrentUser(uid) {
    const user = await this.userDao.getById(uid);

    // devolvemos el DTO
    return new UserDTO(user);
  }
}

export default UserService;