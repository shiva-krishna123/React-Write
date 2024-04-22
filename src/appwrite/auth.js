import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";
import { useSelector } from "react-redux";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount ( { email, password, name  } ) {
        try {
            const userAccount = await this.account.create( ID.unique(), email, password, name );
            if (userAccount) {
                return this.login({email,password});
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("appwrite :: AuthService :: createAccount :: error ", error);
        }

    }

    async login ( { email, password } ) {
        try {
            return await this.account.createEmailSession( email, password );
        } catch (error) {
            console.log("appwrite :: AuthService :: login :: error ",error);
        }
        
    }

    async getCurrentUser () {

        try {
            return await this.account.get();
        } catch (error) {
            console.log("appwrite :: AuthService :: getCurrentUser :: error ",error);
        }
        return null;
        
    }

    async logout () {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("appwrite :: AuthService :: logout :: error ",error);
        }
    }

    

}

const authService = new AuthService();

export default authService;
