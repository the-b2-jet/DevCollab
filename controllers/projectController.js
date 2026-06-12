const Project = require('../models/Project')

exports.create = async (req, res) => {
  try {
  
    const { title, description, duration } = req.body;
    const owner_id = req.user.id;
    
    if(!title || !description){
      
      return res.status(400).json({error: 'Title and description are must!'});
    }
    
    const project = await Project.create({title, description, duration, owner_id});
    res.status(201).json({message: 'Project Created', project });
  
  } catch (e) {
    
    console.error(e); //to debuyg server side requests (remove later)
    res.status(500).json({error: 'Server error while creating the project'});
    
  }
};

exports.getAll = async (req, res) => {

  try {

    const projects = await Project.findAll();
    res.json(projects);

  } catch(e) {
    
    console.error(e);
    res.status(500).json({error: 'Server error while fetching projects'});

  }
};

exports.getById = async(req, res) => {

  try {

    const {id} = req.params;
    const project = await Project.findById(id);
    if(!project){
      return res.status(404).json({error: 'Project Not Found!'});
    }

    const [members, skills, tasks] = await Promise.all([
      Project.getMembers(id),
      Project.getSkills(id),
      Project.getTasks(id)
    ]);
    res.json({ project, members, skills, tasks });
  } catch(e){

      console.error(e);
      res.status(500).json({error: 'Server error while featching project'});

  }
};

exports.update = async(req, res) => {

  try {

    const {id} = req.params;
    const userId = req.user.id;
    const isOwner = await Project.isOwner(id, userId);

    if(!isOwner){
      return res.status(403).json({error: 'You are not the owner of this project!'});
    }
    
    const { title, description, duration } = req.body;
    const updated = await Project.update(id, { title, description, duration });
    
    if(!updated){
      return res.status(404).json({error: 'Project Not Found!'});
    }
   
    res.json({message: 'Project Updated!', project: updated });
  } catch(e){

      console.error(e);
      res.status(500).json({error: 'Server error while updating project'});

  }
};

exports.delete = async(req, res) => {

  try {

    const {id} = req.params;
    const userId = req.user.id;
    const isOwner = await Project.isOwner(id, userId);

    if(!isOwner){
      return res.status(403).json({error: 'You are not the owner of this project!'});
    }
    
    const deleted = await Project.delete(id);
    
    if(!deleted){
      return res.status(404).json({error: 'Project Not Found!'});
    }
   
    res.json({message: 'Project Deleted!' });
  } catch(e){

      console.error(e);
      res.status(500).json({error: 'Server error while deleting project'});

  }
};

exports.addSkill = async(req, res) => {

  try {

    const {id} = req.params;
    const userId = req.user.id;
    const isOwner = await Project.isOwner(id, userId);

    if(!isOwner){
      return res.status(403).json({error: 'Unauthorized User!'});
    }
    
    const {skillId} = req.body;
    if(!skillId){
      return res.status(400).json({error: 'Skill ID is a must'});
    }
  
    const result = await Project.addSkill(id, skillId);
    res.status(201).json({ message: 'Skill added to project', data: result});
  } catch(e){
      console.error(e);
      res.status(500).json({error: 'Server error while adding skill'});
  }
};

exports.removeSkill = async(req, res) => {

  try {

    const {id, skillId} = req.params;
    const userId = req.user.id;
    const isOwner = await Project.isOwner(id, userId);

    if(!isOwner){
      return res.status(403).json({error: 'Unauthorized User!'});
    }
    await Project.removeSkill(id, skillId);
    res.status(201).json({ message: 'Skill removed from project'});
  } catch(e){
      console.error(e);
      res.status(500).json({error: 'Server error while removing skill'});
  }
};

