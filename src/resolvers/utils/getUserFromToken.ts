import JWT from "jsonwebtoken"
import { JSON_SIGNATURE } from "../../keys"

export const getUserFromToken = async (token: string) => {
  try {
    return JWT.verify(token, JSON_SIGNATURE) as {
      userId: number
    }
  } catch (error) {
    return null
  }
}
