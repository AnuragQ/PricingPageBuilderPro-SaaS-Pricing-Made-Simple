class User {
  constructor(user_id, username, email, created_date, widget) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.created_date = created_date;
    this.widget = widget;
  }
}

module.exports = User;
