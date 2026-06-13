const pool = require('../config/db');

const requireProjectOwner = async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.user?.id;
  if (!projectId || !userId){
    return res.status(400).json({ error: 'Missing project ID or User ID'});
  }
  try {
    const query = 'SELECT owner_id FROM projects WHERE id = $1';
    const { rows } = await pool.query(query, [projectId]);

    if (rows.length === 0 ){
      return res.status(404).json({error: 'Project Not Found!'})
    }
    if (row[0].owner_id !== userId){
      return res.status(403).json({error: 'Authorization error: User is NOT the Project Owner'});
    }
    
    next();
  } catch (e) {
    console.error('Guard Error: ', e);
    res.status(500).json({error: 'Server error during authorization!'})
  }
};

module.exports = requireProjectOwner;
