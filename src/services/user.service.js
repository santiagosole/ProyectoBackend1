import UsersRepository from '../repositories/users.repository.js';
import UserDTO from '../dto/user.dto.js';

class UserService {
  constructor() {
    this.userRepository = new UsersRepository();
  }

  async register(userData) {
    return await this.userRepository.create(userData);
  }

  async login(email) {
    return await this.userRepository.getByEmail(email);
  }

  async getCurrentUser(uid) {
    const user = await this.userRepository.getById(uid);
    return new UserDTO(user);
  }
}

export default UserService;