const Skill = require('../models/Skill');

exports.getAll = async (req, res) => {
  try {
    
    const skills = await Skill.getAll();
    res.json(skills);

  } catch(e){
    console.error('Error featching skills: ', e);
    res.status(500).json({error: 'Server error while fetching skills!'});
  }
}

exports.create = async (req, res) => {
  try{

    const {name} = req.body;
    if(!name){
      res.status(400).json({error: 'Skill name is required!'});
    }
    const exist = await Skill.findByName(name);
    if(exist){
      res.status(409).json({error: 'Skill already exists!'})

    }
    const AddSkill = await Skill.create(name);
    res.status(201).json({message: 'Skill Created', skill: AddSkill});

  } catch(e){
    console.error('Error creating skill: ', e);
    res.status(500).json({error: 'Server error while creating skill!'});
  }
}
