import db from "../db"

class UserService {
  static async getUser(userID: number) {
    try {
      
        const user = db.oneOrNone("SELECT id, username, full_name, email, avatar , birth_date, pronouns, created_at, updated_at FROM users WHERE id = $1", [userID]);
        return user;
    } catch (error: any) {
        console.log(">>Error: ", error.message);
    }
  }
  // TODO update profile

}

export default UserService