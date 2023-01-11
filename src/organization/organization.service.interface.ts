export interface IOrganizationService {
  // add user
  inviteUser(
    email: string,
    name: string,
    organizationID: string,
    roles: Array<string>,
  ): Promise<boolean>;

  // accept invitation
  acceptInvitation(
    userID: string,
    organizationID: string,
    code: string,
    password: string | null,
  ): Promise<boolean>;

  // list organization users
  fetchOrganizationUsers(organizationID: string): Promise<any>;

  // creates an organization
  createOrganization(adminID: string, name: string): Promise<boolean>;

  // adds a role to an organization if admin user
  assignRole(
    userID: string,
    organizationID: string,
    roleName: string,
  ): Promise<boolean>;

  // delete role of an organization user
  deleteRole(
    userID: string,
    organizationID: string,
    roleName: string,
  ): Promise<boolean>;

  // leave an organization
  leaveOrganization(userID: string, organizationID: string): Promise<boolean>;

  // delete an organization
  deleteOrganization(organizationID: string): Promise<boolean>;
}
