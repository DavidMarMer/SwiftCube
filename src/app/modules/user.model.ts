/**
 * @class User
 * Contains user data
 */

export class User {
    constructor (
        public username: string,
        public password: string,
        public confirmPassword: string
    ) {  }
}