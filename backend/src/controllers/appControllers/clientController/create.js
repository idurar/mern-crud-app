const mongoose = require('mongoose');

const Model = mongoose.model('Client');
const People = mongoose.model('People');
const Company = mongoose.model('Company');

const create = async (req, res) => {
  // Creating a new document in the collection

  if (req.body.type === 'people') {
    if (!req.body.people) {
      return res.status(403).json({
        success: false,
        message: 'Please select a person',
      });
    } else {
      let { firstname, lastname } = await People.findOne({
        _id: req.body.people,
        removed: false,
      }).exec();
      req.body.name = firstname + ' ' + lastname;
      req.body.company = undefined;
    }
  } else {
    if (!req.body.company) {
      return res.status(403).json({
        success: false,
        message: 'Please select a company',
      });
    } else {
      let { name } = await Company.findOne({
        _id: req.body.company,
        removed: false,
      }).exec();
      req.body.name = name;
      req.body.people = undefined;
    }
  }

  req.body.removed = false;
  const result = await new Model(req.body).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

module.exports = create;