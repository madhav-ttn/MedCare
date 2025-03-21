import { AuthOptions, getServerSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

const authOptions: AuthOptions = {
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  providers: [
      Credentials({
         credentials:{
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
         }
         ,
         async authorize(credentials, req) {
          const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
          console.log("username",credentials?.username);
          if (user) {
            return user
          } else {
            return null
    
          }
        }
      })
  ],
}


const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }