import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
    private secret: string

    constructor (secret: string) {
        this.secret = secret
    }

    async encrypt (value: string): Promise<string> {
        const token = await jwt.sign({ id: value }, this.secret)
        return token
    }
}
