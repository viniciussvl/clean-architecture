import { SignUpController } from './signup';

describe('SignUpController', () => {
    test('should return 400 if not name is provider', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: '123',
                passwordConfirmation: '123'
            }
        }

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
    })
})