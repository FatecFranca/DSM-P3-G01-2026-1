const mongoose = require('mongoose');
const { Restriction, UserRestriction } = require('../models');
const logger = require('../utils/logger');

module.exports = {
  /**
   * Obter restrições do usuário
   * GET /api/user-restrictions
   */
  async getUserRestrictions(req, res) {
    try {
      const userId = req.user.id;

      const userRestrictions = await UserRestriction.find({ user_id: userId }).populate(
        'restriction_id',
        'id nome categoria palavras_chave'
      );

      const restrictionsData = userRestrictions.map(ur => ({
        id: ur._id,
        user_id: ur.user_id,
        restriction_id: ur.restriction_id?._id,
        palavras_chave_personalizadas: ur.palavras_chave_personalizadas || [],
        restriction: ur.restriction_id
          ? {
              id: ur.restriction_id._id,
              nome: ur.restriction_id.nome,
              categoria: ur.restriction_id.categoria,
              palavras_chave: ur.restriction_id.palavras_chave || []
            }
          : null
      }));

      return res.json({ success: true, data: restrictionsData });
    } catch (error) {
      logger.error('Erro ao obter restrições do usuário', error);
      return res.status(500).json({ success: false, message: 'Erro interno' });
    }
  },

  /**
   * Adicionar restrição ao usuário
   * POST /api/user-restrictions
   */
  async addRestriction(req, res) {
    try {
      const userId = req.user.id;
      const { restriction_id } = req.body;

      if (!restriction_id) {
        return res.status(400).json({ success: false, error: 'restriction_id é obrigatório' });
      }

      if (!mongoose.isValidObjectId(restriction_id)) {
        return res.status(400).json({ success: false, error: 'restriction_id inválido' });
      }

      const restriction = await Restriction.findById(restriction_id);
      if (!restriction) {
        return res.status(404).json({ success: false, error: 'Restrição não encontrada' });
      }

      const already = await UserRestriction.findOne({ user_id: userId, restriction_id });
      if (already) {
        return res.status(409).json({ success: false, error: 'Restrição já associada' });
      }

      const userRestriction = await UserRestriction.create({ user_id: userId, restriction_id });

      return res.json({
        success: true,
        message: 'Restrição adicionada',
        data: userRestriction
      });
    } catch (error) {
      logger.error('Erro ao adicionar restrição ao usuário', error);
      return res.status(500).json({ success: false, message: 'Erro interno' });
    }
  },

  /**
   * Remover restrição do usuário
   * DELETE /api/user-restrictions/:id
   */
  async removeRestriction(req, res) {
    try {
      const userId = req.user.id;
      const id = req.params.id;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, error: 'ID inválido' });
      }

      const userRestriction = await UserRestriction.findById(id);
      if (!userRestriction) {
        return res.status(404).json({ success: false, error: 'Restrição não encontrada' });
      }

      if (userRestriction.user_id.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, error: 'Não autorizado' });
      }

      await UserRestriction.findByIdAndDelete(id);

      return res.json({ success: true, message: 'Restrição removida' });
    } catch (error) {
      logger.error('Erro ao remover restrição do usuário', error);
      return res.status(500).json({ success: false, message: 'Erro interno' });
    }
  },

  /**
   * Atualizar palavras-chave personalizadas
   * PUT /api/user-restrictions/:id
   */
  async updateRestrictionKeywords(req, res) {
    try {
      const { keywords } = req.body;
      const id = req.params.id;
      const userId = req.user.id;

      if (!keywords) {
        return res.status(400).json({ success: false, error: 'keywords é obrigatório' });
      }

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, error: 'ID inválido' });
      }

      const userRestriction = await UserRestriction.findById(id);
      if (!userRestriction) {
        return res.status(404).json({ success: false, error: 'Restrição não encontrada' });
      }

      if (userRestriction.user_id.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, error: 'Não autorizado' });
      }

      userRestriction.palavras_chave_personalizadas = Array.isArray(keywords)
        ? keywords
        : String(keywords).split(',').map(k => k.trim()).filter(Boolean);

      await userRestriction.save();

      return res.json({ success: true, message: 'Palavras-chave atualizadas' });
    } catch (error) {
      logger.error('Erro ao atualizar palavras-chave', error);
      return res.status(500).json({ success: false, message: 'Erro interno' });
    }
  }
};