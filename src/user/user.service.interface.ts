export interface IUserService {
  // updates the current password with a new password
  updatePassword(
    userID: string,
    current: string,
    update: string,
  ): Promise<boolean>;

  // update user profile
  updateProfile(
    userID: string,
    firstname: string,
    lastname: string,
  ): Promise<boolean>;
}
