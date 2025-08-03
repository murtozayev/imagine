export default class UserDto {
  id;
  name;
  email;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.name = model.name;
  }
}
