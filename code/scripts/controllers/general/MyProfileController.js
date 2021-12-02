const commonServices = require('common-services');
const Constants = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;

const { WebcController } = WebCardinal.controllers;

export default class MyProfileController extends WebcController {
  constructor(...props) {
    super(...props);
  }

}
