import createCRUDController from '#controllers/middlewaresControllers/createCRUDController/index.js';
import create from './create.js';
import summary from './summary.js';
import update from './update.js';
import remove from './remove.js';
import sendMail from './sendMail.js';

const methods = createCRUDController('Payment');

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;

export default methods;