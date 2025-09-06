// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');

// Testes
describe('Testes de Transferência', () => {
    const baseUrl = 'http://localhost:3000';
    let token;

    before(async () => {
        const respostaLogin = await request(baseUrl)
            .post('/users/login')
            .send({
                username: 'julio',
                password: '123456'
            });

        token = respostaLogin.body.token;
    });

    it('Transferência com sucesso retorna 201', async () => {
        const resposta = await request(baseUrl)
            .post('/transfers')
            .set('Authorization', `Bearer ${token}`)
            .send({
                from: "julio",
                to: "priscila",
                value: 100
            });

        expect(resposta.status).to.equal(201);
        const respostaEsperada = require('../fixture/respostas/quandoInformoValoresValidosEuTenhoSucessoCom201Created.json');
        delete resposta.body.date;
        delete respostaEsperada.date;
        expect(resposta.body).to.deep.equal(respostaEsperada);
    });

    it('Sem saldo disponível retorna 400', async () => {
        const resposta = await request(baseUrl)
            .post('/transfers')
            .set('Authorization', `Bearer ${token}`)
            .send({
                from: "julio",
                to: "priscila",
                value: 999999 
            });

        expect(resposta.status).to.equal(400);
        expect(resposta.body).to.have.property('error').that.includes('Saldo insuficiente');
    });

    it('Token de autenticação não informado retorna 401', async () => {
        const resposta = await request(baseUrl)
            .post('/transfers')
            .send({
                from: "julio",
                to: "priscila",
                value: 100
            });

        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('message').that.includes('Token não fornecido');
    });
});
