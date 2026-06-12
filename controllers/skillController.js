const Skill = require('../models/Skill');

exports.getAll = async (req, res) => {
  try {
    
    const skills = await Skill.getAll();
    res.json(skills);

  } catch(e){
    console.error('Error featching skills: ', e);
    res.status(500).json({error: 'Server error while fetching skills'});
  }
}
