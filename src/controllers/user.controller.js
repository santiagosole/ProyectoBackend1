import UserService from '../services/user.service.js';

const userService = new UserService();

export default {
  register: async (req, res) => {
    try {
      const user = await userService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const user = await userService.login(req.body.email);
      res.status(200).json(user);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  getCurrent: async (req, res) => {
    try {
      const userDTO = await userService.getCurrentUser(req.user._id);
      res.status(200).json(userDTO);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};