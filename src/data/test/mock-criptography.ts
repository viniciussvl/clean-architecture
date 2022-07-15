import { Decrypter } from '../protocols/criptography/decrypter'
import { Encrypter } from '../protocols/criptography/encrypter'
import { HashComparer } from '../protocols/criptography/hash-comparer'
import { Hasher } from '../protocols/criptography/hasher'

export const mockDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        decrypt (value: string): Promise<string> {
            return new Promise(resolve => resolve('any_value'))
        }
    }

    return new DecrypterStub()
}

export const mockHasher = (): Hasher => {
    class HasherStub {
        async hash (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new HasherStub()
}

export const mockEncrypter = (): Encrypter => {
    class Encryptertub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return 'any_token'
        }
    }

    return new Encryptertub()
}

export const mockHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare (value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }

    return new HashComparerStub()
}
