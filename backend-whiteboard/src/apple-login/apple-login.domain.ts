export interface AppleSignInResponse {
  email?: string;
  state?: string;
  identityToken: string;
  authorizationCode: string;
  fullName?: NSPersonNameComponents;
  user?: string;
}

export interface NSPersonNameComponents {
  /**
   * The portion of a name’s full form of address that precedes the name itself (for example, "Dr.," "Mr.," "Ms.")
   */
  namePrefix?: string;
  /**
   * Name bestowed upon an individual to differentiate them from other members of a group that share a family name (for example, "Johnathan")
   */
  givenName?: string;
  /**
   * Secondary name bestowed upon an individual to differentiate them from others that have the same given name (for example, "Maple")
   */
  middleName?: string;
  /**
   * Name bestowed upon an individual to denote membership in a group or family. (for example, "Appleseed")
   */
  familyName?: string;
  /**
   * The portion of a name’s full form of address that follows the name itself (for example, "Esq.," "Jr.," "Ph.D.")
   */
  nameSuffix?: string;
  /**
   * Name substituted for the purposes of familiarity (for example, "Johnny")
   */
  nickname?: string;
}

export interface AppleTokeResponse {
  access_token: string;
  expires_in: number; //seconds
  id_token: string; //JWT WITH INFO
  refresh_token: string;
  token_type: 'bearer'; // https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
}
