const status = require('../utils/http-status')
exports.DefaultError = (req, res , error, status)=>{
    res.status(500).json({message: error});
}