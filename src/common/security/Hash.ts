
import * as bcrypt from 'bcrypt';

export const Hash = (plainText: string, rounds: number = Number(process.env.ROUNDS)): string => {
    return bcrypt.hashSync(plainText, rounds)
}

export const CompareHash = (plainText: string, hash: string): boolean => {
    return bcrypt.compareSync(plainText, hash)
}